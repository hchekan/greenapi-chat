import type { Table } from "dexie";
import type { Chat } from "@types/chats.types";
import type { Message } from "@types/messages.types";

export const DB_NAME = "greenapi-chat-db";
export const DB_STORE_NAME_CHATS = "chats";
export const DB_STORE_NAME_MESSAGES = "messages";

export interface AppDBTables {
  [DB_STORE_NAME_CHATS]: Table<Chat, string>; 
  [DB_STORE_NAME_MESSAGES]: Table<Message, string>;  
}

export const DB_SCHEMAS = {
  1: {
    [DB_STORE_NAME_CHATS]: 'id, chatId, userId, phone,  name',
    [DB_STORE_NAME_MESSAGES]: 'id, idMessage, chatId, senderId, text, timestamp, status',
  }
} as const;
