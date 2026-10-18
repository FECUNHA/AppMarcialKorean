# Proposal — setup-pwa-base

> Feature: — (sem tracker) · PRD: docs/prds/app-hwarang-kumdo/PRD.md · Cobre: R1, R2, R3, RNF1–RNF6, RNF8, RNF9

## Affects

- Repositório novo: estrutura do projeto React + Vite + TypeScript, configuração de lint, testes (Vitest, Playwright) e build.
- Casca do app: tela inicial, barra de abas e rotas dos 4 módulos (telas vazias que as changes seguintes preenchem).
- Contrato de conteúdo: `public/conteudo/conteudo.json` e o esquema que o valida — consumido por `add-modulo-historia`, `add-modulo-golpes`, `add-modulo-videos` e `add-modulo-quiz`.
- PWA: manifest, ícones e service worker.

## Why

Todos os módulos do app dependem de três coisas que ainda não existem: a casca navegável, o conteúdo carregado de um arquivo versionado e o funcionamento offline como PWA. Entregar essa base primeiro permite que as quatro changes de módulo andem em paralelo sobre um contrato de conteúdo único e já validado.

## What Changes

- Projeto inicial com lint, testes unitários, e2e de fumaça e build verdes no CI local.
- Tela inicial com acesso a História, Golpes, Vídeos e Quiz (R1) e barra inferior fixa de 4 abas (R2).
- Carregamento de todo o conteúdo de `conteudo.json`, com validação que bloqueia o build quando um golpe está incompleto (R3, RN01, RN02) ou uma imagem viola o limite (RNF4).
- Conteúdo inicial: 6 capítulos do Anexo A e 5 golpes de exemplo com ilustrações (material em `docs/conteudo-inicial/`).
- PWA instalável e com cache offline do app e do conteúdo (RNF1, RNF2), atualização por novo deploy (RNF9).
- Base de qualidade transversal: orçamento de desempenho (RNF3), tipografia com hangul (RNF5), acessibilidade AA na casca (RNF6) e analítica anônima (RNF8).

## Non-goals

- Conteúdo funcional dos módulos (lista de capítulos, catálogo de golpes, vídeos, quiz) — cada um tem sua change.
- Player do YouTube e regras de vídeo (RNF7) — `add-modulo-videos`.
- Escolha final de hospedagem (PRD §6 Q1) — o build gera estáticos publicáveis em qualquer host.
- Login, backend, painel administrativo (PRD §3).

## Capabilities

### New Capabilities

- `app-shell`: casca do PWA — tela inicial, navegação por abas, instalação, offline, atualização e requisitos de qualidade transversais.
- `conteudo`: fonte única do conteúdo do app (arquivo versionado), seu formato e as regras de validação que o curador precisa cumprir.

### Modified Capabilities

- (nenhuma)

## Impact

- Dependências novas: react, react-dom, react-router-dom, vite, vite-plugin-pwa, zod, vitest, @testing-library/react, @playwright/test, @axe-core/playwright, eslint.
- Scripts npm declarados no `openspec/config.yaml`: `lint`, `test`, `build`, `test:e2e`.
- Nenhum sistema externo além da ferramenta de analítica (decisão em design.md).
