import Link from "next/link";
import { redirect } from "next/navigation";
import { sessaoTurma } from "@/lib/session";
import { db, type Turma } from "@/lib/supabase";
import { GRUPOS, NUMEROS_GRUPO } from "@/lib/grupos";
import { obterMarca } from "@/lib/marcas";
import { quantidadeGruposComEnvio } from "@/lib/cruzamento";
import AtualizadorAutomatico from "@/components/AtualizadorAutomatico";
import { sairDaTurma } from "./actions";

export const dynamic = "force-dynamic";

const SETA_DIREITA = (
  <svg className="trilha-seta" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M5 12h14m0 0l-5-5m5 5l-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ETAPAS = ["Escolha seu grupo", "Baixe e converse com a IA", "Enviem o resultado"];

export default async function PaginaTurma() {
  const turmaId = await sessaoTurma();
  if (!turmaId) redirect("/");

  const { data: turma } = await db()
    .from("turmas")
    .select("*")
    .eq("id", turmaId)
    .maybeSingle<Turma>();
  if (!turma || !turma.ativa) redirect("/?motivo=encerrada");
  const marca = obterMarca(turma.marca);

  const { data: envios } = await db()
    .from("envios")
    .select("grupo")
    .eq("turma_id", turmaId);

  const gruposComEnvio = quantidadeGruposComEnvio(envios ?? []);

  return (
    <div className="pagina-escura" data-marca={marca.slug}>
      <AtualizadorAutomatico />
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

      <main className="miolo miolo-amplo">
        <div className="duas-colunas sobe">
          <section className="coluna-passos">
            <span className="pd-seal">{turma.nome}</span>
            <h2>A mesma decisão, quatro bases de conhecimento</h2>
            <p>
              A Vértice vai contratar um Head de Automação e IA. Três finalistas, decisão
              em 5 dias. Cada grupo é uma área da empresa e responde à mesma pergunta:
              qual dos três contratar, e por quê?
            </p>
            <div className="trilha-passos" aria-label="Como funciona">
              {ETAPAS.map((etapa, indice) => (
                <span key={etapa} className="trilha-item">
                  {indice > 0 && SETA_DIREITA}
                  <span className="trilha-passo">
                    <span className="passo-num">{indice + 1}</span>
                    {etapa}
                  </span>
                </span>
              ))}
            </div>
            <ol className="regras">
              <li>Só os seus documentos. Nada de internet, nada de conhecimento de mercado.</li>
              <li>Toda conclusão aponta para um dado, com origem.</li>
              <li>Informação que falta se declara — não se estima.</li>
            </ol>
            <p className="aponta-lado">
              Comece escolhendo o cartão do seu grupo
              <span className="so-desktop"> ao lado</span>
              <span className="so-mobile"> abaixo</span>
              {SETA_DIREITA}
            </p>
          </section>

          <aside className="coluna-lateral">
            <div className="secao-cabeca">
              <h2>Abra a tarefa do seu grupo</h2>
            </div>
            <span className="meta">
              Entre só na do seu grupo — abrir a de outro estraga a dinâmica.
            </span>
            <div className="grade-grupos grade-grupos-coluna">
              {NUMEROS_GRUPO.map((n) => {
                const g = GRUPOS[n];
                return (
                  <Link href={`/turma/grupo/${n}`} key={n} className="bloco bloco-link">
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
            <p className="meta resumo-envios">
              {gruposComEnvio} de 4 grupos enviaram · {turma.envios_abertos ? "envios abertos" : "envios fechados"}
            </p>
          </aside>
        </div>
      </main>

      <footer className="pd-rule rodape">
        <span>©2026 {marca.nome}</span>
        <span>Vértice Serviços Gerenciados S.A. — caso fictício</span>
      </footer>
    </div>
  );
}
