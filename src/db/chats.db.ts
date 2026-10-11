import { db } from '@db/indexed-db';
import type { Chat } from '@types/chats.types';

export const chatRepository = {
  getAllById: (id: string) => db.chats.where('userId').equals(id).toArray(),

  create: (chat: Chat) => db.chats.add(chat),

  update: (chat: Chat) => db.chats.put(chat),

  delete: (chatId: string) => db.chats.where('chatId').equals(chatId).delete(),

}