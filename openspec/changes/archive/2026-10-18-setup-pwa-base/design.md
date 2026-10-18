# Design — setup-pwa-base

## Context

Projeto novo (greenfield). Motivação em proposal.md. Restrições do PRD §10: PWA, sem backend, conteúdo estático, estado do aluno só no navegador, stack React + Vite + TypeScript. As 4 changes de módulo consomem o contrato de conteúdo definido aqui, então ele precisa nascer estável.

## Goals / Non-Goals

**Goals:**
- Contrato de conteúdo tipado e validado no build, usado igual em runtime e no script do curador.
- Precache de app, conteúdo, fontes e imagens para o offline (RNF2) sem código de cache manual.
- Ferramentas de verificação dos RNF prontas (axe, Lighthouse) para as changes seguintes reaproveitarem.

**Non-Goals:**
- Telas de módulo além de um placeholder com título.
- Escolha do host de produção.

## Decisions

### D1 — Estrutura do projeto
```
src/
  app/          # App, rotas, layout com barra de abas
  conteudo/     # schema.ts (Zod), ConteudoProvider, useConteudo()
  modulos/      # historia/ golpes/ videos/ quiz/ (placeholders nesta change)
  analytics/    # track() + provedores
  ui/           # componentes base (Botao, Card, Aviso)
public/conteudo/conteudo.json
public/conteudo/golpes/*.webp
public/conteudo/historia/*.webp
scripts/validar-conteudo.ts
e2e/            # Playwright
```

### D2 — Conteúdo buscado em runtime e pré-cacheado
`conteudo.json` fica em `public/` e é lido uma vez por um `ConteudoProvider` (React Context), exposto por `useConteudo()` com estados `carregando | pronto | erro`. O service worker pré-cacheia o JSON e as imagens.
*Alternativa:* importar o JSON no bundle. Rejeitada: aumenta o JS inicial (RNF3) e mistura conteúdo com código; o ganho (sem fetch) é irrelevante com precache.

### D3 — Esquema único com Zod (resolve PRD Q3)
`src/conteudo/schema.ts` define `Conteudo`, `Capitulo`, `Golpe`, `Categoria`, `Video` e gera os tipos TypeScript. O mesmo schema roda:
- em `scripts/validar-conteudo.ts`, chamado no `prebuild` — falha o build com mensagem `golpe <id>: campo <campo> ausente` (RN01, RN02) e checa arquivos de imagem com `image-size` (RNF4);
- em runtime, para cair no estado `erro` se o JSON publicado estiver corrompido.
*Alternativa:* JSON Schema + ajv. Rejeitada: duplicaria os tipos TypeScript.

Formato do conteúdo:
```json
{
  "versao": "1.0.0",
  "padrao_romanizacao": "Romanização Revisada do Coreano",
  "categorias": [{ "id": "cortes", "nome": "Cortes", "aplica_a": ["golpes", "videos"] }],
  "capitulos":  [{ "id": "o-que-e", "ordem": 1, "titulo": "...", "texto": "...", "imagens": [{ "arquivo": "historia/x.webp", "legenda": "...", "alt": "..." }] }],
  "golpes":     [{ "id": "meori-chigi", "nome_hangul": "머리치기", "nome_romanizado": "Meori chigi", "nome_pt": "Corte na cabeça", "categoria": "cortes", "descricao": "...", "faixa": "Branca", "imagem": "golpes/meori-chigi.webp", "alt": "...", "video_id": "yt-001" }],
  "videos":     [{ "id": "yt-001", "youtube_id": "XXXXXXXXXXX", "titulo": "...", "duracao": "PT4M12S", "categoria": "cortes", "golpe_id": "meori-chigi" }]
}
```
Categorias iniciais: `cortes`, `estocadas`, `defesas`, `posturas`, `formas` (golpes e vídeos) e `historia`, `treinos` (só vídeos). `imagem` e `video_id` são opcionais; `alt` é obrigatório quando há imagem (RNF6); `imagens` de um capítulo aceita no máximo 3 itens (R5).

### D4 — PWA com vite-plugin-pwa, `registerType: 'autoUpdate'` (resolve PRD Q4)
Workbox pré-cacheia `**/*.{js,css,html,json,webp,png,woff2}`. Com `autoUpdate`, o novo service worker assume no próximo carregamento — atende RNF9 ("no máximo após recarregar") sem tela de aviso. `navigateFallback: '/index.html'` cobre as rotas offline.
*Alternativa:* `prompt` com aviso "Nova versão disponível". Rejeitada para o MVP: mais UI e testes sem ganho para conteúdo que muda raramente.

### D5 — Roteamento
React Router (`createBrowserRouter`): `/`, `/historia`, `/historia/:id`, `/golpes`, `/golpes/:id`, `/videos`, `/videos/:id`, `/quiz`. O layout raiz renderiza a barra de abas nas rotas de primeiro nível. O host precisa servir `index.html` para rotas desconhecidas (registrado em Open Questions).

### D6 — Fonte com hangul
`@fontsource/noto-sans-kr` (pesos 400 e 700, subset coreano + latino) servido localmente e pré-cacheado; `font-size` base 16 px (RNF5).

### D7 — Analítica atrás de uma interface
`track(evento: 'modulo_aberto' | 'quiz_iniciado' | 'quiz_concluido', props)` com provedor injetável; o provedor padrão é no-op. Sem cookies, sem id persistente; falha de rede é ignorada (RNF8). A ferramenta real fica em Open Questions — trocá-la não muda spec nem tasks.

### D8 — Verificação dos RNF
- Vitest + Testing Library para unidade e integração (jsdom).
- Playwright com tag `@smoke` para fumaça e cenário offline (`context.setOffline(true)` após o 1º carregamento).
- `@axe-core/playwright` com helper `expectSemViolacoes(page)` reutilizado pelos módulos (RNF6).
- `@lhci/cli` com asserções de instalabilidade e LCP ≤ 3000 ms, perfil mobile (RNF1, RNF3).

## Risks / Trade-offs

- [Safari iOS limita armazenamento de PWA e pode limpar cache após semanas sem uso] → conteúdo é re-baixado no próximo acesso online; estado do aluno é pequeno e não crítico.
- [Fonte coreana pesa centenas de KB] → subset e só 2 pesos; medir no Lighthouse do D8.
- [Precache de todas as imagens cresce com 50 golpes] → 50 × ≤ 200 KB no pior caso ≈ 10 MB; as ilustrações atuais têm 10–17 KB, então o real fica abaixo de 1 MB.

## Migration Plan

Greenfield: sem migração. Deploy = publicar `dist/` em host estático com HTTPS e fallback SPA. Rollback = republicar o `dist/` anterior; `autoUpdate` propaga a versão revertida no próximo acesso.

## Open Questions

- PRD Q1 — host de produção (Vercel, Netlify, GitHub Pages ou Azure Static Web Apps). Qualquer um com HTTPS e fallback SPA atende; não muda specs nem tasks.
- PRD Q2 — provedor de analítica anônima (Plausible, Umami). Entra como novo provedor do D7.
