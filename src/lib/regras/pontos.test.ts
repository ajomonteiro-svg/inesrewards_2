import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calcularSaldo,
  pontosDaSemana,
  posicaoNoCaminho,
  proximaRecompensa,
  progressoParaProxima,
} from "./pontos";
import { segundaDaSemana } from "../utils/tempo";
import type { MovimentoPontos, Recompensa } from "../../types";

const r = (id: string, pontos: number): Recompensa => ({ id, nome: id, descricao: "", icone: "🎁", pontos });
const recompensas = [r("a", 30), r("b", 50), r("c", 100), r("d", 150), r("e", 250)];
const mov = (valor: number, data: string, tipo: MovimentoPontos["tipo"] = "ganho"): MovimentoPontos => ({
  id: data + valor,
  tipo,
  valor,
  descricao: "x",
  data,
});

test("saldo soma ganhos e descontos", () => {
  assert.equal(calcularSaldo([mov(10, "2026-11-10T10:00:00Z"), mov(-4, "2026-11-11T10:00:00Z", "resgate")]), 6);
});

test("a semana começa à segunda-feira (em Lisboa)", () => {
  assert.equal(segundaDaSemana("2026-11-19T15:00:00Z"), "2026-11-16"); // quinta
  assert.equal(segundaDaSemana("2026-11-22T23:30:00Z"), "2026-11-16"); // domingo
  assert.equal(segundaDaSemana("2026-11-16T00:10:00Z"), "2026-11-16"); // segunda
});

test("pontos da semana ignoram semanas anteriores e resgates", () => {
  const ref = new Date(2026, 10, 19, 15, 0);
  const movs = [
    mov(10, new Date(2026, 10, 15, 12).toISOString()), // domingo anterior
    mov(8, new Date(2026, 10, 16, 12).toISOString()),
    mov(6, new Date(2026, 10, 18, 12).toISOString()),
    mov(-30, new Date(2026, 10, 18, 13).toISOString(), "resgate"),
  ];
  assert.equal(pontosDaSemana(movs, ref), 14);
});

test("próxima recompensa e progresso", () => {
  assert.equal(proximaRecompensa(78, recompensas)?.pontos, 100);
  assert.equal(proximaRecompensa(250, recompensas), null);
  assert.equal(progressoParaProxima(75, recompensas), 0.5);
  assert.equal(progressoParaProxima(0, recompensas), 0);
});

test("posição no caminho é monótona e limitada a 0..1", () => {
  let anterior = -1;
  for (let s = 0; s <= 300; s += 5) {
    const p = posicaoNoCaminho(s, recompensas);
    assert.ok(p >= anterior && p >= 0 && p <= 1);
    anterior = p;
  }
  assert.equal(posicaoNoCaminho(30, recompensas), 0.2);
  assert.equal(posicaoNoCaminho(250, recompensas), 1);
});
