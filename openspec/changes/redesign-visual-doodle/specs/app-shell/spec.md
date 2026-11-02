# Spec Delta — app-shell

## ADDED Requirements

### Requirement: Identidade visual Doodle (RNF6)
O sistema SHALL apresentar todas as telas no estilo Doodle — paleta primary #49B6E5 e secondary #263D5B, texto #111827, fonte manuscrita nos títulos e no texto, bordas escuras desenhadas à mão e sombra sólida deslocada — sem reduzir o contraste abaixo de WCAG AA nem as áreas de toque abaixo de 44 × 44 px.

#### Scenario: Telas no estilo Doodle
- **GIVEN** o aluno abre qualquer tela de primeiro nível (Início, História, Golpes, Vídeos, Quiz)
- **WHEN** a tela é exibida
- **THEN** os títulos usam a fonte manuscrita Delius Swash Caps
- **AND** cartões, botões e a barra de abas têm borda escura e sombra sólida deslocada

#### Scenario: Estilo não compromete a acessibilidade
- **GIVEN** as telas de Início, lista e detalhe de cada módulo e a pergunta respondida do quiz
- **WHEN** a verificação automática de acessibilidade é executada
- **THEN** não há violações de contraste ou de outras regras de severidade séria ou crítica

#### Scenario: Foco visível
- **GIVEN** o aluno navega pelo teclado
- **WHEN** o foco chega a um link, botão, campo ou aba
- **THEN** o elemento mostra um contorno de foco visível, distinto do estado normal

#### Scenario: Fontes do tema offline
- **GIVEN** o aluno já acessou o app uma vez com internet
- **WHEN** ele abre o app sem internet
- **THEN** os títulos continuam na fonte manuscrita, sem trocar para uma fonte do sistema

## MODIFIED Requirements

### Requirement: Tipografia com suporte a hangul (RNF5)
O sistema SHALL usar uma fonte que renderize hangul em todos os textos, com tamanho mínimo de 16 px no conteúdo. Como a fonte manuscrita do tema não tem hangul, todo texto em coreano SHALL ser exibido na fonte coreana do app.

#### Scenario: Hangul legível
- **GIVEN** um texto que contém hangul
- **WHEN** ele é exibido em qualquer tela
- **THEN** os caracteres aparecem sem símbolos substitutos e com no mínimo 16 px

#### Scenario: Hangul ao lado da fonte manuscrita
- **GIVEN** um nome de golpe com hangul e romanização, como "머리치기 · Meori chigi"
- **WHEN** ele é exibido
- **THEN** o hangul aparece na fonte coreana do app e a romanização na fonte manuscrita
