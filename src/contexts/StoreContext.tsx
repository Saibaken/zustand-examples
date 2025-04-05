import { createContextStore } from "@/stores/useContextStore";
import { createContext, ReactNode, useContext, useRef } from "react";
import { ExtractState, useStore } from "zustand";

// Тип для значения контекста
type ContextStoreType = ReturnType<typeof createContextStore> | null;

// Создаем контекст для хранилища
const StoreContext = createContext<ContextStoreType>(null);

// Провайдер для нашего контекста с хранилищем
export function ContextStoreProvider({ children }: { children: ReactNode }) {
  // Используем useRef для создания хранилища один раз
  const storeRef = useRef<ContextStoreType>(null);

  if (!storeRef.current) {
    storeRef.current = createContextStore();
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

export function useContextStore<U>(
  selector: (state: ExtractState<ContextStoreType>) => U
) {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error(
      "useContext store should be used within ContextStoreProvider"
    );
  }

  return useStore(store, selector);
}
