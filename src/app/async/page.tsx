"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAsyncStore } from "@/stores/useAsyncStore";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

// Компонент отображения статуса загрузки
function LoadingStatus() {
  const { isLoading, error, resetError } = useAsyncStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      error: state.error,
      resetError: state.resetError,
    }))
  );

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-100 border-2 border-blue-300 rounded-lg text-blue-800 animate-pulse">
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Загрузка данных...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
          <Button variant="destructive" size="sm" onClick={resetError}>
            Закрыть
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

// Компонент для отображения списка продуктов
function ProductsList() {
  const { products, lastFetched, removeProduct } = useAsyncStore(
    useShallow((state) => ({
      products: state.products,
      lastFetched: state.lastFetched,
      removeProduct: state.removeProduct,
    }))
  );

  return (
    <div className="p-6 border-4 border-emerald-500 rounded-lg bg-emerald-50 text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Список продуктов</h2>
        {lastFetched && (
          <div className="text-xs text-gray-500">
            Последнее обновление: {new Date(lastFetched).toLocaleString()}
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="p-4 text-center bg-gray-100 rounded-lg">
          Нет доступных продуктов. Нажмите кнопку &quot;Загрузить с
          сервера&quot;.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
            >
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-gray-500">{product.price} ₽</div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    product.inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.inStock ? "В наличии" : "Нет в наличии"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => removeProduct(product.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Компонент для добавления нового продукта
function AddProductForm() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    inStock: true,
  });

  const addProduct = useAsyncStore((state) => state.addProduct);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price > 0) {
      addProduct(newProduct);
      setNewProduct({ name: "", price: 0, inStock: true });
    }
  };

  return (
    <div className="p-6 border-4 border-indigo-500 rounded-lg bg-indigo-50 text-black">
      <h2 className="text-xl font-bold mb-4">Добавить новый продукт</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Название продукта</Label>
          <Input
            id="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            placeholder="Введите название продукта"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="price">Цена (₽)</Label>
          <Input
            id="price"
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: Number(e.target.value),
              })
            }
            min="0"
            step="100"
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="inStock"
            type="checkbox"
            checked={newProduct.inStock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, inStock: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label htmlFor="inStock">В наличии</Label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!newProduct.name || newProduct.price <= 0}
        >
          Добавить продукт
        </Button>
      </form>
    </div>
  );
}

// Компонент для управления данными
function DataControls() {
  const fetchProducts = useAsyncStore((state) => state.fetchProducts);
  const isLoading = useAsyncStore((state) => state.isLoading);

  return (
    <div className="p-6 border-4 border-amber-500 rounded-lg bg-amber-50 text-black">
      <h2 className="text-xl font-bold mb-4">Управление данными</h2>
      <div className="space-y-4">
        <Button
          onClick={() => fetchProducts()}
          disabled={isLoading}
          className="w-full bg-amber-500 hover:bg-amber-600"
        >
          Загрузить с сервера
        </Button>
        <div className="p-3 bg-white rounded-lg text-sm">
          <p className="font-medium">Инструкция:</p>
          <ul className="list-disc list-inside text-gray-600 mt-1">
            <li>Нажмите кнопку выше для загрузки данных с сервера</li>
            <li>Добавляйте новые продукты через форму слева</li>
            <li>Удаляйте продукты кнопкой &quot;Удалить&quot;</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Основной компонент страницы
export default function ServerStorePage() {
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
        Демонстрация Zustand с инициализацией данными с сервера
      </h1>

      <LoadingStatus />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-4">
        <ProductsList />
        <div className="space-y-6">
          <AddProductForm />
          <DataControls />
        </div>

        <div className="col-span-1 md:col-span-2 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          <h3 className="font-bold mb-2">Как это работает:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Состояние загрузки (isLoading) и ошибки (error) отслеживаются в
              хранилище
            </li>
            <li>
              Асинхронные методы используют await и try/catch для обработки
              запросов к API
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
