import { PartyPopper } from "lucide-react";
import { LinhaAprovacao } from "@/components/tarefas/LinhaAprovacao";
import { Card, CardTitle } from "@/components/ui/Card";
import { categoriaPorId } from "@/lib/constantes/tarefas";
import { dataRelativa } from "@/lib/utils/datas";
import { listarDecididas, listarPendentes } from "@/services/tarefas";

export const metadata = { title: "Aprovações" };
export const dynamic = "force-dynamic";

export default async function AprovacoesPage() {
  const [pendentes, decididas] = await Promise.all([listarPendentes(), listarDecididas()]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Aprovações</h1>

      {pendentes.length === 0 ? (
        <Card className="text-center sm:p-8">
          <PartyPopper className="mx-auto h-10 w-10 text-grape-400" aria-hidden />
          <p className="mt-2 font-bold">Não há tarefas à espera de aprovação.</p>
          <p className="text-ink-500">Quando a Inês enviar uma tarefa, aparece aqui.</p>
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {pendentes.map((c) => (
            <LinhaAprovacao key={c.id} conclusao={c} />
          ))}
        </ul>
      )}

      {decididas.length > 0 && (
        <Card>
          <CardTitle>Decididas há pouco</CardTitle>
          <ul className="mt-3 divide-y divide-grape-100">
            {decididas.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-2.5">
                <span aria-hidden className="text-xl">{categoriaPorId(c.categoria).icone}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{c.tarefaNome}</p>
                  <p className="text-sm text-ink-500">
                    {dataRelativa(c.decididaEm!)}
                    {c.motivoRejeicao ? ` · ${c.motivoRejeicao}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${c.estado === "aprovada" ? "bg-sun-100" : "bg-grape-50 text-ink-500"}`}
                >
                  {c.estado === "aprovada" ? `+${c.pontos}` : "Rejeitada"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
