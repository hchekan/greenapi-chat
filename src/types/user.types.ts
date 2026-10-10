export interface User {
  id: string;
  apiUrl: string;
  apiTokenInstance: string;
  name: string;
}

export interface UserStore {
  user: User | null;
  isInitialized: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  initialize: () => void;
}