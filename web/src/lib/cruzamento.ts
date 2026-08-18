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
      `Resumo da recomendação: ${envio.motivo}`,
      `O dado que sustenta: ${envio.dado}`,
      `Perguntas que ficaram abertas: ${envio.faltou}`,
      `Racional da decisão:`,
      envio.racional || "[não informado — envio anterior à mudança do formulário]",
    ].join("\n");
  });

  const texto = `Você é o agente de alinhamento do Comitê Executivo da Vértice.

No projeto estão cinco arquivos de conhecimento:
- o descritivo da vaga de Head de Automação e Inteligência Artificial, fonte do objetivo, das responsabilidades e dos requisitos da contratação;
- os três currículos completos, um de Rafael, um de Aline e um de Juliana, fonte dos fatos sobre os candidatos;
- as regras e a direção estratégica da Vértice, camada de decisão que nenhuma área conhecia.

Abaixo estão as recomendações das quatro áreas. Cada uma respondeu usando apenas os
currículos e a própria base de conhecimento. Trate essas respostas como leituras parciais,
não como uma nova fonte de fatos. Quando houver conflito, confira os currículos e aplique
as regras estratégicas.

${blocos.join("\n\n")}

Conduza o trabalho em três rodadas e respeite os bloqueios entre elas.

RODADA 1 — ENTREVISTA (comece aqui)

Sua primeira resposta deve conter SOMENTE UMA PERGUNTA ao facilitador.
Não apresente introdução, mapa, resumo, análise, comparação, alternativa,
mérito ou problema de qualquer candidato. Não diga quem parece melhor.

Depois de cada resposta do facilitador, faça somente a próxima pergunta.
Priorize perguntas cuja resposta poderia mudar a decisão. Faça no máximo
cinco perguntas, uma por mensagem, e aguarde cada resposta.

Não avance até o facilitador escrever exatamente: PODE MAPEAR.

RODADA 2 — MAPA (somente depois de PODE MAPEAR)

1. Mostre os argumentos, pressupostos e informações ausentes de cada área.
2. Identifique choques sem escolher automaticamente um lado.
3. Apresente pelo menos duas alternativas defensáveis, com condições e riscos.
4. Termine com o que ainda precisaria ser respondido.

Não recomende uma decisão. Aguarde o facilitador escrever exatamente:
PODE RECOMENDAR.

RODADA 3 — RECOMENDAÇÃO (somente depois de PODE RECOMENDAR)

1. Registre quais perguntas foram respondidas e quais continuam abertas.
2. Compare candidatos e eventuais soluções em fases contra os documentos.
3. Recomende um encaminhamento, explicitando pressupostos e condições.
4. Mostre uma alternativa e qual informação faria a recomendação mudar.
5. Explique o que surgiu apenas ao juntar as quatro leituras e as regras.

Regras: não invente dado. Se algo não está nos documentos, diga que não
está. Diferencie fato do currículo, leitura da área e regra estratégica.
Cite a origem de cada afirmação.`;

  return { texto, gruposSemEnvio };
}
