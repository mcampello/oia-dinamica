"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { encerrarSessaoTurma, sessaoTurma } from "@/lib/session";
import { isNumeroGrupo } from "@/lib/grupos";
import {
  lerValoresResultado,
  validarValoresResultado,
  type EstadoResultado,
} from "@/lib/resultado";

type ResultadoRegistro = {
  status: "sucesso" | "encerrada" | "fechados";
  envio_id: string | null;
  enviado_em: string | null;
};

export async function enviarResultado(
  _estadoAnterior: EstadoResultado,
  formData: FormData,
): Promise<EstadoResultado> {
  const valores = lerValoresResultado(formData);
  const responderErro = (erro: EstadoResultado["erro"]): EstadoResultado => ({
    status: "erro",
    erro,
    valores,
    envioId: null,
    enviadoEm: null,
  });

  const turmaId = await sessaoTurma();
  if (!turmaId) redirect("/");

  const grupo = Number(formData.get("grupo"));
  if (!isNumeroGrupo(grupo)) return responderErro("campos");
  const erroValidacao = validarValoresResultado(valores);
  if (erroValidacao) return responderErro(erroValidacao);

  const valoresPersistidos = {
    candidato: valores.candidato,
    motivo: valores.motivo.trim(),
    dado: valores.dado.trim(),
    faltou: valores.faltou.trim(),
    prompt: valores.prompt.trim(),
  };
  const { data: resultado, error } = await db()
    .rpc("registrar_envio", {
      p_turma_id: turmaId,
      p_grupo: grupo,
      p_candidato: valoresPersistidos.candidato,
      p_motivo: valoresPersistidos.motivo,
      p_dado: valoresPersistidos.dado,
      p_faltou: valoresPersistidos.faltou,
      p_prompt: valoresPersistidos.prompt,
    })
    .returns<ResultadoRegistro[]>()
    .single();
  if (error || !resultado) return responderErro("envio");
  if (resultado.status === "encerrada") redirect("/?motivo=encerrada");
  if (resultado.status === "fechados") return responderErro("fechados");
  if (
    resultado.status !== "sucesso" ||
    typeof resultado.envio_id !== "string" ||
    typeof resultado.enviado_em !== "string"
  ) {
    return responderErro("envio");
  }

  revalidatePath("/turma");
  revalidatePath(`/turma/grupo/${grupo}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/turmas/${turmaId}`);
  revalidatePath(`/admin/turmas/${turmaId}/projetar`);
  return {
    status: "sucesso",
    erro: null,
    valores: valoresPersistidos,
    envioId: resultado.envio_id,
    enviadoEm: resultado.enviado_em,
  };
}

export async function sairDaTurma() {
  await encerrarSessaoTurma();
  redirect("/");
}
