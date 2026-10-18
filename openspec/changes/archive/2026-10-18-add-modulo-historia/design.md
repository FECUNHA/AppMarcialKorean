# Design — add-modulo-historia

## Context

Usa `useConteudo()` e o tipo `Capitulo` de `setup-pwa-base` (design D2/D3). Motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Telas de leitura sem lógica de dados própria: tudo derivado de `capitulos` ordenados por `ordem`.

**Non-Goals:**
- Renderização de markdown rico no texto: o MVP aceita parágrafos separados por linha em branco e negrito simples.

## Decisions

### D1 — Texto como parágrafos simples
`texto` é dividido em parágrafos por `\n\n`; `**negrito**` vira `<strong>`. *Alternativa:* biblioteca de markdown. Rejeitada: dependência extra para um uso mínimo e risco de HTML injetado no conteúdo.

### D2 — Seletores puros
`capitulosOrdenados(conteudo)` e `vizinhos(conteudo, id) → { anterior?, proximo? }` em `src/modulos/historia/selectors.ts`, testáveis sem render.

### D3 — Imagens
`<img loading="lazy">` com `alt` do conteúdo e `<figcaption>` para a legenda; no máximo 3 por capítulo (o schema do conteúdo já limita).

## Risks / Trade-offs

- [Texto longo do Anexo A em telas pequenas] → largura máxima de leitura (~65 caracteres) e fonte de 16 px+ (RNF5).
