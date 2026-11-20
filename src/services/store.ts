/**
 * Armazenamento da Fase 2: um ficheiro JSON no servidor (data/db.json),
 * com leituras/gravações em fila (uma de cada vez) e gravação atómica.
 *
 * ATENÇÃO: o Vercel não tem disco persistente. Lá o ficheiro vive em /tmp e
 * pode desaparecer a qualquer momento. Em produção a persistência real chega
 * com o Supabase (Fase 6). Todas as páginas usam só este módulo e
 * src/services/*, por isso a troca não toca na interface.
 */
import { promises as fs } from "fs";
import path from "path";
import type { BaseDados } from "../types";
import { criarSeed } from "./seed";

const FICHEIRO =
  process.env.DATA_FILE ?? (process.env.VERCEL ? "/tmp/ines-rewards-db.json" : path.join(process.cwd(), "data", "db.json"));

const g = globalThis as unknown as { __inesFila?: Promise<unknown> };

async function escrever(db: BaseDados) {
  await fs.mkdir(path.dirname(FICHEIRO), { recursive: true });
  const tmp = `${FICHEIRO}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, FICHEIRO);
}

async function lerFicheiro(): Promise<BaseDados> {
  try {
    return JSON.parse(await fs.readFile(FICHEIRO, "utf8")) as BaseDados;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    const seed = criarSeed();
    await escrever(seed);
    return seed;
  }
}

function emFila<T>(tarefa: () => Promise<T>): Promise<T> {
  const anterior = g.__inesFila ?? Promise.resolve();
  const atual = anterior.catch(() => undefined).then(tarefa);
  g.__inesFila = atual;
  return atual;
}

export function ler(): Promise<BaseDados> {
  return emFila(lerFicheiro);
}

/** Lê, aplica `fn` e grava. Se `fn` lançar, nada é gravado. */
export function mutar<T>(fn: (db: BaseDados) => T): Promise<T> {
  return emFila(async () => {
    const db = await lerFicheiro();
    const resultado = fn(db);
    await escrever(db);
    return resultado;
  });
}
