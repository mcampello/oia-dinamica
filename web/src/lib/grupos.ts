export type NumeroGrupo = 1 | 2 | 3 | 4;

export const GRUPOS: Record<
  NumeroGrupo,
  { nome: string; papel: string; zip: string; docs: string }
> = {
  1: {
    nome: "Grupo 1",
    papel: "Gestão de Pessoas",
    zip: "grupo-1-pessoas.zip",
    docs: "quadro de pessoal e cargos · descrição do cargo e fit cultural · histórico de liderança e clima",
  },
  2: {
    nome: "Grupo 2",
    papel: "Financeiro",
    zip: "grupo-2-financeiro.zip",
    docs: "orçamento e quadro de vagas · como se calcula o custo de um funcionário · política de aprovação de despesa",
  },
  3: {
    nome: "Grupo 3",
    papel: "Jurídico",
    zip: "grupo-3-juridico.zip",
    docs: "tipos de vínculo e cláusulas · mapa de contingências · verificação contratual dos candidatos",
  },
  4: {
    nome: "Grupo 4",
    papel: "Operações",
    zip: "grupo-4-operacoes.zip",
    docs: "mapa da operação · exigências técnicas dos clientes · roadmap de automação",
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
