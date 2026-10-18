# Spec Delta — historia

## Purpose

Permite ao aluno ler a história do Hwarang Kumdo organizada em capítulos — o que é, significado do nome, treino, equipamentos, diferenças e contexto histórico — inclusive sem internet.

## ADDED Requirements

### Requirement: Lista de capítulos (R4)
O sistema SHALL listar os capítulos da história na ordem definida no conteúdo, mostrando o título de cada um.

#### Scenario: Capítulos na ordem do conteúdo
- **GIVEN** o conteúdo com os 6 capítulos do texto-base
- **WHEN** o aluno abre o módulo História
- **THEN** a lista mostra, nesta ordem: O que é o Hwarang Kumdo, Significado do nome, Como é treinado, Equipamentos, Diferenças para outras artes de espada, Contexto histórico

### Requirement: Leitura do capítulo (R5)
O sistema SHALL exibir o capítulo com título, texto e até 3 imagens, cada uma com legenda e texto alternativo.

#### Scenario: Capítulo com imagem (CA02)
- **GIVEN** um capítulo com texto e 1 imagem com legenda
- **WHEN** o aluno abre o capítulo
- **THEN** ele vê o título, o texto e a imagem com a legenda abaixo

#### Scenario: Capítulo sem imagem
- **GIVEN** um capítulo sem imagens
- **WHEN** o aluno abre o capítulo
- **THEN** ele vê só o título e o texto, sem espaço vazio de imagem

#### Scenario: Capítulo inexistente
- **GIVEN** um endereço de capítulo que não existe no conteúdo
- **WHEN** o aluno o abre
- **THEN** o app mostra "Capítulo não encontrado" e um link para a lista de capítulos

### Requirement: Navegação entre capítulos (R6)
O sistema SHALL oferecer "Anterior" e "Próximo" na tela do capítulo, seguindo a ordem do conteúdo.

#### Scenario: Limites da navegação
- **GIVEN** o aluno está no primeiro capítulo
- **WHEN** a tela é exibida
- **THEN** não há "Anterior" e "Próximo" leva ao segundo capítulo
- **AND** no último capítulo não há "Próximo"
