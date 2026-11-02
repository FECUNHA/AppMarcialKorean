# Tasks — videos-em-arquivo-proprio

## 1. Link do YouTube e formato do arquivo (R13)

- [x] 1.1 Teste primeiro — seam: `extrairIdYoutube()` (unidade): `watch?v=…&t=5s`, `youtu.be/…`, `shorts/…`, `embed/…`, `m.youtube.com`, `youtube-nocookie.com/embed/…` devolvem o id de 11 caracteres; `vimeo.com/…`, playlist sem `v=` e texto qualquer devolvem `null`; verificar que falha (R13)
- [x] 1.2 Implementar `extrairIdYoutube()` (design D2); verificar o 1.1 verde (R13)
- [x] 1.3 Teste primeiro — seam: `validarVideos(dados, conteudo)` (unidade): arquivo válido vira vídeos internos com `id` = id do YouTube e `golpe_id`; sem duração passa; link inválido falha com `vídeo #2: link do YouTube inválido (<url>)`; categoria que não aplica a vídeos, golpe inexistente e vídeo repetido falham indicando a posição; verificar que falha (R13)
- [x] 1.4 Implementar o schema de `videos.json` e `validarVideos()`, tirar `videos` do schema de `conteudo.json` e `video_id` do golpe, e tornar `duracao` opcional (design D1, D4, D5); verificar o 1.3 verde e os testes de schema existentes ajustados e verdes (R3, R13)

## 2. Carregamento isolado (R3)

- [x] 2.1 Teste primeiro — seam: `ConteudoProvider` com fetch mockado para os dois arquivos: busca os dois em paralelo e expõe `conteudo.videos`; `videos.json` quebrado ⇒ `pronto` com `videos: []` e `videosIndisponiveis`; `conteudo.json` quebrado ⇒ `erro` como hoje; verificar que falha (R3)
- [x] 2.2 Implementar a busca dupla no provider (design D3); verificar o 2.1 verde (R3)
- [x] 2.3 Teste primeiro — seam: render de `/videos` com `videosIndisponiveis`: "Não foi possível carregar os vídeos" + "Tentar de novo" refaz a busca e mostra a lista; render de `/golpes` no mesmo estado funciona; vídeo sem duração não mostra o selo de duração; verificar que falha (R3, R13)
- [x] 2.4 Implementar o aviso no módulo Vídeos, a duração opcional na lista e na tela do vídeo, e o `SlotVideoGolpe` procurando o vídeo pelo `golpe_id` (design D5); verificar o 2.3 e os testes de vídeos/golpes existentes ajustados e verdes (R3, R11, R13)

## 3. Curador e migração (R3, R13)

- [x] 3.1 Teste primeiro — seam: `scripts/validar-conteudo.ts` sobre fixtures: `videos.json` válido passa; link inválido, ausência do arquivo e JSON quebrado falham com mensagem que cita `videos.json`/a posição; verificar que falha (R13)
- [x] 3.2 Ligar `videos.json` ao script (design D4), criar `public/conteudo/videos.json` com os 2 vídeos atuais pelos links originais e retirar `videos` de `conteudo.json`; verificar o 3.1 verde e `npm run validate:conteudo` verde (R3, R13)
- [x] 3.3 Atualizar o e2e de vídeos para servir `videos.json` de teste e o README (seção do curador: como cadastrar um vídeo colando o link); verificar `npm run test:e2e` verde e o exemplo do README validando como escrito (R13)
