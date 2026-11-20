"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_PAIS, DURACAO_SESSAO_SEG, areaDosPaisConfigurada, criarToken, senhaCorreta } from "@/lib/auth/sessao";

export async function entrar(_anterior: { erro?: string }, formData: FormData): Promise<{ erro?: string }> {
  if (!areaDosPaisConfigurada()) {
    return { erro: "A área dos pais ainda não está configurada. Faltam PARENT_PASSWORD e SESSION_SECRET (ver README)." };
  }
  const senha = String(formData.get("senha") ?? "");
  if (!(await senhaCorreta(senha))) {
    await new Promise((r) => setTimeout(r, 700)); // trava tentativas em série
    return { erro: "Senha errada. Tenta outra vez." };
  }
  (await cookies()).set(COOKIE_PAIS, await criarToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_SESSAO_SEG,
  });
  redirect("/pais");
}

export async function sair() {
  (await cookies()).delete(COOKIE_PAIS);
  redirect("/");
}
