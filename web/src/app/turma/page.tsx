import { redirect } from "next/navigation";
import { sessaoTurma } from "@/lib/session";
import { db, type Envio, type Turma } from "@/lib/supabase";
import { CANDIDATOS, GRUPOS, NUMEROS_GRUPO } from "@/lib/grupos";
import { horaCurta } from "@/lib/data";
import { enviarResultado, sairDaTurma } from "./actions";

export const dynamic = "force-dynamic";

const SETA_BAIXO = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M12 4v13m0 0l-5-5m5 5l5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function PaginaTurma({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; erro?: string }>;
}) {
  const turmaId = await sessaoTurma();
  if (!turmaId) redirect("/");

  const { data: turma } = await db()
    .from("turmas")
    .select("*")
    .eq("id", turmaId)
    .maybeSingle<Turma>();
  if (!turma || !turma.ativa) redirect("/");

  const { data: envios } = await db()
    .from("envios")
    .select("*")
    .eq("turma_id", turmaId)
    .order("created_at", { ascending: false })
    .returns<Envio[]>();

  const { enviado, erro } = await searchParams;
  const grupoEnviado = enviado ? Number(enviado) : null;
  const gruposComEnvio = new Set((envios ?? []).map((e) => e.grupo));

  return (
    <div className="pagina-escura">
      <header className="topo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo_dark.svg" alt="Pandora" className="logo" />
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
            <h2>Baixe a pasta do seu grupo</h2>
            <span className="meta">Baixe só a sua — abrir a de outro grupo estraga a dinâmica.</span>
          </div>
          <div className="grade-grupos">
            {NUMEROS_GRUPO.map((n) => {
              const g = GRUPOS[n];
              return (
                <div key={n} className="bloco sobe">
                  <span className="papel">{g.nome}</span>
                  <h3>{g.papel}</h3>
                  <span className="docs">tarefa · currículos · {g.docs}</span>
                  <div className="bloco-acao">
                    <a className="btn-baixar" href={`/downloads/${g.zip}`} download>
                      Baixar material (.zip) {SETA_BAIXO}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="meta">
            Descompacte, crie um projeto na ferramenta de IA indicada pelo facilitador e
            suba os 5 arquivos. O <code>00-A-TAREFA.md</code> explica o resto. O prompt é
            de vocês — não existe roteiro.
          </p>
        </section>

        <section className="secao" id="resultado">
          <div className="secao-cabeca">
            <h2>Envie o resultado do seu grupo</h2>
            <span className="meta">Reenviou? Vale o mais recente.</span>
          </div>

          {grupoEnviado && GRUPOS[grupoEnviado as 1 | 2 | 3 | 4] && (
            <p className="aviso aviso-ok">
              Resultado do {GRUPOS[grupoEnviado as 1 | 2 | 3 | 4].nome} —{" "}
              {GRUPOS[grupoEnviado as 1 | 2 | 3 | 4].papel} recebido.
            </p>
          )}
          {erro === "campos" && (
            <p className="aviso aviso-erro">Preencha todos os campos — inclusive o prompt.</p>
          )}
          {erro === "envio" && (
            <p className="aviso aviso-erro">Não foi possível gravar. Tente de novo.</p>
          )}

          <div className="bloco-envio">
            <form action={enviarResultado} className="form-envio">
              <div className="campo">
                <label htmlFor="grupo">Seu grupo</label>
                <select id="grupo" name="grupo" required defaultValue="">
                  <option value="" disabled>
                    Escolha o grupo
                  </option>
                  {NUMEROS_GRUPO.map((n) => (
                    <option key={n} value={n}>
                      {GRUPOS[n].nome} — {GRUPOS[n].papel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
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
        <span>©2026 Pandora</span>
        <span>Vértice Serviços Gerenciados S.A. — caso fictício</span>
      </footer>
    </div>
  );
}
