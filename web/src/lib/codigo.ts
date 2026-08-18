import { randomInt } from "crypto";

// Sem 0/O, 1/I/L — o código é ditado em voz alta na sala.
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function normalizarCodigo(entrada: unknown): string | null {
  const texto = String(entrada ?? "").trim().toUpperCase();
  const partes = texto.match(/^(?:OIA[\s-]*)?([A-Z0-9]{4})$/);
  if (!partes) return null;

  const sufixo = partes[1];
  if ([...sufixo].some((caractere) => !ALFABETO.includes(caractere))) return null;
  return `OIA-${sufixo}`;
}

export function gerarCodigo(): string {
  let sufixo = "";
  for (let i = 0; i < 4; i++) sufixo += ALFABETO[randomInt(ALFABETO.length)];
  return `OIA-${sufixo}`;
}
