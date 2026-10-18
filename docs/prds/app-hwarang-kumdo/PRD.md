# PRD — App Hwarang Kumdo (MVP)

> Documento de Requisitos de Produto · wise
> Status: `aprovado`
> Versão: 1 · Autor: Fernando Cunha · Data: 2026-10-18 · Projeto: app-hwarang-kumdo
> Aprovado por: Fernando Cunha · 2026-10-18

## Histórico de versões

| Versão | Data | Origem | Solicitante | O que mudou | Por quê |
|---|---|---|---|---|---|
| 1 | 2026-10-18 | Especificação Funcional — App Hwarang Kumdo (MVP) v1.0 | Fernando Cunha | inicial — R1…R18, RNF1…RNF9 | negociação inicial |

## Perguntas ao cliente em aberto

| Id | Pergunta | O que trava | Status |
|---|---|---|---|
| C1 | Como a Especificação Funcional usa termos de kumdo coreano como exemplo (Meori chigi, Sonmok chigi…), faz sentido que a lista oficial de golpes, com hangul, romanização, tradução, categoria e faixa, seja fornecida pelo mestre antes da publicação? Ou o MVP sai com os 5 golpes de exemplo, sabendo que o quiz fica limitado a 5 perguntas? | R7, R16 — conteúdo de produção (não trava o desenvolvimento) | `em aberto` |
| C2 | Como a Especificação Funcional deixa a romanização a cargo da academia, faz sentido adotar a Romanização Revisada do Coreano (padrão usado nos exemplos)? Ou a academia usa outra grafia? | RN02 / R7 — dados do catálogo | `em aberto` |
| C3 | Quais 10 a 20 vídeos do YouTube entram no MVP, e todos permitem incorporação? | R13 — conteúdo de produção | `em aberto` |

## 1. Contexto e problema

Alunos de Hwarang Kumdo precisam memorizar a nomenclatura coreana dos golpes e revisar técnicas entre as aulas, mas o material de estudo hoje está espalhado (anotações, vídeos soltos). O MVP reúne história, glossário de golpes, vídeos e um quiz num PWA de uso offline, para validar se os alunos estudam fora do treino.

## 2. Objetivos

- Alunos ativos por semana em relação ao total de alunos da academia (medir a partir da 1ª semana após o lançamento).
- Quizzes concluídos por aluno por semana.
- Média de acertos no quiz subindo ao longo das semanas.

## 3. Não-objetivos (fora de escopo)

- Login, cadastro e perfil de aluno — o MVP é anônimo.
- Painel administrativo web — o conteúdo é editado no JSON versionado.
- Upload de vídeos próprios — só links do YouTube.
- Ranking entre alunos e gamificação.
- Controle de faixas, exames e mensalidades.
- Notificações push.
- Áudio de pronúncia e idiomas além do português (Brasil).
- Publicação nas lojas Android/iOS — a plataforma é PWA (decisão do cliente).
- Instruções de prática com Jin Kum (espada com corte): o conteúdo sobre ela é apenas informativo.

## 4. Usuários e cenários

- **Aluno**: praticante de qualquer faixa; lê a história, consulta golpes, assiste vídeos, faz o quiz e favorita golpes.
- **Curador de conteúdo** (fora do app): mestre/instrutor que fornece e valida textos, nomes, imagens e links e publica nova versão do JSON.
- Cenário principal: GIVEN um aluno com o PWA já acessado uma vez WHEN ele abre o app sem internet e faz uma rodada do quiz THEN responde 10 perguntas de imagem → nome e vê a pontuação e os golpes que errou.

## 5. Requisitos / capacidades

Os ids seguem a Especificação Funcional: `R<n>` = `RF<nn>` (R7 = RF07) e `RNF<n>` = `RNF<nn>`. Regras de negócio (RN) e critérios de aceite (CA) da especificação estão incorporados aos critérios abaixo.

### Geral

- **R1 — Tela inicial**: exibir tela inicial com acesso aos quatro módulos: História, Golpes, Vídeos e Quiz.
  - Critério de aceite: a tela inicial mostra os 4 módulos e cada um abre a respectiva tela.
- **R2 — Navegação por abas**: navegar entre módulos por barra inferior fixa com 4 abas.
  - Critério de aceite: a barra fica visível em todas as telas de primeiro nível e marca a aba ativa.
- **R3 — Conteúdo em JSON**: carregar todo o conteúdo de um arquivo JSON publicado junto ao PWA e mantido em cache para uso offline.
  - Critério de aceite (CA01): dado o PWA já acessado uma vez, quando o aluno o abre sem internet, então História, Golpes e Quiz carregam normalmente.
  - Critério de aceite (RN01): o build falha se algum golpe não tiver hangul, romanização, tradução e categoria; golpe sem imagem é aceito no catálogo, mas não entra no quiz.
  - Critério de aceite (RN02): toda romanização segue o padrão único definido pela academia (ver C2).

### História

