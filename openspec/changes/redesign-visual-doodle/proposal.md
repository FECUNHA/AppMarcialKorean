# Proposal — redesign-visual-doodle

> Feature: — (sem tracker; pedido do PO em 2026-11-02) · PRD: docs/prds/app-hwarang-kumdo/PRD.md · Cobre: RNF5, RNF6
> Referência visual: design skill "Doodle" (typeui.sh / github.com/bergside/awesome-design-skills, `skills/doodle`, MIT)

## Affects

- Estilos globais (`src/styles.css`, `src/fontes.css`) e todas as telas: casca (tela inicial, barra de abas), História, Golpes, Vídeos e Quiz — só aparência, nenhuma rota ou contrato muda.
- Fontes servidas pelo app: entram Delius Swash Caps e JetBrains Mono (locais e pré-cacheadas); Noto Sans KR continua para o hangul.
- Manifest do PWA: cor de tema e de fundo passam a seguir a nova paleta.
- Sem change pareada em outro repositório.

## Why

O app hoje tem um visual neutro (vermelho e bege) sem identidade. O PO quer um estilo lúdico e informal — traço desenhado à mão, fontes manuscritas, cartões "rabiscados" — que aproxime o aluno do conteúdo e diferencie o app de um catálogo técnico. A skill de design "Doodle" define esse estilo com tokens objetivos (paleta, fontes, escalas), o que permite aplicá-lo de forma consistente nas 5 áreas do app.

## What Changes

- Paleta Doodle como tokens semânticos (primary `#49B6E5`, secondary `#263D5B`, text `#111827`, surface `#FFFFFF`, success/warning/danger), substituindo o vermelho atual.
- Tipografia: Delius Swash Caps (títulos e texto) e JetBrains Mono (rótulos: duração, faixa, progresso, categoria); hangul continua em Noto Sans KR.
- Elementos com aparência desenhada à mão: bordas escuras grossas e irregulares, sombra sólida deslocada, fundo de papel pontilhado, preenchimentos pastel.
- Estados de interação explícitos (hover, focus-visible, active, disabled) em botões, cartões, abas, campos e alternativas do quiz.
- Mantidos: contraste WCAG AA, alvos de 44 × 44 px, offline e desempenho (LCP ≤ 3 s).

## Non-goals

- Ilustrações novas dos golpes (as imagens atuais continuam).
- Modo escuro.
- Mudança de conteúdo, rotas, fluxos ou textos das telas.

## Capabilities

### New Capabilities

- (nenhuma)

### Modified Capabilities

- `app-shell`: nova exigência de identidade visual Doodle com acessibilidade preservada; a exigência de tipografia com hangul passa a considerar a fonte manuscrita (que não cobre hangul).

## Impact

- Dependências novas: `@fontsource/delius-swash-caps`, `@fontsource/jetbrains-mono` (fontes locais; nada de CDN, para o uso offline).
- Precache cresce com as fontes novas (subset latino, poucas dezenas de KB).
- Testes de estilo (`src/styles.test.ts`) e o e2e de hangul passam a checar a nova pilha de fontes.
