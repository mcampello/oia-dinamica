import { describe, expect, it } from "vitest";
import { limitarPasso, registrarVisita } from "./passoAssistente";

describe("limitarPasso", () => {
  it.each([
    [0, 4, 1],
    [1, 4, 1],
    [3, 4, 3],
    [5, 4, 4],
  ])("limita o passo %i ao intervalo de %i etapas", (passo, total, esperado) => {
    expect(limitarPasso(passo, total)).toBe(esperado);
  });
});

describe("registrarVisita", () => {
  it("preserva os passos vistos sem marcar os passos pulados", () => {
    const iniciais = new Set([1]);

    const visitados = registrarVisita(iniciais, 4);

    expect([...visitados]).toEqual([1, 4]);
    expect(visitados.has(2)).toBe(false);
    expect(visitados.has(3)).toBe(false);
    expect(iniciais).toEqual(new Set([1]));
  });
});
