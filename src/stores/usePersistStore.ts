import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  PersistOptions,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Определяем типы для нашего хранилища
interface Settings {
  notifications: boolean;
  sounds: boolean;
  [key: string]: boolean;
}

interface StoreState {
  theme: "dark" | "light";
  settings: Settings;
  lastUpdated: number | null;
  history: Omit<StoreState, "history">[];
}

interface StoreActions {
  toggleTheme: () => void;
  toggleSetting: (key: string) => void;
  addSetting: (settingName: string) => void;
  getStoreState: () => Omit<StoreState, "history">;
}

type PersistStore = StoreState & StoreActions;

// Определяем тип для конфигурации persist
type PersistConfig = PersistOptions<
  PersistStore,
  Pick<StoreState, "theme" | "settings" | "lastUpdated">
>;

// Создаем хранилище с правильным порядком middleware
export const usePersistStore = create<PersistStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Состояние
        theme: "light",
        settings: {
          notifications: true,
          sounds: false,
        },
        lastUpdated: null,
        history: [],

        // Методы с использованием immer
        toggleTheme: () =>
          set((state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
            state.lastUpdated = Date.now();
            state.history.push(state.getStoreState());
          }),

        toggleSetting: (key: string) =>
          set((state) => {
            if (state.settings[key] !== undefined) {
              state.settings[key] = !state.settings[key];
              state.lastUpdated = Date.now();
              state.history.push(state.getStoreState());
            }
          }),

        addSetting: (settingName: string) =>
          set((state) => {
            if (state.settings[settingName] === undefined) {
              state.settings[settingName] = false;
              state.lastUpdated = Date.now();
              state.history.push(state.getStoreState());
            } else {
              state.lastUpdated = Date.now();
            }
          }),
        getStoreState: () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { history, ...restState } = get();
          return restState;
        },
      })),
      {
        name: "app-storage", // Уникальное имя в localStorage
        storage: createJSONStorage(() => localStorage),

        // Определяем, какие части состояния нужно сохранять
        partialize: (state) => ({
          theme: state.theme,
          settings: state.settings,
          lastUpdated: state.lastUpdated,
        }),

        // Пропустить гидратацию для серверного рендера
        /**
         * useEffect(() => {
            // Запускаем гидратацию после маунта компонента
            usePersistStore.persist.rehydrate()
          }, [])
         *
         */
        // skipHydration: true

        // Опциональные настройки
        version: 1,
        merge: (persistedState, currentState) => {
          return {
            ...currentState,
            // @ts-expect-error persistedState is spreadable
            ...persistedState,
          };
        },

        // Опциональный колбэк, вызываемый после восстановления состояния
        onRehydrateStorage: () => {
          console.log("Состояние будет восстановлено из localStorage");
          return (rehydratedState, error) => {
            if (error) {
              console.error("Ошибка при восстановлении состояния:", error);
            } else {
              console.log("Состояние успешно восстановлено:", rehydratedState);
            }
          };
        },
      } as PersistConfig
    )
  )
);
