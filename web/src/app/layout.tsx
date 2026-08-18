import type { Metadata } from "next";
import "./colors_and_type.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "A mesma decisão — dinâmica Vértice",
  description:
    "Quatro grupos, a mesma pergunta, os mesmos três currículos — e bases de conhecimento diferentes.",
  icons: { icon: "/brand/pandora_ico.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Inter:wght@400;500&family=Sora:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
