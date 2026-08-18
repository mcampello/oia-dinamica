export const MARCAS = {
  pandora: { nome: "Pandora", logo: "/brand/logo_dark.svg" },
  tera: { nome: "Tera", logo: "/brand/tera/logo.png" },
  echos: { nome: "Echos", logo: "/brand/echos/logo.svg" },
} as const;

export type MarcaSlug = keyof typeof MARCAS;

export function obterMarca(valor: unknown) {
  const slug: MarcaSlug =
    typeof valor === "string" && Object.hasOwn(MARCAS, valor)
      ? (valor as MarcaSlug)
      : "pandora";

  return { slug, ...MARCAS[slug] };
}