- **R4 — Capítulos da história**: exibir a história do Hwarang Kumdo nos capítulos do Anexo A da especificação: O que é, Significado do nome, Como é treinado, Equipamentos, Diferenças para outras artes de espada, Contexto histórico.
  - Critério de aceite: a lista mostra os 6 capítulos na ordem definida no JSON.
- **R5 — Conteúdo do capítulo**: cada capítulo tem título, texto e até 3 imagens com legenda.
  - Critério de aceite (CA02): ao abrir um capítulo o aluno vê título, texto e imagens com legenda; capítulo sem imagem exibe só o texto.
- **R6 — Navegação entre capítulos** (desejável): permitir avançar e voltar entre capítulos.
  - Critério de aceite: o 1º capítulo não tem "anterior" e o último não tem "próximo".

### Golpes

- **R7 — Lista de golpes**: listar golpes com imagem, nome em coreano (hangul), romanização e tradução em português.
  - Critério de aceite: cada item da lista mostra os 4 elementos; golpe sem imagem mostra um marcador neutro.
- **R8 — Filtro por categoria**: filtrar por Cortes, Estocadas, Defesas, Posturas e Formas.
  - Critério de aceite (CA03): ao filtrar por "Cortes" só aparecem golpes dessa categoria.
- **R9 — Busca**: buscar golpe por texto (romanização ou português), sem diferenciar maiúsculas nem acentos.
  - Critério de aceite (CA04): buscar "cabeça" ou "meori" retorna o Meori chigi.
- **R10 — Detalhe do golpe**: imagem ampliada, nomes, descrição curta da execução e faixa em que é ensinado.
  - Critério de aceite (CA05): o detalhe mostra hangul, romanização, tradução, descrição e faixa.
- **R11 — Vídeo no detalhe do golpe** (desejável): exibir no detalhe o vídeo relacionado ao golpe, quando houver.
  - Critério de aceite: golpe com `video_id` mostra o player; sem `video_id` a seção não aparece; offline mostra "Conecte-se para assistir" (RN10).
- **R12 — Favoritos** (desejável): favoritar e desfavoritar golpe; filtro "Meus favoritos".
  - Critério de aceite (CA11): golpe favoritado continua no filtro "Meus favoritos" após fechar e reabrir o app.
  - Critério de aceite (RN11): favoritos ficam só no navegador do aparelho.

### Vídeos

- **R13 — Lista de vídeos**: listar vídeos do YouTube com miniatura, título, duração e categoria.
  - Critério de aceite: a lista mostra os vídeos do JSON; o app não baixa nem armazena vídeos (RN09).
- **R14 — Player incorporado**: reproduzir o vídeo dentro do app pelo player oficial do YouTube.
  - Critério de aceite (CA06): com internet, tocar num vídeo reproduz no player incorporado sem sair do app.
  - Critério de aceite (CA07 / RN10): sem internet, a aba Vídeos mostra o aviso "Conecte-se para assistir".
- **R15 — Filtro de vídeos** (desejável): filtrar por categoria (categorias dos golpes + História e Treinos).
  - Critério de aceite: ao filtrar por "História" só aparecem vídeos dessa categoria.

### Quiz

- **R16 — Rodada do quiz**: iniciar rodada de 10 perguntas; cada pergunta mostra a imagem de um golpe e 4 nomes como alternativas.
  - Critério de aceite (CA08 / RN03 / RN05): a rodada tem 10 perguntas sem golpe repetido e 4 alternativas embaralhadas cada.
  - Critério de aceite (CA13 / RN04): as 3 alternativas erradas são da mesma categoria do golpe correto quando a categoria tem ao menos 4 golpes com imagem; senão completam com outras categorias.
  - Critério de aceite (CA12 / RN06): com menos de 10 golpes com imagem a rodada usa o total disponível; com menos de 4, o quiz mostra aviso e o botão de iniciar fica desabilitado.
- **R17 — Feedback da resposta**: após responder, indicar certo/errado e mostrar o nome correto (coreano + português) antes de seguir.
  - Critério de aceite (CA09): ao errar, a alternativa correta é destacada com nome coreano e português.
- **R18 — Resultado**: ao final, exibir pontuação, lista de erros e as opções "Jogar de novo" e "Revisar golpes errados".
  - Critério de aceite (RN07): pontuação = 1 ponto por acerto, exibida como acertos/total e percentual.
  - Critério de aceite (CA10 / RN08): quando a pontuação supera a anterior, ela passa a ser a melhor pontuação exibida na tela do Quiz (salva só no aparelho).
  - Critério de aceite: "Revisar golpes errados" abre o detalhe do golpe errado (um por vez, a partir da lista de erros).

### Não funcionais

- **RNF1 — Plataforma**: PWA instalável na tela inicial de Android e iOS, acessado pelo navegador; sem publicação nas lojas.
  - Critério de aceite: o manifest e o service worker passam na auditoria de instalabilidade do Lighthouse.
- **RNF2 — Offline**: História, Golpes e Quiz funcionam 100% offline após o primeiro acesso; Vídeos exigem internet.
  - Critério de aceite: teste e2e com rede desligada após o primeiro carregamento navega pelos 3 módulos.
