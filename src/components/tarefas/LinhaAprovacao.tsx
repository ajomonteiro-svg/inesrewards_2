"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { aprovarAcao, rejeitarAcao } from "@/actions/tarefas";
import { StarBurst } from "@/components/gamificacao/StarBurst";
import { categoriaPorId } from "@/lib/constantes/tarefas";
import { dataRelativa } from "@/lib/utils/datas";
import type { Conclusao } from "@/types";

type Modo = "normal" | "a-rejeitar" | "aprovada" | "rejeitada";

export function LinhaAprovacao({ conclusao: c }: { conclusao: Conclusao }) {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>("normal");
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState<string>();
  const [aTrabalhar, iniciar] = useTransition();
  const cat = categoriaPorId(c.categoria);

  function decidir(acao: "aprovar" | "rejeitar") {
    setErro(undefined);
    iniciar(async () => {
      const r = acao === "aprovar" ? await aprovarAcao(c.id) : await rejeitarAcao(c.id, motivo);
      if (r.ok) {
        setModo(acao === "aprovar" ? "aprovada" : "rejeitada");
        setTimeout(() => router.refresh(), acao === "aprovar" ? 1800 : 900);
      } else {
        setErro(r.erro);
        setTimeout(() => router.refresh(), 2500); // ex.: já decidido noutro dispositivo; dá tempo de ler
      }
    });
  }

  return (
    <li className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-card">
      {modo === "aprovada" && <StarBurst />}
      <div className="flex items-start gap-3">
        <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-grape-50 text-2xl">
          {cat.icone}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-snug">{c.tarefaNome}</p>
          <p className="text-sm text-ink-500">
            {cat.nome} · enviada {dataRelativa(c.submetidaEm)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-sun-100 px-3 py-1 text-sm font-bold">+{c.pontos}</span>
      </div>

      {modo === "normal" && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={aTrabalhar}
            onClick={() => decidir("aprovar")}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-grape-600 font-bold text-white shadow-pop disabled:opacity-60"
          >
            <Check className="h-5 w-5" aria-hidden /> Aprovar
          </button>
          <button
            type="button"
            disabled={aTrabalhar}
            onClick={() => setModo("a-rejeitar")}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-grape-50 font-bold text-ink-700 disabled:opacity-60"
          >
            <X className="h-5 w-5" aria-hidden /> Rejeitar
          </button>
        </div>
      )}

      {modo === "a-rejeitar" && (
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-bold text-ink-700" htmlFor={`motivo-${c.id}`}>
            Motivo (opcional, a Inês vai ver)
          </label>
          <input
            id={`motivo-${c.id}`}
            value={motivo}
            maxLength={200}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex.: Falta arrumar a mochila"
            className="w-full rounded-2xl border-2 border-grape-100 bg-grape-50 px-4 py-3 outline-none focus:border-grape-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={aTrabalhar}
              onClick={() => decidir("rejeitar")}
              className="min-h-12 rounded-2xl bg-rosa-500 font-bold text-white shadow-pop disabled:opacity-60"
            >
              Confirmar
            </button>
            <button type="button" onClick={() => setModo("normal")} className="min-h-12 rounded-2xl bg-grape-50 font-bold text-ink-700">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {modo === "aprovada" && (
        <p role="status" className="mt-4 rounded-2xl bg-sun-100 p-3 text-center font-bold">
          Aprovada! +{c.pontos} pontos para a Inês ⭐
        </p>
      )}
      {modo === "rejeitada" && (
        <p role="status" className="mt-4 rounded-2xl bg-grape-50 p-3 text-center font-bold text-ink-700">
          Rejeitada. A Inês pode tentar outra vez.
        </p>
      )}
      {erro && (
        <p role="alert" className="mt-3 text-sm font-bold text-rosa-500">
          {erro}
        </p>
      )}
    </li>
  );
}
