"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePersistStore } from "@/stores/usePersistStore";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

// Компонент отображения текущей темы
function ThemeDisplay() {
  const theme = usePersistStore(useShallow((state) => state.theme));

  return (
    <div
      className={`p-8 border-4 ${
        theme === "dark"
          ? "border-slate-600 bg-slate-800 text-white"
          : "border-yellow-400 bg-yellow-50 text-black"
      } rounded-lg`}
    >
      <h2 className="text-xl font-bold mb-4">Текущая тема</h2>
      <div className="flex items-center justify-center p-6 rounded-lg bg-opacity-20 backdrop-blur-sm">
        <div
          className={`text-4xl font-bold ${
            theme === "dark" ? "text-blue-400" : "text-orange-500"
          }`}
        >
          {theme === "dark" ? "Темная тема 🌙" : "Светлая тема ☀️"}
        </div>
      </div>
    </div>
  );
}

// Компонент для отображения настроек пользователя
function UserSettings() {
  const [settings, toggleSetting] = usePersistStore(
    useShallow((state) => [state.settings, state.toggleSetting])
  );

  return (
    <div className="p-8 border-4 border-purple-600 rounded-lg bg-purple-50 text-black">
      <h2 className="text-xl font-bold mb-4">Настройки пользователя</h2>
      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
          >
            <Label htmlFor={key} className="text-lg capitalize">
              {key === "notifications"
                ? "Уведомления"
                : key === "sounds"
                ? "Звуки"
                : key}
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                id={key}
                checked={value}
                onCheckedChange={() => toggleSetting(key)}
              />
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  value ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
              >
                {value ? "Вкл" : "Выкл"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Компонент для управления темой и добавления новых настроек
function SettingsControls() {
  const [newSettingName, setNewSettingName] = useState("");
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Загрузка состояния с сервера на клиент. Примитивный вариант как избежать ошибок гидрации
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const [theme, toggleTheme, addSetting] = usePersistStore(
    useShallow((state) => [state.theme, state.toggleTheme, state.addSetting])
  );

  const handleAddSetting = () => {
    if (newSettingName.trim()) {
      addSetting(newSettingName.trim());
      setNewSettingName("");
    }
  };

  if (!isPageLoaded) {
    return (
      <div className="p-8 rounded-lg bg-gray-100 animate-pulse h-64"></div>
    );
  }

  return (
    <div className="p-8 border-4 border-cyan-600 rounded-lg bg-cyan-50 text-black">
      <h2 className="text-xl font-bold mb-4">Управление настройками</h2>

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="font-medium mb-3">Переключение темы:</h3>
        <Button
          onClick={toggleTheme}
          variant={theme === "dark" ? "default" : "secondary"}
          className="w-full"
        >
          Переключить на {theme === "dark" ? "светлую" : "темную"} тему
        </Button>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-medium mb-3">Добавить новую настройку:</h3>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Название настройки"
            value={newSettingName}
            onChange={(e) => setNewSettingName(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleAddSetting}>Добавить</Button>
        </div>
      </div>
    </div>
  );
}

// Отображение информации о последнем сохранении
function LastSavedInfo() {
  const lastUpdated = usePersistStore((state) => state.lastUpdated);
  const history = usePersistStore((state) => state.history);

  return (
    <div className="p-4 bg-blue-50 border-4 border-blue-200 rounded-lg text-blue-800 overflow-scroll max-h-96">
      <h3 className="font-bold mb-1">Последнее сохранение:</h3>
      <div>
        {lastUpdated
          ? new Date(lastUpdated).toLocaleString()
          : "Нет информации о сохранении"}
      </div>
      <ol className="flex flex-col gap-2">
        {history.map((h) => (
          <li
            key={h.lastUpdated}
            className="border-2 p-2 border-blue-200 rounded-sm"
          >
            <p>Тема: {h.theme === "dark" ? "🌙" : "☀️"}</p>
            <p>
              Последнее обновление:
              {`${new Date(h.lastUpdated || 0).toLocaleDateString()} ${new Date(
                h.lastUpdated || 0
              ).toLocaleTimeString()}`}
            </p>
            Настройки:{" "}
            <ul className="text-xs">
              {Object.entries(h.settings).map(([k, v]) => (
                <p key={k}>
                  {k} -{" "}
                  {v ? (
                    <span className="bg-green-500 rounded-sm p-0.5 text-white">
                      true
                    </span>
                  ) : (
                    <span className="bg-red-500 rounded-sm p-0.5 text-white">
                      false
                    </span>
                  )}
                </p>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Основной компонент страницы
export default function PersistPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-slate-800 p-8">
      <h1 className="text-2xl font-bold mb-8 text-center text-white">
        Демонстрация Zustand с Persist middleware
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <ThemeDisplay />
        <UserSettings />
        <SettingsControls />
        <LastSavedInfo />

        <div className="col-span-1 md:col-span-2 p-4 bg-yellow-100 text-yellow-800 rounded">
          <h3 className="font-bold mb-2">Как это работает:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Все настройки и выбранная тема автоматически сохраняются в
              localStorage
            </li>
            <li>
              Persist middleware управляет сериализацией/десериализацией данных
            </li>
            <li>Используется createJSONStorage для работы с localStorage</li>
            <li>
              Функция partialize определяет, какие части состояния должны быть
              сохранены
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
