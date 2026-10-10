import { db } from '@db/indexed-db';
import type { Message } from '@types/messages.types';

export const messageRepository = {
  getByChatId: (id: string) => db.messages.where('chatId').equals(id).toArray(),

  create: (message: Message) => db.messages.add(message),

  update: (message: Message) => db.messages.put(message),

  deleteByChatId: (chatId: string) => db.messages.where('chatId').equals(chatId).delete(),
}