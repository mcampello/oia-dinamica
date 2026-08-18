import { describe, expect, it } from "vitest";
import { normalizarCodigo } from "./codigo";

describe("normalizarCodigo", () => {
  it.each(["ab3k", "OIA AB3K", "OIA-AB3K", "  oia - ab3k  "])(
    "normaliza %s para o formato canônico",
    (entrada) => {
      expect(normalizarCodigo(entrada)).toBe("OIA-AB3K");
    },
  );

  it.each(["", "AB3", "AB3K5", "OIA-AB0K", "OIA-ABIL", "AB 3K", null])(
    "rejeita o formato inválido %s",
    (entrada) => {
      expect(normalizarCodigo(entrada)).toBeNull();
    },
  );
});
