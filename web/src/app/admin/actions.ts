"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import {
  abrirSessaoAdmin,
  encerrarSessaoAdmin,
  senhaConfere,
  sessaoAdmin,
} from "@/lib/session";
import { gerarCodigo } from "@/lib/codigo";
import { obterMarca } from "@/lib/marcas";

export async function entrarAdmin(formData: FormData) {
  const senha = process.env.ADMIN_PASSWORD;
  if (!senha) throw new Error("Defina ADMIN_PASSWORD no ambiente");

  const tentativa = String(formData.get("senha") ?? "");
  if (!tentativa || !senhaConfere(tentativa, senha)) redirect("/admin?erro=1");

  await abrirSessaoAdmin();
  redirect("/admin");
}

export async function sairAdmin() {
  await encerrarSessaoAdmin();
  redirect("/admin");
}

export async function criarTurma(formData: FormData) {
  if (!(await sessaoAdmin())) redirect("/admin");

  const nome = String(formData.get("nome") ?? "").trim().slice(0, 120);
  if (!nome) redirect("/admin?erro=nome");
  const marca = obterMarca(formData.get("marca")).slug;

  // O código é único; em colisão (rara), tenta outro.
  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const { error } = await db().from("turmas").insert({ nome, codigo: gerarCodigo(), marca });
    if (!error) {
      revalidatePath("/admin");
      redirect("/admin");
    }
    if (error.code !== "23505") break;
  }
  redirect("/admin?erro=criar");
}

export async function alternarTurma(formData: FormData) {
  if (!(await sessaoAdmin())) redirect("/admin");

  const id = String(formData.get("id") ?? "");
  const { data: turma } = await db()
    .from("turmas")
    .select("ativa")
    .eq("id", id)
    .maybeSingle();
  if (turma) {
    await db().from("turmas").update({ ativa: !turma.ativa }).eq("id", id);
  }
  revalidatePath("/admin");
  redirect("/admin");
}
