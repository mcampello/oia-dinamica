"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { enviarResultado } from "@/app/turma/actions";
import { CANDIDATOS, type NumeroGrupo } from "@/lib/grupos";
import {
  LIMITES_RESULTADO,
  estadoInicialResultado,
  type ValoresResultado,
} from "@/lib/resultado";

type EnvioAtual = ValoresResultado & {
  id: string;
  created_at: string;
};

type Props = {
  grupo: NumeroGrupo;
  envioAtual: EnvioAtual | null;
  enviosAbertos: boolean;
};

const MENSAGENS_ERRO = {
  campos: "Preencha todos os campos — inclusive o prompt.",
  limite: "Um ou mais campos passaram do limite. Revise os contadores.",
  fechados: "Os envios foram fechados pelo facilitador. Seu texto foi preservado.",
  envio: "Não foi possível gravar. Seu texto foi preservado; tente de novo.",
} as const;

function BotaoEnviar({ habilitado }: { habilitado: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-roxo" disabled={!habilitado || pending}>
      {pending ? "Enviando…" : "Enviar resultado"}
    </button>
  );
}

function Contador({ atual, maximo }: { atual: number; maximo: number }) {
  return <span className="contador-caracteres">{atual} / {maximo}</span>;
}

export default function FormularioResultado({ grupo, envioAtual, enviosAbertos }: Props) {
  const valoresIniciais: ValoresResultado = envioAtual
    ? {
        candidato: envioAtual.candidato,
        motivo: envioAtual.motivo,
        dado: envioAtual.dado,
        faltou: envioAtual.faltou,
        prompt: envioAtual.prompt,
      }
    : { candidato: "", motivo: "", dado: "", faltou: "", prompt: "" };
  const [estado, acao] = useActionState(enviarResultado, estadoInicialResultado(valoresIniciais));
  const [valores, setValores] = useState(valoresIniciais);
  const [sujo, setSujo] = useState(false);
  const [envioCarregado, setEnvioCarregado] = useState({
    id: envioAtual?.id ?? null,
    criadoEm: envioAtual?.created_at ?? null,
  });
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
    if (estado.status !== "sucesso" || !estado.envioId || !estado.enviadoEm) return;
    setValores(estado.valores);
    setSujo(false);
    setEnvioCarregado({ id: estado.envioId, criadoEm: estado.enviadoEm });
  }, [estado]);

  useEffect(() => {
    if (!envioAtual || sujo) return;
    const atualMaisNovo =
      !envioCarregado.criadoEm ||
      new Date(envioAtual.created_at).getTime() > new Date(envioCarregado.criadoEm).getTime();
    if (!atualMaisNovo) return;
    setValores({
      candidato: envioAtual.candidato,
      motivo: envioAtual.motivo,
      dado: envioAtual.dado,
      faltou: envioAtual.faltou,
      prompt: envioAtual.prompt,
    });
    setEnvioCarregado({ id: envioAtual.id, criadoEm: envioAtual.created_at });
  }, [envioAtual, envioCarregado.criadoEm, sujo]);

  function alterar(campo: keyof ValoresResultado, valor: string) {
    setValores((atuais) => ({ ...atuais, [campo]: valor }));
    setSujo(true);
  }

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

        {envioCarregado.id && estado.status !== "sucesso" && (
          <p className="aviso aviso-ok">O último resultado deste grupo foi carregado para revisão.</p>
        )}
        {!enviosAbertos && (
          <p className="aviso" role="status">
            Os envios estão fechados. O resultado continua visível e o facilitador pode reabrir.
          </p>
        )}
        {estado.status === "sucesso" && !sujo && (
          <p className="aviso aviso-ok" role="status">
            Resultado recebido. Este é agora o envio vigente.
          </p>
        )}
        {estado.status === "erro" &&
          estado.erro &&
          (estado.erro !== "fechados" || enviosAbertos) && (
            <p className="aviso aviso-erro" role="alert">{MENSAGENS_ERRO[estado.erro]}</p>
          )}

        <form action={acao} className="form-envio" aria-disabled={!enviosAbertos}>
          <input type="hidden" name="grupo" value={grupo} />

          <div className="form-envio-campos">
            <div className="campo campo-cheio">
              <label>Candidato escolhido</label>
              <div className="opcoes" style={{ paddingTop: 7 }}>
                {Object.entries(CANDIDATOS).map(([valor, nome]) => (
                  <label key={valor} className="opcao">
                    <input
                      type="radio"
                      name="candidato"
                      value={valor}
                      checked={valores.candidato === valor}
                      onChange={(evento) => alterar("candidato", evento.target.value)}
                      disabled={!enviosAbertos}
                      required
                    />
                    {nome}
                  </label>
                ))}
              </div>
            </div>

            <CampoTexto
              id="motivo"
              label="Motivo"
              placeholder="Em até três linhas."
              valor={valores.motivo}
              maximo={LIMITES_RESULTADO.motivo}
              somenteLeitura={!enviosAbertos}
              onChange={(valor) => alterar("motivo", valor)}
            />
            <CampoTexto
              id="dado"
              label="O dado que sustenta"
              placeholder="De qual documento saiu, e qual número ou trecho."
              valor={valores.dado}
              maximo={LIMITES_RESULTADO.dado}
              somenteLeitura={!enviosAbertos}
              onChange={(valor) => alterar("dado", valor)}
            />
            <CampoTexto
              id="faltou"
              label="O que ficou faltando"
              placeholder="Que informação vocês gostariam de ter e não têm."
              valor={valores.faltou}
              maximo={LIMITES_RESULTADO.faltou}
              somenteLeitura={!enviosAbertos}
              onChange={(valor) => alterar("faltou", valor)}
            />
            <CampoTexto
              id="prompt"
              label="O prompt que vocês usaram"
              placeholder="Cole o prompt inteiro. Ele entra no fechamento — sem prompt, não vale."
              valor={valores.prompt}
              maximo={LIMITES_RESULTADO.prompt}
              somenteLeitura={!enviosAbertos}
              alto
              onChange={(valor) => alterar("prompt", valor)}
            />
          </div>

          <div className="linha-acao">
            <BotaoEnviar habilitado={enviosAbertos} />
            <span className="nota">Todos os campos apontam para os seus documentos.</span>
          </div>
        </form>
      </div>
    </div>
  );
}

function CampoTexto({
  id,
  label,
  placeholder,
  valor,
  maximo,
  somenteLeitura,
  alto = false,
  onChange,
}: {
  id: "motivo" | "dado" | "faltou" | "prompt";
  label: string;
  placeholder: string;
  valor: string;
  maximo: number;
  somenteLeitura: boolean;
  alto?: boolean;
  onChange: (valor: string) => void;
}) {
  return (
    <div className="campo campo-cheio">
      <div className="campo-rotulo">
        <label htmlFor={id}>{label}</label>
        <Contador atual={valor.length} maximo={maximo} />
      </div>
      <textarea
        id={id}
        name={id}
        style={alto ? { minHeight: 90 } : undefined}
        placeholder={placeholder}
        value={valor}
        maxLength={maximo}
        readOnly={somenteLeitura}
        onChange={(evento) => onChange(evento.target.value)}
        required
      />
    </div>
  );
}
