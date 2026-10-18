# Hwarang Kumdo — app de estudo

PWA de estudo para alunos de Hwarang Kumdo: módulos **História**, **Golpes**, **Vídeos** e **Quiz**.
Sem login e sem backend: todo o conteúdo vem de `public/conteudo/conteudo.json`, versionado no
repositório, e fica em cache para uso offline.

- Requisitos: [docs/prds/app-hwarang-kumdo/PRD.md](docs/prds/app-hwarang-kumdo/PRD.md)
- Plano e fluxo OpenSpec: [docs/OPENSPEC.md](docs/OPENSPEC.md)

## Como rodar

Requer Node.js 20 ou mais recente.

```bash
npm install
npx playwright install chromium   # uma vez, para os testes e2e
npm run dev                       # http://localhost:5173
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (sem service worker) |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários e de integração (Vitest + Testing Library) |
| `npm run validate:conteudo` | Valida `public/conteudo/conteudo.json` e as imagens |
| `npm run build` | Valida o conteúdo, checa os tipos e gera o build de produção em `dist/` |
| `npm run preview` | Serve o `dist/` localmente |
| `npm run test:e2e` | Testes e2e (Playwright, perfil Pixel 7); gera o build antes |
| `npm run test:e2e -- --grep @smoke` | Só os testes de fumaça (não acessam o YouTube) |
| `npm run test:e2e:externo` | E2e que abre um vídeo real no YouTube (precisa de internet; `YT_VIDEO_ID` troca o vídeo) |
| `npm run lighthouse` | Lighthouse CI no `dist/`: instalabilidade do PWA e LCP ≤ 3 s (rode `npm run build` antes) |

Antes de abrir um MR: `npm run lint`, `npm test`, `npm run build` e
`npm run test:e2e -- --grep @smoke` verdes.

## Como editar o conteúdo (curador)

Todo o conteúdo fica em **`public/conteudo/conteudo.json`**:

- `capitulos`: capítulos da História (`ordem` define a sequência; no máximo 3 `imagens` por capítulo).
- `golpes`: golpes do catálogo.
- `categorias`: categorias de golpes e vídeos (`aplica_a` diz onde cada uma vale).
- `videos`: vídeos do YouTube (`youtube_id` com 11 caracteres; `duracao` no formato `PT4M12S`). O vídeo precisa
  permitir incorporação; senão o app mostra "Este vídeo não está disponível". Para ligar um vídeo a um golpe,
  use `golpe_id` no vídeo e `video_id` no golpe.
- `versao`: aumente a cada publicação (aparece no rodapé da tela inicial).

Regras que a validação cobra:

- Todo golpe precisa de `nome_hangul`, `nome_romanizado`, `nome_pt`, `descricao`, `faixa` e uma
  `categoria` que exista.
- A romanização usa só letras latinas, espaços e hífens, no padrão declarado em
  `padrao_romanizacao`.
- `imagem` é opcional. Golpe sem imagem é publicado, mas não entra no quiz. Com imagem, `alt`
  (descrição para leitor de tela) é obrigatório.
- Imagem de golpe: arquivo em `public/conteudo/golpes/`, formato **WebP ou PNG**, no máximo
  **200 KB** e proporção **1:1** (quadrada).

Depois de editar, rode:

```bash
npm run validate:conteudo
```

Se algo estiver errado, o comando lista cada problema e sai com erro, por exemplo:

```
Conteúdo inválido (2 problema(s)):
  - golpe meori-chigi: campo nome_pt ausente
  - golpe jjireugi: imagem golpes/jjireugi.webp tem 350 KB (máximo 200 KB)
```

O `npm run build` roda a mesma validação e não gera o build com conteúdo inválido.

## PWA e offline

- Instalável a partir do navegador (manifest + service worker via `vite-plugin-pwa`).
- O service worker pré-cacheia app, conteúdo, imagens e fontes. Depois do primeiro acesso,
  História, Golpes e Quiz funcionam sem internet.
- Atualização automática (`autoUpdate`): o aluno vê uma nova publicação no máximo depois de
  recarregar o app.
- O host precisa de HTTPS e de fallback SPA (servir `index.html` para rotas desconhecidas).
- Ícones: `public/icone.svg` é a fonte; os PNG saem de `npx tsx scripts/gerar-icones.ts`.

## Desempenho (RNF3)

Lighthouse CI 0.13 (Lighthouse 11.4), perfil mobile padrão (Moto G Power, 4G lento simulado),
build servido com gzip, mediana de 3 execuções — medido em 2026-10-18 com os 4 módulos prontos:

| Métrica | Resultado | Meta |
|---|---|---|
| Largest Contentful Paint (mediana) | 2,9 s (execuções: 2.618–2.937 ms) | ≤ 3 s |
| Instalabilidade (`installable-manifest`) | passa | passa |
| Nota de performance | 0,90–0,93 | — |

A folga é pequena e varia entre execuções. Ajustes feitos: CSS embutido no `index.html`, registro do
service worker com `defer`, schema (Zod) carregado sob demanda e **telas de módulo com `lazy`** nas
rotas (o bundle inicial leva só a casca e a tela inicial; cada módulo é um chunk pré-cacheado). O que
resta no bundle inicial é basicamente React + React Router; mudanças na casca ou na tela inicial
devem rodar `npm run lighthouse`.
