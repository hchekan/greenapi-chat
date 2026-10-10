import Dexie from 'dexie';
import { DB_NAME, DB_STORE_NAME_CHATS, DB_STORE_NAME_MESSAGES, type AppDBTables } from './schema';
import { registerDBVersions } from './register-versions';

class AppDatabase extends Dexie {
  [DB_STORE_NAME_CHATS]!: AppDBTables['chats'];
  [DB_STORE_NAME_MESSAGES]!: AppDBTables['messages'];

  constructor() {
    super(DB_NAME);
    registerDBVersions(this);
  }
}

export const db = new AppDatabase();
