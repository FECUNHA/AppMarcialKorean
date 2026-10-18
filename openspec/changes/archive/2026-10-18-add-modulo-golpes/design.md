# Design — add-modulo-golpes

## Context

Usa `useConteudo()` e os tipos `Golpe`/`Categoria` de `setup-pwa-base`. Motivação em proposal.md. O quiz (`add-modulo-quiz`) reutiliza o armazenamento local e o vídeo do golpe (R11) entra por `add-modulo-videos`.

## Goals / Non-Goals

**Goals:**
- Filtro e busca como funções puras sobre a lista, testáveis sem render.
- Estado do filtro na URL (`?categoria=cortes&q=meori`) para o botão voltar do detalhe preservar a lista.

**Non-Goals:**
- Virtualização da lista: 30–50 golpes não justificam.

## Decisions

### D1 — Normalização para busca
`normalizar(s) = s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()`; o golpe casa se `normalizar(nome_romanizado)` ou `normalizar(nome_pt)` contém o termo normalizado. *Alternativa:* busca fuzzy (Fuse.js). Rejeitada: dependência extra e resultados menos previsíveis para o aluno.

### D2 — Filtro e busca na URL
`useSearchParams` guarda `categoria` (`todas` | id | `favoritos`) e `q`. O detalhe usa `navigate(-1)` para voltar com o filtro intacto.

### D3 — Armazenamento local resiliente
`src/lib/armazenamento.ts`: `ler<T>(chave, padrao)` e `gravar(chave, valor)` com `try/catch` e fallback em memória quando `localStorage` lança (modo privado, cota). Chave `hk:favoritos` = array de ids. Hook `useFavoritos()` expõe `ehFavorito`, `alternar` e `ids`, filtrando ids que não existem mais no conteúdo.

### D4 — Ponto de extensão para o vídeo
O detalhe renderiza `<SlotVideoGolpe golpe={...} />`, que nesta change retorna `null`; `add-modulo-videos` o implementa (R11). Evita que a change de vídeos precise reescrever o detalhe.

### D5 — Imagens
Miniatura na lista com `loading="lazy"` e `width/height` fixos (sem salto de layout, RNF3); detalhe usa a mesma imagem 1:1 em largura total.

## Risks / Trade-offs

- [`localStorage` limpo pelo Safari após inatividade] → aceito pelo PRD (RN11); favoritos não são críticos.
- [Termo de busca com hangul não casa] → fora do MVP (proposal Non-goals); o campo indica "Busque em português ou romanizado".
