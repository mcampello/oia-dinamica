"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AtualizadorAutomatico({ intervalo = 5000 }: { intervalo?: number }) {
  const router = useRouter();

  useEffect(() => {
    function atualizarSeVisivel() {
      if (document.visibilityState === "visible") router.refresh();
    }

    const timer = window.setInterval(atualizarSeVisivel, intervalo);
    document.addEventListener("visibilitychange", atualizarSeVisivel);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", atualizarSeVisivel);
    };
  }, [intervalo, router]);

  return null;
}
