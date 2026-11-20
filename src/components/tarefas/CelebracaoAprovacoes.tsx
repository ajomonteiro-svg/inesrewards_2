"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { marcarCelebracoesVistasAcao } from "@/actions/tarefas";
import { StarBurst } from "@/components/gamificacao/StarBurst";
import type { Conclusao } from "@/types";

export function CelebracaoAprovacoes({ nome, conclusoes }: { nome: string; conclusoes: Conclusao[] }) {
  const router = useRouter();
  const [oculto, setOculto] = useState(false);
  const [aGuardar, iniciar] = useTransition();
  const total = conclusoes.reduce((t, c) => t + c.pontos, 0);
  if (oculto || conclusoes.length === 0) return null;

  function fechar() {
    iniciar(async () => {
      await marcarCelebracoesVistasAcao(conclusoes.map((c) => c.id));
      setOculto(true);
      router.refresh();
    });
  }

  return (
    <section
      role="status"
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sun-300 to-rosa-400 p-6 text-center text-ink-900 shadow-card"
    >
      <StarBurst />
      <p className="font-display text-2xl font-semibold">Parabéns, {nome}! 🎉</p>
      <p className="mt-1 text-lg font-bold">
        {conclusoes.length === 1 ? "Os pais aprovaram 1 tarefa" : `Os pais aprovaram ${conclusoes.length} tarefas`}: ganhaste +{total} pontos!
      </p>
      <ul className="mt-2 text-sm font-semibold">
        {conclusoes.map((c) => (
          <li key={c.id}>
            {c.tarefaNome} (+{c.pontos})
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={fechar}
        disabled={aGuardar}
        className="relative mt-4 min-h-12 rounded-2xl bg-white px-6 font-bold text-grape-700 shadow-pop disabled:opacity-60"
      >
        Que bom!
      </button>
    </section>
  );
}
