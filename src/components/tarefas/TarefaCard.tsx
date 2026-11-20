"use client";

import { CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { useState, useTransition } from "react";
import { submeterTarefaAcao } from "@/actions/tarefas";
import { frequenciaPorId } from "@/lib/constantes/tarefas";
import type { ItemTarefa } from "@/services/tarefas";

export function TarefaCard({ item }: { item: ItemTarefa }) {
  const { tarefa, estado, rejeicao } = item;
  const [aEnviar, iniciar] = useTransition();
  const [erro, setErro] = useState<string>();

  function enviar() {
    setErro(undefined);
    iniciar(async () => {
      const r = await submeterTarefaAcao(tarefa.id);
      if (!r.ok) setErro(r.erro);
    });
  }

  return (
    <li className="flex flex-col rounded-3xl bg-white p-4 shadow-card">
      <div className="flex-1">
        <p className="font-bold leading-snug">{tarefa.nome}</p>
        {tarefa.descricao && <p className="mt-0.5 text-sm text-ink-500">{tarefa.descricao}</p>}
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-full bg-sun-100 px-3 py-1 text-ink-900">+{tarefa.pontos} pontos</span>
          <span className="rounded-full bg-grape-50 px-3 py-1 text-ink-500">{frequenciaPorId(tarefa.frequencia).curto}</span>
        </div>
        {estado === "pendente" && rejeicao && (
          <p className="mt-3 flex gap-2 rounded-2xl bg-rosa-50 p-3 text-sm text-ink-700">
            <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-rosa-500" aria-hidden />
            <span>
              Os pais pediram para tentares outra vez{rejeicao.motivo ? `: ${rejeicao.motivo}` : "."}
            </span>
          </p>
        )}
      </div>

      <div className="mt-4">
        {estado === "pendente" && (
          <button
            type="button"
            onClick={enviar}
            disabled={aEnviar}
            className="min-h-12 w-full rounded-2xl bg-grape-600 px-4 font-bold text-white shadow-pop transition active:translate-y-0.5 disabled:opacity-60"
          >
            {aEnviar ? "A enviar…" : "Já fiz!"}
          </button>
        )}
        {estado === "concluida" && (
          <p className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sun-100 px-4 font-bold text-ink-700">
            <Clock className="h-5 w-5" aria-hidden /> À espera dos pais
          </p>
        )}
        {estado === "aprovada" && (
          <p className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sky-100 px-4 font-bold text-sky-500">
            <CheckCircle2 className="h-5 w-5" aria-hidden /> Aprovada
          </p>
        )}
        {erro && (
          <p role="alert" className="mt-2 text-sm font-bold text-rosa-500">
            {erro}
          </p>
        )}
      </div>
    </li>
  );
}
