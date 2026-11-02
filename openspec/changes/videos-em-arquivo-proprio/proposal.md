# Proposal — videos-em-arquivo-proprio

> Feature: — (sem tracker; pedido do PO em 2026-11-02) · PRD: docs/prds/app-hwarang-kumdo/PRD.md · Cobre: R3, R13

## Affects

- Contrato de conteúdo: os vídeos saem de `public/conteudo/conteudo.json` e passam para um arquivo próprio, `public/conteudo/videos.json`, cadastrado por **link do YouTube**.
- Carregamento do conteúdo (provider) e validação do curador (`npm run validate:conteudo`, prebuild).
- Módulo Vídeos (lista, filtro, tela do vídeo) e a seção "Vídeo" do detalhe do golpe — mesma aparência e fluxo; o endereço da tela do vídeo passa a usar o id do YouTube (`/videos/<id>`).
- Sem change pareada em outro repositório.

## Why

Hoje, para incluir um vídeo, o curador edita o arquivo grande de conteúdo e precisa extrair à mão o id de 11 caracteres do link, inventar um id interno e manter a ligação com o golpe em dois lugares (`video_id` no golpe e `golpe_id` no vídeo). Os vídeos mudam com mais frequência que a história e os golpes; um arquivo só deles, em que basta colar o link do YouTube, reduz erro e o risco de quebrar o resto do conteúdo ao editar a lista.

## What Changes

- Novo arquivo `public/conteudo/videos.json` com a lista de vídeos: link do YouTube (qualquer formato comum: `watch?v=`, `youtu.be/`, `shorts/`, `embed/`, com ou sem `&t=`), título, categoria, duração opcional e golpe relacionado opcional.
- O app lê esse arquivo junto com o conteúdo; um problema nele afeta só o módulo Vídeos, que mostra o erro e permite tentar de novo.
- A validação do curador passa a checar `videos.json`: link inválido, categoria inexistente, golpe inexistente e vídeo repetido falham com mensagem que aponta a entrada.
- **BREAKING (conteúdo):** o campo `videos` de `conteudo.json` deixa de ser lido; os 2 vídeos atuais migram para `videos.json`. A ligação golpe → vídeo passa a ser declarada só no vídeo.

## Non-goals

- Buscar título ou duração automaticamente no YouTube (exigiria rede no build ou chave de API).
- Começar o vídeo no tempo do link (`&t=`); o tempo é aceito no link mas ignorado.
- Playlists ou canais inteiros.

## Capabilities

### New Capabilities

- (nenhuma)

### Modified Capabilities

- `conteudo`: o conteúdo passa a vir de dois arquivos versionados (conteúdo e vídeos); novas regras de validação do arquivo de vídeos; falha no arquivo de vídeos isolada no módulo Vídeos.

## Impact

- Código: `src/conteudo/` (schema, provider), `scripts/validar-conteudo.ts`, `src/modulos/videos/`, `src/modulos/golpes/SlotVideoGolpe.tsx`.
- Conteúdo: `public/conteudo/videos.json` (novo) e `public/conteudo/conteudo.json` (sem `videos`).
- README: seção do curador passa a explicar `videos.json`.
- Sem dependências novas.
