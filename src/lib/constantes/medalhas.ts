export interface DefMedalha {
  id: string;
  icone: string;
  nome: string;
  descricao: string;
  tipo: "primeira" | "pontos" | "tarefas" | "dias";
  alvo: number;
}

// Avaliação básica; o conjunto completo (leitura, arrumação…) chega na Fase 4.
export const MEDALHAS: DefMedalha[] = [
  { id: "b1", icone: "🥇", nome: "Primeira tarefa concluída", descricao: "Concluíste a tua primeira tarefa.", tipo: "primeira", alvo: 1 },
  { id: "b2", icone: "⭐", nome: "100 pontos conquistados", descricao: "Já ganhaste 100 pontos no total.", tipo: "pontos", alvo: 100 },
  { id: "b3", icone: "💪", nome: "20 tarefas concluídas", descricao: "Conclui 20 tarefas.", tipo: "tarefas", alvo: 20 },
  { id: "b4", icone: "🌈", nome: "7 dias de dedicação", descricao: "Conclui tarefas 7 dias seguidos.", tipo: "dias", alvo: 7 },
];
