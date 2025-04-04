"use client";
import { Button } from "@/components/ui/button";
import { useBasicStore } from "@/stores/useBasicStore";
import { useShallow } from "zustand/shallow";

// Выборка только нужных частей состояния
function BearCounter() {
  const bears = useBasicStore((state) => state.bears);

  return (
    <div className="p-12 border-4 border-amber-600 rounded-4xl bg-amber-200 text-black">
      <h1>{bears} bears</h1>
    </div>
  );
}

// Выборка только нужных частей состояния
function FishCounter() {
  const fish = useBasicStore((state) => state.fish);

  return (
    <div className="p-12 border-4 border-slate-500 rounded-4xl bg-slate-400 text-black">
      <h1>{fish} fish</h1>
    </div>
  );
}

function Controls() {
  // Получаем методы для изменения состояния
  // Без useShallow бесконечно ререндерится 🤔
  const { increaseBears, removeAllBears, addFish, feedBears } = useBasicStore(
    useShallow((state) => ({
      increaseBears: state.increaseBears,
      removeAllBears: state.removeAllBears,
      addFish: state.addFish,
      feedBears: state.feedBears,
    }))
  );

  return (
    <div className="flex flex-row gap-4">
      <Button onClick={increaseBears}>Добавить медведя</Button>
      <Button onClick={() => addFish(5)}>Добавить 5 рыб</Button>
      <Button onClick={feedBears}>Покормить медведей</Button>
      <Button onClick={removeAllBears}>Убрать всех медведей</Button>
    </div>
  );
}

export default function Page() {
  return (
    <div className="w-full h-full bg-slate-800 text-white flex flex-col gap-4 items-center justify-center">
      <div className="grid grid-cols-2 gap-4">
        <BearCounter />
        <FishCounter />
      </div>
      <Controls />
    </div>
  );
}
