import type { NumeroGrupo } from "./grupos";

export type DocGuia = {
  arquivo: string;
  descricao: string;
  igualParaTodos?: boolean;
};

export type GuiaGrupo = {
  papelLongo: string;
  angulo: string;
  docs: DocGuia[];
};

const TAREFA: DocGuia = {
  arquivo: "00-A-TAREFA.md",
  descricao: "O contexto, a tarefa, a entrega e as regras da dinâmica.",
};

const CURRICULOS: DocGuia = {
  arquivo: "Dinamica-Curriculos-dos-tres-finalistas.md",
  descricao: "Os três candidatos.",
  igualParaTodos: true,
};

export const GUIAS: Record<NumeroGrupo, GuiaGrupo> = {
  1: {
    papelLongo: "Você é a liderança de Gestão de Pessoas.",
    angulo:
      "Sua área enxerga a decisão pelo quadro de pessoas, pelo desenho do cargo, pelo fit cultural e pelo histórico de liderança e clima.",
    docs: [
      TAREFA,
      CURRICULOS,
      {
        arquivo: "Dinamica-P1-quadro-de-pessoal-e-cargos.md",
        descricao: "Quem trabalha na Vértice, em que nível, e quanto se paga em cada faixa.",
      },
      {
        arquivo: "Dinamica-P2-descricao-do-cargo-e-fit-cultural.md",
        descricao: "O descritivo da vaga e o guia de avaliação de fit cultural da casa.",
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
      "Sua área enxerga a decisão pelo orçamento, pelo custo de uma contratação e pelas regras de aprovação de despesas.",
    docs: [
      TAREFA,
      CURRICULOS,
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
      "Sua área enxerga a decisão pelos vínculos e cláusulas, pelas contingências e pela checagem contratual dos candidatos.",
    docs: [
      TAREFA,
      CURRICULOS,
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
      "Sua área enxerga a decisão pelo mapa da operação, pelas exigências técnicas dos clientes e pelo roadmap de automação.",
    docs: [
      TAREFA,
      CURRICULOS,
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

export const PASSOS = [
  "Baixem e descompactem a pasta do seu grupo.",
  "Criem um projeto na ferramenta de IA indicada pelo facilitador.",
  "Subam os 5 arquivos da pasta no projeto.",
  "Escrevam o próprio prompt e conversem com a IA usando somente esses documentos.",
  "Decidam em grupo, preencham a entrega e enviem o resultado nesta página.",
];

export const ENTREGA = [
  { campo: "Candidato escolhido", instrucao: "Rafael, Aline, Juliana — ou nenhum." },
  { campo: "Motivo", instrucao: "Em até três linhas." },
  {
    campo: "O dado que sustenta",
    instrucao: "De qual documento saiu, e qual número ou trecho.",
  },
  {
    campo: "O que ficou faltando",
    instrucao: "Que informação vocês gostariam de ter e não têm.",
  },
  { campo: "Prompt", instrucao: "O prompt inteiro que o grupo usou." },
];

export const REGRAS_GUIA = [
  "Só os seus documentos. Nada de internet, nada de conhecimento de mercado, nada de número inventado.",
  "Toda conclusão aponta para um dado. De onde saiu.",
  "Se faltar informação, declare. Não estime.",
];

export const DICAS_PROMPT = [
  "Diga à IA qual é o papel do seu grupo e qual decisão vocês precisam tomar.",
  "Peça que cruze informações entre os documentos, em vez de analisar cada arquivo isoladamente.",
  "Exija a origem de cada afirmação: documento, número ou trecho.",
  "Defina o formato que você quer receber, como tabela, comparação ou lista de critérios.",
  "Peça que a IA declare o que não está nos documentos e o que ainda falta saber.",
];

export const TEMPO = "25 minutos";
