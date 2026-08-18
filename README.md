# A mesma decisão, quatro bases de conhecimento

Dinâmica em grupo sobre **IA e contexto**: quatro grupos recebem exatamente a mesma pergunta e exatamente os mesmos três currículos. O que muda entre eles é a base de conhecimento — os documentos que cada diretoria teria no drive dela.

## O caso

A **Vértice Serviços Gerenciados S.A.** (1.140 funcionários, 14 contratos ativos) vai criar um cargo novo: **Head de Automação e Inteligência Artificial**. O processo seletivo terminou com três finalistas, e o Comitê Executivo decide em 5 dias. Antes, chamou quatro áreas — Pessoas, Financeiro, Jurídico e Operações — e fez a mesma pergunta a todas: **qual dos três contratar, e por quê?**

Cada grupo faz o papel de uma dessas áreas, usando uma ferramenta de IA, o descritivo da vaga, os três currículos comuns aos grupos e a base da própria área.

## Primeiro: baixe o descritivo da vaga

[Baixe o descritivo de Head de Automação e Inteligência Artificial](https://github.com/mcampello/oia-dinamica/releases/latest/download/Descritivo-da-vaga-Head-de-Automacao-e-IA.md). Ele informa a missão, as responsabilidades e os requisitos usados para avaliar os finalistas.

## Depois: baixe os currículos

Cada finalista tem seu próprio currículo completo:

- [Currículo 1 — Rafael D'Ávila](https://github.com/mcampello/oia-dinamica/releases/latest/download/Curriculo-1-Rafael-DAvila.md)
- [Currículo 2 — Aline Ferraz](https://github.com/mcampello/oia-dinamica/releases/latest/download/Curriculo-2-Aline-Ferraz.md)
- [Currículo 3 — Juliana Setúbal](https://github.com/mcampello/oia-dinamica/releases/latest/download/Curriculo-3-Juliana-Setubal.md)

Baixe os três arquivos para enviá-los à IA junto com a base da sua área.

## Por fim: baixe a base do seu grupo

**Baixe só a sua.** Abrir a pasta de outro grupo — ou a do facilitador — estraga a dinâmica para todo mundo.

| Grupo | Papel | Download |
|---|---|---|
| Grupo 1 | Gestão de Pessoas | [grupo-1-pessoas.zip](https://github.com/mcampello/oia-dinamica/releases/latest/download/grupo-1-pessoas.zip) |
| Grupo 2 | Financeiro | [grupo-2-financeiro.zip](https://github.com/mcampello/oia-dinamica/releases/latest/download/grupo-2-financeiro.zip) |
| Grupo 3 | Jurídico | [grupo-3-juridico.zip](https://github.com/mcampello/oia-dinamica/releases/latest/download/grupo-3-juridico.zip) |
| Grupo 4 | Operações | [grupo-4-operacoes.zip](https://github.com/mcampello/oia-dinamica/releases/latest/download/grupo-4-operacoes.zip) |

Cada ZIP contém **4 documentos da área**: seus objetivos estratégicos e três fontes com dados, regras e histórico para avaliar os candidatos.

## Como participar

1. Baixe o descritivo da vaga.
2. Baixe os três arquivos de currículo, um para cada finalista.
3. Baixe e descompacte o ZIP do seu grupo. São **4 arquivos** com a base de conhecimento da área.
4. Crie um **projeto** na ferramenta de IA indicada pelo facilitador e suba o descritivo, os 3 currículos e os 4 documentos da área.
5. Decidam em grupo como consultar essa base, quais documentos cruzar e quais critérios devem pesar na avaliação dos candidatos.
6. Conversem com o modelo até chegar a uma recomendação fundamentada nos dados disponíveis.
7. Decidam, preencham a entrega e enviem o resultado pela interface da turma.

Não existe prompt pronto. Descobrir como usar o conhecimento da área para chegar a uma decisão faz parte do exercício.

Três regras valem para todos: só os seus documentos (nada de internet nem conhecimento de mercado), toda conclusão aponta para um dado, e informação que faltar se declara — não se estima.

## A interface (turmas com código)

Em [`web/`](web/) vive a interface da dinâmica (Next.js + Supabase, deploy na Vercel): a turma entra com um código entregue pelo facilitador, baixa o material comum e o material do seu grupo e envia o resultado na mesma tela. O facilitador cria turmas e acompanha os envios em `/admin`. No detalhe da turma fica o kit do agente de alinhamento: descritivo da vaga, currículos, regras estratégicas e um prompt pronto que incorpora automaticamente a resposta vigente dos quatro grupos.

Para rodar local: `cd web && npm install`, copie `.env.example` para `.env.local` com as chaves do Supabase, e `npm run dev`. A migration do banco está em `web/supabase/migrations/`.

## Para facilitadores

O material de condução está em [`Facilitador (não distribuir)/`](Facilitador%20(n%C3%A3o%20distribuir)/) — roteiro minuto a minuto, prompt de cruzamento e o documento de regras da empresa usado no fechamento. **Participante: não abra.** Você só perderia a melhor parte.

Os quatro ZIPs, o descritivo da vaga e os três arquivos de currículo são regenerados automaticamente a cada push na `main` (workflow em `.github/workflows/gerar-zips.yml`) e publicados como assets da release `downloads` — não há nada para atualizar à mão.
