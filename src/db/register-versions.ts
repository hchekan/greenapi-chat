import type Dexie from 'dexie';
import { DB_SCHEMAS } from './schema';

export const registerDBVersions = (db: Dexie): void => {
  db.version(1).stores(DB_SCHEMAS[1]);
};