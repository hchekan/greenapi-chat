import { create } from 'zustand';
import type { User, UserStore } from '@types/user.types';
import { userStorage } from './user.localstorage';

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isInitialized: false,

  initialize: () => {
    const savedUser = userStorage.get();
    set({ 
      user: savedUser, 
      isInitialized: true 
    });
  },

  setUser: (user: User) => {
    userStorage.set(user); 
    set({ user });
  },

  clearUser: () => {
    userStorage.clear();
    set({ user: null });
  },
}));