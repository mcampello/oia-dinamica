"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { entrarNaTurma, type EstadoEntrada } from "@/app/actions";

const ESTADO_INICIAL: EstadoEntrada = { codigo: "", erro: null };

const MENSAGENS = {
  formato: "Digite os quatro caracteres do código, com ou sem o prefixo OIA.",
  inexistente: "Código não encontrado. Confira com o facilitador.",
  encerrada: "Esta turma já foi encerrada. Fale com o facilitador.",
  indisponivel: "Não foi possível consultar a turma agora. Tente novamente.",
} as const;

function BotaoEntrar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="pd-btn" disabled={pending}>
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export default function FormularioEntrada() {
  const [estado, acao] = useActionState(entrarNaTurma, ESTADO_INICIAL);
  const [codigo, setCodigo] = useState("");

  return (
    <form action={acao} className="form-codigo">
      <div className="campo">
        <label htmlFor="codigo">Código da turma</label>
        <input
          id="codigo"
          name="codigo"
          className="input-codigo"
          placeholder="OIA-XXXX"
          autoComplete="off"
          autoCapitalize="characters"
          autoFocus
          maxLength={12}
          value={codigo}
          onChange={(evento) => setCodigo(evento.target.value)}
          aria-invalid={Boolean(estado.erro)}
          required
        />
        <span className="ajuda">O facilitador entrega o código na sala.</span>
      </div>
      {estado.erro && (
        <p className="aviso aviso-erro" role="alert">
          {MENSAGENS[estado.erro]}
        </p>
      )}
      <div>
        <BotaoEntrar />
      </div>
    </form>
  );
}
