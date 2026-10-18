# Spec Delta — conteudo

## Purpose

Define a fonte única do conteúdo do app — capítulos, golpes, categorias e vídeos num arquivo versionado — e as regras que o curador precisa cumprir para que uma nova versão seja publicada.

## ADDED Requirements

### Requirement: Conteúdo carregado de arquivo versionado (R3)
O sistema SHALL obter capítulos, golpes, categorias e vídeos exclusivamente do arquivo de conteúdo publicado junto ao app, sem backend.

#### Scenario: Módulos leem o mesmo conteúdo
- **GIVEN** o arquivo de conteúdo publicado com 6 capítulos e 5 golpes
- **WHEN** o app é aberto
- **THEN** o conteúdo fica disponível para todos os módulos sem nenhuma outra requisição de dados

#### Scenario: Arquivo de conteúdo inválido em produção
- **GIVEN** o arquivo de conteúdo não pôde ser lido
- **WHEN** um módulo precisa do conteúdo
- **THEN** o módulo mostra a mensagem "Não foi possível carregar o conteúdo" com a opção de tentar de novo

### Requirement: Golpe completo para publicação (R3)
O sistema SHALL recusar a publicação de conteúdo em que algum golpe não tenha nome em hangul, romanização, tradução em português e categoria existente (RN01).

#### Scenario: Golpe sem tradução
- **GIVEN** um golpe sem tradução em português
- **WHEN** a validação do conteúdo é executada
- **THEN** ela falha e a mensagem identifica o id do golpe e o campo ausente

#### Scenario: Golpe sem imagem
- **GIVEN** um golpe completo, mas sem imagem
- **WHEN** a validação do conteúdo é executada
- **THEN** ela passa
- **AND** o golpe é marcado como não elegível para o quiz

### Requirement: Padrão único de romanização (R3)
O sistema SHALL exigir que o conteúdo declare um único padrão de romanização e que toda romanização use apenas letras latinas, espaços e hífens (RN02).

#### Scenario: Romanização com hangul
- **GIVEN** um golpe cuja romanização contém caracteres hangul
- **WHEN** a validação do conteúdo é executada
- **THEN** ela falha e indica o id do golpe

### Requirement: Limites das imagens de golpes (RNF4)
O sistema SHALL recusar imagem de golpe em formato diferente de WebP ou PNG, acima de 200 KB ou com proporção diferente de 1:1.

#### Scenario: Imagem grande demais
- **GIVEN** uma imagem de golpe com 350 KB
- **WHEN** a validação do conteúdo é executada
- **THEN** ela falha e indica o arquivo e o tamanho

#### Scenario: Imagem fora de 1:1
- **GIVEN** uma imagem de golpe com 800 × 600 px
- **WHEN** a validação do conteúdo é executada
- **THEN** ela falha e indica o arquivo e as dimensões
