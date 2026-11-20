/**
 * Dados iniciais (primeira execução). Servem para a app arrancar com o
 * catálogo de tarefas e recompensas pedido e algum histórico de exemplo.
 * Podem ser apagados em /pais assim que a gestão completa existir (Fases 3 e 5).
 */
import { chavePeriodo } from "../lib/regras/tarefas";
import type { BaseDados, Conclusao, MovimentoPontos, Tarefa } from "../types";

function diasAtras(n: number, hora = 18): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hora, 0, 0, 0);
  return d.toISOString();
}

type T = Omit<Tarefa, "ativa">;
const tarefasBase: T[] = [
  { id: "t-tpc", nome: "Fazer os trabalhos de casa", descricao: "Todos os trabalhos de casa do dia.", categoria: "escola", pontos: 10, frequencia: "diaria" },
  { id: "t-teste", nome: "Estudar para um teste", descricao: "Estudar com calma antes de um teste.", categoria: "escola", pontos: 12, frequencia: "semanal" },
  { id: "t-ler", nome: "Ler durante 20 minutos", descricao: "Um livro à tua escolha.", categoria: "escola", pontos: 8, frequencia: "diaria" },
  { id: "t-mochila", nome: "Preparar a mochila", descricao: "Tudo pronto para o dia seguinte.", categoria: "escola", pontos: 8, frequencia: "diaria" },
  { id: "t-cama", nome: "Fazer a cama", descricao: "Cama feita de manhã.", categoria: "responsabilidades", pontos: 5, frequencia: "diaria" },
  { id: "t-quarto", nome: "Arrumar o quarto", descricao: "Quarto arrumado e chão livre.", categoria: "responsabilidades", pontos: 10, frequencia: "semanal" },
  { id: "t-roupa", nome: "Preparar a roupa para o dia seguinte", descricao: "Roupa escolhida e pronta.", categoria: "responsabilidades", pontos: 5, frequencia: "diaria" },
  { id: "t-brinquedos", nome: "Arrumar os brinquedos e materiais", descricao: "Cada coisa no seu lugar.", categoria: "responsabilidades", pontos: 5, frequencia: "diaria" },
  { id: "t-mesa", nome: "Ajudar a pôr a mesa", descricao: "Antes das refeições.", categoria: "familia", pontos: 6, frequencia: "diaria" },
  { id: "t-cozinha", nome: "Ajudar a arrumar a cozinha", descricao: "Depois das refeições.", categoria: "familia", pontos: 6, frequencia: "diaria" },
  { id: "t-familiar", nome: "Colaborar numa tarefa familiar", descricao: "Ajudar numa tarefa de toda a família.", categoria: "familia", pontos: 10, frequencia: "semanal" },
  { id: "t-simpatica", nome: "Ter uma atitude especialmente simpática", descricao: "Um gesto simpático que se notou.", categoria: "familia", pontos: 10, frequencia: "semanal" },
  { id: "t-dentes", nome: "Lavar os dentes sem ser necessário lembrar", descricao: "Sem ninguém lembrar.", categoria: "habitos", pontos: 5, frequencia: "diaria" },
  { id: "t-horas", nome: "Preparar-se a horas", descricao: "Pronta à hora combinada.", categoria: "habitos", pontos: 5, frequencia: "diaria" },
  { id: "t-noite", nome: "Cumprir a rotina da noite", descricao: "Rotina da noite feita até ao fim.", categoria: "habitos", pontos: 5, frequencia: "diaria" },
];

// [dias atrás, tarefa]: histórico de exemplo, todo aprovado
const historico: [number, string][] = [
  [12, "t-tpc"], [11, "t-cama"], [10, "t-ler"], [9, "t-quarto"], [8, "t-teste"], [7, "t-cama"],
  [6, "t-mesa"], [5, "t-mochila"], [4, "t-simpatica"], [3, "t-tpc"], [2, "t-ler"], [1, "t-mesa"], [0, "t-quarto"],
];

export function criarSeed(): BaseDados {
  const tarefas: Tarefa[] = tarefasBase.map((t) => ({ ...t, ativa: true }));
  const conclusoes: Conclusao[] = [];
  const movimentos: MovimentoPontos[] = [];

  for (const [dias, id] of historico) {
    const t = tarefas.find((x) => x.id === id)!;
    const data = diasAtras(dias, dias === 0 ? 8 : 18);
    const c: Conclusao = {
      id: `c-seed-${conclusoes.length + 1}`, tarefaId: t.id, tarefaNome: t.nome, categoria: t.categoria, pontos: t.pontos,
      periodo: chavePeriodo(t.frequencia, data), estado: "aprovada", submetidaEm: data, decididaEm: data, celebracaoVista: true,
    };
    conclusoes.push(c);
    movimentos.push({ id: `m-seed-${movimentos.length + 1}`, tipo: "ganho", valor: t.pontos, descricao: t.nome, categoria: t.categoria, data, conclusaoId: c.id });
    if (dias === 6) {
      movimentos.push({ id: "m-seed-resgate", tipo: "resgate", valor: -30, descricao: "Escolher o jantar", data: diasAtras(6, 20) });
    }
  }

  return {
    versao: 1,
    perfil: { nome: "Inês", avatar: "🦄", objetivoSemanal: 60 },
    tarefas,
    conclusoes,
    movimentos: movimentos.sort((a, b) => a.data.localeCompare(b.data)),
    recompensas: [
      { id: "r1", nome: "Escolher o jantar", descricao: "Tu decides o que há para jantar.", icone: "🍝", pontos: 30 },
      { id: "r2", nome: "Escolher um filme em família", descricao: "Noite de cinema com pipocas.", icone: "🎬", pontos: 50 },
      { id: "r3", nome: "Uma atividade especial", descricao: "Uma atividade só para ti.", icone: "🎨", pontos: 100 },
      { id: "r4", nome: "Um passeio à escolha", descricao: "Escolhes para onde vamos passear.", icone: "🌳", pontos: 150 },
      { id: "r5", nome: "Uma surpresa especial", descricao: "Uma surpresa muito especial.", icone: "🎁", pontos: 250 },
    ],
  };
}
