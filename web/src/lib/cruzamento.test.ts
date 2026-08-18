import { describe, expect, it } from "vitest";
import { montarPromptCruzamento, quantidadeGruposComEnvio, vigentes } from "./cruzamento";
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
    racional: "racional",
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

describe("montarPromptCruzamento", () => {
  it("inclui o envio vigente e identifica os grupos ainda ausentes", () => {
    const antigo = envio("antigo", 1, "2026-08-18T10:00:00.000Z");
    antigo.motivo = "resposta antiga";
    const recente = envio("recente", 1, "2026-08-18T11:00:00.000Z");
    recente.motivo = "resposta vigente";

    const resultado = montarPromptCruzamento([antigo, recente]);

    expect(resultado.texto).toContain("Você é o agente de alinhamento");
    expect(resultado.texto).toContain("descritivo da vaga");
    expect(resultado.texto).toContain("SOMENTE UMA PERGUNTA");
    expect(resultado.texto).toContain("PODE MAPEAR");
    expect(resultado.texto).toContain("PODE RECOMENDAR");
    expect(resultado.texto).toContain("resposta vigente");
    expect(resultado.texto).not.toContain("resposta antiga");
    expect(resultado.gruposSemEnvio).toEqual([2, 3, 4]);
  });

  it("não apresenta o prompt legado como racional da decisão", () => {
    const legado = envio("legado", 1, "2026-08-18T10:00:00.000Z");
    legado.racional = "";

    const resultado = montarPromptCruzamento([legado]);

    expect(resultado.texto).toContain(
      "[não informado — envio anterior à mudança do formulário]",
    );
  });
});
