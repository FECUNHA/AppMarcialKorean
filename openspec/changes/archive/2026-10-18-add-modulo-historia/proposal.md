# Proposal — add-modulo-historia

> Feature: — (sem tracker) · PRD: docs/prds/app-hwarang-kumdo/PRD.md · Cobre: R4, R5, R6
> Depende de: setup-pwa-base (capabilities `app-shell` e `conteudo`)

## Affects

- Rotas `/historia` e `/historia/:id` (placeholder criado em `setup-pwa-base`).
- Leitura de `capitulos` do contrato `conteudo` — sem alteração no formato.

## Why

O aluno precisa entender o que é o Hwarang Kumdo, de onde vem o nome, como se treina e como ele difere de outras artes de espada. O texto-base já existe (Anexo A da especificação) e hoje não tem onde ser lido.

## What Changes

- Lista dos capítulos da história na ordem do conteúdo (R4).
- Tela do capítulo com título, texto e até 3 imagens com legenda (R5).
- Navegação "anterior / próximo" entre capítulos (R6, desejável).

## Non-goals

- Edição de capítulos pelo app (o curador edita o JSON).
- Vídeos sobre história — ficam no módulo Vídeos (`add-modulo-videos`, categoria `historia`).
- Busca dentro do texto.

## Capabilities

### New Capabilities

- `historia`: leitura da história do Hwarang Kumdo organizada em capítulos.

### Modified Capabilities

- (nenhuma)

## Impact

- Código novo em `src/modulos/historia/`.
- Sem novas dependências.
