import { ClipboardCheck, Gift, LayoutDashboard, ListChecks, LogOut, Settings, Wallet } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { COOKIE_PAIS, tokenValido } from "@/lib/auth/sessao";
import { contarPendentes } from "@/services/tarefas";
import { sair } from "../acoes";

const itens = [
  { href: "/pais", rotulo: "Resumo", icone: LayoutDashboard },
  { href: "/pais/aprovacoes", rotulo: "Aprovações", icone: ClipboardCheck },
  { href: "/pais/tarefas", rotulo: "Tarefas", icone: ListChecks },
  { href: "/pais/recompensas", rotulo: "Recompensas", icone: Gift },
  { href: "/pais/pontos", rotulo: "Pontos", icone: Wallet },
  { href: "/pais/configuracoes", rotulo: "Definições", icone: Settings },
];

export default async function PaisLayout({ children }: { children: React.ReactNode }) {
  // Segunda verificação (a primeira é no middleware): defesa em profundidade.
  if (!(await tokenValido((await cookies()).get(COOKIE_PAIS)?.value))) redirect("/pais/entrar");

  const pendentes = await contarPendentes();

  return (
    <div className="min-h-screen">
      <header className="border-b border-grape-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <p className="font-display text-lg font-semibold text-grape-700">Área dos pais</p>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full bg-grape-50 px-4 py-2 text-sm font-bold text-grape-600">
              Ver como a Inês
            </Link>
            <form action={sair}>
              <button
                type="submit"
                aria-label="Sair da área dos pais"
                className="grid h-10 w-10 place-items-center rounded-full bg-grape-50 text-ink-500"
              >
                <LogOut className="h-5 w-5" aria-hidden />
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Área dos pais" className="mx-auto max-w-5xl overflow-x-auto px-4 pb-3">
          <ul className="flex gap-2">
            {itens.map(({ href, rotulo, icone: Icone }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-700 shadow-card hover:bg-grape-50"
                >
                  <Icone className="h-4 w-4" aria-hidden />
                  {rotulo}
                  {href === "/pais/aprovacoes" && pendentes > 0 && (
                    <span className="grid min-w-5 place-items-center rounded-full bg-rosa-500 px-1.5 text-xs text-white">
                      <span className="sr-only">{pendentes} à espera: </span>
                      <span aria-hidden>{pendentes}</span>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
