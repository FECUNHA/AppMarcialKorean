# Tasks — add-modulo-quiz

## 1. Geração da rodada (R16)

- [x] 1.1 Teste primeiro — seam: `gerarRodada()` com rng de semente (unidade): 30 elegíveis ⇒ 10 perguntas sem repetição; 5 elegíveis + 2 sem imagem ⇒ 5 perguntas, nenhuma sem imagem; 3 elegíveis ⇒ indisponível; verificar que falha (R16)
- [x] 1.2 Implementar `gerarRodada()` e o rng injetável (design D1, D2); verificar o teste 1.1 verde (R16)
- [x] 1.3 Teste primeiro — seam: `gerarAlternativas()` (unidade): categoria com 6 ⇒ 3 distratores da mesma categoria; categoria com 1 ⇒ distratores de outras, sem repetir; sempre 4 alternativas com exatamente 1 correta e ordem variando com a semente; verificar que falha (R16)
- [x] 1.4 Implementar `gerarAlternativas()` com Fisher–Yates; verificar o teste 1.3 verde (R16)

## 2. Tela inicial do quiz e indisponibilidade (R16, R18)

- [x] 2.1 Teste primeiro — seam: render de `/quiz`: com 3 elegíveis mostra "O quiz precisa de pelo menos 4 golpes com imagem" e "Iniciar" desabilitado; com melhor pontuação salva mostra "Melhor pontuação: 70%"; verificar que falha (R16, R18)
- [x] 2.2 Implementar a tela inicial do quiz lendo `hk:quiz:melhor`; verificar o teste 2.1 verde (R16, R18)

## 3. Pergunta e correção (R16, R17)

- [x] 3.1 Teste primeiro — seam: reducer (unidade) `iniciar → responder → avancar` e render da pergunta: imagem com `alt` + 4 botões; resposta errada marca a escolha como errada, destaca "머리치기 · Meori chigi — Corte na cabeça", bloqueia as alternativas, anuncia "Errado" na região `aria-live` e libera "Próxima"; verificar que falha (R17)
- [x] 3.2 Implementar o reducer e a tela da pergunta (design D3, D6); verificar o teste 3.1 verde (R16, R17)

## 4. Resultado, revisão e recorde (R18)

- [x] 4.1 Teste primeiro — seam: render do resultado com rodada de fixture 7/10: "7/10", "70%", 3 golpes errados com link para `/golpes/:id`; "Revisar golpes errados" abre o primeiro errado e voltar reabre o resultado; rodada sem erros não mostra o botão; "Jogar de novo" gera nova rodada; verificar que falha (R18)
- [x] 4.2 Implementar a tela de resultado e o `hk:quiz:ultimo` em `sessionStorage` (design D4); verificar o teste 4.1 verde (R18)
- [x] 4.3 Teste primeiro — seam: `registrarMelhor()` (unidade): 60% → 70% grava; 80% → 70% mantém; empate mantém; armazenamento indisponível não lança; verificar que falha (R18)
- [x] 4.4 Implementar `registrarMelhor()` sobre `armazenamento.ts`; verificar o teste 4.3 verde (R18)

## 5. Analítica (RNF8)

- [x] 5.1 Teste primeiro — seam: reducer + `track` espião: `quiz_iniciado` com `{ total }` e `quiz_concluido` com `{ acertos, total }`, sem outros campos; verificar que falha (RNF8)
- [x] 5.2 Disparar os eventos (design D5); verificar o teste 5.1 verde (RNF8)

## 6. Integração

- [x] 6.1 E2e `@smoke` offline após o 1º acesso: iniciar o quiz, responder todas as perguntas, ver o resultado, revisar um golpe errado, voltar e jogar de novo; rodar `expectSemViolacoes` na pergunta respondida e no resultado e verificar que passa (R16, R17, R18, RNF2, RNF6)
