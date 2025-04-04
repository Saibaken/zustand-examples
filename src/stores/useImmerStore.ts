"use client";
// Пример с Immer middleware
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface User {
  id: number;
  name: string;
  active: boolean;
}

interface MiddlewareStore {
  users: User[];
  toggleUserStatus: (userId: number) => void;
  addUser: (name: string) => void;
  getUser: (userId: number) => User | undefined;
  getAllUsers: () => User[];
  getActiveUsersCount: () => number;
  getInactiveUsersCount: () => number;
  getUsersCount: () => number;
}

// Создаем хранилище с использованием immer
export const useImmerStore = create<MiddlewareStore>()(
  immer((set, get) => ({
    users: [],
    // С immer можно напрямую "мутировать" состояние
    // (хотя на самом деле создается новый объект)
    toggleUserStatus: (userId) =>
      set((state) => {
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          user.active = !user.active;
        }
      }),

    addUser: (name) =>
      set((state) => {
        state.users.push({
          id: Math.max(0, ...state.users.map((u) => u.id)) + 1,
          name,
          active: false,
        });
      }),
    getUser: (userId: number) => get().users.find((u) => u.id === userId),
    getAllUsers: () => get().users,
    getActiveUsersCount: () => get().users.filter((u) => u.active).length,
    getUsersCount: () => get().users.length,
    getInactiveUsersCount: () =>
      get().getUsersCount() - get().getActiveUsersCount(),
  }))
);
