"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { encerrarSessaoTurma, sessaoTurma } from "@/lib/session";
import { CANDIDATOS } from "@/lib/grupos";

export async function enviarResultado(formData: FormData) {
  const turmaId = await sessaoTurma();
  if (!turmaId) redirect("/");

  const grupo = Number(formData.get("grupo"));
  const candidato = String(formData.get("candidato") ?? "");
  const motivo = String(formData.get("motivo") ?? "").trim();
  const dado = String(formData.get("dado") ?? "").trim();
  const faltou = String(formData.get("faltou") ?? "").trim();
  const prompt = String(formData.get("prompt") ?? "").trim();

  const valido =
    [1, 2, 3, 4].includes(grupo) &&
    candidato in CANDIDATOS &&
    motivo &&
    dado &&
    faltou &&
    prompt;
  if (!valido) redirect("/turma?erro=campos");

  const { error } = await db().from("envios").insert({
    turma_id: turmaId,
    grupo,
    candidato,
    motivo: motivo.slice(0, 2000),
    dado: dado.slice(0, 2000),
    faltou: faltou.slice(0, 2000),
    prompt: prompt.slice(0, 8000),
  });
  if (error) redirect("/turma?erro=envio");

  revalidatePath("/turma");
  redirect(`/turma?enviado=${grupo}`);
}

export async function sairDaTurma() {
  await encerrarSessaoTurma();
  redirect("/");
}
