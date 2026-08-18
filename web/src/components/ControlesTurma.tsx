"use client";

import { useActionState } from "react";
import {
  definirAcessoTurma,
  definirEnviosTurma,
  type EstadoControleTurma,
} from "@/app/admin/actions";

const INICIAL: EstadoControleTurma = { erro: null };

export default function ControlesTurma({
  id,
  ativa,
  enviosAbertos,
}: {
  id: string;
  ativa: boolean;
  enviosAbertos: boolean;
}) {
  const [estadoAcesso, acaoAcesso, acessoPendente] = useActionState(
    definirAcessoTurma,
    INICIAL,
  );
  const [estadoEnvios, acaoEnvios, enviosPendentes] = useActionState(
    definirEnviosTurma,
    INICIAL,
  );
  const erro = estadoAcesso.erro ?? estadoEnvios.erro;

  return (
    <div className="controles-turma">
      <div className="estados-turma">
        <span className={ativa ? "estado" : "estado mudo"}>
          {ativa ? "Acesso ativo" : "Encerrada"}
        </span>
        <span className={ativa && enviosAbertos ? "estado" : "estado mudo"}>
          {ativa && enviosAbertos ? "Envios abertos" : "Envios fechados"}
        </span>
      </div>
      <div className="acoes-turma">
        {ativa && (
          <form action={acaoEnvios}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="abertos" value={String(!enviosAbertos)} />
            <button type="submit" className="btn-fio" disabled={enviosPendentes}>
              {enviosAbertos ? "fechar envios" : "abrir envios"}
            </button>
          </form>
        )}
        <form
          action={acaoAcesso}
          onSubmit={(evento) => {
            if (
              ativa &&
              !window.confirm(
                "Encerrar a turma? Os envios serão fechados e os alunos serão redirecionados.",
              )
            ) {
              evento.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="ativa" value={String(!ativa)} />
          <button type="submit" className="btn-fio" disabled={acessoPendente}>
            {ativa ? "encerrar" : "reabrir acesso"}
          </button>
        </form>
      </div>
      {erro && <span className="aviso aviso-erro" role="alert">{erro}</span>}
    </div>
  );
}
