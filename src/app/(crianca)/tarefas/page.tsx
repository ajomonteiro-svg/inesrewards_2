import { CelebracaoAprovacoes } from "@/components/tarefas/CelebracaoAprovacoes";
import { TarefaCard } from "@/components/tarefas/TarefaCard";
import { obterTarefasDaCrianca } from "@/services/tarefas";

export const metadata = { title: "As minhas tarefas" };
export const dynamic = "force-dynamic";

export default async function TarefasPage() {
  const { nome, porCategoria, celebracoes } = await obterTarefasDaCrianca();
  const porFazer = porCategoria.flatMap((g) => g.itens).filter((i) => i.estado === "pendente").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold">As minhas tarefas</h1>
        <p className="mt-1 text-ink-500">
          {porFazer === 0 ? "Está tudo feito por agora. Boa!" : `${porFazer} por fazer. Quando acabares, toca em “Já fiz!”.`}
        </p>
      </header>

      <CelebracaoAprovacoes nome={nome} conclusoes={celebracoes} />

      {porCategoria.map(({ categoria, itens }) => (
        <section key={categoria.id} aria-labelledby={`cat-${categoria.id}`}>
          <h2 id={`cat-${categoria.id}`} className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
            <span aria-hidden>{categoria.icone}</span> {categoria.nome}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((item) => (
              <TarefaCard key={item.tarefa.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
