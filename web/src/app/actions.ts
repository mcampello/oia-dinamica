"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { abrirSessaoTurma } from "@/lib/session";
import { normalizarCodigo } from "@/lib/codigo";

export type ErroEntrada = "formato" | "inexistente" | "encerrada" | "indisponivel";

export type EstadoEntrada = {
  codigo: string;
  erro: ErroEntrada | null;
};

export async function entrarNaTurma(
  _estadoAnterior: EstadoEntrada,
  formData: FormData,
): Promise<EstadoEntrada> {
  const digitado = String(formData.get("codigo") ?? "");
  const codigo = normalizarCodigo(digitado);
  if (!codigo) return { codigo: digitado, erro: "formato" };

  const { data: turma, error } = await db()
    .from("turmas")
    .select("id, ativa")
    .eq("codigo", codigo)
    .maybeSingle();

  if (error) return { codigo: digitado, erro: "indisponivel" };
  if (!turma) return { codigo: digitado, erro: "inexistente" };
  if (!turma.ativa) return { codigo: digitado, erro: "encerrada" };

  await abrirSessaoTurma(turma.id);
  redirect("/turma");
}
