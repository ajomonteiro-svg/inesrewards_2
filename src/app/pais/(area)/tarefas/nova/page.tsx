import { Card } from "@/components/ui/Card";
import { FormularioTarefa } from "@/components/tarefas/FormularioTarefa";

export const metadata = { title: "Nova tarefa" };

export default function NovaTarefaPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-3xl font-semibold">Nova tarefa</h1>
      <Card className="sm:p-6">
        <FormularioTarefa />
      </Card>
    </div>
  );
}
