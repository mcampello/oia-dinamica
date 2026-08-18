# Como a Vértice Calcula o Custo de um Funcionário

**Vértice Serviços Gerenciados S.A. — Controladoria**
Método oficial · Uso interno

---

## 1. Por que o salário não é o custo

Quando alguém diz "essa pessoa ganha R$ 10.000", esse não é o custo da pessoa para a empresa. É menos da metade da conta em alguns níveis.

O custo real tem cinco partes.

### Parte 1 — Salário anual
São **13 salários** por ano: os doze meses mais o 13º.

> Fórmula: `salário mensal × 13`

### Parte 2 — Encargos e provisões
É tudo o que a empresa paga por cima do salário: as contribuições obrigatórias sobre a folha (INSS e FGTS), as férias com o adicional de um terço previsto em lei, e o dinheiro que se guarda todo mês para pagar a saída da pessoa no futuro.

Na Vértice, esse conjunto equivale a **68% do salário anual**.

> Fórmula: `salário anual × 0,68`

### Parte 3 — Benefícios
Plano de saúde, odontológico, vale-refeição, vale-transporte e seguro de vida. Na Vértice o pacote é igual para todos os níveis a partir de Especialista.

> Valor fixo: **R$ 38.400 por ano**

### Parte 4 — Bônus alvo
Bônus anual por resultado. O percentual varia por nível.

| Nível | Bônus alvo |
|---|---|
| Operação | não há |
| Especialista | 8% do salário anual |
| Coordenação | 15% do salário anual |
| **Gerência / Head** | **25% do salário anual** |
| Diretoria | 40% do salário anual |

> Fórmula: `salário anual × percentual do nível`

### Parte 5 — Valores de entrada
Quando existem. Bônus de contratação, ajuda de mudança, ou compra de bônus que a pessoa perderia ao sair do emprego atual. São pagos uma única vez, no primeiro ano.

---

## 2. A conta fechada

```
CUSTO NO PRIMEIRO ANO =
      (salário mensal × 13)
    + (salário mensal × 13 × 0,68)
    + 38.400
    + (salário mensal × 13 × percentual de bônus do nível)
    + valores de entrada, se houver
```

Nos anos seguintes, tira-se a parte 5.

---

## 3. Dois exemplos resolvidos

Use estes para conferir se o seu cálculo está batendo com o método.

### Exemplo A — Coordenador ganhando R$ 14.500

| Componente | Conta | Valor |
|---|---|---|
| Salário anual | 14.500 × 13 | R$ 188.500 |
| Encargos e provisões | 188.500 × 0,68 | R$ 128.180 |
| Benefícios | fixo | R$ 38.400 |
| Bônus alvo (Coordenação, 15%) | 188.500 × 0,15 | R$ 28.275 |
| **Custo anual** | | **R$ 383.355** |

### Exemplo B — Gerente ganhando R$ 24.600

| Componente | Conta | Valor |
|---|---|---|
| Salário anual | 24.600 × 13 | R$ 319.800 |
| Encargos e provisões | 319.800 × 0,68 | R$ 217.464 |
| Benefícios | fixo | R$ 38.400 |
| Bônus alvo (Gerência, 25%) | 319.800 × 0,25 | R$ 79.950 |
| **Custo anual** | | **R$ 655.614** |

---

## 4. Quando a pessoa já é da casa

Para quem já trabalha aqui, o que importa para o orçamento é o **custo adicional**: o custo no novo cargo menos o que a empresa já gasta hoje com essa pessoa.

> `custo adicional = custo no novo cargo − custo atual`

**Atenção:** para efeito das regras de aprovação de despesa, o que vale é o **custo total** da posição, não o custo adicional. A regra está no documento de política de aprovação.

---

## 5. Custo médio por nível na Vértice

| Nível | Custo anual médio |
|---|---|
| Operação | R$ 46.000 |
| Especialista | R$ 141.000 |
| Coordenação | R$ 371.000 |
| Gerência / Head | R$ 651.000 |

---

## 6. Outros custos que costumam ser esquecidos

| Item | Valor |
|---|---|
| Processo seletivo de liderança, com consultoria | R$ 78.000 |
| Reposição de um funcionário de Operação | R$ 8.400 |
| Equipamento e acessos de um novo líder | R$ 11.000 |
