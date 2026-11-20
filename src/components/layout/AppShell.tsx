"use client";

import { Gift, History, Home, ListChecks, Lock, Medal, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const itens = [
  { href: "/", rotulo: "Início", icone: Home },
  { href: "/tarefas", rotulo: "Tarefas", icone: ListChecks },
  { href: "/recompensas", rotulo: "Recompensas", icone: Gift },
  { href: "/medalhas", rotulo: "Medalhas", icone: Medal },
  { href: "/historico", rotulo: "Histórico", icone: History },
];

function Marca() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sun-400 text-ink-900 shadow-pop">
        <Star className="h-5 w-5 fill-current" aria-hidden />
      </span>
      <span className="font-display text-xl font-semibold text-grape-700">Inês Rewards</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ativo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="min-h-screen md:pl-64">
      {/* Barra lateral (computador e tablet) */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-grape-100 bg-white/80 p-5 backdrop-blur md:flex">
        <Marca />
        <nav aria-label="Principal" className="mt-8 flex flex-1 flex-col gap-1.5">
          {itens.map(({ href, rotulo, icone: Icone }) => (
            <Link
              key={href}
              href={href}
              aria-current={ativo(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-colors",
                ativo(href) ? "bg-grape-600 text-white shadow-pop" : "text-ink-700 hover:bg-grape-50",
              )}
            >
              <Icone className="h-5 w-5" aria-hidden />
              {rotulo}
            </Link>
          ))}
        </nav>
        <Link
          href="/pais"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-ink-500 hover:bg-grape-50"
        >
          <Lock className="h-5 w-5" aria-hidden />
          Área dos pais
        </Link>
      </aside>

      {/* Cabeçalho (telemóvel) */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-grape-100 bg-white/85 px-4 py-3 backdrop-blur md:hidden">
        <Marca />
        <Link
          href="/pais"
          aria-label="Área dos pais"
          className="grid h-10 w-10 place-items-center rounded-full bg-grape-50 text-grape-600"
        >
          <Lock className="h-5 w-5" aria-hidden />
        </Link>
      </header>

      <main className="px-4 pb-28 pt-5 sm:px-6 md:px-10 md:pb-10 md:pt-8">{children}</main>

      {/* Navegação inferior (telemóvel) */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-grape-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="grid grid-cols-5">
          {itens.map(({ href, rotulo, icone: Icone }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={ativo(href) ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold",
                  ativo(href) ? "text-grape-600" : "text-ink-500",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-12 place-items-center rounded-full transition-colors",
                    ativo(href) && "bg-grape-100",
                  )}
                >
                  <Icone className="h-5 w-5" aria-hidden />
                </span>
                {rotulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
