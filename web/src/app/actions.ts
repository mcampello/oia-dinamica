"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { abrirSessaoTurma } from "@/lib/session";

export async function entrarNaTurma(formData: FormData) {
  const codigo = String(formData.get("codigo") ?? "").trim().toUpperCase();
  if (!codigo) redirect("/?erro=1");

  const { data: turma } = await db()
    .from("turmas")
    .select("id, ativa")
    .eq("codigo", codigo)
    .maybeSingle();

  if (!turma || !turma.ativa) redirect("/?erro=1");

  await abrirSessaoTurma(turma.id);
  redirect("/turma");
}
