import { randomInt } from "crypto";

// Sem 0/O, 1/I/L — o código é ditado em voz alta na sala.
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function gerarCodigo(): string {
  let sufixo = "";
  for (let i = 0; i < 4; i++) sufixo += ALFABETO[randomInt(ALFABETO.length)];
  return `OIA-${sufixo}`;
}
