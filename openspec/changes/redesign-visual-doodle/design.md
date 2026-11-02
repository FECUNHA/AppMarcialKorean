# Design — redesign-visual-doodle

## Context

Hoje o visual está em `src/styles.css` (tokens `--cor-*` em `:root` + classes por módulo) e as fontes em `src/fontes.css` (Noto Sans KR local, subsets latino e coreano). Motivação em proposal.md. Restrições que continuam valendo: offline (RNF2), LCP ≤ 3 s (RNF3, margem de ~100 ms), hangul (RNF5), AA e 44 px (RNF6). O e2e já roda axe em todas as telas.

A skill Doodle traz tokens (paleta, fontes, escala tipográfica 14/16/18/24/32/40, espaçamento 4/8/12/16/24/32, raio 4/8) e o exemplo visual do registro mostra: fundo de papel creme pontilhado, bordas escuras grossas e irregulares, sombra sólida deslocada, preenchimentos pastel.

## Goals / Non-Goals

**Goals:**
- Trocar a pele inteira mexendo só em CSS e em poucos atributos de marcação — nenhum componente muda de comportamento.
- Tokens semânticos únicos (cor, fonte, espaço, raio, sombra, borda) usados por todas as classes.

**Non-Goals:**
- Reescrever componentes ou trocar a estrutura de classes.
- Biblioteca de UI ou CSS-in-JS.

## Decisions

### D1 — Tokens semânticos em `:root`
Novos tokens: `--cor-primaria: #49B6E5`, `--cor-secundaria: #263D5B`, `--cor-texto: #111827`, `--cor-superficie: #FFFFFF`, `--cor-papel: #F8F5EE` (fundo creme do exemplo), `--cor-traco: #1F2A37` (contorno), `--cor-sucesso: #16A34A`, `--cor-alerta: #D97706`, `--cor-perigo: #DC2626` e pastéis derivados para preenchimento (`--cor-pastel-azul`, `--cor-pastel-pessego`, `--cor-pastel-verde`, `--cor-pastel-vermelho`). Escalas `--esp-1..6` (4…32), `--raio-sm/md` (4/8), `--fonte-*`. As classes atuais passam a usar só tokens.
*Alternativa:* manter os nomes antigos e só trocar valores. Rejeitada: `--cor-primaria` hoje é usada como cor de texto, o que com #49B6E5 reprovaria o contraste.

### D2 — Contraste: primary como preenchimento, secondary como texto
#49B6E5 sobre branco tem contraste ≈ 2,3:1 — reprova AA para texto. Regra: primary só como **fundo** (botão principal, aba ativa, destaques) com texto `--cor-texto` (7,7:1); links, rótulos ativos e títulos coloridos usam `--cor-secundaria` (10,2:1 sobre o papel, 11:1 sobre branco); texto secundário `#4B5563` (6,9:1 sobre o papel). A skill manda priorizar acessibilidade em conflito estético.

### D3 — Traço "desenhado à mão" só com CSS
- Borda: `2px solid var(--cor-traco)` com `border-radius` assimétrico (ex.: `255px 15px 225px 15px / 15px 225px 15px 255px`) para o contorno irregular.
- Sombra: sólida e deslocada, `4px 4px 0 var(--cor-traco)`; em hover sobe para 6px e o elemento desloca −2px; em active cai para 1px (efeito de "apertar").
- Fundo de papel: `radial-gradient` de pontos sobre `--cor-papel`, sem imagem extra.
*Alternativa:* SVG com filtro de turbulência para bordas tremidas. Rejeitada: custo de pintura em celular intermediário (RNF3) e bordas que escapam do layout.

### D4 — Fontes locais com fallback por caractere
`@fontsource/delius-swash-caps` (só peso 400 existe) e `@fontsource/jetbrains-mono` (400/700) no subset latino, declarados em `src/fontes.css` como o Noto Sans KR. Pilhas:
- texto e títulos: `'Delius Swash Caps', 'Noto Sans KR', system-ui, sans-serif` — o navegador usa a Noto para cada caractere hangul;
- rótulos: `'JetBrains Mono', 'Noto Sans KR', ui-monospace, monospace`;
- `:lang(ko)`: `'Noto Sans KR'` primeiro, para nomes coreanos marcados com `lang="ko"` (RNF5).
Negrito da Delius é sintético (só 400 existe); títulos usam o peso 400 e ganham hierarquia pelo tamanho da escala 24/32/40.

### D5 — Manifest e cor de tema
`theme_color` = `#263D5B` (barra do sistema escura, ícone branco legível) e `background_color` = `--cor-papel`. O ícone do app ganha o fundo `#49B6E5` com traço escuro, gerado pelo `scripts/gerar-icones.ts` existente.

## Risks / Trade-offs

- [Fonte manuscrita em textos longos (capítulos da História) cansa a leitura] → Delius é legível em 16 px+; altura de linha 1,6 e largura máxima de 65 caracteres já existentes.
- [Mais fontes podem estourar o LCP] → só subset latino (~20–30 KB cada), `font-display: swap` e nada bloqueia a 1ª pintura; `npm run lighthouse` no fim.
- [Borda irregular cortar foco/contorno] → `outline` com `outline-offset` (não depende do raio) para o focus-visible.

## Migration Plan

Só front-end: publicar normalmente. Rollback = reverter o commit; o `autoUpdate` do service worker propaga.
