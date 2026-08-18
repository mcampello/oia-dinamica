import FormularioEntrada from "@/components/FormularioEntrada";

export default async function Entrada({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;

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
          {motivo === "encerrada" && (
            <p className="aviso aviso-erro" role="alert">
              O facilitador encerrou esta turma. Os resultados continuam salvos.
            </p>
          )}
          <FormularioEntrada />
        </section>
      </main>

      <footer className="pd-rule rodape">
        <span>©2026 Pandora</span>
        <span>Vértice Serviços Gerenciados S.A. — caso fictício</span>
      </footer>
    </div>
  );
}
