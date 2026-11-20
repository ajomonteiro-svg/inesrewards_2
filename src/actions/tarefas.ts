"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE_PAIS, tokenValido } from "@/lib/auth/sessao";
import { ErroNegocio, validarTarefa } from "@/lib/regras/tarefas";
import * as svc from "@/services/tarefas";
import type { EstadoFormTarefa, Resultado } from "@/types";

async function exigirPais() {
  if (!(await tokenValido((await cookies()).get(COOKIE_PAIS)?.value))) {
    throw new ErroNegocio("A sessão dos pais terminou. Entra outra vez.");
  }
}

function falha(e: unknown): Resultado {
  if (e instanceof ErroNegocio) return { ok: false, erro: e.message };
  console.error(e);
  return { ok: false, erro: "Algo correu mal. Tenta outra vez." };
}

// ----- Inês -----
export async function submeterTarefaAcao(tarefaId: string): Promise<Resultado> {
  try {
    await svc.submeter(tarefaId);
    revalidatePath("/tarefas");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return falha(e);
  }
}

export async function marcarCelebracoesVistasAcao(ids: string[]): Promise<Resultado> {
  try {
    await svc.marcarCelebracoesVistas(ids);
    revalidatePath("/tarefas");
    return { ok: true };
  } catch (e) {
    return falha(e);
  }
}

// ----- Pais (cada ação confirma a sessão no servidor) -----
export async function aprovarAcao(id: string): Promise<Resultado> {
  try {
    await exigirPais();
    await svc.aprovar(id);
    // Sem revalidatePath: isso refrescaria a página já e o cartão perderia a celebração.
    // As páginas da Inês são dinâmicas e leem sempre dados novos.
    return { ok: true };
  } catch (e) {
    return falha(e);
  }
}

export async function rejeitarAcao(id: string, motivo: string): Promise<Resultado> {
  try {
    await exigirPais();
    await svc.rejeitar(id, motivo);
    return { ok: true };
  } catch (e) {
    return falha(e);
  }
}

export async function guardarTarefaAcao(_anterior: EstadoFormTarefa, fd: FormData): Promise<EstadoFormTarefa> {
  const texto = (k: string) => String(fd.get(k) ?? "");
  const { valor, erros } = validarTarefa({
    nome: texto("nome"),
    descricao: texto("descricao"),
    categoria: texto("categoria"),
    pontos: texto("pontos"),
    frequencia: texto("frequencia"),
  });
  if (!valor) return { erros };

  try {
    await exigirPais();
    const id = texto("id");
    if (id) await svc.editarTarefa(id, valor);
    else await svc.criarTarefa(valor);
  } catch (e) {
    const r = falha(e);
    return { geral: r.ok ? undefined : r.erro };
  }
  revalidatePath("/tarefas");
  redirect("/pais/tarefas");
}

export async function definirAtivaAcao(fd: FormData): Promise<void> {
  await exigirPais();
  await svc.definirAtiva(String(fd.get("id")), fd.get("ativa") === "1");
  revalidatePath("/pais/tarefas");
  revalidatePath("/tarefas");
}
