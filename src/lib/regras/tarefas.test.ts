import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ErroNegocio,
  aprovarConclusao,
  chavePeriodo,
  estadoTarefa,
  rejeitarConclusao,
  submeterConclusao,
  ultimaRejeicao,
  validarTarefa,
  type DadosTarefas,
} from "./tarefas";
import { calcularSaldo } from "./pontos";
import { avaliarMedalhas } from "./medalhas";
import { MEDALHAS } from "../constantes/medalhas";
import type { Tarefa } from "../../types";

const t = (id: string, frequencia: Tarefa["frequencia"], pontos = 10): Tarefa => ({
  id, nome: id, descricao: "", categoria: "escola", pontos, frequencia, ativa: true,
});
const novo = (): DadosTarefas => ({ tarefas: [t("d", "diaria"), t("s", "semanal"), t("p", "pontual", 25)], conclusoes: [], movimentos: [] });
const seg = new Date("2026-11-16T10:00:00Z");
const qui = new Date("2026-11-19T10:00:00Z");
const seguinte = new Date("2026-11-20T10:00:00Z");

test("chaves de período", () => {
  assert.equal(chavePeriodo("diaria", qui), "2026-11-19");
  assert.equal(chavePeriodo("semanal", qui), "2026-11-16");
  assert.equal(chavePeriodo("pontual", qui), "unica");
});

test("a chave do dia usa o fuso de Lisboa", () => {
  // 23:30 UTC no verão já é dia seguinte em Lisboa
  assert.equal(chavePeriodo("diaria", new Date("2026-07-10T23:30:00Z")), "2026-07-11");
});

test("submeter fica à espera e não pode ser enviada duas vezes", () => {
  const db = novo();
  submeterConclusao(db, "d", qui);
  assert.equal(estadoTarefa(db, db.tarefas[0], qui), "concluida");
  assert.throws(() => submeterConclusao(db, "d", qui), ErroNegocio);
  assert.equal(db.conclusoes.length, 1);
});

test("só dá pontos depois de aprovada", () => {
  const db = novo();
  const c = submeterConclusao(db, "d", qui);
  assert.equal(calcularSaldo(db.movimentos), 0);
  aprovarConclusao(db, c.id, qui);
  assert.equal(calcularSaldo(db.movimentos), 10);
  assert.equal(estadoTarefa(db, db.tarefas[0], qui), "aprovada");
});

test("não permite aprovação duplicada", () => {
  const db = novo();
  const c = submeterConclusao(db, "d", qui);
  aprovarConclusao(db, c.id, qui);
  assert.throws(() => aprovarConclusao(db, c.id, qui), ErroNegocio);
  assert.equal(db.movimentos.length, 1);
  assert.equal(calcularSaldo(db.movimentos), 10);
});

test("rejeitar não dá pontos, permite tentar outra vez e guarda o motivo", () => {
  const db = novo();
  const c = submeterConclusao(db, "d", qui);
  rejeitarConclusao(db, c.id, "  Falta arrumar a mochila ", qui);
  assert.equal(calcularSaldo(db.movimentos), 0);
  assert.equal(estadoTarefa(db, db.tarefas[0], qui), "pendente");
  assert.equal(ultimaRejeicao(db, db.tarefas[0], qui)?.motivoRejeicao, "Falta arrumar a mochila");
  assert.throws(() => aprovarConclusao(db, c.id, qui), ErroNegocio); // já rejeitada
  const c2 = submeterConclusao(db, "d", qui);
  aprovarConclusao(db, c2.id, qui);
  assert.equal(calcularSaldo(db.movimentos), 10);
});

test("tarefa diária volta a ficar pendente no dia seguinte; semanal só na semana seguinte", () => {
  const db = novo();
  aprovarConclusao(db, submeterConclusao(db, "d", qui).id, qui);
  aprovarConclusao(db, submeterConclusao(db, "s", seg).id, seg);
  assert.equal(estadoTarefa(db, db.tarefas[0], seguinte), "pendente");
  assert.equal(estadoTarefa(db, db.tarefas[1], seguinte), "aprovada");
  assert.equal(estadoTarefa(db, db.tarefas[1], new Date("2026-11-23T10:00:00Z")), "pendente");
});

test("tarefa pontual só se faz uma vez", () => {
  const db = novo();
  aprovarConclusao(db, submeterConclusao(db, "p", qui).id, qui);
  assert.throws(() => submeterConclusao(db, "p", new Date("2027-01-01T10:00:00Z")), ErroNegocio);
});

test("tarefa desativada não pode ser enviada", () => {
  const db = novo();
  db.tarefas[0].ativa = false;
  assert.throws(() => submeterConclusao(db, "d", qui), ErroNegocio);
});

test("editar a tarefa não altera o histórico", () => {
  const db = novo();
  const c = submeterConclusao(db, "d", qui);
  db.tarefas[0].nome = "Outro nome";
  db.tarefas[0].pontos = 99;
  aprovarConclusao(db, c.id, qui);
  assert.equal(db.movimentos[0].valor, 10);
  assert.equal(db.movimentos[0].descricao, "d");
});

test("validação de tarefas", () => {
  const ok = validarTarefa({ nome: " Fazer a cama ", descricao: "", categoria: "responsabilidades", pontos: "5", frequencia: "diaria" });
  assert.deepEqual(ok.erros, {});
  assert.equal(ok.valor?.nome, "Fazer a cama");
  assert.equal(ok.valor?.pontos, 5);
  const mau = validarTarefa({ nome: "x", descricao: "", categoria: "nada", pontos: "0", frequencia: "sempre" });
  assert.deepEqual(Object.keys(mau.erros).sort(), ["categoria", "frequencia", "nome", "pontos"]);
  assert.ok(validarTarefa({ nome: "ok", descricao: "", categoria: "escola", pontos: "2.5", frequencia: "diaria" }).erros.pontos);
});

test("medalhas básicas: desbloqueio e progresso", () => {
  const ganho = (n: number, dia: string) => ({ id: `g${n}`, tipo: "ganho" as const, valor: 10, descricao: "x", data: `${dia}T12:00:00Z` });
  const movs = [ganho(1, "2026-11-10"), ganho(2, "2026-11-11"), ganho(3, "2026-11-12")];
  const r = avaliarMedalhas(MEDALHAS, movs, qui);
  assert.equal(r.find((m) => m.id === "b1")?.desbloqueadaEm, "2026-11-10T12:00:00Z");
  assert.equal(r.find((m) => m.id === "b2")?.progresso?.atual, 30);
  assert.equal(r.find((m) => m.id === "b3")?.progresso?.atual, 3);
  assert.equal(r.find((m) => m.id === "b4")?.progresso?.atual, 0); // última atividade há mais de 1 dia
});
