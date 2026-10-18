# videos Specification

## Purpose

Organiza os vídeos do YouTube selecionados pela academia por categoria, reproduz cada um dentro do app pelo player oficial e liga cada golpe ao seu vídeo, sem armazenar vídeos no aparelho.

## Requirements

### Requirement: Lista de vídeos (R13)
O sistema SHALL listar os vídeos do conteúdo com miniatura, título, duração e categoria, sem baixar nem armazenar os vídeos no aparelho (RN09).

#### Scenario: Item de vídeo
- **GIVEN** um vídeo de 4 min 12 s da categoria Cortes
- **WHEN** o aluno abre o módulo Vídeos com internet
- **THEN** o item mostra a miniatura, o título, "4:12" e "Cortes"

### Requirement: Reprodução no player incorporado (R14, RNF7)
O sistema SHALL reproduzir o vídeo dentro do app pelo player oficial incorporado do YouTube, em modo de privacidade aprimorada.

#### Scenario: Reproduzir sem sair do app (CA06)
- **GIVEN** o aluno está com internet na lista de vídeos
- **WHEN** ele toca num vídeo
- **THEN** o vídeo é reproduzido no player incorporado dentro do app
- **AND** o app não abre outra aba nem o aplicativo do YouTube

#### Scenario: Vídeo indisponível
- **GIVEN** um vídeo removido ou com incorporação bloqueada no YouTube
- **WHEN** o aluno tenta reproduzi-lo
- **THEN** o app mostra "Este vídeo não está disponível" no lugar do player

### Requirement: Aviso sem internet (R14)
O sistema SHALL mostrar o aviso "Conecte-se para assistir" no lugar da lista e dos players quando não houver internet (RN10), mantendo os demais módulos funcionando.

#### Scenario: Aba Vídeos offline (CA07)
- **GIVEN** o aparelho está sem internet
- **WHEN** o aluno abre a aba Vídeos
- **THEN** ele vê "Conecte-se para assistir"
- **AND** ao voltar a internet a lista aparece sem recarregar o app

### Requirement: Filtro de vídeos por categoria (R15)
O sistema SHALL permitir filtrar os vídeos pelas categorias de golpes e pelas categorias História e Treinos.

#### Scenario: Filtrar por História
- **GIVEN** vídeos das categorias História, Treinos e Cortes
- **WHEN** o aluno seleciona "História"
- **THEN** só aparecem vídeos da categoria História

### Requirement: Vídeo relacionado no detalhe do golpe (R11)
O sistema SHALL exibir, no detalhe de um golpe que tem vídeo associado, o player desse vídeo, e não exibir a seção quando não houver vídeo.

#### Scenario: Golpe com vídeo
- **GIVEN** o golpe Meori chigi associado a um vídeo
- **WHEN** o aluno abre o detalhe com internet
- **THEN** a seção "Vídeo" mostra o player desse vídeo

#### Scenario: Golpe sem vídeo
- **GIVEN** um golpe sem vídeo associado
- **WHEN** o aluno abre o detalhe
- **THEN** a seção "Vídeo" não aparece

#### Scenario: Golpe com vídeo, sem internet
- **GIVEN** o golpe Meori chigi associado a um vídeo e o aparelho sem internet
- **WHEN** o aluno abre o detalhe
- **THEN** a seção "Vídeo" mostra "Conecte-se para assistir" e o restante do detalhe aparece normalmente
