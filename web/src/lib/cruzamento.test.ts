import { describe, expect, it } from "vitest";
import { quantidadeGruposComEnvio, vigentes } from "./cruzamento";
import type { Envio } from "./supabase";

function envio(id: string, grupo: number, created_at: string): Envio {
  return {
    id,
    turma_id: "turma",
    grupo,
    candidato: "aline",
    motivo: "motivo",
    dado: "dado",
    faltou: "faltou",
    prompt: "prompt",
    created_at,
  };
}

describe("vigentes", () => {
  it("seleciona o envio mais recente de cada grupo independentemente da ordem", () => {
    const antigo = envio("antigo", 1, "2026-08-18T10:00:00.000Z");
    const recente = envio("recente", 1, "2026-08-18T11:00:00.000Z");
    const outroGrupo = envio("grupo-2", 2, "2026-08-18T09:00:00.000Z");

    const respostas = vigentes([antigo, outroGrupo, recente]);

    expect(respostas.get(1)?.id).toBe("recente");
    expect(respostas.get(2)?.id).toBe("grupo-2");
  });
});

describe("quantidadeGruposComEnvio", () => {
  it("conta grupos distintos, não reenvios", () => {
    expect(
      quantidadeGruposComEnvio([
        envio("a", 1, "2026-08-18T10:00:00.000Z"),
        envio("b", 1, "2026-08-18T11:00:00.000Z"),
        envio("c", 3, "2026-08-18T12:00:00.000Z"),
      ]),
    ).toBe(2);
  });
});
