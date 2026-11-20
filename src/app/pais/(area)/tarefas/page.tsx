import { Plus } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CATEGORIAS, frequenciaPorId } from "@/lib/constantes/tarefas";
import { definirAtivaAcao } from "@/actions/tarefas";
import { listarTarefasGestao } from "@/services/tarefas";

export const metadata = { title: "Gerir tarefas" };
export const dynamic = "force-dynamic";

export default async function GerirTarefasPage() {
  const tarefas = await listarTarefasGestao();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Gerir tarefas</h1>
        <Link href="/pais/tarefas/nova" className="flex min-h-11 items-center gap-2 rounded-2xl bg-grape-600 px-4 font-bold text-white shadow-pop">
          <Plus className="h-5 w-5" aria-hidden /> Nova tarefa
        </Link>
      </div>

      {CATEGORIAS.map((c) => {
        const lista = tarefas.filter((t) => t.categoria === c.id);
        if (!lista.length) return null;
        return (
          <Card key={c.id}>
            <h2 className="font-display text-lg font-semibold">
              <span aria-hidden>{c.icone}</span> {c.nome}
            </h2>
            <ul className="mt-2 divide-y divide-grape-100">
              {lista.map((t) => (
                <li key={t.id} className={`flex flex-wrap items-center gap-3 py-3 ${t.ativa ? "" : "opacity-60"}`}>
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="font-bold leading-snug">{t.nome}</p>
                    <p className="text-sm text-ink-500">
                      {t.pontos} pontos · {frequenciaPorId(t.frequencia).curto}
                      {t.ativa ? "" : " · desativada"}
                    </p>
                  </div>
                  <Link href={`/pais/tarefas/${t.id}`} className="rounded-full bg-grape-50 px-4 py-2 text-sm font-bold text-grape-600">
                    Editar
                  </Link>
                  <form action={definirAtivaAcao}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="ativa" value={t.ativa ? "0" : "1"} />
                    <button type="submit" className="rounded-full bg-grape-50 px-4 py-2 text-sm font-bold text-ink-700">
                      {t.ativa ? "Desativar" : "Ativar"}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
