# Tasks — add-modulo-videos

## 1. Lista de vídeos (R13)

- [x] 1.1 Teste primeiro — seam: `formatarDuracao()` (unidade: `PT4M12S` → `4:12`, `PT1H2M5S` → `1:02:05`) e render de `/videos` com fixture: miniatura com `alt`, título, duração e categoria; verificar que falha (R13)
- [x] 1.2 Implementar a lista de vídeos (design D3) e excluir os domínios do YouTube do precache (design D4); verificar o teste 1.1 verde e o `sw.js` gerado sem URLs do YouTube (R13)

## 2. Player e indisponibilidade (R14, RNF7)

- [x] 2.1 Teste primeiro — seam: `PlayerYoutube` com a IFrame API simulada: cria o player com host `youtube-nocookie.com`; `onError` 150 mostra "Este vídeo não está disponível"; verificar que falha (R14)
- [x] 2.2 Implementar `PlayerYoutube` (design D1) e a tela `/videos/:id`; verificar o teste 2.1 verde (R14)

## 3. Sem internet (R14)

- [x] 3.1 Teste primeiro — seam: `useOnline()` com eventos `offline`/`online` disparados no jsdom e render de `/videos`: offline mostra "Conecte-se para assistir"; ao voltar online a lista aparece sem recarregar; verificar que falha (R14)
- [x] 3.2 Implementar `useOnline()` e `AvisoSemInternet` (design D2); verificar o teste 3.1 verde (R14)

## 4. Filtro por categoria (R15)

- [x] 4.1 Teste primeiro — seam: `filtrarVideos()` (unidade) e render com `?categoria=historia`: só vídeos de História; o seletor mostra só categorias com `aplica_a` contendo `videos`; verificar que falha (R15)
- [x] 4.2 Implementar o filtro ligado à URL (design D5); verificar o teste 4.1 verde (R15)

## 5. Vídeo no detalhe do golpe (R11)

- [x] 5.1 Teste primeiro — seam: render de `/golpes/:id` com `PlayerYoutube` falso: golpe com `video_id` mostra a seção "Vídeo"; sem `video_id` não mostra; offline mostra "Conecte-se para assistir" e o restante do detalhe; verificar que falha (R11)
- [x] 5.2 Implementar o `SlotVideoGolpe` usando `PlayerYoutube` e `useOnline()`; verificar o teste 5.1 verde (R11)

## 6. Integração

- [x] 6.1 E2e `@smoke` com rede bloqueada para o YouTube: lista renderiza, filtro História funciona, aba Vídeos offline mostra o aviso e os outros módulos seguem navegáveis; rodar `expectSemViolacoes` na lista e no detalhe do vídeo e verificar que passa (R13, R14, R15, RNF6)
- [x] 6.2 E2e `@externo` (fora do gate de fumaça): abrir um vídeo real e verificar que o iframe aponta para `youtube-nocookie.com` (RNF7)
