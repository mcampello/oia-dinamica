# A mesma decisão, quatro bases de conhecimento

Dinâmica em grupo sobre **IA e contexto**: quatro grupos recebem exatamente a mesma pergunta e exatamente os mesmos três currículos. O que muda entre eles é a base de conhecimento — os documentos que cada diretoria teria no drive dela.

## O caso

A **Vértice Serviços Gerenciados S.A.** (1.140 funcionários, 14 contratos ativos) vai criar um cargo novo: **Head de Automação e Inteligência Artificial**. O processo seletivo terminou com três finalistas, e o Comitê Executivo decide em 5 dias. Antes, chamou quatro áreas — Pessoas, Financeiro, Jurídico e Operações — e fez a mesma pergunta a todas: **qual dos três contratar, e por quê?**

Cada grupo faz o papel de uma dessas áreas, usando uma ferramenta de IA e apenas os documentos da própria pasta.

## Baixe a pasta do seu grupo

**Baixe só a sua.** Abrir a pasta de outro grupo — ou a do facilitador — estraga a dinâmica para todo mundo.

| Grupo | Papel | Download |
|---|---|---|
| Grupo 1 | Gestão de Pessoas | [grupo-1-pessoas.zip](https://github.com/mcampello/oia-dinamica/raw/main/downloads/grupo-1-pessoas.zip) |
| Grupo 2 | Financeiro | [grupo-2-financeiro.zip](https://github.com/mcampello/oia-dinamica/raw/main/downloads/grupo-2-financeiro.zip) |
| Grupo 3 | Jurídico | [grupo-3-juridico.zip](https://github.com/mcampello/oia-dinamica/raw/main/downloads/grupo-3-juridico.zip) |
| Grupo 4 | Operações | [grupo-4-operacoes.zip](https://github.com/mcampello/oia-dinamica/raw/main/downloads/grupo-4-operacoes.zip) |

## Como participar

1. Baixe e descompacte o ZIP do seu grupo. São **5 arquivos**: a tarefa, os currículos e três documentos da sua área.
2. Crie um **projeto** na ferramenta de IA que o facilitador indicar e **suba os 5 arquivos**.
3. Leia o `00-A-TAREFA.md` — ele explica a situação, o que entregar e as regras.
4. Vocês escrevem o próprio prompt. Não existe roteiro: a forma de perguntar faz parte do exercício.

Três regras valem para todos: só os seus documentos (nada de internet nem conhecimento de mercado), toda conclusão aponta para um dado, e informação que faltar se declara — não se estima.

## A interface (turmas com código)

Em [`web/`](web/) vive a interface da dinâmica (Next.js + Supabase, deploy na Vercel): a turma entra com um código entregue pelo facilitador, baixa o material do seu grupo e envia o resultado na mesma tela. O facilitador cria turmas e acompanha os envios em `/admin`, incluindo o prompt de cruzamento pronto para o fechamento.

Para rodar local: `cd web && npm install`, copie `.env.example` para `.env.local` com as chaves do Supabase, e `npm run dev`. A migration do banco está em `web/supabase/migrations/`.

## Para facilitadores

O material de condução está em [`Facilitador (não distribuir)/`](Facilitador%20(n%C3%A3o%20distribuir)/) — roteiro minuto a minuto, prompt de cruzamento e o documento de regras da empresa usado no fechamento. **Participante: não abra.** Você só perderia a melhor parte.

Alterou algum documento de grupo? Regere os ZIPs com `./ferramentas/gerar-zips.sh` antes de commitar.
