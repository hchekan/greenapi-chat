import { create } from "zustand";
import type { ChatStore } from "@types/chats.types";
import { chatRepository } from "@db/chats.db";
import { success } from "@/components/notify/notify";
import { useMessageStore } from "@store/messages/messages.store";

export const useChatStore = create<ChatStore>((set, get) => ({
  chatsById: {},
  chatIds: [],
  isLoaded: false,
  isFirstLoaded: false,
  error: null,

  loadChats: async (id) => {
    try {
      const data = await chatRepository.getAllById(id);

      set({
        isLoaded: true,
        error: null,
        chatsById: Object.fromEntries(data.map((n) => [n.chatId, n])),
        chatIds: data.map((item) => item.chatId),
        isFirstLoaded: true,
      });
    } catch (error) {
      console.error("Failed to load chats:", error);

      set({
        error: "Ошибка загрузки чатов",
        isLoaded: true,
        isFirstLoaded: true,
      });
    }
  },

  createChat: async (chat) => {
    try {
      await chatRepository.create(chat);

      set((state) => ({
        error: null,
        chatIds: [chat.chatId, ...state.chatIds],
        chatsById: {
          ...state.chatsById,
          [chat.chatId]: chat,
        },
      }));

      return chat;
    } catch (error) {
      console.error("Failed to add chat:", error);

      set({
        error: "Не удалось создать чат",
      });

      return null;
    }
  },

  renameChat: async (chat) => {
    try {
      await chatRepository.update(chat);

      set((state) => ({
        error: null,
        chatsById: {
          ...state.chatsById,
          [chat.chatId]: chat,
        },
      }));

      return chat;
    } catch (error) {
      console.error("Failed to rename chat:", error);

      set({
        error: "Не удалось переименовать чат",
      });

      return null;
    }
  },

  deleteChat: async (chatId) => {
    try {
      await chatRepository.delete(chatId);

      useMessageStore.getState().deleteMessagesByChatId(chatId);

      set((state) => {
        const { [chatId]: _removed, ...rest } = state.chatsById;
        const chatIds = state.chatIds.filter((chat: string) => chat !== chatId);
        return {
          chatsById: rest,
          chatIds: chatIds,
          error: null,
        };
      });
    } catch (error) {
      success("Возникла ошибка при удалении чата");
      console.error("Failed to delete chat:", error);

      set({
        error: "Не удалось удалить чат",
      });
    }
  },

  clearChats: () => {
    set(() => {
      return {
        chatsById: {},
        chatIds: [],
        error: null,
      };
    });
  },
}));
