import type { EstadoRecompensa, MovimentoPontos, Recompensa } from "../../types";
import { segundaDaSemana } from "../utils/tempo";

/** O saldo é sempre a soma do livro-razão. Nunca é guardado à parte. */
export function calcularSaldo(movimentos: MovimentoPontos[]): number {
  return movimentos.reduce((total, m) => total + m.valor, 0);
}

export function ganhosDaSemana(movimentos: MovimentoPontos[], ref: Date = new Date()): MovimentoPontos[] {
  const semana = segundaDaSemana(ref);
  return movimentos.filter((m) => m.tipo === "ganho" && segundaDaSemana(m.data) === semana);
}

export function pontosDaSemana(movimentos: MovimentoPontos[], ref: Date = new Date()): number {
  return ganhosDaSemana(movimentos, ref).reduce((t, m) => t + m.valor, 0);
}

export function ordenarPorPontos(recompensas: Recompensa[]): Recompensa[] {
  return [...recompensas].sort((a, b) => a.pontos - b.pontos);
}

export function estadoRecompensa(saldo: number, r: Recompensa): EstadoRecompensa {
  return saldo >= r.pontos ? "desbloqueada" : "bloqueada";
}

/** Primeira recompensa que ainda não dá para pedir, ou null se já chega para todas. */
export function proximaRecompensa(saldo: number, recompensas: Recompensa[]): Recompensa | null {
  return ordenarPorPontos(recompensas).find((r) => r.pontos > saldo) ?? null;
}

/** Progresso (0 a 1) entre a recompensa anterior e a próxima. */
export function progressoParaProxima(saldo: number, recompensas: Recompensa[]): number {
  const ordenadas = ordenarPorPontos(recompensas);
  const proxima = ordenadas.find((r) => r.pontos > saldo);
  if (!proxima) return 1;
  const anterior = [...ordenadas].reverse().find((r) => r.pontos <= saldo)?.pontos ?? 0;
  return Math.min(1, Math.max(0, (saldo - anterior) / (proxima.pontos - anterior)));
}

/**
 * Posição (0 a 1) no caminho de estrelas. As paragens ficam equidistantes,
 * para que recompensas baratas (30, 50) não se sobreponham.
 */
export function posicaoNoCaminho(saldo: number, recompensas: Recompensa[]): number {
  const n = recompensas.length;
  if (n === 0) return 0;
  const ordenadas = ordenarPorPontos(recompensas);
  const alcancadas = ordenadas.filter((r) => r.pontos <= saldo).length;
  if (alcancadas === n) return 1;
  return (alcancadas + progressoParaProxima(saldo, recompensas)) / n;
}
