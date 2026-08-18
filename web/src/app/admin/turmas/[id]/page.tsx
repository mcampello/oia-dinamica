import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { sessaoAdmin } from "@/lib/session";
import { db, type Envio, type Turma } from "@/lib/supabase";
import { CANDIDATOS, GRUPOS, NUMEROS_GRUPO } from "@/lib/grupos";
import { montarPromptCruzamento, vigentes } from "@/lib/cruzamento";
import { dataHora } from "@/lib/data";
import BotaoCopiar from "@/components/BotaoCopiar";
import AtualizadorAutomatico from "@/components/AtualizadorAutomatico";
import ControlesTurma from "@/components/ControlesTurma";
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
      <AtualizadorAutomatico />
      <header className="papel-topo">
        <div className="papel-topo-esq">
          <span className="papel-titulo">{turma.nome}</span>
          <span className="papel-chip">
            código <code style={{ color: "var(--pd-purple)" }}>{turma.codigo}</code> ·{" "}
            {obterMarca(turma.marca).nome} · {turma.ativa ? "ativa" : "encerrada"}
          </span>
        </div>
        <div className="acoes-topo">
          <Link
            href={`/admin/turmas/${id}/projetar`}
            target="_blank"
            className="btn-fio"
            style={{ textDecoration: "none" }}
          >
            Projetar ↗
          </Link>
          <Link href="/admin" className="btn-fio" style={{ textDecoration: "none" }}>
            ← Turmas
          </Link>
        </div>
      </header>

      <main className="papel-miolo">
        <section className="painel-controles sobe">
          <div>
            <h2>Condução da turma</h2>
            <p className="meta">
              Fechar envios mantém o material acessível. Encerrar também remove o acesso dos alunos.
            </p>
          </div>
          <ControlesTurma
            id={turma.id}
            ativa={turma.ativa}
            enviosAbertos={turma.envios_abertos}
          />
        </section>

        <section className="bloco-roxo sobe">
          <h3>Kit do agente de alinhamento</h3>
          <p>
            O agente final recebe três camadas: os fatos dos currículos, as regras estratégicas
            do Comitê e as respostas dos grupos, que já entram dentro do prompt gerado abaixo.
          </p>
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
              <strong>Conhecimento do agente.</strong> Crie um projeto no agente que fará o
              fechamento e adicione estes cinco arquivos uma única vez:
              <div className="acoes-turma" style={{ marginTop: 8, justifyContent: "flex-start" }}>
                <a
                  href="/downloads/Descritivo-da-vaga-Head-de-Automacao-e-IA.md"
                  download
                  className="pd-btn"
                  style={{ color: "#000", textDecoration: "none" }}
                >
                  Descritivo da vaga
                </a>
                <a
                  href="/downloads/Curriculo-1-Rafael-DAvila.md"
                  download
                  className="pd-btn"
                  style={{ color: "#000", textDecoration: "none" }}
                >
                  Currículo 1 — Rafael
                </a>
                <a
                  href="/downloads/Curriculo-2-Aline-Ferraz.md"
                  download
                  className="pd-btn"
                  style={{ color: "#000", textDecoration: "none" }}
                >
                  Currículo 2 — Aline
                </a>
                <a
                  href="/downloads/Curriculo-3-Juliana-Setubal.md"
                  download
                  className="pd-btn"
                  style={{ color: "#000", textDecoration: "none" }}
                >
                  Currículo 3 — Juliana
                </a>
                <a
                  href="/downloads/Regras-e-Estrategia-da-Vertice.md"
                  target="_blank"
                  rel="noreferrer"
                  className="pd-btn"
                  style={{ color: "#000", textDecoration: "none" }}
                >
                  Abrir regras e estratégia
                </a>
              </div>
            </li>
            <li>
              <strong>Contexto dos grupos.</strong> Não é preciso copiar resposta por resposta.
              O sistema seleciona o envio mais recente de cada grupo e coloca os quatro dentro
              do prompt de alinhamento.
            </li>
            <li>
              <strong>Prompt de alinhamento.</strong> Depois que os quatro grupos enviarem,
              copie o prompt abaixo. A primeira resposta do agente será somente uma pergunta;
              ele fica proibido de mostrar análise ou candidatos favoritos.
              <div style={{ marginTop: 8 }}>
                <BotaoCopiar
                  texto={promptCruzamento}
                  rotulo="Copiar prompt de alinhamento"
                  className="pd-btn"
                />
              </div>
            </li>
            <li>
              <strong>Libere cada rodada.</strong> Responda às perguntas e escreva
              <code> PODE MAPEAR</code> para ver alternativas sem recomendação. Quando a turma
              estiver pronta, escreva <code>PODE RECOMENDAR</code> para produzir o fechamento.
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
                      <span className="rotulo">Resumo da recomendação</span>
                      <span className="valor">{e.motivo}</span>
                    </div>
                    <div className="resposta-campo">
                      <span className="rotulo">O dado que sustenta</span>
                      <span className="valor">{e.dado}</span>
                    </div>
                    <div className="resposta-campo">
                      <span className="rotulo">Perguntas que ficaram abertas</span>
                      <span className="valor">{e.faltou}</span>
                    </div>
                    <div className="resposta-campo resposta-racional">
                      <span className="rotulo">Racional da decisão</span>
                      <span className="valor">{e.racional}</span>
                    </div>
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
