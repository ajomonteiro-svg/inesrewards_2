/**
 * Sessão da área dos pais (Fase 1): senha simples validada SEMPRE no servidor.
 * Só usa Web Crypto, por isso funciona no middleware (Edge) e no servidor Node.
 * A sessão é um cookie httpOnly assinado com HMAC-SHA256 e com validade.
 */
export const COOKIE_PAIS = "ines_pais";
export const DURACAO_SESSAO_SEG = 60 * 60 * 8;

const enc = new TextEncoder();

function segredo(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV !== "production") return "segredo-local-so-para-desenvolvimento";
  throw new Error("SESSION_SECRET em falta (mínimo 16 caracteres). Ver README.");
}

async function assinar(dados: string): Promise<string> {
  const chave = await crypto.subtle.importKey("raw", enc.encode(segredo()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", chave, enc.encode(dados)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

function iguais(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Em produção a área dos pais só abre se a senha e o segredo estiverem configurados. */
export function areaDosPaisConfigurada(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return Boolean(process.env.PARENT_PASSWORD) && (process.env.SESSION_SECRET ?? "").length >= 16;
}

export async function senhaCorreta(tentativa: string): Promise<boolean> {
  const esperada = process.env.PARENT_PASSWORD ?? (process.env.NODE_ENV !== "production" ? "1234" : "");
  if (!esperada) return false; // em produção, sem senha configurada ninguém entra
  // Compara as assinaturas das duas senhas: tempo constante e tamanhos iguais.
  return iguais(await assinar(`senha:${tentativa}`), await assinar(`senha:${esperada}`));
}

export async function criarToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + DURACAO_SESSAO_SEG;
  return `${exp}.${await assinar(`sessao:${exp}`)}`;
}

export async function tokenValido(token: string | undefined): Promise<boolean> {
  if (!token || !areaDosPaisConfigurada()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  return iguais(sig, await assinar(`sessao:${exp}`));
}
