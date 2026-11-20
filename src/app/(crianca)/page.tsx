import { CheckCircle2, Lock, Sparkles, Star, Target } from "lucide-react";
import { AnimatedNumber } from "@/components/gamificacao/AnimatedNumber";
import { CaminhoDeEstrelas } from "@/components/gamificacao/CaminhoDeEstrelas";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  estadoRecompensa,
  ordenarPorPontos,
  posicaoNoCaminho,
  progressoParaProxima,
  proximaRecompensa,
} from "@/lib/regras/pontos";
import { dataRelativa } from "@/lib/utils/datas";
import { obterDadosDashboard } from "@/services/dashboard";

export const dynamic = "force-dynamic"; // "esta semana" depende do dia de hoje

export default async function DashboardPage() {
  const d = await obterDadosDashboard();
  const recompensas = ordenarPorPontos(d.recompensas);
  const proxima = proximaRecompensa(d.saldo, recompensas);
  const posicao = posicaoNoCaminho(d.saldo, recompensas);
  const desbloqueadas = d.medalhas.filter((m) => m.desbloqueadaEm).sort((a, b) => b.desbloqueadaEm!.localeCompare(a.desbloqueadaEm!));
  const aCaminho = d.medalhas.filter((m) => !m.desbloqueadaEm);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Cabeçalho com o caminho de estrelas */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-grape-600 via-grape-500 to-sky-500 pb-5 text-white shadow-card">
        <Star aria-hidden className="absolute -right-4 -top-4 h-24 w-24 rotate-12 fill-sun-300/30 text-sun-300/30" />
        <Star aria-hidden className="absolute right-24 top-16 hidden h-6 w-6 fill-sun-300/60 text-sun-300/60 sm:block" />
        <div className="relative p-5 pb-2 sm:p-7 sm:pb-3">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">
            Olá, {d.perfil.nome}! Vamos conquistar mais estrelas?
          </h1>
          <p className="mt-4 flex items-end gap-2">
            <Star aria-hidden className="mb-1.5 h-9 w-9 fill-sun-300 text-sun-300" />
            <AnimatedNumber valor={d.saldo} className="font-display text-6xl font-bold leading-none" />
            <span className="mb-1.5 text-lg font-bold text-white/90">pontos disponíveis</span>
          </p>
        </div>
        <CaminhoDeEstrelas recompensas={recompensas} saldo={d.saldo} posicao={posicao} avatar={d.perfil.avatar} />
        <p className="px-5 text-center font-bold sm:px-7">
          {proxima ? (
            <>
              Faltam {proxima.pontos - d.saldo} pontos para {proxima.nome} <span aria-hidden>{proxima.icone}</span>
            </>
          ) : (
            "Já tens pontos para todas as recompensas!"
          )}
        </p>
      </section>

      {/* Números da semana */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rosa-100 text-rosa-500">
              <Target className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-500">Pontos desta semana</p>
              <p className="font-display text-3xl font-semibold leading-none">
                {d.pontosSemana}
                <span className="text-lg text-ink-300"> / {d.perfil.objetivoSemanal}</span>
              </p>
            </div>
          </div>
          <ProgressBar
            cor="rosa"
            valor={d.pontosSemana / d.perfil.objetivoSemanal}
            etiqueta="Objetivo semanal de pontos"
            className="mt-4 bg-rosa-100"
          />
          <p className="mt-2 text-sm text-ink-500">
            {d.pontosSemana >= d.perfil.objetivoSemanal
              ? "Objetivo da semana conquistado! 🎉"
              : `Faltam ${d.perfil.objetivoSemanal - d.pontosSemana} pontos para o objetivo da semana.`}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-100 text-sky-500">
              <CheckCircle2 className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-500">Tarefas concluídas</p>
              <p className="font-display text-3xl font-semibold leading-none">
                {d.tarefasSemana}
                <span className="text-lg text-ink-300"> esta semana</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-500">{d.tarefasTotal} tarefas concluídas desde o início.</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Próximas recompensas */}
        <Card className="lg:col-span-3">
          <CardTitle>Próximas recompensas</CardTitle>
          {proxima && (
            <div className="mt-3">
              <ProgressBar
                valor={progressoParaProxima(d.saldo, recompensas)}
                etiqueta={`Progresso para ${proxima.nome}`}
                cor="grape"
              />
            </div>
          )}
          <ul className="mt-4 divide-y divide-grape-100">
            {recompensas.map((r) => {
              const pronta = estadoRecompensa(d.saldo, r) === "desbloqueada";
              return (
                <li key={r.id} className="flex items-center gap-3 py-3">
                  <span
                    aria-hidden
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl ${pronta ? "bg-sun-100" : "bg-grape-50"}`}
                  >
                    <span className={pronta ? "" : "opacity-60"}>{r.icone}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-tight">{r.nome}</p>
                    <p className="text-sm text-ink-500">{r.pontos} pontos</p>
                  </div>
                  {pronta ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-sun-100 px-3 py-1 text-sm font-bold text-ink-900">
                      <Sparkles className="h-4 w-4 text-sun-500" aria-hidden /> Já podes pedir
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-grape-50 px-3 py-1 text-sm font-bold text-ink-500">
                      <Lock className="h-3.5 w-3.5" aria-hidden /> Faltam {r.pontos - d.saldo}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Últimas conquistas */}
        <Card className="lg:col-span-2">
          <CardTitle>Últimas conquistas</CardTitle>
          <ul className="mt-3 space-y-3">
            {desbloqueadas.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-sun-100/60 p-3">
                <span aria-hidden className="text-3xl">{m.icone}</span>
                <div>
                  <p className="font-bold leading-tight">{m.nome}</p>
                  <p className="text-sm text-ink-500">{dataRelativa(m.desbloqueadaEm!)}</p>
                </div>
              </li>
            ))}
            {aCaminho.map((m) => (
              <li key={m.id} className="rounded-2xl bg-grape-50 p-3">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="text-3xl opacity-50 grayscale">{m.icone}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-tight">{m.nome}</p>
                    {m.progresso && (
                      <p className="text-sm text-ink-500">
                        {m.progresso.atual} de {m.progresso.alvo}
                      </p>
                    )}
                  </div>
                </div>
                {m.progresso && (
                  <ProgressBar
                    cor="sun"
                    valor={m.progresso.atual / m.progresso.alvo}
                    etiqueta={`Progresso: ${m.nome}`}
                    className="mt-2 h-2.5 bg-white"
                  />
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
