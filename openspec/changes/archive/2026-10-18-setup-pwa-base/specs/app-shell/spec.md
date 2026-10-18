# Spec Delta — app-shell

## Purpose

Define a casca do PWA de estudo de Hwarang Kumdo: como o aluno entra no app, navega entre os módulos, instala o app, usa offline e recebe novas versões, além dos requisitos de qualidade que valem para todas as telas.

## ADDED Requirements

### Requirement: Tela inicial com os quatro módulos (R1)
O sistema SHALL exibir, ao abrir o app, uma tela inicial com acesso aos módulos História, Golpes, Vídeos e Quiz.

#### Scenario: Acesso aos módulos pela tela inicial
- **GIVEN** o aluno abre o app
- **WHEN** a tela inicial é exibida
- **THEN** ela mostra os 4 módulos: História, Golpes, Vídeos e Quiz
- **AND** tocar em um módulo abre a tela desse módulo

### Requirement: Barra de abas fixa (R2)
O sistema SHALL exibir uma barra inferior fixa com 4 abas (História, Golpes, Vídeos, Quiz) em todas as telas de primeiro nível, indicando a aba ativa.

#### Scenario: Troca de módulo pela barra
- **GIVEN** o aluno está no módulo Golpes
- **WHEN** ele toca na aba Quiz
- **THEN** a tela do Quiz é exibida
- **AND** a aba Quiz aparece como ativa e a aba Golpes como inativa

#### Scenario: Barra acessível por leitor de tela
- **GIVEN** um leitor de tela ativo
- **WHEN** o foco chega à barra de abas
- **THEN** cada aba é anunciada com seu nome e a aba ativa é anunciada como atual

### Requirement: Instalação como PWA (RNF1)
O sistema SHALL ser instalável na tela inicial de Android e iOS a partir do navegador, sem publicação em lojas.

#### Scenario: App instalável
- **GIVEN** o app publicado em HTTPS
- **WHEN** a auditoria de instalabilidade de PWA é executada
- **THEN** ela passa, com manifest válido (nome, ícones 192 e 512 px, cor de tema, `display: standalone`) e service worker ativo

### Requirement: Uso offline dos módulos de conteúdo (RNF2)
O sistema SHALL funcionar sem internet, após o primeiro acesso, nos módulos História, Golpes e Quiz, incluindo textos e imagens.

#### Scenario: Abertura sem internet (CA01)
- **GIVEN** o aluno já acessou o app uma vez com internet
- **WHEN** ele abre o app sem internet
- **THEN** a tela inicial, História, Golpes e Quiz carregam com seus textos e imagens

### Requirement: Tempo de abertura (RNF3)
O sistema SHALL exibir a tela inicial em até 3 segundos em aparelho intermediário.

#### Scenario: Orçamento de desempenho
- **GIVEN** o build de produção
- **WHEN** a tela inicial é medida em perfil de celular intermediário com rede 4G lenta
- **THEN** o Largest Contentful Paint é de no máximo 3 segundos

### Requirement: Tipografia com suporte a hangul (RNF5)
O sistema SHALL usar uma fonte que renderize hangul em todos os textos, com tamanho mínimo de 16 px no conteúdo.

#### Scenario: Hangul legível
- **GIVEN** um texto que contém hangul
- **WHEN** ele é exibido em qualquer tela
- **THEN** os caracteres aparecem sem símbolos substitutos e com no mínimo 16 px

### Requirement: Acessibilidade das telas (RNF6 parcial)
O sistema SHALL atender contraste WCAG AA, oferecer texto alternativo em toda imagem de conteúdo e áreas de toque de no mínimo 44 × 44 px.

#### Scenario: Casca sem violações de acessibilidade
- **GIVEN** a tela inicial e a barra de abas
- **WHEN** uma verificação automática de acessibilidade é executada
- **THEN** não há violações de severidade séria ou crítica
- **AND** todo elemento tocável mede ao menos 44 × 44 px

### Requirement: Analítica anônima (RNF8)
O sistema SHALL registrar apenas eventos de uso anônimos — módulo aberto, quiz iniciado e quiz concluído — sem dados pessoais nem identificador persistente do aluno.

#### Scenario: Evento sem dado pessoal
- **GIVEN** o aluno abre o módulo Golpes
- **WHEN** o evento "módulo aberto" é enviado
- **THEN** ele contém só o nome do evento, o módulo e a data
- **AND** não contém identificador do aparelho, do aluno ou endereço IP armazenado pelo app

#### Scenario: Sem internet não há erro
- **GIVEN** o app está offline
- **WHEN** um evento seria enviado
- **THEN** o evento é descartado sem afetar a navegação

### Requirement: Atualização por nova versão (RNF9)
O sistema SHALL passar a exibir o conteúdo de uma nova publicação no primeiro acesso com internet após o deploy.

#### Scenario: Conteúdo novo após deploy
- **GIVEN** uma nova versão publicada com o arquivo de conteúdo alterado
- **WHEN** o aluno abre o app com internet
- **THEN** o novo conteúdo é baixado e passa a ser exibido, no máximo após recarregar o app
