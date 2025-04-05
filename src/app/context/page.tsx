"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContextStoreProvider, useContextStore } from "@/contexts/StoreContext";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

// Компонент для отображения списка задач
function TodoList() {
  const { todos, filter, toggleTodo, removeTodo } = useContextStore(
    useShallow((state) => ({
      todos: state.todos,
      filter: state.filter,
      toggleTodo: state.toggleTodo,
      removeTodo: state.removeTodo,
    }))
  );

  // Фильтрация задач в зависимости от текущего фильтра
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="p-6 border-4 border-purple-500 rounded-lg bg-purple-50 text-black">
      <h2 className="text-xl font-bold mb-4">Список задач</h2>

      {filteredTodos.length === 0 ? (
        <div className="p-4 text-center bg-gray-100 rounded-lg">
          {filter === "all"
            ? "Нет задач. Добавьте новую задачу."
            : filter === "active"
            ? "Нет активных задач."
            : "Нет завершенных задач."}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span
                  className={todo.completed ? "line-through text-gray-500" : ""}
                >
                  {todo.text}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => removeTodo(todo.id)}
              >
                Удалить
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Компонент для добавления новой задачи
function AddTodo() {
  const [text, setText] = useState("");
  const addTodo = useContextStore((state) => state.addTodo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText("");
    }
  };

  return (
    <div className="p-6 border-4 border-teal-500 rounded-lg bg-teal-50 text-black">
      <h2 className="text-xl font-bold mb-4">Добавить задачу</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите текст задачи"
          className="flex-grow"
        />
        <Button type="submit" disabled={!text.trim()}>
          Добавить
        </Button>
      </form>
    </div>
  );
}

// Компонент для фильтрации задач
function FilterTodos() {
  const { filter, setFilter } = useContextStore(
    useShallow((state) => ({
      filter: state.filter,
      setFilter: state.setFilter,
    }))
  );

  return (
    <div className="p-6 border-4 border-blue-500 rounded-lg bg-blue-50 text-black">
      <h2 className="text-xl font-bold mb-4">Фильтр задач</h2>
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          Все
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Активные
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Завершенные
        </Button>
      </div>
    </div>
  );
}

// Компонент для демонстрации контекст-специфичного значения
function ContextSpecificValue() {
  const { value, setValue } = useContextStore(
    useShallow((state) => ({
      value: state.contextSpecificValue,
      setValue: state.setContextValue,
    }))
  );

  return (
    <div className="p-6 border-4 border-amber-500 rounded-lg bg-amber-50 text-black">
      <h2 className="text-xl font-bold mb-4">Значение из контекста</h2>
      <div className="mb-4 p-3 bg-white rounded-lg">
        <p>
          Текущее значение: <span className="font-bold">{value}</span>
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Изменить значение"
          className="flex-grow"
        />
      </div>
    </div>
  );
}

// Компонент без обёртки ContextStoreProvider (для демонстрации)
function NonWrappedComponent() {
  return (
    <div className="p-6 border-4 border-red-500 rounded-lg bg-red-50 text-black">
      <h2 className="text-xl font-bold mb-4">Компонент вне контекста</h2>
      <p>
        Этот компонент не имеет доступа к хранилищу, так как находится вне
        ContextStoreProvider
      </p>
      <Button
        variant="outline"
        className="mt-2"
        onClick={() => alert("Здесь нельзя использовать useContextStore")}
      >
        Попробовать использовать хранилище
      </Button>
    </div>
  );
}

// Основной компонент с обёрткой ContextStoreProvider
export function ContextPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Демонстрация Zustand с Context API
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Компоненты внутри ContextStoreProvider */}
        <ContextStoreProvider>
          <TodoList />
          <div className="space-y-6">
            <AddTodo />
            <FilterTodos />
          </div>
          <ContextSpecificValue />
        </ContextStoreProvider>

        {/* Компонент вне ContextStoreProvider */}
        <NonWrappedComponent />

        <div className="col-span-1 md:col-span-2 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          <h3 className="font-bold mb-2">Как это работает:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Создаётся фабрика хранилища вместо глобального синглтона</li>
            <li>
              ContextStoreProvider создаёт экземпляр хранилища и передаёт его в
              React Context
            </li>
            <li>
              useContextStore позволяет компонентам получать доступ к состоянию
              и методам
            </li>
            <li>
              Каждый экземпляр ContextStoreProvider создаёт отдельное
              изолированное хранилище
            </li>
            <li>
              Компоненты, находящиеся вне провайдера, не могут использовать
              хранилище
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Страница с двумя изолированными экземплярами хранилища
export default function MultiContextPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Zustand с множественными изолированными контекстами
      </h1>

      <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
        {/* Первый экземпляр хранилища */}
        <div className="p-4 border-2 border-blue-300 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Контекст 1 (Независимое хранилище)
          </h2>
          <ContextStoreProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TodoList />
              <AddTodo />
            </div>
          </ContextStoreProvider>
        </div>

        {/* Второй экземпляр хранилища */}
        <div className="p-4 border-2 border-green-300 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Контекст 2 (Независимое хранилище)
          </h2>
          <ContextStoreProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TodoList />
              <AddTodo />
            </div>
          </ContextStoreProvider>
        </div>

        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          <h3 className="font-bold mb-2">Преимущества этого подхода:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Изолированные состояния для разных частей приложения</li>
            <li>Можно создавать несколько независимых экземпляров хранилища</li>
            <li>
              Удобно для компонентов, которые могут использоваться несколько раз
              на странице
            </li>
            <li>
              Сочетает преимущества Zustand (простой API, devtools) с
              преимуществами Context API
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
