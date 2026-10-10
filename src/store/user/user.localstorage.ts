import type { User } from "@/types/user.types";

const USER_KEY = 'greenapi_chat_current_user';

export const userStorage = {
  get(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  
  set(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  clear(): void {
    localStorage.removeItem(USER_KEY);
  }
};