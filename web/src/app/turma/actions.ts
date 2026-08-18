"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { encerrarSessaoTurma, sessaoTurma } from "@/lib/session";
import { CANDIDATOS, isNumeroGrupo } from "@/lib/grupos";

export async function enviarResultado(formData: FormData) {
  const turmaId = await sessaoTurma();
  if (!turmaId) redirect("/");

  const grupo = Number(formData.get("grupo"));
  const veioDaPaginaDoGrupo =
    formData.get("origem") === "grupo" && isNumeroGrupo(grupo);
  const retorno = veioDaPaginaDoGrupo ? `/turma/grupo/${grupo}` : "/turma";
  const candidato = String(formData.get("candidato") ?? "");
  const motivo = String(formData.get("motivo") ?? "").trim();
  const dado = String(formData.get("dado") ?? "").trim();
  const faltou = String(formData.get("faltou") ?? "").trim();
  const prompt = String(formData.get("prompt") ?? "").trim();

  const valido = Boolean(
    isNumeroGrupo(grupo) &&
    Object.hasOwn(CANDIDATOS, candidato) &&
    motivo &&
    dado &&
    faltou &&
    prompt,
  );
  if (!valido) redirect(`${retorno}?erro=campos`);

  const { data: turma } = await db()
    .from("turmas")
    .select("id")
    .eq("id", turmaId)
    .eq("ativa", true)
    .maybeSingle();
  if (!turma) redirect("/");

  const { error } = await db().from("envios").insert({
    turma_id: turmaId,
    grupo,
    candidato,
    motivo: motivo.slice(0, 2000),
    dado: dado.slice(0, 2000),
    faltou: faltou.slice(0, 2000),
    prompt: prompt.slice(0, 8000),
  });
  if (error) redirect(`${retorno}?erro=envio`);

  revalidatePath("/turma");
  if (veioDaPaginaDoGrupo) redirect(`${retorno}?enviado=1`);
  redirect(`/turma?enviado=${grupo}`);
}

export async function sairDaTurma() {
  await encerrarSessaoTurma();
  redirect("/");
}
