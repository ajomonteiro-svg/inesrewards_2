import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

interface Props {
  titulo: string;
  icone: LucideIcon;
  fase: number;
  texto: string;
  itens: string[];
}

/** Rota já navegável cuja funcionalidade chega numa fase seguinte. Sem botões falsos. */
export function FaseEmBreve({ titulo, icone: Icone, fase, texto, itens }: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink-900">{titulo}</h1>
      <Card className="mt-5 text-center sm:p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-grape-100 text-grape-600">
          <Icone className="h-8 w-8" aria-hidden />
        </div>
        <p className="mt-4 inline-block rounded-full bg-sun-100 px-3 py-1 text-sm font-bold text-ink-700">
          Chega na Fase {fase}
        </p>
        <p className="mx-auto mt-3 max-w-md text-ink-700">{texto}</p>
        <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-ink-700">
          {itens.map((i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="text-sun-500">★</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
