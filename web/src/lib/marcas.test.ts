import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MARCAS, obterMarca } from "./marcas";

describe("obterMarca", () => {
  it.each([
    ["pandora", "Pandora", "/brand/logo_dark.svg"],
    ["tera", "Tera", "/brand/tera/logo.png"],
    ["echos", "Echos", "/brand/echos/logo.svg"],
  ])("resolve %s", (slug, nome, logo) => {
    expect(obterMarca(slug)).toEqual({ slug, nome, logo });
  });

  it.each([undefined, null, "desconhecida", "constructor", "toString"])(
    "usa Pandora como fallback para %s",
    (valor) => {
      expect(obterMarca(valor)).toEqual({
        slug: "pandora",
        nome: "Pandora",
        logo: "/brand/logo_dark.svg",
      });
    },
  );

  it("mantém todos os logos registrados no diretório público", () => {
    for (const marca of Object.values(MARCAS)) {
      const caminho = join(process.cwd(), "public", marca.logo.replace(/^\//, ""));
      expect(existsSync(caminho), caminho).toBe(true);
    }
  });
});
