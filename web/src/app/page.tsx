import { entrarNaTurma } from "./actions";

export default async function Entrada({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="pagina-escura">
      <header className="topo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo_dark.svg" alt="Pandora" className="logo" />
      </header>

      <main className="miolo">
        <section className="entrada-miolo sobe">
          <span className="pd-seal">Dinâmica em grupo</span>
          <h1>
            A mesma decisão,
            <br />
            quatro bases de conhecimento
          </h1>
          <p className="entrada-sub">
            A Vértice vai contratar um Head de Automação e IA. Quatro áreas recebem a
            mesma pergunta e os mesmos três currículos. O que muda é o que cada uma
            sabe.
          </p>
          <form action={entrarNaTurma} className="form-codigo">
            <div className="campo">
              <label htmlFor="codigo">Código da turma</label>
              <input
                id="codigo"
                name="codigo"
                className="input-codigo"
                placeholder="OIA-XXXX"
                autoComplete="off"
                autoFocus
                required
              />
              <span className="ajuda">O facilitador entrega o código na sala.</span>
            </div>
            {erro && (
              <p className="aviso aviso-erro">
                Código não encontrado ou turma encerrada. Confira com o facilitador.
              </p>
            )}
            <div>
              <button type="submit" className="pd-btn">
                Entrar
              </button>
            </div>
          </form>
        </section>
      </main>

      <footer className="pd-rule rodape">
        <span>©2026 Pandora</span>
        <span>Vértice Serviços Gerenciados S.A. — caso fictício</span>
      </footer>
    </div>
  );
}
