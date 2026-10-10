import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMessageStore } from "@store/messages/messages.store";
import { useUserStore } from "@store/user/user.store";
import type { Message } from "@/types/messages.types";

const POLLING_DELAY = 2000;
const ERROR_DELAY = 3000;
const BILLION = 10000000000;

export const useNotifications = () => {
  const { chatId: chatIdFromParams } = useParams();
  const user = useUserStore((state) => state.user);
  const { getMessage, changeStatusMessage } = useMessageStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!user) return;

    let isActive = true;
    abortControllerRef.current = new AbortController();

    const startPolling = async () => {
      while (isActive) {
        try {
          const response = await fetch(
            `${user.apiUrl}/waInstance${user.id}/receiveNotification/${user.apiTokenInstance}`,
            {
              method: "GET",
              signal: abortControllerRef.current?.signal,
            },
          );

          if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
          }

          if (response.status === 204) {
            // Нет данных — ждём перед следующим запросом
            await new Promise((resolve) => setTimeout(resolve, POLLING_DELAY));
            continue;
          }

          const text = await response.text();

          if (!text) {
            // Пустое тело — тоже ждём
            await new Promise((resolve) => setTimeout(resolve, POLLING_DELAY));
            continue;
          }

          const result = JSON.parse(text);

          if (isActive && result) {
            const response = result.body;
            // 2. Изменяем стор
            // сообщения от пользователя greeanapi
            if (response.typeWebhook === "outgoingMessageStatus") {
              changeStatusMessage({
                idMessage: response.idMessage,
                chatId: response.chatId,
                status: response.status
              });
            }

            // сообщение от другого пользователя, нужно обработать
            if (response.typeWebhook === "incomingMessageReceived") {
              if (response.messageData.typeMessage === "deletedMessage") {
                changeStatusMessage({
                  idMessage: response.messageData.deletedMessageData.stanzaId,
                  chatId: response.senderData.chatId,
                  status: 'deleted'
                });
              }
              if (response.messageData.typeMessage === "textMessage") {
                const newMessage: Message = {
                  id: crypto.randomUUID(),
                  idMessage: response.idMessage,
                  senderId: response.senderData.sender,
                  timestamp: response.timestamp < BILLION ? response.timestamp * 1000 : response.timestamp,
                  chatId: response.senderData.chatId,
                  text: response.messageData.textMessageData.textMessage,
                  status: chatIdFromParams === response.senderData.chatId ? 'read' : 'new',
                };
                getMessage(newMessage);
              }
            }

            // 3. Отправляем запрос на удаление
            try {
              const deleteResponse = await fetch(
                `${user.apiUrl}/waInstance${user.id}/deleteNotification/${user.apiTokenInstance}/${result.receiptId}`,
                {
                  method: "DELETE",
                  signal: abortControllerRef.current?.signal,
                },
              );

              if (!deleteResponse.ok) {
                console.error(
                  "Не удалось удалить уведомление:",
                  deleteResponse.status,
                );
                // Можно добавить в стор как ошибку или попробовать снова
              }
            } catch (deleteErr) {
              if (deleteErr.name === "AbortError") break;
              console.error("Ошибка при удалении уведомления:", deleteErr);
            }

            // 4. После успешного получения и удаления - сразу получаем следующее
            // (без задержки, так как хотим быстро обработать очередь)
          }
        } catch (err) {
          if (err.name === "AbortError") {
            break;
          }

          console.error("Ошибка long polling:", err);

          if (isActive) {
            // useDataStore.getState().setError(err instanceof Error ? err.message : 'Неизвестная ошибка');

            await new Promise((resolve) => setTimeout(resolve, ERROR_DELAY));
          }
        }
      }
    };

    startPolling();

    return () => {
      isActive = false;
      abortControllerRef.current?.abort();
    };
  }, [user]);
};
