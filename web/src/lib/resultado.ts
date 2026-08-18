import { CANDIDATOS } from "./grupos";

export const LIMITES_RESULTADO = {
  motivo: 2000,
  dado: 2000,
  faltou: 2000,
  racional: 8000,
} as const;

export type ValoresResultado = {
  candidato: string;
  motivo: string;
  dado: string;
  faltou: string;
  racional: string;
};

export type ErroResultado = "campos" | "limite" | "fechados" | "envio";

export type EstadoResultado = {
  status: "inicial" | "erro" | "sucesso";
  erro: ErroResultado | null;
  valores: ValoresResultado;
  envioId: string | null;
  enviadoEm: string | null;
};

export const VALORES_RESULTADO_VAZIOS: ValoresResultado = {
  candidato: "",
  motivo: "",
  dado: "",
  faltou: "",
  racional: "",
};

export function lerValoresResultado(formData: Pick<FormData, "get">): ValoresResultado {
  return {
    candidato: String(formData.get("candidato") ?? ""),
    motivo: String(formData.get("motivo") ?? ""),
    dado: String(formData.get("dado") ?? ""),
    faltou: String(formData.get("faltou") ?? ""),
    racional: String(formData.get("racional") ?? ""),
  };
}

export function validarValoresResultado(valores: ValoresResultado): ErroResultado | null {
  const preenchido =
    Object.hasOwn(CANDIDATOS, valores.candidato) &&
    valores.motivo.trim() &&
    valores.dado.trim() &&
    valores.faltou.trim() &&
    valores.racional.trim();
  if (!preenchido) return "campos";

  if (
    valores.motivo.length > LIMITES_RESULTADO.motivo ||
    valores.dado.length > LIMITES_RESULTADO.dado ||
    valores.faltou.length > LIMITES_RESULTADO.faltou ||
    valores.racional.length > LIMITES_RESULTADO.racional
  ) {
    return "limite";
  }
  return null;
}

export function estadoInicialResultado(valores: ValoresResultado): EstadoResultado {
  return { status: "inicial", erro: null, valores, envioId: null, enviadoEm: null };
}
