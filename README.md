# Inês Rewards

Aplicação web de recompensas por pontos para a Inês. Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion e Lucide.
Supabase entra na Fase 6.

## Estado

| Fase | Conteúdo | Estado |
|---|---|---|
| 1 | Estrutura visual, dashboard, navegação, acesso dos pais | **Feita** |
| 2 | Tarefas e aprovações | **Feita** |
| 3 | Pontos e recompensas | Por fazer |
| 4 | Medalhas, conquistas e histórico | Por fazer |
| 5 | Área dos pais e estatísticas | Por fazer |
| 6 | Supabase, RLS e publicação | Por fazer |

**Dados (Fases 2 a 5):** ficam num ficheiro JSON no servidor (`data/db.json`, criado na primeira execução com as
tarefas e recompensas iniciais). Funciona bem localmente. **No Vercel não há disco persistente**: lá o ficheiro vive em
`/tmp` e pode desaparecer, por isso serve para ver e testar, mas não para uso real. A persistência verdadeira chega com
o Supabase na Fase 6. Todas as páginas usam só `src/services/*`, por isso a troca não toca na interface.

## Correr localmente

```bash
npm install
cp .env.example .env.local   # opcional em desenvolvimento
npm run dev                  # http://localhost:3000
npm test                     # regras de pontos, tarefas e aprovações
npm run typecheck
```

Em desenvolvimento, a senha dos pais é `1234` se `PARENT_PASSWORD` não estiver definida.

## Área dos pais (senha simples)

A senha é validada **no servidor** (`src/app/pais/acoes.ts`). Se estiver certa, é criado um cookie `httpOnly`
assinado (HMAC-SHA256) com validade de 8 horas. O `middleware.ts` e o layout de `/pais` verificam-no.
A senha nunca vai para o browser.

Variáveis (Vercel → Settings → Environment Variables):

- `PARENT_PASSWORD`: a senha dos pais.
- `SESSION_SECRET`: texto aleatório com pelo menos 16 caracteres (`openssl rand -hex 32`).

Em produção, sem estas duas variáveis a área dos pais fica fechada.

## Publicar no Vercel

1. Envia o projeto para um repositório Git.
2. No Vercel: **Add New → Project** e escolhe o repositório (deteta Next.js sozinho).
3. Define `PARENT_PASSWORD` e `SESSION_SECRET`.
4. **Deploy**.

## Estrutura

```
src/app/(crianca)/   páginas da Inês (início, tarefas, recompensas, medalhas, histórico)
src/app/pais/        entrar + área protegida (aprovações, tarefas, recompensas, pontos, definições)
src/components/      ui, gamificacao, layout
src/lib/regras/      lógica pura: pontos, tarefas, aprovações, medalhas (testada)
src/actions/         ações do servidor (a Inês submete; os pais aprovam, sempre com sessão verificada)
src/lib/auth/        sessão dos pais
src/services/        acesso a dados (ficheiro JSON agora, Supabase na Fase 6)
src/types/           tipos partilhados
supabase/migrations/ SQL e RLS (Fase 6)
```

## Regras da Fase 2

- A Inês só envia ("Já fiz!"); os pontos só entram depois de um dos pais aprovar.
- Cada tarefa tem um período: o dia (diária), a semana de segunda a domingo (semanal) ou uma só vez (pontual),
  sempre em hora de Lisboa. No mesmo período só há um envio válido por tarefa.
- Aprovar duas vezes é impossível: o segundo pedido recebe "Esta tarefa já foi aprovada" e não cria pontos.
- Rejeitar não dá pontos; a Inês vê o motivo e pode tentar outra vez.
- Editar uma tarefa não altera o histórico: o nome e os pontos ficam guardados no momento do envio.

