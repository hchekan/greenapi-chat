import { useShallow } from 'zustand/react/shallow';
import { useChatStore } from "./chats.store";

export const useChatIds = () =>
  useChatStore(useShallow((s) => s.chatIds));

export const useChatById = (id: string | undefined) => 
  useChatStore((s) => (id ? s.chatsById[id] : undefined));

