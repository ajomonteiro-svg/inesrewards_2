"use client";

import { useActionState } from "react";
import { entrar } from "../acoes";

export function FormularioEntrar() {
  const [estado, acao, aEnviar] = useActionState(entrar, {} as { erro?: string });

  return (
    <form action={acao} className="mt-5 space-y-4">
      <div>
        <label htmlFor="senha" className="block text-sm font-bold text-ink-700">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-describedby={estado.erro ? "erro-senha" : undefined}
          className="mt-1 w-full rounded-2xl border-2 border-grape-100 bg-grape-50 px-4 py-3 text-lg outline-none focus:border-grape-500"
        />
      </div>
      {estado.erro && (
        <p id="erro-senha" role="alert" className="rounded-xl bg-rosa-50 px-3 py-2 text-sm font-bold text-rosa-500">
          {estado.erro}
        </p>
      )}
      <button
        type="submit"
        disabled={aEnviar}
        className="w-full rounded-2xl bg-grape-600 px-4 py-3 text-lg font-bold text-white shadow-pop transition active:translate-y-0.5 disabled:opacity-60"
      >
        {aEnviar ? "A entrar…" : "Entrar"}
      </button>
    </form>
  );
}
