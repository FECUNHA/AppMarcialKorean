# Proposal — add-modulo-quiz

> Feature: — (sem tracker) · PRD: docs/prds/app-hwarang-kumdo/PRD.md · Cobre: R16, R17, R18
> Depende de: setup-pwa-base (`golpesElegiveisQuiz()`, `track()`) e add-modulo-golpes (detalhe do golpe e armazenamento local)

## Affects

- Rota `/quiz` (placeholder de `setup-pwa-base`).
- Leitura de `golpes` e `categorias` do contrato `conteudo` — sem alteração no formato.
- Novo armazenamento local `hk:quiz:melhor` no navegador.
- Eventos de analítica `quiz_iniciado` e `quiz_concluido` (definidos em `setup-pwa-base`).
- Links do resultado para o detalhe do golpe (`/golpes/:id`, de `add-modulo-golpes`).

## Why

Associar a imagem do golpe ao nome coreano é o exercício de memorização que os alunos fazem hoje de cabeça. O quiz transforma o catálogo em prática ativa e gera os indicadores de sucesso do MVP (quizzes concluídos e média de acertos).

## What Changes

- Rodada de até 10 perguntas sorteadas sem repetição, cada uma com a imagem de um golpe e 4 alternativas embaralhadas (R16, RN03, RN05).
- Alternativas erradas preferencialmente da mesma categoria (R16, RN04) e regra de catálogo pequeno (R16, RN06).
- Feedback imediato com o nome correto em coreano e português (R17).
- Resultado com pontuação, percentual, lista de erros, "Jogar de novo", "Revisar golpes errados" e melhor pontuação salva no aparelho (R18, RN07, RN08).

## Non-goals

- Outros tipos de pergunta (nome → imagem, hangul → tradução) — candidatos a evolução.
- Ranking entre alunos e histórico de rodadas (PRD §3).
- Temporizador por pergunta.

## Capabilities

### New Capabilities

- `quiz`: rodadas de perguntas imagem → nome do golpe, com pontuação e revisão dos erros.

### Modified Capabilities

- (nenhuma)

## Impact

- Código novo em `src/modulos/quiz/`.
- Sem novas dependências.
