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

const SETA_BAIXO = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M12 4v13m0 0l-5-5m5 5l5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ETAPAS = [
  "Entenda o desafio",
  "Baixe o descritivo",
  "Baixe os currículos",
  "Baixe a base da sua área",
  "Compare e envie",
];

const FINALISTAS = [
  { nome: "Rafael D'Ávila", arquivo: "Curriculo-1-Rafael-DAvila.md" },
  { nome: "Aline Ferraz", arquivo: "Curriculo-2-Aline-Ferraz.md" },
  { nome: "Juliana Setúbal", arquivo: "Curriculo-3-Juliana-Setubal.md" },
];

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
            <h1>Seu desafio: indicar quem contratar</h1>
            <p>
              A Vértice vai contratar um Head de Automação e IA. Seu grupo receberá o
              descritivo da vaga, os currículos de três finalistas e a base de conhecimento
              de uma área da empresa.
            </p>
            <p className="aviso">
              Vocês devem usar a IA para investigar os currículos pela perspectiva da sua área.
              Os documentos fornecem o conhecimento; o grupo decide como interrogá-lo, que
              cruzamentos fazer e quais critérios devem pesar. No fim, respondam: <strong>quem
              vocês contratariam — ou não contratariam ninguém — e por quê?</strong>
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
            <div>
              <h2>O que vocês vão entregar</h2>
              <ol className="regras">
                <li>As perguntas e tensões que apareceram na análise dos três candidatos.</li>
                <li>A indicação de quem contratar, ou a decisão de não aprovar ninguém.</li>
                <li>Um resumo da justificativa, incluindo dúvidas e dados que sustentam a escolha.</li>
              </ol>
            </div>
            <ol className="regras">
              <li>Só os seus documentos. Nada de internet, nada de conhecimento de mercado.</li>
              <li>Toda conclusão aponta para um dado, com origem.</li>
              <li>Informação que falta se declara — não se estima.</li>
            </ol>
            <p className="aponta-lado">
              Comece baixando o descritivo da vaga
              <span className="so-desktop"> ao lado</span>
              <span className="so-mobile"> abaixo</span>
              {SETA_DIREITA}
            </p>
          </section>

          <aside className="coluna-lateral">
            <section className="bloco bloco-curriculos">
              <span className="papel">Material comum aos quatro grupos</span>
              <h2>1. Baixe o descritivo da vaga</h2>
              <p>
                Este é o cargo para o qual vocês vão avaliar os três finalistas. Enviem este
                documento à IA para que ela conheça a missão, as responsabilidades e os requisitos.
              </p>
              <code className="arquivo-doc">Descritivo-da-vaga-Head-de-Automacao-e-IA.md</code>
              <div className="bloco-acao">
                <a
                  className="btn-baixar"
                  href="/downloads/Descritivo-da-vaga-Head-de-Automacao-e-IA.md"
                  download
                >
                  Baixar descritivo da vaga {SETA_BAIXO}
                </a>
              </div>
            </section>
            <section className="bloco bloco-curriculos">
              <span className="papel">Material comum aos quatro grupos</span>
              <h2>2. Baixe os três currículos</h2>
              <p>
                Cada finalista tem um currículo completo e independente. Baixe os três arquivos;
                depois vocês vão enviá-los à IA junto com os documentos da sua área.
              </p>
              <ol className="lista-candidatos">
                {FINALISTAS.map((finalista) => (
                  <li key={finalista.arquivo}>
                    <span className="curriculo-dados">
                      <strong>{finalista.nome}</strong>
                      <code className="arquivo-doc">{finalista.arquivo}</code>
                    </span>
                    <a
                      className="btn-baixar btn-curriculo"
                      href={`/downloads/${finalista.arquivo}`}
                      download
                    >
                      Baixar {SETA_BAIXO}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
            <div className="secao-cabeca secao-grupos">
              <h2>3. Baixe o material da sua área</h2>
            </div>
            <span className="meta">
              Abra somente o seu grupo. A base traz os objetivos estratégicos e os dados da
              sua área para analisar os currículos; abrir outro grupo estraga a dinâmica.
            </span>
            <div className="grade-grupos grade-grupos-coluna">
              {NUMEROS_GRUPO.map((n) => {
                const g = GRUPOS[n];
                return (
                  <Link href={`/turma/grupo/${n}`} key={n} className="bloco bloco-link">
                    <span className="papel">{g.nome}</span>
                    <h3>{g.papel}</h3>
                    <span className="docs">{g.docs}</span>
                    <div className="bloco-acao">
                      <span className="btn-baixar">
                        Abrir guia e baixar o material {SETA_DIREITA}
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
