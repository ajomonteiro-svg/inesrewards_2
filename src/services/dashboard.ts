import { MEDALHAS } from "../lib/constantes/medalhas";
import { avaliarMedalhas } from "../lib/regras/medalhas";
import { calcularSaldo, ganhosDaSemana, pontosDaSemana } from "../lib/regras/pontos";
import type { DadosDashboard } from "../types";
import { ler } from "./store";

export async function obterPerfil() {
  return (await ler()).perfil;
}

export async function obterDadosDashboard(): Promise<DadosDashboard> {
  const db = await ler();
  return {
    perfil: db.perfil,
    saldo: calcularSaldo(db.movimentos),
    pontosSemana: pontosDaSemana(db.movimentos),
    tarefasSemana: ganhosDaSemana(db.movimentos).length,
    tarefasTotal: db.movimentos.filter((m) => m.tipo === "ganho").length,
    recompensas: db.recompensas,
    medalhas: avaliarMedalhas(MEDALHAS, db.movimentos),
  };
}
