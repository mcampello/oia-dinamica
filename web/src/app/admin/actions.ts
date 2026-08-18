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

export type EstadoControleTurma = { erro: string | null };

function revalidarTurma(id: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/turmas/${id}`);
  revalidatePath(`/admin/turmas/${id}/projetar`);
  revalidatePath("/turma");
  for (let grupo = 1; grupo <= 4; grupo++) revalidatePath(`/turma/grupo/${grupo}`);
}

export async function definirAcessoTurma(
  _estadoAnterior: EstadoControleTurma,
  formData: FormData,
): Promise<EstadoControleTurma> {
  if (!(await sessaoAdmin())) redirect("/admin");

  const id = String(formData.get("id") ?? "");
  const ativa = formData.get("ativa") === "true";
  if (!id) return { erro: "Turma inválida." };

  const alteracoes = ativa ? { ativa: true } : { ativa: false, envios_abertos: false };
  const { data, error } = await db()
    .from("turmas")
    .update(alteracoes)
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !data) return { erro: "Não foi possível alterar o acesso da turma." };

  revalidarTurma(id);
  return { erro: null };
}

export async function definirEnviosTurma(
  _estadoAnterior: EstadoControleTurma,
  formData: FormData,
): Promise<EstadoControleTurma> {
  if (!(await sessaoAdmin())) redirect("/admin");

  const id = String(formData.get("id") ?? "");
  const abertos = formData.get("abertos") === "true";
  if (!id) return { erro: "Turma inválida." };

  let consulta = db().from("turmas").update({ envios_abertos: abertos }).eq("id", id);
  if (abertos) consulta = consulta.eq("ativa", true);
  const { data, error } = await consulta.select("id").maybeSingle();
  if (error) return { erro: "Não foi possível alterar os envios." };
  if (!data) return { erro: "Reabra o acesso da turma antes de abrir os envios." };

  revalidarTurma(id);
  return { erro: null };
}
