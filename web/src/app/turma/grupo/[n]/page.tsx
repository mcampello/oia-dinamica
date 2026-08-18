import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AssistentePassos from "@/components/AssistentePassos";
import AtualizadorAutomatico from "@/components/AtualizadorAutomatico";
import FormularioResultado from "@/components/FormularioResultado";
import { db, type Envio } from "@/lib/supabase";
import { sessaoTurma } from "@/lib/session";
import { GRUPOS, isNumeroGrupo } from "@/lib/grupos";
import { obterMarca } from "@/lib/marcas";
import {
  ENTREGA,
  GUIAS,
  PREPARACAO_PROJETO,
  REGRAS_GUIA,
  SITUACAO,
  TEMPO,
} from "@/lib/guia";

export const dynamic = "force-dynamic";

const SETA_BAIXO = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M12 4v13m0 0l-5-5m5 5l5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SETA_DIREITA = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M5 12h14m0 0l-5-5m5 5l-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ETAPAS = [
  { id: "situacao", titulo: "Entenda a situação" },
  { id: "material", titulo: "Baixe a base da área" },
  { id: "projeto", titulo: "Prepare o projeto" },
  { id: "comparacao", titulo: "Compare e envie" },
];

export default async function PaginaGrupo({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const numero = Number((await params).n);
  if (!isNumeroGrupo(numero)) notFound();

  const turmaId = await sessaoTurma();
  if (!turmaId) redirect("/");

  const { data: turma } = await db()
    .from("turmas")
    .select("id, marca, ativa, envios_abertos")
    .eq("id", turmaId)
    .maybeSingle();
  if (!turma || !turma.ativa) redirect("/?motivo=encerrada");
  const marca = obterMarca(turma.marca);

  const { data: envioAtual } = await db()
    .from("envios")
    .select("*")
    .eq("turma_id", turmaId)
    .eq("grupo", numero)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Envio>();

  const g = GRUPOS[numero];
  const guia = GUIAS[numero];

  return (
    <div className="pagina-escura" data-marca={marca.slug}>
      <AtualizadorAutomatico />
      <header className="topo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={marca.logo} alt={marca.nome} className="logo" />
        <Link href="/turma" className="btn-fio-escuro">
          ← Voltar
        </Link>
      </header>

      <main className="miolo">
        <div className="sobe">
          <section className="coluna-passos">
            <span className="pd-seal">
              {g.nome} — {g.papel}
            </span>
            <h1>Guia do grupo</h1>
            <AssistentePassos etapas={ETAPAS} passoInicial={envioAtual ? 4 : 1}>
              <div>
                <h2>Entenda a situação</h2>
                {SITUACAO.map((paragrafo) => (
                  <p key={paragrafo}>{paragrafo}</p>
                ))}
                <p>
                  <strong>{guia.papelLongo}</strong> {guia.angulo}
                </p>
                <p className="meta">
                  Você não precisa ser desta área — os documentos falam por si, em português
                  comum.
                </p>
              </div>

              <div>
                <h2>Baixe a base da sua área</h2>
                <div className="tabela">
                  <div className="th cols-docs">
                    <span>Arquivo</span>
                    <span>O que é</span>
                  </div>
                  {guia.docs.map((doc) => (
                    <div className="tr cols-docs" key={doc.arquivo}>
                      <code className="arquivo-doc">{doc.arquivo}</code>
                      <span>{doc.descricao}</span>
                    </div>
                  ))}
                </div>
                <p className="meta">
                  Este ZIP tem os 4 documentos que representam o conhecimento da sua área,
                  incluindo seus objetivos estratégicos.
                  Eles serão usados para avaliar a vaga e os currículos baixados na Home.
                </p>
                <a className="btn-baixar" href={`/downloads/${g.zip}`} download>
                  Baixar base da área (.zip) {SETA_BAIXO}
                </a>
              </div>

              <div>
                <h2>Prepare o projeto</h2>
                <ol className="regras">
                  {PREPARACAO_PROJETO.map((passo) => (
                    <li key={passo}>{passo}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h2>Compare e enviem</h2>
                <p>
                  O projeto agora reúne o descritivo da vaga, os currículos e o conhecimento
                  disponível para a sua área. O desafio do grupo é descobrir como cruzar essas
                  informações para avaliar os candidatos e tomar uma decisão.
                </p>
                <p className="aviso">
                  Não existe prompt pronto nem sequência obrigatória. O que perguntar, quais
                  critérios usar e como conduzir a análise fazem parte do exercício.
                </p>
                <p className="meta">
                  A IA conhece somente o que está nos oito arquivos. Se faltar contexto,
                  identifiquem a lacuna em vez de inventar uma resposta.
                </p>
                <p>
                  Qualifiquem os três candidatos, escolham quem deve ser contratado e resumam
                  o porquê. Se concluírem que ninguém deve ser aprovado agora, expliquem o
                  encaminhamento.
                </p>
                <div className="tabela">
                  <div className="th cols-docs">
                    <span>Campo</span>
                    <span>O que preencher</span>
                  </div>
                  {ENTREGA.map((item) => (
                    <div className="tr cols-docs" key={item.campo}>
                      <span className="label">{item.campo}</span>
                      <span>{item.instrucao}</span>
                    </div>
                  ))}
                </div>
                <ol className="regras">
                  {REGRAS_GUIA.map((regra) => (
                    <li key={regra}>{regra}</li>
                  ))}
                </ol>
                <p><strong>Tempo: {TEMPO}.</strong></p>
                <button type="button" className="aponta-lado aponta-botao" popoverTarget="resultado">
                  Preencham o formulário
                  {SETA_DIREITA}
                </button>
              </div>
            </AssistentePassos>
            <p className="meta">
              Travou? Chame um facilitador — ele não dá a resposta; faz a pergunta.
            </p>
          </section>

        </div>
        <FormularioResultado
          grupo={numero}
          envioAtual={envioAtual}
          enviosAbertos={turma.envios_abertos}
        />
      </main>

      <footer className="pd-rule rodape">
        <span>©2026 {marca.nome}</span>
        <span>Vértice Serviços Gerenciados S.A. — caso fictício</span>
      </footer>
    </div>
  );
}