- **RNF3 — Desempenho**: abertura do app em até 3 segundos em aparelho intermediário.
  - Critério de aceite: LCP ≤ 3 s no Lighthouse com perfil "Moto G Power" / 4G lento.
- **RNF4 — Imagens**: imagens dos golpes em WebP/PNG de até 200 KB cada, proporção 1:1.
  - Critério de aceite: a validação do conteúdo falha para imagem acima de 200 KB ou fora de 1:1.
- **RNF5 — Tipografia**: fonte com suporte a hangul em todos os textos; mínimo de 16 px no conteúdo.
  - Critério de aceite: nenhum texto de conteúdo abaixo de 16 px; hangul renderiza sem caracteres substitutos.
- **RNF6 — Acessibilidade**: contraste AA, texto alternativo nas imagens, áreas de toque de no mínimo 44 px.
  - Critério de aceite: zero violações sérias/críticas no axe nas telas principais.
- **RNF7 — YouTube**: reprodução pelo player oficial do YouTube, respeitando os termos de uso da plataforma.
  - Critério de aceite: o player usa o embed oficial (youtube-nocookie.com) e nenhum vídeo é baixado.
- **RNF8 — Privacidade**: sem coleta de dados pessoais; analítica apenas anônima (eventos de uso).
  - Critério de aceite: nenhum identificador pessoal é enviado; eventos limitados a módulo aberto, quiz iniciado e quiz concluído.
- **RNF9 — Atualização de conteúdo**: atualização por novo deploy do PWA; o service worker baixa a nova versão no próximo acesso com internet.
  - Critério de aceite: após deploy com JSON alterado, o próximo acesso online passa a exibir o novo conteúdo.

## 6. Perguntas técnicas em aberto

- **Q1 — Hospedagem do PWA**: onde publicar (Vercel, Netlify, GitHub Pages, Azure Static Web Apps)? Afeta o pipeline de deploy e o domínio.
- **Q2 — Ferramenta de analítica anônima (RNF8)**: Plausible, Umami ou eventos próprios? Afeta privacidade e custo.
- **Q3 — Validação do JSON**: esquema com Zod em tempo de build ou JSON Schema? Afeta RN01/RNF4 e a mensagem de erro para o curador.
- **Q4 — Estratégia de atualização do service worker (RNF9)**: `autoUpdate` silencioso ou aviso "Nova versão disponível"?

## 7. Riscos e mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Lista oficial de golpes e imagens atrasar | alto | Desenvolver com os 5 golpes de exemplo; conteúdo entra por JSON sem mudança de código |
| Ilustrações geradas por IA com técnica imprecisa | médio | Validação do mestre antes da publicação; trocar por fotos próprias se necessário |
| Vídeo do YouTube removido ou com incorporação bloqueada | médio | Tratar erro do player com mensagem e manter lista curada |
| iOS limitar recursos de PWA (armazenamento, instalação) | médio | Testar em Safari iOS; estado do aluno é pequeno e não crítico |

## 8. Métricas de sucesso

- Alunos ativos por semana ÷ total de alunos da academia.
- Quizzes concluídos por aluno por semana.
- Média de acertos no quiz em tendência de alta nas primeiras 8 semanas.

## 9. Glossário

- **Golpe**: técnica catalogada (corte, estocada, defesa, postura ou forma) com nome em hangul, romanização e tradução. _Evitar: movimento, técnica (como sinônimo de registro)._
- **Capítulo**: unidade de texto do módulo História. _Evitar: seção, página._
- **Rodada**: sequência de até 10 perguntas do quiz. _Evitar: partida, jogo._
- **Curador**: quem mantém o conteúdo do JSON. _Evitar: admin._
- **Ka Kum / Jin Kum**: espada sem corte / com corte.

## 10. Premissas e restrições

- **Premissa — conteúdo da academia**: textos, nomenclatura e imagens são fornecidos e validados pela academia; se não forem, o MVP sai com o conteúdo de exemplo.
- **Premissa — direitos de imagem**: imagens são fotos/ilustrações próprias com direito de uso.
- **Premissa — vídeos públicos**: os vídeos são públicos no YouTube e permitem incorporação.
- **Premissa — volume**: 30 a 50 golpes e 10 a 20 vídeos no MVP.
- **Restrição — plataforma PWA**: decidida pelo cliente; sem app nativo nem lojas.
- **Restrição — sem backend**: conteúdo estático; estado do aluno só no navegador.
- **Restrição — stack**: React + Vite + TypeScript, vite-plugin-pwa, React Router, Vitest + Testing Library.

---
<!-- rastreabilidade — preenchido pelas skills -->
- Origem: Especificação Funcional — App Hwarang Kumdo (MVP) v1.0 · https://claude.ai/code/artifact/caa8d948-feae-408d-b3a9-f643085999e3
- Feature: —
- Change OpenSpec: openspec/changes/setup-pwa-base/ · openspec/changes/add-modulo-historia/ · openspec/changes/add-modulo-golpes/ · openspec/changes/add-modulo-videos/ · openspec/changes/add-modulo-quiz/
- Implementado: —
