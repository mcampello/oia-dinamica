"use client";

import { useState } from "react";

export default function BotaoCopiar({
  texto,
  rotulo,
  className = "btn-fio",
}: {
  texto: string;
  rotulo: string;
  className?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await navigator.clipboard.writeText(texto);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }}
    >
      {copiado ? "Copiado" : rotulo}
    </button>
  );
}
