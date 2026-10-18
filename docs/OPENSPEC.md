# App Hwarang Kumdo — plano OpenSpec

PRD: `docs/prds/app-hwarang-kumdo/PRD.md` (aprovado, v1). Material de origem: `docs/ran/`.
Conteúdo inicial (história, 5 golpes de exemplo e ilustrações): `docs/conteudo-inicial/`.

As 5 changes do MVP foram implementadas e **arquivadas em 2026-10-18** em
`openspec/changes/archive/2026-10-18-<change>/`. As specs delas viraram as specs principais em
`openspec/specs/` (`app-shell`, `conteudo`, `historia`, `golpes`, `videos`, `quiz`) — a fonte da
verdade do que o sistema faz. Ordem em que foram implementadas:

| # | Change | Cobre | Depende de |
|---|---|---|---|
| 1 | `setup-pwa-base` | R1–R3, RNF1–RNF6, RNF8, RNF9 | — |
| 2 | `add-modulo-historia` | R4–R6 | 1 |
| 3 | `add-modulo-golpes` | R7–R10, R12 | 1 |
| 4 | `add-modulo-videos` | R11, R13–R15, RNF7 | 1, 3 |
| 5 | `add-modulo-quiz` | R16–R18 | 1, 3 |

Mudanças novas: `/opsx:propose "<ideia>"` → `/opsx:apply <change>` → MR revisado → `/opsx:archive <change>`
(as specs novas usam `MODIFIED`/`ADDED` sobre as specs principais acima).

---

# Fluxo OpenSpec

Instalação (uma vez por máquina): `npm install -g @fission-ai/openspec@1.14.0`.
Os comandos e skills do Claude Code ficam em `.claude/commands/opsx/` e `.claude/skills/openspec-*`
(gerados por `openspec init --tools claude`; regenere com `openspec update`).

| Comando | Para quê |
|---|---|
| `/opsx:explore` | Investigar o problema e comparar abordagens, sem implementar |
| `/opsx:propose "<ideia>"` | Criar a change com proposal, design, specs e tasks |
| `/opsx:apply <change>` | Implementar as tasks (TDD: teste primeiro em cada task) |
| `/opsx:update <change>` | Ajustar os artefatos de uma change existente |
| `/opsx:sync <change>` | Promover as delta specs para `openspec/specs/` sem arquivar |
| `/opsx:archive <change>` | Fundir as delta specs em `openspec/specs/` e arquivar a change |

CLI úteis: `openspec list`, `openspec show <change>`, `openspec validate --all --strict`.

Antes do MR: `npm run lint`, `npm test`, `npm run build` e `npm run test:e2e -- --grep @smoke` verdes.
Branch: `feat|fix|chore/<change>`.
