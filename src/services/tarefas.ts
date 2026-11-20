import { CATEGORIAS } from "../lib/constantes/tarefas";
import {
  aprovarConclusao,
  estadoTarefa,
  rejeitarConclusao,
  submeterConclusao,
  ultimaRejeicao,
  ErroNegocio,
} from "../lib/regras/tarefas";
import type { CategoriaId, Conclusao, EstadoTarefa, Tarefa } from "../types";
import { ler, mutar } from "./store";

export interface ItemTarefa {
  tarefa: Tarefa;
  estado: EstadoTarefa;
  rejeicao: { motivo?: string } | null; // a última tentativa foi rejeitada
}

export async function obterTarefasDaCrianca() {
  const db = await ler();
  const porCategoria = CATEGORIAS.map((c) => ({
    categoria: c,
    itens: db.tarefas
      .filter((t) => t.ativa && t.categoria === c.id)
      .map((t): ItemTarefa => {
        const rej = ultimaRejeicao(db, t);
        return { tarefa: t, estado: estadoTarefa(db, t), rejeicao: rej ? { motivo: rej.motivoRejeicao } : null };
      }),
  })).filter((g) => g.itens.length > 0);
  const celebracoes = db.conclusoes.filter((c) => c.estado === "aprovada" && c.celebracaoVista === false);
  return { nome: db.perfil.nome, porCategoria, celebracoes };
}

export async function listarPendentes(): Promise<Conclusao[]> {
  const db = await ler();
  return db.conclusoes.filter((c) => c.estado === "concluida").sort((a, b) => a.submetidaEm.localeCompare(b.submetidaEm));
}

export async function contarPendentes(): Promise<number> {
  return (await listarPendentes()).length;
}

export async function listarDecididas(limite = 8): Promise<Conclusao[]> {
  const db = await ler();
  return db.conclusoes
    .filter((c) => c.estado !== "concluida" && c.decididaEm)
    .sort((a, b) => b.decididaEm!.localeCompare(a.decididaEm!))
    .slice(0, limite);
}

export async function listarTarefasGestao(): Promise<Tarefa[]> {
  return (await ler()).tarefas;
}

export async function obterTarefa(id: string): Promise<Tarefa | undefined> {
  return (await ler()).tarefas.find((t) => t.id === id);
}

export const submeter = (tarefaId: string) => mutar((db) => submeterConclusao(db, tarefaId));
export const aprovar = (id: string) => mutar((db) => aprovarConclusao(db, id));
export const rejeitar = (id: string, motivo?: string) => mutar((db) => rejeitarConclusao(db, id, motivo));

export const marcarCelebracoesVistas = (ids: string[]) =>
  mutar((db) => {
    for (const c of db.conclusoes) if (ids.includes(c.id)) c.celebracaoVista = true;
  });

export const criarTarefa = (dados: Omit<Tarefa, "id" | "ativa">) =>
  mutar((db) => {
    db.tarefas.push({ ...dados, id: crypto.randomUUID(), ativa: true });
  });

export const editarTarefa = (id: string, dados: Omit<Tarefa, "id" | "ativa">) =>
  mutar((db) => {
    const t = db.tarefas.find((x) => x.id === id);
    if (!t) throw new ErroNegocio("Não encontrei esta tarefa.");
    Object.assign(t, dados);
  });

export const definirAtiva = (id: string, ativa: boolean) =>
  mutar((db) => {
    const t = db.tarefas.find((x) => x.id === id);
    if (!t) throw new ErroNegocio("Não encontrei esta tarefa.");
    t.ativa = ativa;
  });

export type { CategoriaId };
