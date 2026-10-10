import { create } from "zustand";
import axios from "axios";
import type { Message, MessageStore } from "@types/messages.types";
import { messageRepository } from "@db/messages.db";
import api from "@api/api";
import { error, success } from "@/components/notify/notify";

export const useMessageStore = create<MessageStore>((set, get) => ({
  messagesByChatId: {},

  sendMessage: async (payload) => {
    let currentChat = get().messagesByChatId[payload.chatId];
    if (!currentChat) {
      currentChat = {
        isLoaded: false,
        error: null,
        data: [],
        lastMessage: null,
      };

      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [payload.chatId]: {
            ...currentChat,
          },
        },
      }));
    }

    set((state) => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [payload.chatId]: {
          ...currentChat,
          isLoaded: false,
          error: null,
        },
      },
    }));

    try {
      const response = await api.sendMessageApi({
        message: payload.text,
        chatId: payload.chatId,
      });

      const newMessage = {
        ...payload,
        idMessage: response.data.idMessage,
      };

      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [payload.chatId]: {
            ...currentChat,
            isLoaded: true,
            data: [...currentChat.data, newMessage],
            lastMessage: newMessage,
          },
        },
      }));

      // занесение в indexeddb
      try {
        await messageRepository.create(newMessage);
      } catch (error) {}

      return newMessage;
    } catch (err) {
      
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        if (
          errorData.message ===
          "Validation failed. Details: 'chatId': invalid phone number"
        ) {
          error("Ошибка при отправке сообщения. Неверный номер телефона.");
        }

        if (err.response?.status === 401) {
          error("Ошибка при отправке сообщения. Проверьте ваш idInstance и его авторизацию.");
        }
      }

      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [payload.chatId]: {
            ...currentChat,
            isLoaded: true,
            error: "Ошибка при отправке сообщения",
          },
        },
      }));

      return null;
    }
  },

  loadMessages: async (chatId) => {
    const currentChat = get().messagesByChatId[chatId];
    if (!currentChat) {
      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: {
            isLoaded: false,
            error: null,
            data: [],
            lastMessage: null,
          },
        },
      }));
    }

    try {
      const data = await messageRepository.getByChatId(chatId);
      const dataSorted = data.toSorted(
        (mes1, mes2) => mes1.timestamp - mes2.timestamp,
      );

      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: {
            isLoaded: true,
            error: null,
            data: dataSorted,
            lastMessage:
              dataSorted.length > 0 ? dataSorted[dataSorted.length - 1] : null,
          },
        },
      }));
    } catch (error) {
      console.error("Failed to load chats:", error);

      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: {
            isLoaded: true,
            error: "Ошибка при получении сообщений",
            data: [],
            lastMessage: null,
          },
        },
      }));
    }
  },

  getMessage: async (payload) => {
    let currentChat = get().messagesByChatId[payload.chatId];
    if (!currentChat) {
      currentChat = {
        isLoaded: true,
        error: null,
        data: [],
        lastMessage: null,
      };

      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [payload.chatId]: {
            ...currentChat,
          },
        },
      }));
    }

    set((state) => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [payload.chatId]: {
          ...currentChat,
          data: [...currentChat.data, payload],
          lastMessage: payload,
        },
      },
    }));

    try {
      await messageRepository.create(payload);
    } catch (error) {}
  },

  changeStatusMessage: async (payload) => {
    let currentChat = get().messagesByChatId[payload.chatId];

    if (!currentChat) {
      currentChat = {
        isLoaded: true,
        error: null,
        data: [],
        lastMessage: null,
      };

      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [payload.chatId]: {
            ...currentChat,
          },
        },
      }));
    }

    let updatedMes: Message | null = null;
    const lastMessage = currentChat.lastMessage;

    set((state) => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [payload.chatId]: {
          ...currentChat,
          data: currentChat.data.map((msg) => {
            if (msg.idMessage === payload.idMessage) {
              updatedMes = {
                ...msg,
                status: payload.status,
              };
              return updatedMes;
            }
            return msg;
          }),
          lastMessage:
            lastMessage?.idMessage === payload.idMessage
              ? updatedMes
              : lastMessage,
        },
      },
    }));

    try {
      if (updatedMes) {
        await messageRepository.update(updatedMes);
      }
    } catch (error) {}
  },

  deleteMessagesByChatId: async (chatId) => {
    try {
      await messageRepository.deleteByChatId(chatId);

      let currentChat = get().messagesByChatId[chatId];
      if (currentChat) {
        set((state) => ({
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: {
              data: [],
              lastMessage: null,
              isLoaded: false,
              error: null,
            },
          },
        }));
      }
    } catch (error) {
      success("Возникла ошибка при удалении сообщений");
      console.error("Failed to delete chat:", error);
    }
  },

  clearMessages: () => {
    set(() => ({
      messagesByChatId: {},
    }));
  },
}));
