import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { sessaoAdmin } from "@/lib/session";
import { db, type Envio, type Turma } from "@/lib/supabase";
import { CANDIDATOS, GRUPOS, NUMEROS_GRUPO } from "@/lib/grupos";
import { montarPromptCruzamento, vigentes } from "@/lib/cruzamento";
import { dataHora } from "@/lib/data";
import BotaoCopiar from "@/components/BotaoCopiar";
import { obterMarca } from "@/lib/marcas";

export const dynamic = "force-dynamic";

export default async function DetalheTurma({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await sessaoAdmin())) redirect("/admin");

  const { id } = await params;
  const { data: turma } = await db()
    .from("turmas")
    .select("*")
    .eq("id", id)
    .maybeSingle<Turma>();
  if (!turma) notFound();

  const { data: enviosData } = await db()
    .from("envios")
    .select("*")
    .eq("turma_id", id)
    .order("created_at", { ascending: false })
    .returns<Envio[]>();
  const envios = enviosData ?? [];

  const respostasVigentes = vigentes(envios);
  const { texto: promptCruzamento, gruposSemEnvio } = montarPromptCruzamento(envios);

  return (
    <>
      <header className="papel-topo">
        <div className="papel-topo-esq">
          <span className="papel-titulo">{turma.nome}</span>
          <span className="papel-chip">
            código <code style={{ color: "var(--pd-purple)" }}>{turma.codigo}</code> ·{" "}
            {obterMarca(turma.marca).nome} · {turma.ativa ? "ativa" : "encerrada"}
          </span>
        </div>
        <Link href="/admin" className="btn-fio" style={{ textDecoration: "none" }}>
          ← Turmas
        </Link>
      </header>

      <main className="papel-miolo">
        <section className="bloco-roxo sobe">
          <h3>Cruzamento no Claude</h3>
          <ol
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              margin: 0,
              paddingLeft: 20,
            }}
          >
            <li>
              <strong>Monte o projeto (uma vez).</strong> Baixe as regras da Vértice e
              adicione o arquivo ao projeto no Claude.
              <div style={{ marginTop: 8 }}>
                <a
                  href="https://raw.githubusercontent.com/mcampello/oia-dinamica/main/Facilitador%20(n%C3%A3o%20distribuir)/Regras-e-Estrategia-da-Vertice.md"
                  target="_blank"
                  rel="noreferrer"
                  className="pd-btn"
                  style={{ color: "#000", textDecoration: "none" }}
                >
                  Abrir regras da Vértice
                </a>
              </div>
            </li>
            <li>
              <strong>Depois dos envios.</strong> Copie o prompt de cruzamento. Ele já
              inclui a resposta vigente dos quatro grupos.
              <div style={{ marginTop: 8 }}>
                <BotaoCopiar
                  texto={promptCruzamento}
                  rotulo="Copiar prompt de cruzamento"
                  className="pd-btn"
                />
              </div>
            </li>
            <li>
              <strong>Faça o cruzamento.</strong> Cole o prompt no projeto e rode com a
              resposta projetada para a turma.
            </li>
          </ol>
          {gruposSemEnvio.length > 0 && (
            <p style={{ color: "#fff" }}>
              Atenção: sem envio de{" "}
              {gruposSemEnvio.map((n) => `${GRUPOS[n].nome} (${GRUPOS[n].papel})`).join(", ")}.
            </p>
          )}
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h2>Respostas por grupo</h2>
          {NUMEROS_GRUPO.map((n) => {
            const g = GRUPOS[n];
            const doGrupo = envios.filter((e) => e.grupo === n);
            const vigente = respostasVigentes.get(n);
            return (
              <div key={n} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="secao-cabeca">
                  <h3>
                    {g.nome} — {g.papel}
                  </h3>
                  <span className={vigente ? "estado" : "estado mudo"}>
                    {vigente
                      ? `${doGrupo.length} ${doGrupo.length === 1 ? "envio" : "envios"}`
                      : "sem envio"}
                  </span>
                </div>
                {doGrupo.map((e) => (
                  <div
                    key={e.id}
                    className={`bloco-branco${e.id === vigente?.id ? " vigente" : ""}`}
                  >
                    <div className="secao-cabeca">
                      <span className="label" style={{ color: "var(--pd-ink)", fontWeight: 500 }}>
                        {CANDIDATOS[e.candidato] ?? e.candidato}
                      </span>
                      <span className="meta">
                        {e.id === vigente?.id ? "vigente · " : ""}
                        {dataHora(e.created_at)}
                      </span>
                    </div>
                    <div className="resposta-campo">
                      <span className="rotulo">Motivo</span>
                      <span className="valor">{e.motivo}</span>
                    </div>
                    <div className="resposta-campo">
                      <span className="rotulo">O dado que sustenta</span>
                      <span className="valor">{e.dado}</span>
                    </div>
                    <div className="resposta-campo">
                      <span className="rotulo">O que ficou faltando</span>
                      <span className="valor">{e.faltou}</span>
                    </div>
                    <div className="resposta-prompt">{e.prompt}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
