import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_TURMA = "oia_turma";
const COOKIE_ADMIN = "oia_admin";

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("Defina SESSION_SECRET no ambiente");
  return s;
}

function assinar(valor: string): string {
  const mac = createHmac("sha256", secret()).update(valor).digest("base64url");
  return `${valor}.${mac}`;
}

function verificar(token: string | undefined): string | null {
  if (!token) return null;
  const corte = token.lastIndexOf(".");
  if (corte < 1) return null;
  const valor = token.slice(0, corte);
  const mac = Buffer.from(token.slice(corte + 1));
  const esperado = Buffer.from(createHmac("sha256", secret()).update(valor).digest("base64url"));
  if (mac.length !== esperado.length || !timingSafeEqual(mac, esperado)) return null;
  return valor;
}

const opcoesCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function abrirSessaoTurma(turmaId: string) {
  (await cookies()).set(COOKIE_TURMA, assinar(turmaId), {
    ...opcoesCookie,
    maxAge: 60 * 60 * 12,
  });
}

export async function sessaoTurma(): Promise<string | null> {
  return verificar((await cookies()).get(COOKIE_TURMA)?.value);
}

export async function encerrarSessaoTurma() {
  (await cookies()).delete(COOKIE_TURMA);
}

export async function abrirSessaoAdmin() {
  (await cookies()).set(COOKIE_ADMIN, assinar("admin"), {
    ...opcoesCookie,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function sessaoAdmin(): Promise<boolean> {
  return verificar((await cookies()).get(COOKIE_ADMIN)?.value) === "admin";
}

export async function encerrarSessaoAdmin() {
  (await cookies()).delete(COOKIE_ADMIN);
}

// Comparação de senha em tempo constante, independente dos tamanhos.
export function senhaConfere(tentativa: string, senha: string): boolean {
  const a = createHmac("sha256", secret()).update(tentativa).digest();
  const b = createHmac("sha256", secret()).update(senha).digest();
  return timingSafeEqual(a, b);
}
