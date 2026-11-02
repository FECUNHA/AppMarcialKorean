# Tasks — redesign-visual-doodle

## 1. Fontes e tokens (RNF5, RNF6)

- [ ] 1.1 Teste primeiro — seam: estilos globais no jsdom (`src/styles.test.ts`): `body` usa a pilha `'Delius Swash Caps', 'Noto Sans KR', …` com font-size ≥ 16 px; `:lang(ko)` põe `Noto Sans KR` primeiro; `:root` define os tokens `--cor-primaria: #49B6E5`, `--cor-secundaria: #263D5B`, `--cor-texto: #111827`; verificar que falha (RNF5, RNF6)
- [ ] 1.2 Adicionar `@fontsource/delius-swash-caps` e `@fontsource/jetbrains-mono` (subset latino, locais) em `src/fontes.css` e os tokens do design D1 em `src/styles.css`; verificar o teste 1.1 verde e o build com as fontes no precache (RNF5, RNF6)

## 2. Casca no estilo Doodle (RNF6)

- [ ] 2.1 Teste primeiro — e2e `@smoke` de identidade visual: na tela inicial o `h1` usa Delius Swash Caps, o cartão de módulo e a aba ativa têm borda de 2 px escura e `box-shadow` sólido deslocado, e o foco por teclado num cartão mostra `outline` visível; verificar que falha (RNF6)
- [ ] 2.2 Aplicar papel pontilhado, traço irregular, sombra sólida e estados hover/focus-visible/active (design D2, D3) na tela inicial, barra de abas, botões, campos e avisos; verificar o 2.1 verde e `expectSemViolacoes` + alvos ≥ 44 px da casca ainda verdes (RNF6)
- [ ] 2.3 Atualizar `theme_color`/`background_color` do manifest e regerar os ícones com `scripts/gerar-icones.ts` (design D5); verificar o ícone gerado e a auditoria de instalabilidade do Lighthouse passando (RNF1)

## 3. Módulos no estilo Doodle (RNF5, RNF6)

- [ ] 3.1 Teste primeiro — e2e: hangul ao lado da fonte manuscrita (nome do golpe no detalhe: o `lang="ko"` em Noto Sans KR, a romanização em Delius Swash Caps) e axe sem violações em lista e detalhe de História, Golpes e Vídeos e na pergunta respondida do quiz; verificar que falha (RNF5, RNF6)
- [ ] 3.2 Aplicar o estilo a cartões de golpe e de vídeo, capítulos, filtros, detalhe do golpe, player/avisos de vídeo, alternativas certa/errada e resultado do quiz (rótulos de duração, faixa, progresso e categoria em JetBrains Mono); verificar o 3.1 verde (RNF5, RNF6)

## 4. Verificação final

- [ ] 4.1 Rodar `npm run lighthouse` e ajustar até LCP ≤ 3000 ms e instalabilidade passando; atualizar a tabela de desempenho do README e verificar lint/test/build/e2e verdes (RNF3)
