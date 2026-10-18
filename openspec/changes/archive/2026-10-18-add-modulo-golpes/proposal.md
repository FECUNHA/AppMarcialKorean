# Proposal — add-modulo-golpes

> Feature: — (sem tracker) · PRD: docs/prds/app-hwarang-kumdo/PRD.md · Cobre: R7, R8, R9, R10, R12
> Depende de: setup-pwa-base (capabilities `app-shell` e `conteudo`)

## Affects

- Rotas `/golpes` e `/golpes/:id` (placeholders de `setup-pwa-base`).
- Leitura de `golpes` e `categorias` do contrato `conteudo` — sem alteração no formato.
- Novo armazenamento local `hk:favoritos` no navegador.
- A tela de detalhe ganha um ponto de extensão para o vídeo do golpe, preenchido por `add-modulo-videos` (R11).

## Why

Memorizar a nomenclatura coreana é a principal dificuldade dos alunos. O catálogo de golpes com hangul, romanização e tradução é o núcleo do app e a base de dados do quiz.

## What Changes

- Lista de golpes com imagem, hangul, romanização e tradução (R7).
- Filtro por categoria: Cortes, Estocadas, Defesas, Posturas, Formas (R8).
- Busca por romanização ou português, sem diferenciar maiúsculas e acentos (R9).
- Detalhe do golpe com imagem ampliada, nomes, descrição e faixa (R10).
- Favoritos salvos no aparelho e filtro "Meus favoritos" (R12, desejável).

## Non-goals

- Vídeo no detalhe do golpe (R11) — entregue por `add-modulo-videos`, que reutiliza o player.
- Busca por hangul digitado (o aluno raramente tem teclado coreano); pode entrar depois.
- Sincronizar favoritos entre aparelhos (sem login, PRD §3).

## Capabilities

### New Capabilities

- `golpes`: catálogo de golpes com nomes em coreano e português, filtro, busca, detalhe e favoritos.

### Modified Capabilities

- (nenhuma)

## Impact

- Código novo em `src/modulos/golpes/` e um utilitário de armazenamento local em `src/lib/armazenamento.ts`, reutilizado pelo quiz.
- Sem novas dependências.
