# Proposal — add-modulo-videos

> Feature: — (sem tracker) · PRD: docs/prds/app-hwarang-kumdo/PRD.md · Cobre: R11, R13, R14, R15, RNF7
> Depende de: setup-pwa-base e add-modulo-golpes (usa o `SlotVideoGolpe` do detalhe do golpe)

## Affects

- Rotas `/videos` e `/videos/:id` (placeholders de `setup-pwa-base`).
- Tela de detalhe do golpe: implementa o `SlotVideoGolpe` criado em `add-modulo-golpes` (R11).
- Leitura de `videos` e `categorias` do contrato `conteudo` — sem alteração no formato.
- Domínios externos: `www.youtube-nocookie.com` (player) e `i.ytimg.com` (miniaturas).

## Why

Ver a técnica em movimento complementa o nome e a imagem estática. A academia já tem vídeos no YouTube, mas espalhados; o app os organiza por categoria e liga cada golpe ao seu vídeo.

## What Changes

- Lista de vídeos com miniatura, título, duração e categoria (R13).
- Reprodução no player oficial incorporado do YouTube, sem sair do app (R14, RNF7).
- Aviso "Conecte-se para assistir" sem internet, na aba Vídeos e no detalhe do golpe (RN10).
- Filtro por categoria, incluindo História e Treinos (R15, desejável).
- Vídeo relacionado no detalhe do golpe, quando houver (R11, desejável).

## Non-goals

- Baixar ou guardar vídeos para uso offline (RN09).
- Upload de vídeos próprios (PRD §3).
- Seleção dos vídeos de produção — é conteúdo (PRD C3); a change usa vídeos de exemplo.

## Capabilities

### New Capabilities

- `videos`: lista e reprodução de vídeos do YouTube por categoria e o vídeo relacionado a cada golpe.

### Modified Capabilities

- (nenhuma)

## Impact

- Código novo em `src/modulos/videos/` e implementação de `SlotVideoGolpe` em `src/modulos/golpes/`.
- Carrega a IFrame Player API do YouTube sob demanda (só com internet).
- O service worker não deve pré-cachear nada do YouTube.
