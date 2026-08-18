export type NumeroGrupo = 1 | 2 | 3 | 4;

export const GRUPOS: Record<
  NumeroGrupo,
  { nome: string; papel: string; zip: string; docs: string }
> = {
  1: {
    nome: "Grupo 1",
    papel: "Gestão de Pessoas",
    zip: "grupo-1-pessoas.zip",
    docs: "objetivos estratégicos · quadro e cargos · fit cultural · liderança e clima",
  },
  2: {
    nome: "Grupo 2",
    papel: "Financeiro",
    zip: "grupo-2-financeiro.zip",
    docs: "objetivos estratégicos · orçamento e vagas · custo de pessoal · aprovação de despesa",
  },
  3: {
    nome: "Grupo 3",
    papel: "Jurídico",
    zip: "grupo-3-juridico.zip",
    docs: "objetivos estratégicos · vínculos e cláusulas · contingências · verificação dos candidatos",
  },
  4: {
    nome: "Grupo 4",
    papel: "Operações",
    zip: "grupo-4-operacoes.zip",
    docs: "objetivos estratégicos · mapa da operação · exigências dos clientes · roadmap de automação",
  },
};

export const NUMEROS_GRUPO: NumeroGrupo[] = [1, 2, 3, 4];

export function isNumeroGrupo(numero: number): numero is NumeroGrupo {
  return NUMEROS_GRUPO.includes(numero as NumeroGrupo);
}

export const CANDIDATOS: Record<string, string> = {
  rafael: "Rafael D'Ávila",
  aline: "Aline Ferraz",
  juliana: "Juliana Setúbal",
  nenhum: "Nenhum agora",
};
