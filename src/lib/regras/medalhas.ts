import type { DefMedalha } from "../constantes/medalhas";
import type { Medalha, MovimentoPontos } from "../../types";
import { diaLisboa, diasEntre } from "../utils/tempo";

/** Sequência de dias consecutivos com pelo menos um ganho. */
function sequencias(ganhos: MovimentoPontos[]): { atual: number; dataDoAlvo: (alvo: number) => string | undefined } {
  const ultimoPorDia = new Map<string, string>();
  for (const g of ganhos) ultimoPorDia.set(diaLisboa(g.data), g.data);
  const dias = [...ultimoPorDia.keys()].sort();

  let corrida = 0;
  const alcanca = new Map<number, string>(); // tamanho da corrida -> data em que foi atingido (primeira vez)
  dias.forEach((d, i) => {
    corrida = i > 0 && diasEntre(dias[i - 1], d) === 1 ? corrida + 1 : 1;
    if (!alcanca.has(corrida)) alcanca.set(corrida, ultimoPorDia.get(d)!);
  });
  return { atual: corrida, dataDoAlvo: (alvo) => alcanca.get(alvo) };
}

export function avaliarMedalhas(defs: DefMedalha[], movimentos: MovimentoPontos[], ref: Date = new Date()): Medalha[] {
  const ganhos = movimentos.filter((m) => m.tipo === "ganho").sort((a, b) => a.data.localeCompare(b.data));
  const seq = sequencias(ganhos);
  const hoje = diaLisboa(ref);
  const ultimoDia = ganhos.length ? diaLisboa(ganhos[ganhos.length - 1].data) : undefined;
  const aCorrer = ultimoDia !== undefined && diasEntre(ultimoDia, hoje) <= 1 ? seq.atual : 0;

  return defs.map((d) => {
    const base = { id: d.id, icone: d.icone, nome: d.nome, descricao: d.descricao };
    const por = (atual: number) => ({ ...base, progresso: { atual: Math.min(atual, d.alvo), alvo: d.alvo } });

    if (d.tipo === "primeira") return ganhos[0] ? { ...base, desbloqueadaEm: ganhos[0].data } : por(0);
    if (d.tipo === "tarefas") return ganhos.length >= d.alvo ? { ...base, desbloqueadaEm: ganhos[d.alvo - 1].data } : por(ganhos.length);
    if (d.tipo === "pontos") {
      let total = 0;
      for (const g of ganhos) {
        total += g.valor;
        if (total >= d.alvo) return { ...base, desbloqueadaEm: g.data };
      }
      return por(total);
    }
    const data = seq.dataDoAlvo(d.alvo);
    return data ? { ...base, desbloqueadaEm: data } : por(aCorrer);
  });
}
