import { CANDIDATOS, GRUPOS, NUMEROS_GRUPO, NumeroGrupo } from "./grupos";
import type { Envio } from "./supabase";

export function quantidadeGruposComEnvio(envios: Array<Pick<Envio, "grupo">>): number {
  return new Set(envios.map((envio) => envio.grupo)).size;
}

// O envio mais recente de cada grupo é a resposta vigente.
export function vigentes(envios: Envio[]): Map<NumeroGrupo, Envio> {
  const mapa = new Map<NumeroGrupo, Envio>();
  const ordenados = [...envios].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  for (const envio of ordenados) {
    const grupo = envio.grupo as NumeroGrupo;
    if (!mapa.has(grupo)) mapa.set(grupo, envio);
  }
  return mapa;
}

// Texto pronto para colar no projeto do facilitador, junto com o arquivo
// Regras-e-Estrategia-da-Vertice.md. As cinco seções vêm do Roteiro do
// Facilitador; as respostas entram inline no lugar dos quatro documentos.
export function montarPromptCruzamento(envios: Envio[]): {
  texto: string;
  gruposSemEnvio: NumeroGrupo[];
} {
  const respostas = vigentes(envios);
  const gruposSemEnvio = NUMEROS_GRUPO.filter((n) => !respostas.has(n));

  const blocos = NUMEROS_GRUPO.map((n) => {
    const g = GRUPOS[n];
    const cabecalho = `=== RESPOSTA DA ÁREA: ${g.papel.toUpperCase()} (${g.nome}) ===`;
    const envio = respostas.get(n);
    if (!envio) return `${cabecalho}\n(este grupo não enviou resposta)`;
    return [
      cabecalho,
      `Candidato escolhido: ${CANDIDATOS[envio.candidato] ?? envio.candidato}`,
      `Motivo: ${envio.motivo}`,
      `O dado que sustenta: ${envio.dado}`,
      `O que ficou faltando: ${envio.faltou}`,
      `Prompt que o grupo usou:`,
      envio.prompt,
    ].join("\n");
  });

  const texto = `Você tem abaixo a recomendação de quatro áreas da Vértice sobre a mesma
contratação, e um documento no projeto com as regras e a direção
estratégica da empresa que nenhuma das áreas conhecia.

Cada área respondeu com base apenas na base de conhecimento dela.

${blocos.join("\n\n")}

Com isso em mãos:

1. MAPA — para cada área: quem ela escolheu, o argumento central,
   e qual informação ela NÃO tinha e que teria mudado a resposta dela.

2. CHOQUES — onde as áreas se contradizem. Para cada contradição,
   diga qual das duas se sustenta quando as regras da empresa entram,
   e por quê.

3. CADA CANDIDATO CONTRA AS REGRAS — passe Rafael, Aline e Juliana por
   todas as regras do documento estratégico. Diga o que elimina cada um,
   citando a regra.

4. O ENCAMINHAMENTO — proponha a decisão que aproveita o que há de
   legítimo nas quatro leituras. Mostre explicitamente qual pedaço de
   qual área sobreviveu em cada parte da proposta.

5. O QUE NINGUÉM VIU — o que só apareceu porque as quatro leituras
   e as regras estavam na mesma mesa.

Regras: não invente dado. Se algo não está nos documentos, diga que não
está. Cite a origem de cada afirmação.`;

  return { texto, gruposSemEnvio };
}
