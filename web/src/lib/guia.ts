import type { NumeroGrupo } from "./grupos";

export type DocGuia = {
  arquivo: string;
  descricao: string;
};

export type GuiaGrupo = {
  papelLongo: string;
  angulo: string;
  docs: DocGuia[];
};

export const GUIAS: Record<NumeroGrupo, GuiaGrupo> = {
  1: {
    papelLongo: "Você é a liderança de Gestão de Pessoas.",
    angulo:
      "Sua área prioriza mobilidade interna, retenção, capacidade em IA e equidade, considerando também o quadro, o fit cultural e o histórico de liderança.",
    docs: [
      {
        arquivo: "Dinamica-P0-objetivos-estrategicos-de-pessoas.md",
        descricao: "O que Gestão de Pessoas precisa alcançar em 2026 e como mede progresso.",
      },
      {
        arquivo: "Dinamica-P1-quadro-de-pessoal-e-cargos.md",
        descricao: "Quem trabalha na Vértice, em que nível, e quanto se paga em cada faixa.",
      },
      {
        arquivo: "Dinamica-P2-fit-cultural-e-origem-dos-requisitos.md",
        descricao: "Como a casa avalia fit cultural e de onde vieram os requisitos da vaga.",
      },
      {
        arquivo: "Dinamica-P3-historico-de-lideranca-e-clima.md",
        descricao: "O que aconteceu com quem virou líder aqui, e o que a pesquisa de clima diz.",
      },
    ],
  },
  2: {
    papelLongo: "Você é a liderança de Financeiro.",
    angulo:
      "Sua área prioriza margem, caixa e investimento sustentável, considerando também o custo da contratação e as regras de aprovação.",
    docs: [
      {
        arquivo: "Dinamica-F0-objetivos-estrategicos-do-financeiro.md",
        descricao: "O que o Financeiro precisa proteger, financiar e medir em 2026.",
      },
      {
        arquivo: "Dinamica-F1-orcamento-2026-e-quadro-de-vagas.md",
        descricao: "O orçamento do ano, o que foi aprovado e como está o caixa.",
      },
      {
        arquivo: "Dinamica-F2-como-se-calcula-o-custo-de-um-funcionario.md",
        descricao: "O método da casa para calcular quanto uma pessoa custa de verdade.",
      },
      {
        arquivo: "Dinamica-F3-politica-de-aprovacao-de-despesa.md",
        descricao: "Quem aprova o quê, e as regras para gasto fora do previsto.",
      },
    ],
  },
  3: {
    papelLongo: "Você é a liderança de Jurídico.",
    angulo:
      "Sua área prioriza viabilizar IA com governança e reduzir riscos evitáveis, considerando vínculos, contingências e impedimentos.",
    docs: [
      {
        arquivo: "Dinamica-J0-objetivos-estrategicos-do-juridico.md",
        descricao: "O que o Jurídico precisa viabilizar e quais riscos pretende reduzir em 2026.",
      },
      {
        arquivo: "Dinamica-J1-tipos-de-vinculo-e-clausulas.md",
        descricao: "As formas de contratar alguém no Brasil e as cláusulas que aparecem nos contratos.",
      },
      {
        arquivo: "Dinamica-J2-mapa-de-contingencias.md",
        descricao: "Os processos que a Vértice tem hoje e quanto custaram os casos passados.",
      },
      {
        arquivo: "Dinamica-J3-verificacao-contratual-dos-candidatos.md",
        descricao: "A checagem de documentos que o Jurídico fez nos três finalistas.",
      },
    ],
  },
  4: {
    papelLongo: "Você é a liderança de Operações.",
    angulo:
      "Sua área prioriza renovações, escala de novos produtos e capacidade reutilizável, considerando a operação, os clientes e o roadmap.",
    docs: [
      {
        arquivo: "Dinamica-O0-objetivos-estrategicos-de-operacoes.md",
        descricao: "O que Operações precisa entregar e escalar em 2026.",
      },
      {
        arquivo: "Dinamica-O1-mapa-da-operacao.md",
        descricao: "Os 14 contratos, o tamanho de cada um e os sistemas que rodam por baixo.",
      },
      {
        arquivo: "Dinamica-O2-exigencias-tecnicas-dos-clientes.md",
        descricao: "O que os clientes exigem por contrato de quem toca projeto de automação.",
      },
      {
        arquivo: "Dinamica-O3-roadmap-de-automacao.md",
        descricao: "O que a área quer automatizar, em que ordem, e o que já foi tentado.",
      },
    ],
  },
};

export const SITUACAO = [
  "A Vértice presta serviços de atendimento ao cliente e backoffice — o trabalho administrativo de bastidor — para grandes empresas. São 1.140 funcionários e 14 contratos ativos.",
  "A empresa vai criar um cargo novo: Head de Automação e Inteligência Artificial, a pessoa que vai liderar a automação das operações. O processo seletivo terminou com três finalistas. O Comitê Executivo decide em 5 dias.",
  "O Comitê chamou as quatro áreas — Pessoas, Financeiro, Jurídico e Operações — e fez a mesma pergunta a todas: qual dos três contratar, e por quê?",
];

export const PREPARACAO_PROJETO = [
  "Baixem e descompactem a pasta do seu grupo.",
  "Criem um projeto na ferramenta de IA indicada pelo facilitador.",
  "Subam no mesmo projeto o descritivo da vaga, os 3 currículos e os 4 documentos da área.",
  "Expliquem ao modelo que precisam avaliar quem contratar para a vaga descrita e que os três currículos são as candidaturas finalistas.",
  "A partir daqui, o modelo conhece a vaga, os candidatos e os dados disponíveis para a sua área. O grupo decide como usar esse conhecimento.",
];

export const ENTREGA = [
  { campo: "Candidato escolhido", instrucao: "Rafael, Aline, Juliana — ou nenhum." },
  {
    campo: "Resumo da recomendação",
    instrucao: "Qualifiquem os três candidatos e resumam por que escolheram o indicado.",
  },
  {
    campo: "O dado que sustenta",
    instrucao: "De qual documento saiu, e qual número ou trecho.",
  },
  {
    campo: "Perguntas que ficaram abertas",
    instrucao: "O que a conversa revelou e que os documentos não permitem responder.",
  },
  {
    campo: "Racional da decisão",
    instrucao: "Como o grupo ponderou os critérios, as tensões e as condições da escolha.",
  },
];

export const REGRAS_GUIA = [
  "Só os seus documentos. Nada de internet, nada de conhecimento de mercado, nada de número inventado.",
  "Toda conclusão aponta para um dado. De onde saiu.",
  "Se faltar informação, declare. Não estime.",
];

export const TEMPO = "25 minutos";
