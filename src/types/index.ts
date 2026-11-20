export type CategoriaId = "escola" | "responsabilidades" | "familia" | "habitos";

export interface PerfilCrianca {
  nome: string;
  avatar: string; // emoji (Fase 6: avatar personalizável)
  objetivoSemanal: number;
}

export type TipoMovimento = "ganho" | "resgate" | "ajuste";

/**
 * Movimento do livro-razão de pontos. O nome da tarefa/recompensa e o valor
 * ficam guardados no próprio movimento, para que editar a tarefa ou a
 * recompensa mais tarde nunca altere o histórico.
 */
export interface MovimentoPontos {
  id: string;
  tipo: TipoMovimento;
  valor: number; // positivo = ganho, negativo = desconto
  descricao: string;
  categoria?: CategoriaId;
  data: string; // ISO
  conclusaoId?: string; // liga o ganho à aprovação que o originou
}

export interface Recompensa {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  pontos: number;
}

export type EstadoRecompensa = "bloqueada" | "desbloqueada";

export interface Medalha {
  id: string;
  icone: string;
  nome: string;
  descricao: string;
  desbloqueadaEm?: string; // ISO
  progresso?: { atual: number; alvo: number };
}

export interface DadosDashboard {
  perfil: PerfilCrianca;
  saldo: number;
  pontosSemana: number;
  tarefasSemana: number;
  tarefasTotal: number;
  recompensas: Recompensa[];
  medalhas: Medalha[];
}

export type Frequencia = "diaria" | "semanal" | "pontual";

export interface Tarefa {
  id: string;
  nome: string;
  descricao: string;
  categoria: CategoriaId;
  pontos: number;
  frequencia: Frequencia;
  ativa: boolean;
}

/** concluida = a Inês enviou e os pais ainda não decidiram. */
export type EstadoConclusao = "concluida" | "aprovada" | "rejeitada";

/** Estado de uma tarefa no período atual (hoje, esta semana ou uma vez). */
export type EstadoTarefa = "pendente" | "concluida" | "aprovada";

export interface Conclusao {
  id: string;
  tarefaId: string;
  // Cópia no momento do envio: editar a tarefa depois não altera o histórico.
  tarefaNome: string;
  categoria: CategoriaId;
  pontos: number;
  periodo: string; // dia (YYYY-MM-DD), segunda-feira da semana ou "unica"
  estado: EstadoConclusao;
  submetidaEm: string;
  decididaEm?: string;
  motivoRejeicao?: string;
  celebracaoVista?: boolean;
}

export interface BaseDados {
  versao: 1;
  perfil: PerfilCrianca;
  tarefas: Tarefa[];
  conclusoes: Conclusao[];
  movimentos: MovimentoPontos[];
  recompensas: Recompensa[];
}

export type Resultado = { ok: true } | { ok: false; erro: string };

export interface EstadoFormTarefa {
  erros?: Record<string, string>;
  geral?: string;
}
