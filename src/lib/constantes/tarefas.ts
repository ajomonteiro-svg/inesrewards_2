import type { CategoriaId, Frequencia } from "../../types";

export const CATEGORIAS: { id: CategoriaId; nome: string; icone: string }[] = [
  { id: "escola", nome: "Escola", icone: "📚" },
  { id: "responsabilidades", nome: "Responsabilidades", icone: "🏠" },
  { id: "familia", nome: "Família", icone: "❤️" },
  { id: "habitos", nome: "Hábitos pessoais", icone: "🌟" },
];

export const FREQUENCIAS: { id: Frequencia; nome: string; curto: string }[] = [
  { id: "diaria", nome: "Todos os dias", curto: "Diária" },
  { id: "semanal", nome: "Uma vez por semana", curto: "Semanal" },
  { id: "pontual", nome: "Só uma vez", curto: "Pontual" },
];

export const categoriaPorId = (id: CategoriaId) => CATEGORIAS.find((c) => c.id === id)!;
export const frequenciaPorId = (id: Frequencia) => FREQUENCIAS.find((f) => f.id === id)!;
