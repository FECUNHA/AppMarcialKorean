# Design — add-modulo-videos

## Context

Usa `useConteudo()` (`setup-pwa-base`) e o `SlotVideoGolpe` (`add-modulo-golpes`, design D4). Motivação em proposal.md. É a única change que depende de serviço externo (YouTube).

## Goals / Non-Goals

**Goals:**
- Um componente `PlayerYoutube` único, usado na tela do vídeo e no detalhe do golpe.
- Estado de conexão reativo, sem recarregar o app.

**Non-Goals:**
- Lista de reprodução, autoplay do próximo vídeo, legendas próprias.

## Decisions

### D1 — IFrame Player API em modo nocookie
`PlayerYoutube` carrega `https://www.youtube.com/iframe_api` sob demanda (uma vez) e cria o player com `host: 'https://www.youtube-nocookie.com'`, `playsinline: 1`, `rel: 0`. O evento `onError` (códigos 2, 5, 100, 101, 150) troca o player por "Este vídeo não está disponível".
*Alternativa:* `<iframe>` simples. Rejeitada: não informa erro de vídeo removido ou bloqueado, e o cenário "Vídeo indisponível" ficaria sem prova.

### D2 — Conexão reativa
Hook `useOnline()` baseado em `navigator.onLine` + eventos `online`/`offline`. Offline ⇒ `AvisoSemInternet` no lugar da lista e de cada player (RN10).
*Trade-off:* `navigator.onLine` pode ser `true` em rede sem saída; nesse caso a miniatura falha e o `onError`/timeout do player mostra o aviso de indisponível.

### D3 — Miniatura e duração
Miniatura = `https://i.ytimg.com/vi/<youtube_id>/hqdefault.jpg` com `loading="lazy"`. `duracao` (ISO 8601, ex. `PT4M12S`) é formatada por `formatarDuracao()` → `4:12` / `1:02:05`.

### D4 — Fora do precache
O Workbox exclui `youtube.com`, `youtube-nocookie.com` e `ytimg.com` (sem `runtimeCaching` para eles), garantindo RN09.

### D5 — Rotas e filtro
`/videos?categoria=historia` (mesmo padrão de URL do módulo Golpes) e `/videos/:id` com o player e o título. Categorias do filtro = `categorias` cujo `aplica_a` inclui `videos`.

## Risks / Trade-offs

- [YouTube muda a IFrame API ou bloqueia o domínio nocookie] → `PlayerYoutube` isolado num componente; troca em um lugar só.
- [Testes dependem de rede externa] → unidade e integração usam um `PlayerYoutube` falso; só um e2e opcional (`@externo`, fora do `@smoke`) toca o YouTube real.

## Open Questions

- PRD C3 — lista de vídeos de produção (conteúdo; não muda código).
