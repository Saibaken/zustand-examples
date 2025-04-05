import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const links: { link: string; title: string }[] = [
  { link: "/basic", title: "Basic example" },
  { link: "/immer", title: "Immer example" },
  { link: "/persist", title: "Persist example" },
  { link: "/async", title: "Async store example" },
  { link: "/context", title: "Context store example" },
];

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-slate-800 text-white">
      <div className="grid grid-cols-2 gap-8 w-96">
        {links.map(({ link, title }) => (
          <Link href={link} key={link}>
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
