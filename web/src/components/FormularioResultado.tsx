"use client";

import { useEffect, useRef } from "react";
import { enviarResultado } from "@/app/turma/actions";
import { CANDIDATOS } from "@/lib/grupos";

type Props = {
  numeroGrupo: number;
  nomeGrupo: string;
  papelGrupo: string;
  enviado?: string;
  erro?: string;
};

export default function FormularioResultado({
  numeroGrupo,
  nomeGrupo,
  papelGrupo,
  enviado,
  erro,
}: Props) {
  const lightbox = useRef<HTMLDivElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const focoAnterior = useRef<HTMLElement | null>(null);
  const elementosInertes = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!lightbox.current) return;
    const elemento: HTMLDivElement = lightbox.current;

    function restaurarPagina() {
      elementosInertes.current.forEach((item) => {
        item.removeAttribute("inert");
      });
      elementosInertes.current = [];
    }

    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key !== "Tab" || !elemento.matches(":popover-open")) return;

      const focaveis = Array.from(
        elemento.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((item) => item.getClientRects().length > 0);
      const primeiro = focaveis[0];
      const ultimo = focaveis.at(-1);
      if (!primeiro || !ultimo) return;

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    function aoAlternar() {
      if (elemento.matches(":popover-open")) {
        focoAnterior.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;

        let atual: HTMLElement = elemento;
        while (atual.parentElement) {
          Array.from(atual.parentElement.children).forEach((irmao) => {
            if (irmao instanceof HTMLElement && irmao !== atual && !irmao.hasAttribute("inert")) {
              irmao.setAttribute("inert", "");
              elementosInertes.current.push(irmao);
            }
          });
          atual = atual.parentElement;
        }

        requestAnimationFrame(() => botaoFechar.current?.focus());
        return;
      }

      restaurarPagina();
      focoAnterior.current?.focus();
      focoAnterior.current = null;
    }

    elemento.addEventListener("toggle", aoAlternar);
    elemento.addEventListener("keydown", aoPressionarTecla);
    return () => {
      elemento.removeEventListener("toggle", aoAlternar);
      elemento.removeEventListener("keydown", aoPressionarTecla);
      restaurarPagina();
    };
  }, []);

  useEffect(() => {
    if (!(enviado || erro) || !lightbox.current?.showPopover) return;
    if (!lightbox.current.matches(":popover-open")) lightbox.current.showPopover();
  }, [enviado, erro]);

  return (
    <div
      ref={lightbox}
      id="resultado"
      className="lightbox-resultado"
      popover="auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resultado-titulo"
    >
      <div className="bloco-envio">
        <div className="secao-cabeca lightbox-cabeca">
          <div>
            <h2 id="resultado-titulo">O que entregar</h2>
            <span className="meta">Reenviou? Vale o mais recente.</span>
          </div>
          <button
            ref={botaoFechar}
            type="button"
            className="lightbox-fechar"
            popoverTarget="resultado"
            popoverTargetAction="hide"
            aria-label="Fechar formulário"
          >
            ×
          </button>
        </div>

        {enviado === "1" && (
          <p className="aviso aviso-ok">
            Resultado do {nomeGrupo} — {papelGrupo} recebido.
          </p>
        )}
        {erro === "campos" && (
          <p className="aviso aviso-erro">Preencha todos os campos — inclusive o prompt.</p>
        )}
        {erro === "envio" && (
          <p className="aviso aviso-erro">Não foi possível gravar. Tente de novo.</p>
        )}

        <form action={enviarResultado} className="form-envio">
          <input type="hidden" name="grupo" value={numeroGrupo} />
          <input type="hidden" name="origem" value="grupo" />

          <div className="form-envio-campos">
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
              <textarea id="motivo" name="motivo" placeholder="Em até três linhas." required />
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
          </div>

          <div className="linha-acao">
            <button type="submit" className="btn-roxo">
              Enviar resultado
            </button>
            <span className="nota">Todos os campos apontam para os seus documentos.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
