import Link from "next/link";
import { sessaoAdmin } from "@/lib/session";
import { db, type Turma } from "@/lib/supabase";
import { dataCurta } from "@/lib/data";
import BotaoCopiar from "@/components/BotaoCopiar";
import { MARCAS, obterMarca } from "@/lib/marcas";
import { alternarTurma, criarTurma, entrarAdmin, sairAdmin } from "./actions";

export const dynamic = "force-dynamic";

type TurmaComContagem = Turma & { envios: { count: number }[] };

export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  if (!(await sessaoAdmin())) {
    return (
      <main className="papel-login sobe">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo.svg" alt="Pandora" style={{ height: 26 }} />
        <form action={entrarAdmin}>
          <div className="campo">
            <label htmlFor="senha">Senha do facilitador</label>
            <input id="senha" name="senha" type="password" autoFocus required />
          </div>
          {erro === "1" && <p className="aviso aviso-erro">Senha incorreta.</p>}
          <div>
            <button type="submit" className="btn-ink">
              Entrar
            </button>
          </div>
        </form>
      </main>
    );
  }

  const { data: turmas } = await db()
    .from("turmas")
    .select("*, envios(count)")
    .order("created_at", { ascending: false })
    .returns<TurmaComContagem[]>();

  return (
    <>
      <header className="papel-topo">
        <div className="papel-topo-esq">
          <span className="papel-titulo">Turmas</span>
          <span className="papel-chip">dinâmica · a mesma decisão</span>
        </div>
        <form action={sairAdmin}>
          <button type="submit" className="btn-fio">
            Sair
          </button>
        </form>
      </header>

      <main className="papel-miolo">
        <section className="sobe" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h2>Nova turma</h2>
          <form
            action={criarTurma}
            style={{ display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}
          >
            <div className="campo" style={{ minWidth: 260, flex: "0 1 320px" }}>
              <label htmlFor="nome">Nome da turma</label>
              <input id="nome" name="nome" placeholder="Liderança Vetrus — ago/2026" required />
            </div>
            <div className="campo" style={{ minWidth: 140 }}>
              <label htmlFor="marca">Marca</label>
              <select id="marca" name="marca" defaultValue="pandora" required>
                {Object.entries(MARCAS).map(([slug, marca]) => (
                  <option key={slug} value={slug}>
                    {marca.nome}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-ink">
              Criar turma
            </button>
          </form>
          {erro === "criar" && (
            <p className="aviso aviso-erro">Não foi possível criar a turma. Tente de novo.</p>
          )}
          <p className="meta">
            O código é gerado na hora. Entregue à turma; todos entram com o mesmo código.
          </p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h2>Turmas criadas</h2>
          {!turmas || turmas.length === 0 ? (
            <p className="meta">Nenhuma turma ainda.</p>
          ) : (
            <div className="tabela">
              <div className="th cols-turmas">
                <span>Turma</span>
                <span>Código</span>
                <span className="oculta-mobile">Envios</span>
                <span className="oculta-mobile">Criada em</span>
                <span style={{ textAlign: "right" }}>Situação</span>
              </div>
              {turmas.map((t) => (
                <div key={t.id} className="tr cols-turmas">
                  <span>
                    <Link href={`/admin/turmas/${t.id}`}>{t.nome}</Link>{" "}
                    <span className="meta">· {obterMarca(t.marca).nome}</span>
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <code style={{ color: "var(--pd-purple)" }}>{t.codigo}</code>
                    <BotaoCopiar texto={t.codigo} rotulo="copiar" />
                  </span>
                  <span className="meta oculta-mobile">{t.envios?.[0]?.count ?? 0}</span>
                  <span className="meta oculta-mobile">{dataCurta(t.created_at)}</span>
                  <span
                    style={{
                      display: "inline-flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span className={t.ativa ? "estado" : "estado mudo"}>
                      {t.ativa ? "Ativa" : "Encerrada"}
                    </span>
                    <form action={alternarTurma}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className="btn-fio">
                        {t.ativa ? "encerrar" : "reabrir"}
                      </button>
                    </form>
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="meta">
            Encerrar uma turma desliga o código de acesso sem apagar os envios.
          </p>
        </section>
      </main>
    </>
  );
}
