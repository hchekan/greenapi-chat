export interface Message {
  id: string;
  idMessage: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: string;
}

export interface MessageToSend {
  chatId: string;
  message: string;
}

export interface MessageToSendResponse {
  idMessage: string;
}

export interface MessagesStore {
  isLoaded: boolean;
  error: string | null;
  data: Message[];
  lastMessage: Message | null;
}

export interface MessageToChangeStatus {
  idMessage: string;
  chatId: string;
  status: string;
}

export interface MessageStore {
  messagesByChatId: Record<string, MessagesStore>;

  sendMessage: (payload: Message) => Promise<Message | null>;
  loadMessages: (chatId: string) => Promise<void>;
  getMessage: (payload: Message) => Promise<void>;
  changeStatusMessage: (payload: MessageToChangeStatus) => Promise<void>;
  deleteMessagesByChatId: (chatId: string) => Promise<void>;
  clearMessages: () => void;
}
