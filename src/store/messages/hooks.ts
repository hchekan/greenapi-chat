import { useMessageStore } from "./messages.store";

export const useMessagesByChatId = (id: string) => 
  useMessageStore((s) => (s.messagesByChatId[id] ? s.messagesByChatId[id] : null));

export const useLastMessageByChatId = (id: string) => 
  useMessageStore((s) => (s.messagesByChatId[id] ? s.messagesByChatId[id].lastMessage: null));

