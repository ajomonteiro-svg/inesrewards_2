"use client";

import { useActionState, useState } from "react";
import { guardarTarefaAcao } from "@/actions/tarefas";
import { CATEGORIAS, FREQUENCIAS } from "@/lib/constantes/tarefas";
import type { EstadoFormTarefa, Tarefa } from "@/types";

const campo = "mt-1 w-full rounded-2xl border-2 border-grape-100 bg-grape-50 px-4 py-3 text-base outline-none focus:border-grape-500";

export function FormularioTarefa({ tarefa }: { tarefa?: Tarefa }) {
  const [estado, acao, aEnviar] = useActionState(guardarTarefaAcao, {} as EstadoFormTarefa);
  const [nome, setNome] = useState(tarefa?.nome ?? "");
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? "");
  const [categoria, setCategoria] = useState(tarefa?.categoria ?? "escola");
  const [pontos, setPontos] = useState(String(tarefa?.pontos ?? 5));
  const [frequencia, setFrequencia] = useState(tarefa?.frequencia ?? "diaria");
  const e = estado.erros ?? {};
  const Erro = ({ id }: { id: string }) =>
    e[id] ? (
      <p id={`erro-${id}`} className="mt-1 text-sm font-bold text-rosa-500">
        {e[id]}
      </p>
    ) : null;

  return (
    <form action={acao} className="space-y-4" noValidate>
      {tarefa && <input type="hidden" name="id" value={tarefa.id} />}
      <div>
        <label htmlFor="nome" className="text-sm font-bold text-ink-700">Nome</label>
        <input id="nome" name="nome" value={nome} onChange={(x) => setNome(x.target.value)} maxLength={60} className={campo} aria-describedby={e.nome ? "erro-nome" : undefined} />
        <Erro id="nome" />
      </div>
      <div>
        <label htmlFor="descricao" className="text-sm font-bold text-ink-700">Descrição</label>
        <textarea id="descricao" name="descricao" value={descricao} onChange={(x) => setDescricao(x.target.value)} maxLength={200} rows={2} className={campo} aria-describedby={e.descricao ? "erro-descricao" : undefined} />
        <Erro id="descricao" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="categoria" className="text-sm font-bold text-ink-700">Categoria</label>
          <select id="categoria" name="categoria" value={categoria} onChange={(x) => setCategoria(x.target.value as Tarefa["categoria"])} className={campo}>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>
            ))}
          </select>
          <Erro id="categoria" />
        </div>
        <div>
          <label htmlFor="pontos" className="text-sm font-bold text-ink-700">Pontos</label>
          <input id="pontos" name="pontos" type="number" inputMode="numeric" min={1} max={500} value={pontos} onChange={(x) => setPontos(x.target.value)} className={campo} aria-describedby={e.pontos ? "erro-pontos" : undefined} />
          <Erro id="pontos" />
        </div>
        <div>
          <label htmlFor="frequencia" className="text-sm font-bold text-ink-700">Frequência</label>
          <select id="frequencia" name="frequencia" value={frequencia} onChange={(x) => setFrequencia(x.target.value as Tarefa["frequencia"])} className={campo}>
            {FREQUENCIAS.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
          <Erro id="frequencia" />
        </div>
      </div>
      {estado.geral && (
        <p role="alert" className="rounded-xl bg-rosa-50 px-3 py-2 text-sm font-bold text-rosa-500">{estado.geral}</p>
      )}
      <button type="submit" disabled={aEnviar} className="min-h-12 w-full rounded-2xl bg-grape-600 px-6 font-bold text-white shadow-pop disabled:opacity-60 sm:w-auto">
        {aEnviar ? "A guardar…" : tarefa ? "Guardar alterações" : "Criar tarefa"}
      </button>
    </form>
  );
}
