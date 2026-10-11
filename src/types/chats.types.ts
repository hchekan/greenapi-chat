export interface Chat {
  id: string;
  chatId: string;
  userId: string;
  phone: string;
  name: string;
}

export interface ChatStore {
  isLoaded: boolean;
  isFirstLoaded: boolean;
  error: string | null;
  chatsById: Record<string, Chat>;
  chatIds: string[];

  loadChats: (id: string) => Promise<void>;
  createChat: (chat: Chat) => Promise<Chat | null>;
  renameChat: (chat: Chat) => Promise<Chat | null>;
  deleteChat: (chatId: string) => Promise<void>;
  clearChats: () => void;
}
