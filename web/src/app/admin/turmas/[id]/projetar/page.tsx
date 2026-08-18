import { notFound, redirect } from "next/navigation";
import AtualizadorAutomatico from "@/components/AtualizadorAutomatico";
import { quantidadeGruposComEnvio } from "@/lib/cruzamento";
import { obterMarca } from "@/lib/marcas";
import { sessaoAdmin } from "@/lib/session";
import { db, type Turma } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ProjetarTurma({ params }: { params: Promise<{ id: string }> }) {
  if (!(await sessaoAdmin())) redirect("/admin");

  const { id } = await params;
  const { data: turma } = await db()
    .from("turmas")
    .select("*")
    .eq("id", id)
    .maybeSingle<Turma>();
  if (!turma) notFound();

  const { data: envios } = await db()
    .from("envios")
    .select("grupo")
    .eq("turma_id", id);
  const progresso = quantidadeGruposComEnvio(envios ?? []);
  const marca = obterMarca(turma.marca);
  const situacao = !turma.ativa
    ? "Turma encerrada"
    : turma.envios_abertos
      ? "Recebendo envios"
      : "Envios fechados";

  return (
    <div className="pagina-projecao" data-marca={marca.slug}>
      <AtualizadorAutomatico />
      <header className="projecao-topo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={marca.logo} alt={marca.nome} className="logo" />
        <span>{turma.nome}</span>
      </header>
      <main className="projecao-miolo">
        <span className="projecao-rotulo">Código da turma</span>
        <code className="projecao-codigo">{turma.codigo}</code>
        <div className="projecao-progresso" aria-live="polite">
          <strong>{progresso}</strong>
          <span>de 4 grupos enviaram</span>
        </div>
        <span className={`projecao-estado${turma.ativa && turma.envios_abertos ? " ativo" : ""}`}>
          {situacao}
        </span>
      </main>
    </div>
  );
}
