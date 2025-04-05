// useContextStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Типы для нашего хранилища
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface ContextState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  contextSpecificValue: string;
}

export interface ContextActions {
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  setFilter: (filter: "all" | "active" | "completed") => void;
  setContextValue: (value: string) => void;
}

export type ContextStore = ContextState & ContextActions;

// Создаем фабрику хранилища вместо глобального хранилища
export const createContextStore = () =>
  create<ContextStore>()(
    devtools(
      immer((set) => ({
        // Начальное состояние
        todos: [
          { id: 1, text: "Изучить Zustand", completed: false },
          { id: 2, text: "Понять Context API", completed: false },
          { id: 3, text: "Совместить Zustand и Context", completed: false },
        ],
        filter: "all",
        contextSpecificValue: "Значение из контекста",

        // Методы с использованием immer
        addTodo: (text) =>
          set((state) => {
            state.todos.push({
              id: Date.now(),
              text,
              completed: false,
            });
          }),

        toggleTodo: (id) =>
          set((state) => {
            const todo = state.todos.find((todo) => todo.id === id);
            if (todo) {
              todo.completed = !todo.completed;
            }
          }),

        removeTodo: (id) =>
          set((state) => {
            state.todos = state.todos.filter((todo) => todo.id !== id);
          }),

        setFilter: (filter) =>
          set((state) => {
            state.filter = filter;
          }),

        setContextValue: (value) =>
          set((state) => {
            state.contextSpecificValue = value;
          }),
      }))
    )
  );
