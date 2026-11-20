import { diaLisboa, diasEntre } from "./tempo";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "hoje", "ontem", "há 3 dias" ou "12 nov" */
export function dataRelativa(iso: string, ref: Date = new Date()): string {
  const dias = diasEntre(diaLisboa(iso), diaLisboa(ref));
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 7) return `há ${dias} dias`;
  const [, m, d] = diaLisboa(iso).split("-").map(Number);
  return `${d} ${MESES[m - 1]}`;
}
