"use client";

import { useState, type ReactNode } from "react";
import { limitarPasso, registrarVisita } from "./passoAssistente";

export type EtapaAssistente = {
  id: string;
  titulo: string;
};

type Props = {
  etapas: EtapaAssistente[];
  passoInicial: number;
  children: ReactNode[];
};

const Seta = () => (
  <svg className="trilha-seta" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path d="M5 12h14m0 0l-5-5m5 5l-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AssistentePassos({ etapas, passoInicial, children }: Props) {
  const [passo, setPasso] = useState(() => limitarPasso(passoInicial, etapas.length));
  const [visitados, setVisitados] = useState<Set<number>>(
    () => new Set([limitarPasso(passoInicial, etapas.length)]),
  );

  function irParaPasso(numero: number) {
    const proximo = limitarPasso(numero, etapas.length);
    setVisitados((atuais) => registrarVisita(atuais, proximo));
    setPasso(proximo);
  }

  return (
    <>
      <nav className="trilha-passos" aria-label="Etapas do guia">
        {etapas.map((etapa, indice) => {
          const numero = indice + 1;
          return (
            <span key={etapa.id} className="trilha-item">
              {indice > 0 && <Seta />}
              <button
                type="button"
                className="trilha-passo"
                aria-current={passo === numero ? "step" : undefined}
                data-concluido={numero !== passo && visitados.has(numero)}
                onClick={() => irParaPasso(numero)}
              >
                <span className="passo-num">{numero}</span>
                {etapa.titulo}
              </button>
            </span>
          );
        })}
      </nav>

      <div className="painel-passo">
        <span className="meta">Passo {passo} de {etapas.length}</span>
        {children[passo - 1]}
      </div>

      <div className="assistente-nav">
        <button
          type="button"
          className="btn-fio-escuro"
          disabled={passo === 1}
          onClick={() => irParaPasso(passo - 1)}
        >
          ← Anterior
        </button>
        {passo < etapas.length ? (
          <button type="button" className="btn-roxo" onClick={() => irParaPasso(passo + 1)}>
            Próximo →
          </button>
        ) : (
          <a href="#resultado" className="btn-roxo">
            Preencher o formulário →
          </a>
        )}
      </div>
    </>
  );
}
