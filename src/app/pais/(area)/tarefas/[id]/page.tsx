import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { FormularioTarefa } from "@/components/tarefas/FormularioTarefa";
import { obterTarefa } from "@/services/tarefas";

export const metadata = { title: "Editar tarefa" };
export const dynamic = "force-dynamic";

export default async function EditarTarefaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tarefa = await obterTarefa(id);
  if (!tarefa) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-3xl font-semibold">Editar tarefa</h1>
      <Card className="sm:p-6">
        <FormularioTarefa tarefa={tarefa} />
      </Card>
      <p className="text-sm text-ink-500">
        As alterações não mudam o histórico: tarefas já aprovadas mantêm o nome e os pontos que tinham.
      </p>
    </div>
  );
}
