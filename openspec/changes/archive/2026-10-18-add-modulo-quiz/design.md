# Design — add-modulo-quiz

## Context

Usa `golpesElegiveisQuiz()` e `track()` de `setup-pwa-base` e o `armazenamento.ts` de `add-modulo-golpes` (design D3). Motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Toda a regra do quiz (RN03–RN08) em funções puras e determinísticas sob teste.
- Tela fina: um reducer conduz o fluxo.

**Non-Goals:**
- Persistir uma rodada em andamento entre aberturas do app.

## Decisions

### D1 — Geração com aleatoriedade injetável
`gerarRodada(golpes, { tamanho: 10, rng })` e `gerarAlternativas(golpe, elegiveis, rng)` recebem `rng: () => number`. Produção usa `Math.random`; testes usam um gerador com semente (mulberry32) para cenários reproduzíveis. Embaralhamento = Fisher–Yates.
*Alternativa:* `Math.random` direto. Rejeitada: tornaria RN03–RN05 não testáveis de forma determinística.

### D2 — Regras de seleção
- Elegíveis = golpes com imagem (RN01). `< 4` ⇒ quiz indisponível (RN06); `< 10` ⇒ rodada com todos os elegíveis.
- Perguntas = amostra sem reposição dos elegíveis (RN03).
- Distratores = amostra da mesma categoria sem o correto; se faltar, completa com outras categorias, sem repetir (RN04).
- As 4 alternativas são embaralhadas por pergunta (RN05).

### D3 — Máquina de estados em reducer
Estados: `inicio → pergunta(i) → respondida(i) → … → resultado`. Ações: `iniciar`, `responder(id)`, `avancar`, `jogarDeNovo`. `pontuacao = acertos` (RN07); percentual arredondado ao inteiro.

### D4 — Melhor pontuação e retorno da revisão
`hk:quiz:melhor` guarda `{ percentual, acertos, total, data }` e só é sobrescrito quando o novo percentual é maior (RN08). O resultado da última rodada fica em `sessionStorage` (`hk:quiz:ultimo`) para que voltar do detalhe do golpe reabra o resultado em vez de uma rodada nova.

### D5 — Analítica
`track('quiz_iniciado', { total })` ao iniciar e `track('quiz_concluido', { acertos, total })` ao chegar no resultado — sem dados do aluno (RNF8).

### D6 — Acessibilidade da correção
Alternativas são `<button>` em um grupo; após responder ficam `disabled` e a correção é anunciada por uma região `aria-live="polite"` com "Certo"/"Errado" + nome correto; certo/errado usam ícone e texto além da cor (RNF6).

## Risks / Trade-offs

- [Com os 5 golpes de exemplo a rodada tem 5 perguntas e os distratores se repetem entre perguntas] → esperado até a lista oficial (PRD C1); não é falha.
- [Percentual arredondado pode empatar recordes] → empate não sobrescreve (RN08 fala em "superar").
