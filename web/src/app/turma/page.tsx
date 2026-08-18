import Link from "next/link";
import { redirect } from "next/navigation";
import { sessaoTurma } from "@/lib/session";
import { db, type Envio, type Turma } from "@/lib/supabase";
import { CANDIDATOS, GRUPOS, NUMEROS_GRUPO } from "@/lib/grupos";
import { horaCurta } from "@/lib/data";
import { obterMarca } from "@/lib/marcas";
import { sairDaTurma } from "./actions";

export const dynamic = "force-dynamic";

const SETA_DIREITA = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M5 12h14m0 0l-5-5m5 5l-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function PaginaTurma() {
  const turmaId = await sessaoTurma();
  if (!turmaId) redirect("/");

  const { data: turma } = await db()
    .from("turmas")
    .select("*")
    .eq("id", turmaId)
    .maybeSingle<Turma>();
  if (!turma || !turma.ativa) redirect("/");
  const marca = obterMarca(turma.marca);

  const { data: envios } = await db()
    .from("envios")
    .select("*")
    .eq("turma_id", turmaId)
    .order("created_at", { ascending: false })
    .returns<Envio[]>();

  const gruposComEnvio = new Set((envios ?? []).map((e) => e.grupo));

  return (
    <div className="pagina-escura" data-marca={marca.slug}>
      <header className="topo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={marca.logo} alt={marca.nome} className="logo" />
        <div className="topo-direita">
          <span className="meta">{turma.nome}</span>
          <form action={sairDaTurma}>
            <button type="submit" className="btn-fio-escuro">
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="miolo">
        <section className="secao sobe" style={{ marginTop: "var(--gap-5)" }}>
          <span className="pd-seal">{turma.nome}</span>
          <h2>A mesma decisão, quatro bases de conhecimento</h2>
          <p style={{ maxWidth: "62ch" }}>
            A Vértice vai contratar um Head de Automação e IA. Três finalistas, decisão
            em 5 dias. Cada grupo é uma área da empresa e responde à mesma pergunta:
            qual dos três contratar, e por quê?
          </p>
          <ol className="regras">
            <li>Só os seus documentos. Nada de internet, nada de conhecimento de mercado.</li>
            <li>Toda conclusão aponta para um dado, com origem.</li>
            <li>Informação que falta se declara — não se estima.</li>
          </ol>
        </section>

        <section className="secao">
          <div className="secao-cabeca">
            <h2>Abra a tarefa do seu grupo</h2>
            <span className="meta">
              Entre só na do seu grupo — abrir a de outro estraga a dinâmica.
            </span>
          </div>
          <div className="grade-grupos">
            {NUMEROS_GRUPO.map((n) => {
              const g = GRUPOS[n];
              return (
                <Link href={`/turma/grupo/${n}`} key={n} className="bloco bloco-link sobe">
                  <span className="papel">{g.nome}</span>
                  <h3>{g.papel}</h3>
                  <span className="docs">tarefa · currículos · {g.docs}</span>
                  <div className="bloco-acao">
                    <span className="btn-baixar">
                      Ver a tarefa do grupo {SETA_DIREITA}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="secao">
          <div className="secao-cabeca">
            <h2>Envios da turma</h2>
            <span className="meta">
              {gruposComEnvio.size} de 4 grupos enviaram
            </span>
          </div>
          {(envios ?? []).length === 0 ? (
            <p className="meta">Nenhum envio ainda. O primeiro aparece aqui.</p>
          ) : (
            <div className="tabela">
              <div className="th cols-envios">
                <span>Grupo</span>
                <span>Candidato</span>
                <span style={{ textAlign: "right" }}>Hora</span>
              </div>
              {(envios ?? []).map((e) => {
                const g = GRUPOS[e.grupo as 1 | 2 | 3 | 4];
                return (
                  <div key={e.id} className="tr cols-envios">
                    <span className="label" style={{ color: "var(--on-dark-1)" }}>
                      {g.nome} — {g.papel}
                    </span>
                    <span className="estado">{CANDIDATOS[e.candidato] ?? e.candidato}</span>
                    <span className="meta" style={{ textAlign: "right" }}>
                      {horaCurta(e.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="pd-rule rodape">
        <span>©2026 {marca.nome}</span>
        <span>Vértice Serviços Gerenciados S.A. — caso fictício</span>
      </footer>
    </div>
  );
}
