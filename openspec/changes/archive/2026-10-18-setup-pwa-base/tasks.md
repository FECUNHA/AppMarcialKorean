# Tasks — setup-pwa-base

## 1. Projeto e ferramentas

- [x] 1.1 Criar o projeto Vite React TS com ESLint, Vitest (jsdom), Testing Library e Playwright; declarar os scripts `lint`, `test`, `build`, `test:e2e` e verificar que `npm run lint && npm test && npm run build` passam com um teste-semente
- [x] 1.2 Adicionar `@axe-core/playwright` com o helper `expectSemViolacoes(page)` e `@lhci/cli` com `lighthouserc` (instalabilidade + LCP ≤ 3000 ms) e verificar que os dois rodam contra o build

## 2. Tela inicial e barra de abas (R1, R2)

- [x] 2.1 Teste primeiro — seam: render do router em `MemoryRouter`: a rota `/` mostra os 4 módulos e cada link navega para `/historia`, `/golpes`, `/videos`, `/quiz`; verificar que falha (R1)
- [x] 2.2 Implementar a tela inicial e telas placeholder dos 4 módulos e verificar o teste 2.1 verde (R1)
- [x] 2.3 Teste primeiro — seam: layout raiz: a barra mostra 4 abas, marca `aria-current="page"` na ativa e troca de módulo ao clicar; verificar que falha (R2)
- [x] 2.4 Implementar o layout com a barra inferior fixa e verificar o teste 2.3 verde (R2)
- [x] 2.5 Teste e2e `@smoke` "navega pelos 4 módulos pela barra" + `expectSemViolacoes` na tela inicial; implementar ajustes de contraste e alvos de 44 px até passar (R2, RNF6)

## 3. Contrato e validação do conteúdo (R3, RNF4)

- [x] 3.1 Teste primeiro — seam: `schema.ts` (unidade): golpe sem `nome_pt` falha com `golpe <id>: campo nome_pt ausente`; golpe sem imagem passa e fica não elegível ao quiz; romanização com hangul falha; verificar que falha (R3)
- [x] 3.2 Implementar o schema Zod do design D3 e o seletor `golpesElegiveisQuiz()`; verificar o teste 3.1 verde (R3)
- [x] 3.3 Teste primeiro — seam: `scripts/validar-conteudo.ts` sobre fixtures: imagem de 350 KB falha com arquivo e tamanho; imagem 800 × 600 falha com dimensões; conteúdo válido passa; verificar que falha (RNF4)
- [x] 3.4 Implementar o script com `image-size`, ligá-lo ao `prebuild` e verificar o teste 3.3 verde e `npm run build` falhando com um golpe incompleto (R3, RNF4)
- [x] 3.5 Teste primeiro — seam: `ConteudoProvider` com fetch mockado: estados `carregando → pronto`; JSON corrompido → mensagem "Não foi possível carregar o conteúdo" com botão "Tentar de novo"; verificar que falha (R3)
- [x] 3.6 Implementar `ConteudoProvider`/`useConteudo()` e verificar o teste 3.5 verde (R3)
- [x] 3.7 Montar `public/conteudo/conteudo.json` com os 6 capítulos de `docs/conteudo-inicial/historia.md`, os 5 golpes de `docs/conteudo-inicial/golpes-exemplo.json` e as imagens de `docs/conteudo-inicial/imagens/`; verificar `npm run validate:conteudo` verde (R3)

## 4. PWA, offline e atualização (RNF1, RNF2, RNF9)

- [x] 4.1 Teste primeiro — e2e `@smoke` offline: carregar o app, `setOffline(true)`, recarregar e abrir `/`, `/historia`, `/golpes`, `/quiz` sem erro e com imagens; verificar que falha (RNF2)
- [x] 4.2 Configurar vite-plugin-pwa (manifest, ícones 192/512, `autoUpdate`, precache e `navigateFallback` do design D4) e verificar o teste 4.1 verde e a auditoria de instalabilidade do Lighthouse passando (RNF1, RNF2)
- [x] 4.3 Teste e2e de atualização: servir o build A, abrir o app, trocar para o build B com `conteudo.json` alterado, recarregar duas vezes e verificar que o conteúdo de B aparece (RNF9)

## 5. Tipografia, desempenho e analítica (RNF3, RNF5, RNF8)

- [x] 5.1 Teste primeiro — seam: estilos globais no jsdom: `font-family` inclui Noto Sans KR e o `font-size` base é ≥ 16 px; verificar que falha (RNF5)
- [x] 5.2 Adicionar `@fontsource/noto-sans-kr` (400/700) e os estilos base; verificar o teste 5.1 verde e o hangul de exemplo renderizado no e2e sem caractere substituto (RNF5)
- [x] 5.3 Rodar o Lighthouse CI no build e ajustar até LCP ≤ 3000 ms no perfil mobile; registrar o resultado no README (RNF3)
- [x] 5.4 Teste primeiro — seam: `track()` com provedor espião: o payload de `modulo_aberto` tem só evento, módulo e data; com rede falhando não lança erro; verificar que falha (RNF8)
- [x] 5.5 Implementar `track()` com provedor no-op padrão e o disparo de `modulo_aberto` na troca de aba; verificar o teste 5.4 verde (RNF8)

## 6. Documentação do projeto

- [x] 6.1 Escrever o README (como rodar, scripts, como o curador edita `conteudo.json` e roda `npm run validate:conteudo`) e verificar que os comandos documentados rodam como escritos
