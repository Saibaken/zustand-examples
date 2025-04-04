// useServerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Типы для данных с сервера
interface ServerProduct {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

interface ServerData {
  products: ServerProduct[];
  lastFetched: string | null;
}

// Определяем типы для нашего хранилища
interface StoreState {
  // Данные, которые загружаются с сервера
  products: ServerProduct[];
  lastFetched: string | null;

  // Флаги состояния загрузки
  isLoading: boolean;
  error: string | null;
}

interface StoreActions {
  // Действия для работы с серверными данными
  fetchProducts: () => Promise<void>;
  updateProduct: (id: number, updates: Partial<ServerProduct>) => Promise<void>;
  addProduct: (product: Omit<ServerProduct, "id">) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;

  // Утилитарные методы
  resetError: () => void;
  getProductById: (id: number) => ServerProduct | undefined;
}

type ServerStore = StoreState & StoreActions;

// Имитация API для работы с сервером
const api = {
  fetchProducts: async (): Promise<ServerData> => {
    // Имитируем задержку сети
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // В реальном приложении здесь был бы fetch запрос
    return {
      products: [
        { id: 1, name: "Ноутбук", price: 75000, inStock: true },
        { id: 2, name: "Смартфон", price: 45000, inStock: true },
        { id: 3, name: "Наушники", price: 12000, inStock: false },
      ],
      lastFetched: new Date().toISOString(),
    };
  },

  updateProduct: async (
    id: number,
    updates: Partial<ServerProduct>
  ): Promise<ServerProduct> => {
    // Имитируем задержку сети
    await new Promise((resolve) => setTimeout(resolve, 800));

    // В реальном приложении здесь был бы PUT/PATCH запрос
    return {
      id,
      name: "Обновлённый продукт",
      price: 0,
      inStock: true,
      ...updates,
    };
  },

  addProduct: async (
    product: Omit<ServerProduct, "id">
  ): Promise<ServerProduct> => {
    // Имитируем задержку сети
    await new Promise((resolve) => setTimeout(resolve, 800));

    // В реальном приложении здесь был бы POST запрос
    return { ...product, id: Math.floor(Math.random() * 1000) + 10 };
  },

  removeProduct: async (id: number): Promise<void> => {
    // Имитируем задержку сети
    await new Promise((resolve) => setTimeout(resolve, 500));

    // В реальном приложении здесь был бы DELETE запрос
    console.log(`Продукт с ID ${id} удален`);
  },
};

// Создаем хранилище с middleware
export const useAsyncStore = create<ServerStore>()(
  devtools(
    immer((set, get) => ({
      // Начальное состояние
      products: [],
      lastFetched: null,
      isLoading: false,
      error: null,

      // Метод для загрузки данных с сервера
      fetchProducts: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const data = await api.fetchProducts();

          set((state) => {
            state.products = data.products;
            state.lastFetched = data.lastFetched;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error
                ? error.message
                : "Произошла ошибка при загрузке";
            state.isLoading = false;
          });
        }
      },

      // Метод для обновления продукта
      updateProduct: async (id, updates) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const updatedProduct = await api.updateProduct(id, updates);

          set((state) => {
            const index = state.products.findIndex((p) => p.id === id);
            if (index !== -1) {
              state.products[index] = updatedProduct;
            }
            state.isLoading = false;
            state.lastFetched = new Date().toISOString();
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error
                ? error.message
                : "Ошибка при обновлении продукта";
            state.isLoading = false;
          });
        }
      },

      // Метод для добавления продукта
      addProduct: async (product) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const newProduct = await api.addProduct(product);

          set((state) => {
            state.products.push(newProduct);
            state.isLoading = false;
            state.lastFetched = new Date().toISOString();
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error
                ? error.message
                : "Ошибка при добавлении продукта";
            state.isLoading = false;
          });
        }
      },

      // Метод для удаления продукта
      removeProduct: async (id) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          await api.removeProduct(id);

          set((state) => {
            state.products = state.products.filter((p) => p.id !== id);
            state.isLoading = false;
            state.lastFetched = new Date().toISOString();
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error
                ? error.message
                : "Ошибка при удалении продукта";
            state.isLoading = false;
          });
        }
      },

      // Вспомогательные методы
      resetError: () =>
        set((state) => {
          state.error = null;
        }),

      getProductById: (id) => get().products.find((p) => p.id === id),
    }))
  )
);
