/**
 * Regras de negócio das tarefas e aprovações. Funções síncronas que alteram o
 * objeto recebido: quem as chama (a store) trata de as correr em exclusão
 * mútua e de gravar no fim. Se uma regra falhar, lança ErroNegocio e nada
 * é gravado.
 */
import type { CategoriaId, Conclusao, EstadoTarefa, Frequencia, MovimentoPontos, Tarefa } from "../../types";
import { CATEGORIAS, FREQUENCIAS } from "../constantes/tarefas";
import { diaLisboa, segundaDaSemana } from "../utils/tempo";

export class ErroNegocio extends Error {}

export interface DadosTarefas {
  tarefas: Tarefa[];
  conclusoes: Conclusao[];
  movimentos: MovimentoPontos[];
}

export function chavePeriodo(f: Frequencia, ref: Date | string = new Date()): string {
  if (f === "diaria") return diaLisboa(ref);
  if (f === "semanal") return segundaDaSemana(ref);
  return "unica";
}

/** Envio do período atual que ainda conta (pendente de decisão ou aprovado). */
export function conclusaoAtiva(db: DadosTarefas, t: Tarefa, ref: Date = new Date()): Conclusao | undefined {
  const periodo = chavePeriodo(t.frequencia, ref);
  return db.conclusoes.find((c) => c.tarefaId === t.id && c.periodo === periodo && c.estado !== "rejeitada");
}

export function estadoTarefa(db: DadosTarefas, t: Tarefa, ref: Date = new Date()): EstadoTarefa {
  const c = conclusaoAtiva(db, t, ref);
  if (!c) return "pendente";
  return c.estado === "aprovada" ? "aprovada" : "concluida";
}

/** Última rejeição do período, para dizer à Inês que pode tentar outra vez. */
export function ultimaRejeicao(db: DadosTarefas, t: Tarefa, ref: Date = new Date()): Conclusao | undefined {
  if (conclusaoAtiva(db, t, ref)) return undefined;
  const periodo = chavePeriodo(t.frequencia, ref);
  return db.conclusoes
    .filter((c) => c.tarefaId === t.id && c.periodo === periodo && c.estado === "rejeitada")
    .sort((a, b) => b.submetidaEm.localeCompare(a.submetidaEm))[0];
}

export function submeterConclusao(db: DadosTarefas, tarefaId: string, ref: Date = new Date()): Conclusao {
  const t = db.tarefas.find((x) => x.id === tarefaId);
  if (!t || !t.ativa) throw new ErroNegocio("Esta tarefa já não está disponível.");
  const existente = conclusaoAtiva(db, t, ref);
  if (existente?.estado === "aprovada") throw new ErroNegocio("Esta tarefa já foi aprovada.");
  if (existente) throw new ErroNegocio("Esta tarefa já foi enviada e está à espera dos pais.");

  const c: Conclusao = {
    id: crypto.randomUUID(),
    tarefaId: t.id,
    tarefaNome: t.nome,
    categoria: t.categoria,
    pontos: t.pontos,
    periodo: chavePeriodo(t.frequencia, ref),
    estado: "concluida",
    submetidaEm: ref.toISOString(),
  };
  db.conclusoes.push(c);
  return c;
}

function conclusaoPendente(db: DadosTarefas, id: string): Conclusao {
  const c = db.conclusoes.find((x) => x.id === id);
  if (!c) throw new ErroNegocio("Não encontrei este pedido.");
  if (c.estado === "aprovada") throw new ErroNegocio("Esta tarefa já foi aprovada.");
  if (c.estado === "rejeitada") throw new ErroNegocio("Esta tarefa já foi rejeitada.");
  return c;
}

/** Aprova e regista os pontos no livro-razão. Nunca aprova duas vezes. */
export function aprovarConclusao(db: DadosTarefas, id: string, ref: Date = new Date()): MovimentoPontos {
  const c = conclusaoPendente(db, id);
  if (db.movimentos.some((m) => m.conclusaoId === c.id)) throw new ErroNegocio("Os pontos desta tarefa já foram atribuídos.");

  c.estado = "aprovada";
  c.decididaEm = ref.toISOString();
  c.celebracaoVista = false;
  const mov: MovimentoPontos = {
    id: crypto.randomUUID(),
    tipo: "ganho",
    valor: c.pontos,
    descricao: c.tarefaNome,
    categoria: c.categoria,
    data: ref.toISOString(),
    conclusaoId: c.id,
  };
  db.movimentos.push(mov);
  return mov;
}

export function rejeitarConclusao(db: DadosTarefas, id: string, motivo = "", ref: Date = new Date()): void {
  const c = conclusaoPendente(db, id);
  c.estado = "rejeitada";
  c.decididaEm = ref.toISOString();
  const m = motivo.trim().slice(0, 200);
  if (m) c.motivoRejeicao = m;
}

export interface EntradaTarefa {
  nome: string;
  descricao: string;
  categoria: string;
  pontos: string | number;
  frequencia: string;
}

export function validarTarefa(e: EntradaTarefa): { valor?: Omit<Tarefa, "id" | "ativa">; erros: Record<string, string> } {
  const erros: Record<string, string> = {};
  const nome = e.nome.trim();
  const descricao = e.descricao.trim();
  const pontos = Number(e.pontos);

  if (nome.length < 2) erros.nome = "Escreve um nome com pelo menos 2 letras.";
  else if (nome.length > 60) erros.nome = "O nome pode ter no máximo 60 letras.";
  if (descricao.length > 200) erros.descricao = "A descrição pode ter no máximo 200 letras.";
  if (!CATEGORIAS.some((c) => c.id === e.categoria)) erros.categoria = "Escolhe uma categoria.";
  if (!FREQUENCIAS.some((f) => f.id === e.frequencia)) erros.frequencia = "Escolhe a frequência.";
  if (!Number.isInteger(pontos) || pontos < 1 || pontos > 500) erros.pontos = "Os pontos têm de ser um número inteiro entre 1 e 500.";

  if (Object.keys(erros).length) return { erros };
  return {
    erros,
    valor: { nome, descricao, categoria: e.categoria as CategoriaId, pontos, frequencia: e.frequencia as Frequencia },
  };
}
