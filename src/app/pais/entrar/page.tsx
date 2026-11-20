import { Lock } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { FormularioEntrar } from "./FormularioEntrar";

export const metadata = { title: "Área dos pais" };

export default function EntrarPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-sm sm:p-7">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-grape-100 text-grape-600">
          <Lock className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold">Área dos pais</h1>
        <p className="mt-1 text-ink-500">Escreve a senha para aprovar tarefas e gerir recompensas.</p>
        <FormularioEntrar />
        <Link href="/" className="mt-5 block text-center font-bold text-grape-600">
          Voltar à área da Inês
        </Link>
      </Card>
    </main>
  );
}
