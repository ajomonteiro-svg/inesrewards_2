"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { Recompensa } from "@/types";

interface Props {
  recompensas: Recompensa[]; // ordenadas por pontos
  saldo: number;
  posicao: number; // 0 a 1
  avatar: string;
}

/** O caminho da Inês: cada paragem é uma recompensa. */
export function CaminhoDeEstrelas({ recompensas, saldo, posicao, avatar }: Props) {
  const n = recompensas.length;
  const proxima = recompensas.find((r) => r.pontos > saldo);
  const descricao = proxima
    ? `Tens ${saldo} pontos. Faltam ${proxima.pontos - saldo} para ${proxima.nome}.`
    : `Tens ${saldo} pontos e já podes pedir todas as recompensas.`;

  return (
    <div className="px-6" role="img" aria-label={descricao}>
      <div className="relative h-[128px]">
        <motion.div
          className="absolute top-0 z-10 flex -translate-x-1/2 flex-col items-center"
          initial={{ left: "0%" }}
          animate={{ left: `${posicao * 100}%` }}
          transition={{ type: "spring", stiffness: 45, damping: 14, delay: 0.3 }}
        >
          <div className="animate-bob grid h-11 w-11 place-items-center rounded-full border-4 border-white bg-sun-400 text-2xl shadow-pop">
            <span aria-hidden>{avatar}</span>
          </div>
          <div className="-mt-px h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-white" />
        </motion.div>

        <div className="absolute inset-x-0 top-[76px] h-3 -translate-y-1/2 rounded-full bg-white/25" />
        <motion.div
          className="absolute left-0 top-[76px] h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-rosa-400 to-sun-300"
          initial={{ width: 0 }}
          animate={{ width: `${posicao * 100}%` }}
          transition={{ type: "spring", stiffness: 45, damping: 14, delay: 0.3 }}
        />
        <div className="absolute left-0 top-[76px] h-3 w-3 -translate-y-1/2 rounded-full bg-white" aria-hidden />

        {recompensas.map((r, i) => {
          const alcancada = r.pontos <= saldo;
          const left = `${((i + 1) / n) * 100}%`;
          return (
            <div key={r.id}>
              <div
                className={cn(
                  "absolute top-[76px] grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-lg",
                  alcancada ? "border-white bg-sun-400 shadow-pop" : "border-white/40 bg-grape-700",
                )}
                style={{ left }}
                aria-hidden
              >
                <span className={alcancada ? "" : "opacity-60"}>{r.icone}</span>
              </div>
              <span
                className="absolute top-[100px] -translate-x-1/2 text-xs font-bold text-white/85"
                style={{ left }}
                aria-hidden
              >
                {r.pontos}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
