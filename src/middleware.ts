import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_PAIS, tokenValido } from "@/lib/auth/sessao";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/pais/entrar") return NextResponse.next();

  if (await tokenValido(req.cookies.get(COOKIE_PAIS)?.value)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/pais/entrar";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/pais/:path*"] };
