import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const links: { link: string; title: string; description: string }[] = [
  {
    link: "/basic",
    title: "Базовый пример",
    description: "Базовый пример с несколькими полями и экшенами",
  },
  {
    link: "/immer",
    title: "Immer middleware",
    description:
      "Использование immer middleware для изменений сложных объектов иммутабельно",
  },
  {
    link: "/persist",
    title: "Persist middleware",
    description:
      "Использование persist middleware для хранения и синхронизации с JSON хранилищем.",
  },
  {
    link: "/async",
    title: "Async set",
    description: "Асинхронный вызов изменений стора",
  },
  {
    link: "/context",
    title: "React context и фабрики",
    description: "Фабрика хранилищ и использование в контексте",
  },
];

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-slate-800 text-white">
      <div className="grid grid-cols-2 gap-8 w-1/2">
        {links.map(({ link, title, description }) => (
          <Link href={link} key={link}>
            <Card className="border-2 border-slate-400 h-full w-full">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
