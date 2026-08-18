import { describe, expect, it } from "vitest";
import {
  LIMITES_RESULTADO,
  lerValoresResultado,
  validarValoresResultado,
  type ValoresResultado,
} from "./resultado";

const VALIDO: ValoresResultado = {
  candidato: "aline",
  motivo: "motivo",
  dado: "dado",
  faltou: "faltou",
  prompt: "prompt",
};

describe("validarValoresResultado", () => {
  it("aceita todos os campos preenchidos", () => {
    expect(validarValoresResultado(VALIDO)).toBeNull();
  });

  it.each(["candidato", "motivo", "dado", "faltou", "prompt"] as const)(
    "rejeita %s vazio",
    (campo) => {
      expect(validarValoresResultado({ ...VALIDO, [campo]: "   " })).toBe("campos");
    },
  );

  it("aceita o limite exato", () => {
    expect(
      validarValoresResultado({
        ...VALIDO,
        motivo: "m".repeat(LIMITES_RESULTADO.motivo),
        dado: "d".repeat(LIMITES_RESULTADO.dado),
        faltou: "f".repeat(LIMITES_RESULTADO.faltou),
        prompt: "p".repeat(LIMITES_RESULTADO.prompt),
      }),
    ).toBeNull();
  });

  it.each(Object.entries(LIMITES_RESULTADO))("rejeita %s acima do limite", (campo, limite) => {
    expect(
      validarValoresResultado({ ...VALIDO, [campo]: "x".repeat(limite + 1) }),
    ).toBe("limite");
  });
});

describe("lerValoresResultado", () => {
  it("preserva os valores digitados sem aparar ou truncar", () => {
    const formData = new FormData();
    const motivo = `  ${"x".repeat(LIMITES_RESULTADO.motivo + 1)}  `;
    formData.set("candidato", "juliana");
    formData.set("motivo", motivo);
    formData.set("dado", " dado ");
    formData.set("faltou", " faltou ");
    formData.set("prompt", " prompt ");

    expect(lerValoresResultado(formData)).toEqual({
      candidato: "juliana",
      motivo,
      dado: " dado ",
      faltou: " faltou ",
      prompt: " prompt ",
    });
  });
});
