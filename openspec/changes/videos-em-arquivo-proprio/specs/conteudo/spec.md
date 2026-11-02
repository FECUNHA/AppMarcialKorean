# Spec Delta — conteudo

## MODIFIED Requirements

### Requirement: Conteúdo carregado de arquivo versionado (R3)
O sistema SHALL obter capítulos, golpes e categorias exclusivamente do arquivo de conteúdo e os vídeos exclusivamente do arquivo de vídeos, ambos publicados junto ao app, sem backend.

#### Scenario: Módulos leem o mesmo conteúdo
- **GIVEN** o arquivo de conteúdo publicado com 6 capítulos e 5 golpes e o arquivo de vídeos com 2 vídeos
- **WHEN** o app é aberto
- **THEN** o conteúdo e os vídeos ficam disponíveis para todos os módulos sem nenhuma outra requisição de dados além desses dois arquivos

#### Scenario: Arquivo de conteúdo inválido em produção
- **GIVEN** o arquivo de conteúdo não pôde ser lido
- **WHEN** um módulo precisa do conteúdo
- **THEN** o módulo mostra a mensagem "Não foi possível carregar o conteúdo" com a opção de tentar de novo

## ADDED Requirements

### Requirement: Vídeos cadastrados por link do YouTube (R13)
O sistema SHALL aceitar, no arquivo de vídeos, cada vídeo identificado pelo seu link do YouTube nos formatos comuns (página do vídeo, link curto, shorts e incorporado, com ou sem parâmetros), com título e categoria obrigatórios e duração e golpe relacionado opcionais.

#### Scenario: Formatos de link aceitos
- **GIVEN** vídeos cadastrados com os links "https://www.youtube.com/watch?v=2mG4A7Sr1fU&t=5s", "https://youtu.be/qjrYw-LjlB0", "https://www.youtube.com/shorts/dQw4w9WgXcQ" e "https://www.youtube.com/embed/M7lc1UVf-VE"
- **WHEN** a validação do conteúdo é executada
- **THEN** ela passa e cada vídeo é reproduzido pelo vídeo correto do YouTube

#### Scenario: Vídeo sem duração
- **GIVEN** um vídeo cadastrado sem duração
- **WHEN** a lista de vídeos é exibida
- **THEN** o item mostra miniatura, título e categoria, sem espaço vazio de duração

### Requirement: Vídeo inválido bloqueia a publicação (R13)
O sistema SHALL recusar a publicação quando um vídeo do arquivo de vídeos tiver link que não é do YouTube, categoria que não se aplica a vídeos, golpe relacionado inexistente ou o mesmo vídeo cadastrado duas vezes, indicando a posição do vídeo e o problema.

#### Scenario: Link que não é do YouTube
- **GIVEN** o 2º vídeo do arquivo com o link "https://vimeo.com/123456"
- **WHEN** a validação do conteúdo é executada
- **THEN** ela falha com a mensagem "vídeo #2: link do YouTube inválido (https://vimeo.com/123456)"

#### Scenario: Golpe relacionado inexistente
- **GIVEN** um vídeo relacionado ao golpe "golpe-que-nao-existe"
- **WHEN** a validação do conteúdo é executada
- **THEN** ela falha e a mensagem indica o vídeo e o golpe inexistente

#### Scenario: Mesmo vídeo duas vezes
- **GIVEN** dois vídeos com links diferentes do mesmo vídeo do YouTube
- **WHEN** a validação do conteúdo é executada
- **THEN** ela falha e a mensagem indica o vídeo repetido

### Requirement: Falha no arquivo de vídeos isolada (R3)
O sistema SHALL continuar exibindo História, Golpes e Quiz quando o arquivo de vídeos não puder ser lido, mostrando o problema apenas no módulo Vídeos com a opção de tentar de novo.

#### Scenario: Arquivo de vídeos indisponível
- **GIVEN** o arquivo de conteúdo foi lido e o arquivo de vídeos não pôde ser lido
- **WHEN** o aluno abre Golpes e depois Vídeos
- **THEN** Golpes funciona normalmente
- **AND** Vídeos mostra "Não foi possível carregar os vídeos" com a opção de tentar de novo
