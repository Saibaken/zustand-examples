"use client";
// 1. Создаем хранилище

import { create } from "zustand";

interface BasicStore {
  bears: number;
  fish: number;

  increaseBears: () => void;
  increaseByAmount: (amount: number) => void;
  removeAllBears: () => void;
  feedBears: () => void;

  addFish: (amount: number) => void;
}

// Определяем хранилище с начальным состоянием и методами для его изменения
export const useBasicStore = create<BasicStore>((set) => ({
  // Состояние
  bears: 0,
  fish: 0,

  // Методы для изменения состояния
  increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
  increaseByAmount: (amount) =>
    set((state) => ({ bears: state.bears + amount })),
  removeAllBears: () => set({ bears: 0 }),

  // Более сложные операции с доступом к текущему состоянию
  feedBears: () =>
    set((state) => {
      if (state.fish > 0) {
        return { bears: state.bears + 1, fish: state.fish - 1 };
      }
      return state;
    }),

  addFish: (count) => set((state) => ({ fish: state.fish + count })),
}));
