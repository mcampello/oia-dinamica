import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { enviarResultado } from "@/app/turma/actions";
import AssistentePassos from "@/components/AssistentePassos";
import { db } from "@/lib/supabase";
import { sessaoTurma } from "@/lib/session";
import { CANDIDATOS, GRUPOS, isNumeroGrupo } from "@/lib/grupos";
import { obterMarca } from "@/lib/marcas";
import {
  DICAS_PROMPT,
  ENTREGA,
  GUIAS,
  PASSOS,
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
  { id: "material", titulo: "Baixe o material" },
  { id: "ia", titulo: "Converse com a IA" },
  { id: "envio", titulo: "Decidam e enviem" },
];

export default async function PaginaGrupo({
  params,
  searchParams,
}: {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ enviado?: string; erro?: string }>;
}) {
  const numero = Number((await params).n);
  if (!isNumeroGrupo(numero)) notFound();

  const turmaId = await sessaoTurma();
  if (!turmaId) redirect("/");

  const { data: turma } = await db()
    .from("turmas")
    .select("id, marca")
    .eq("id", turmaId)
    .eq("ativa", true)
    .maybeSingle();
  if (!turma) redirect("/");
  const marca = obterMarca(turma.marca);

  const g = GRUPOS[numero];
  const guia = GUIAS[numero];
  const { enviado, erro } = await searchParams;

  return (
    <div className="pagina-escura" data-marca={marca.slug}>
      <header className="topo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={marca.logo} alt={marca.nome} className="logo" />
        <Link href="/turma" className="btn-fio-escuro">
          ← Voltar
        </Link>
      </header>

      <main className="miolo miolo-amplo">
        <div className="duas-colunas sobe">
          <section className="coluna-passos">
            <span className="pd-seal">
              {g.nome} — {g.papel}
            </span>
            <h1>Guia do grupo</h1>
            <AssistentePassos etapas={ETAPAS} passoInicial={enviado || erro ? 4 : 1}>
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
                <h2>Baixe o material</h2>
                <div className="tabela">
                  <div className="th cols-docs">
                    <span>Arquivo</span>
                    <span>O que é</span>
                  </div>
                  {guia.docs.map((doc) => (
                    <div className="tr cols-docs" key={doc.arquivo}>
                      <code className="arquivo-doc">{doc.arquivo}</code>
                      <span>
                        {doc.descricao}
                        {doc.igualParaTodos && (
                          <span className="meta"> Igual para todos os grupos.</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="meta">
                  Esses documentos são a base de conhecimento da sua área. O que precisarem
                  concluir terá de sair deles.
                </p>
                <a className="btn-baixar" href={`/downloads/${g.zip}`} download>
                  Baixar material (.zip) {SETA_BAIXO}
                </a>
              </div>

              <div>
                <h2>Converse com a IA</h2>
                <ol className="regras">
                  {PASSOS.map((passo) => (
                    <li key={passo}>{passo}</li>
                  ))}
                </ol>
                <ul className="dicas-guia">
                  {DICAS_PROMPT.map((dica) => (
                    <li key={dica}>{dica}</li>
                  ))}
                </ul>
                <p className="meta">O prompt é de vocês — não existe roteiro pronto.</p>
              </div>

              <div>
                <h2>Decidam e enviem</h2>
                <p>
                  Escolham um dos três candidatos e digam por quê. Se concluírem que nenhum
                  deve ser contratado agora, expliquem o encaminhamento.
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
                <a href="#resultado" className="aponta-lado">
                  Preencham o formulário
                  <span className="so-desktop"> ao lado</span>
                  <span className="so-mobile"> abaixo</span>
                  {SETA_DIREITA}
                </a>
              </div>
            </AssistentePassos>
            <p className="meta">
              Travou? Chame um facilitador — ele não dá a resposta; faz a pergunta.
            </p>
          </section>

          <aside className="coluna-lateral coluna-fixa" id="resultado">
            <div className="bloco-envio">
              <div className="secao-cabeca">
                <h2>O que entregar</h2>
                <span className="meta">Reenviou? Vale o mais recente.</span>
              </div>

              {enviado === "1" && (
                <p className="aviso aviso-ok">
                  Resultado do {g.nome} — {g.papel} recebido.
                </p>
              )}
              {erro === "campos" && (
                <p className="aviso aviso-erro">Preencha todos os campos — inclusive o prompt.</p>
              )}
              {erro === "envio" && (
                <p className="aviso aviso-erro">Não foi possível gravar. Tente de novo.</p>
              )}

              <form action={enviarResultado} className="form-envio">
                <input type="hidden" name="grupo" value={numero} />
                <input type="hidden" name="origem" value="grupo" />

              <div className="campo campo-cheio">
                <label>Candidato escolhido</label>
                <div className="opcoes" style={{ paddingTop: 7 }}>
                  {Object.entries(CANDIDATOS).map(([valor, nome]) => (
                    <label key={valor} className="opcao">
                      <input type="radio" name="candidato" value={valor} required />
                      {nome}
                    </label>
                  ))}
                </div>
              </div>

              <div className="campo campo-cheio">
                <label htmlFor="motivo">Motivo</label>
                <textarea
                  id="motivo"
                  name="motivo"
                  placeholder="Em até três linhas."
                  required
                />
              </div>

              <div className="campo campo-cheio">
                <label htmlFor="dado">O dado que sustenta</label>
                <textarea
                  id="dado"
                  name="dado"
                  placeholder="De qual documento saiu, e qual número ou trecho."
                  required
                />
              </div>

              <div className="campo campo-cheio">
                <label htmlFor="faltou">O que ficou faltando</label>
                <textarea
                  id="faltou"
                  name="faltou"
                  placeholder="Que informação vocês gostariam de ter e não têm."
                  required
                />
              </div>

              <div className="campo campo-cheio">
                <label htmlFor="prompt">O prompt que vocês usaram</label>
                <textarea
                  id="prompt"
                  name="prompt"
                  style={{ minHeight: 90 }}
                  placeholder="Cole o prompt inteiro. Ele entra no fechamento — sem prompt, não vale."
                  required
                />
              </div>

              <div className="linha-acao">
                <button type="submit" className="btn-roxo">
                  Enviar resultado
                </button>
                <span className="nota">Todos os campos apontam para os seus documentos.</span>
              </div>
              </form>
            </div>
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
