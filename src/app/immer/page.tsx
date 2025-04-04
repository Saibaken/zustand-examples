"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImmerStore } from "@/stores/useImmerStore";

import { useState } from "react";
import { useShallow } from "zustand/shallow";

// Компонент для отображения списка пользователей
function UsersList() {
  // Получаем только users из хранилища
  const users = useImmerStore(useShallow((state) => state.getAllUsers()));

  return (
    <div className="p-8 border-4 border-indigo-600 rounded-lg bg-indigo-50 text-black">
      <h2 className="text-xl font-bold mb-4">Пользователи</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-3 rounded flex justify-between items-center ${
              user.active
                ? "bg-green-100 border-green-500"
                : "bg-gray-100 border-gray-400"
            } border`}
          >
            <span>
              {user.name} (ID: {user.id})
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                user.active
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {user.active ? "Активен" : "Неактивен"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Немного извращений с перемещением стейта вниз по дереву

function TotalUsers() {
  const total = useImmerStore(useShallow((state) => state.getUsersCount()));

  return (
    <div className="p-4 bg-white rounded shadow text-center">
      <div className="text-2xl font-bold">{total}</div>
      <div className="text-sm text-gray-600">Всего</div>
    </div>
  );
}

function ActiveUsers() {
  const active = useImmerStore(
    useShallow((state) => state.getActiveUsersCount())
  );

  return (
    <div className="p-4 bg-green-50 rounded shadow text-center">
      <div className="text-2xl font-bold text-green-600">{active}</div>
      <div className="text-sm text-gray-600">Активны</div>
    </div>
  );
}

function InactiveUsers() {
  const inactive = useImmerStore(
    useShallow((state) => state.getInactiveUsersCount())
  );

  return (
    <div className="p-4 bg-gray-50 rounded shadow text-center">
      <div className="text-2xl font-bold text-gray-600">{inactive}</div>
      <div className="text-sm text-gray-600">Неактивны</div>
    </div>
  );
}

// Компонент для отображения статистики
function UsersStats() {
  return (
    <div className="p-8 border-4 border-purple-600 rounded-lg bg-purple-50 text-black">
      <h2 className="text-xl font-bold mb-4">Статистика</h2>
      <div className="grid grid-cols-3 gap-4">
        <TotalUsers />
        <ActiveUsers />
        <InactiveUsers />
      </div>
    </div>
  );
}

// Компонент для управления пользователями
function UserControls() {
  const [newUserName, setNewUserName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Получаем методы для изменения состояния с использованием useShallow
  const [toggleUserStatus, addUser, getUser] = useImmerStore(
    useShallow((state) => [
      state.toggleUserStatus,
      state.addUser,
      state.getUser,
    ])
  );

  // Список пользователей для выбора
  const users = useImmerStore((state) => state.users);

  const handleAddUser = () => {
    if (newUserName.trim()) {
      addUser(newUserName.trim());
      setNewUserName("");
    }
  };

  const handleToggleStatus = () => {
    if (selectedUserId !== null) {
      toggleUserStatus(selectedUserId);
    }
  };

  // Получаем детали выбранного пользователя
  const selectedUser =
    selectedUserId !== null ? getUser(selectedUserId) : undefined;

  return (
    <div className="p-8 border-4 border-cyan-600 rounded-lg bg-cyan-50 text-black">
      <h2 className="text-xl font-bold mb-4">Управление</h2>

      {/* Форма добавления пользователя */}
      <div className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Имя нового пользователя"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleAddUser}>Добавить</Button>
      </div>

      {/* Выбор пользователя */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Выберите пользователя для изменения статуса:
        </label>
        <select
          className="w-full p-2 border rounded"
          value={selectedUserId || ""}
          onChange={(e) =>
            setSelectedUserId(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">-- Выберите пользователя --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.active ? "Активен" : "Неактивен"})
            </option>
          ))}
        </select>
      </div>

      {/* Детали и действия с выбранным пользователем */}
      {selectedUser && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-bold mb-2">Выбран: {selectedUser.name}</h3>
          <p>Статус: {selectedUser.active ? "Активен" : "Неактивен"}</p>
          <Button
            onClick={handleToggleStatus}
            className="mt-3"
            variant={selectedUser.active ? "destructive" : "default"}
          >
            {selectedUser.active ? "Деактивировать" : "Активировать"}
          </Button>
        </div>
      )}
    </div>
  );
}

// Основной компонент страницы
export default function ImmerPage() {
  return (
    <div className="w-full min-h-screen bg-slate-800 text-white p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Демонстрация Zustand с Immer и Persist middleware
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <UsersList />
        <UsersStats />
        <UserControls />

        <div className="col-span-1 md:col-span-2 p-4 bg-yellow-100 text-yellow-800 rounded">
          <h3 className="font-bold mb-2">Как это работает:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Данные сохраняются в localStorage благодаря persist middleware
            </li>
            <li>Обновите страницу, и данные останутся неизменными</li>
            <li>
              Immer позволяет &quot;мутировать&quot; состояние напрямую (за
              кулисами создается новый объект)
            </li>
            <li>
              useShallow используется для предотвращения лишних ререндеров
              компонентов
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
