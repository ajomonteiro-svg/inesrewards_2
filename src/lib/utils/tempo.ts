/** "Hoje" e "esta semana" medem-se sempre em Lisboa, não no fuso do servidor. */
export const FUSO = "Europe/Lisbon";

const formato = new Intl.DateTimeFormat("en-CA", { timeZone: FUSO, year: "numeric", month: "2-digit", day: "2-digit" });

/** YYYY-MM-DD em Lisboa */
export function diaLisboa(d: Date | string): string {
  return formato.format(new Date(d));
}

/** YYYY-MM-DD da segunda-feira da semana (em Lisboa) */
export function segundaDaSemana(d: Date | string): string {
  const [a, m, dia] = diaLisboa(d).split("-").map(Number);
  const u = new Date(Date.UTC(a, m - 1, dia));
  u.setUTCDate(u.getUTCDate() - ((u.getUTCDay() + 6) % 7));
  return u.toISOString().slice(0, 10);
}

/** Dias entre duas chaves YYYY-MM-DD (b - a) */
export function diasEntre(a: string, b: string): number {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86_400_000);
}
