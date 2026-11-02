# Design — videos-em-arquivo-proprio

## Context

Hoje `conteudo.json` traz `videos[]` com `id`, `youtube_id`, `titulo`, `duracao` (obrigatória), `categoria` e `golpe_id`; golpes podem ter `video_id`. O `ConteudoProvider` busca um arquivo e valida com o schema Zod de `src/conteudo/schema.ts`, que também roda no `scripts/validar-conteudo.ts` (prebuild). Os módulos leem `conteudo.videos` do mesmo objeto. Motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Módulos de vídeo e o detalhe do golpe continuam lendo `conteudo.videos` no mesmo formato interno — a mudança fica no carregamento e na validação.
- Mensagens de erro do curador que apontam a posição do vídeo no arquivo.

**Non-Goals:**
- Cache diferente para `videos.json` (entra no precache como qualquer JSON — é texto, não vídeo; RN09 segue atendida).

## Decisions

### D1 — Formato de `public/conteudo/videos.json`
```json
{
  "videos": [
    { "url": "https://www.youtube.com/watch?v=2mG4A7Sr1fU&t=5s", "titulo": "...", "categoria": "treinos", "duracao": "PT10M7S", "golpe": "meori-chigi" }
  ]
}
```
Objeto com a chave `videos` (e não um array solto) para poder ganhar campos depois sem quebrar o formato. `duracao` (ISO 8601) e `golpe` são opcionais.

### D2 — Id do vídeo = id do YouTube
`extrairIdYoutube(url)` aceita `youtube.com/watch?v=`, `m.`/`music.youtube.com`, `youtube-nocookie.com/embed/`, `youtu.be/`, `/shorts/`, `/embed/`, `/live/`, ignorando `t`, `si`, `list` e outros parâmetros; devolve os 11 caracteres ou `null`. O id interno do vídeo (rota `/videos/:id`) passa a ser esse id — o curador não inventa id e duplicata vira erro de validação.
*Alternativa:* manter `id` manual. Rejeitada: é o campo que mais gera erro e não agrega para o aluno.

### D3 — Dois arquivos, conteúdo obrigatório e vídeos isolado
O provider busca os dois em paralelo. Falha em `conteudo.json` mantém o estado `erro` atual. Falha em `videos.json` (rede, JSON quebrado ou schema) resulta em `pronto` com `videos: []` e `videosIndisponiveis: true`; o módulo Vídeos mostra "Não foi possível carregar os vídeos" com "Tentar de novo" (que refaz a busca), e os demais módulos não mudam. Depois do parse, as entradas viram o formato interno (`id`, `youtube_id`, `titulo`, `duracao?`, `categoria`, `golpe_id?`) e passam pelas mesmas checagens cruzadas de hoje (categoria aplica a vídeos, golpe existe).

### D4 — Validação do curador
`validarConteudoPublicado()` passa a ler também `videos.json`. Erros com a posição 1-based: `vídeo #2: link do YouTube inválido (<url>)`, `vídeo #3: categoria historia não existe`, `vídeo #4: golpe x não existe`, `vídeo #5: repete o vídeo #1`. Arquivo ausente ou JSON quebrado falha com o nome do arquivo.

### D5 — Ligação golpe → vídeo
Declarada só no vídeo (`golpe`). O `video_id` em golpe deixa de existir no schema; o detalhe do golpe mostra o primeiro vídeo cujo `golpe_id` é o golpe. Nenhum golpe do conteúdo atual usa `video_id`, então não há migração de dados além dos 2 vídeos.

## Risks / Trade-offs

- [Links antigos `/videos/haidong-gumdo-demo` deixam de abrir] → o app é novo e esses endereços não foram divulgados; a tela mostra "Vídeo não encontrado" com link para a lista.
- [Curador cola link de playlist sem `v=`] → validação falha com a mensagem de link inválido, antes de publicar.

## Migration Plan

Mover os 2 vídeos de `conteudo.json` para `videos.json` (com os links originais) e retirar `videos` de `conteudo.json` na mesma entrega. Rollback = reverter o commit.
