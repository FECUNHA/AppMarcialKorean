# Spec Delta — golpes

## Purpose

Catálogo dos golpes de Hwarang Kumdo para o aluno consultar e memorizar a nomenclatura: nome em hangul, romanização e tradução, com filtro, busca, detalhe da execução e favoritos.

## ADDED Requirements

### Requirement: Lista de golpes (R7)
O sistema SHALL listar todos os golpes do conteúdo mostrando, em cada item, a imagem, o nome em hangul, a romanização e a tradução em português.

#### Scenario: Item completo
- **GIVEN** o golpe Meori chigi com imagem
- **WHEN** o aluno abre o módulo Golpes
- **THEN** o item mostra a imagem, "머리치기", "Meori chigi" e "Corte na cabeça"

#### Scenario: Golpe sem imagem
- **GIVEN** um golpe sem imagem
- **WHEN** a lista é exibida
- **THEN** o item mostra um marcador neutro no lugar da imagem e os três nomes

### Requirement: Filtro por categoria (R8)
O sistema SHALL permitir filtrar a lista por uma categoria de golpe (Cortes, Estocadas, Defesas, Posturas, Formas) ou mostrar todas.

#### Scenario: Filtrar por Cortes (CA03)
- **GIVEN** golpes das categorias Cortes, Estocadas e Defesas
- **WHEN** o aluno seleciona o filtro "Cortes"
- **THEN** só aparecem golpes da categoria Cortes

#### Scenario: Categoria sem golpes
- **GIVEN** a categoria Formas sem nenhum golpe
- **WHEN** o aluno seleciona "Formas"
- **THEN** o app mostra "Nenhum golpe nesta categoria"

### Requirement: Busca por texto (R9)
O sistema SHALL filtrar a lista pelo texto digitado, comparando com a romanização e a tradução, sem diferenciar maiúsculas, minúsculas e acentos, e combinando com o filtro de categoria ativo.

#### Scenario: Busca em português ou romanizado (CA04)
- **GIVEN** o golpe Meori chigi, "Corte na cabeça"
- **WHEN** o aluno busca "cabeca" ou "MEORI"
- **THEN** o Meori chigi aparece no resultado

#### Scenario: Busca sem resultado
- **GIVEN** nenhum golpe contém "xyz"
- **WHEN** o aluno busca "xyz"
- **THEN** o app mostra "Nenhum golpe encontrado"

### Requirement: Detalhe do golpe (R10)
O sistema SHALL exibir, no detalhe do golpe, a imagem ampliada, o nome em hangul, a romanização, a tradução, a descrição da execução e a faixa em que é ensinado.

#### Scenario: Detalhe completo (CA05)
- **GIVEN** o golpe Meori chigi com descrição e faixa Branca
- **WHEN** o aluno toca nele na lista
- **THEN** o detalhe mostra imagem, "머리치기", "Meori chigi", "Corte na cabeça", a descrição e "Faixa: Branca"

#### Scenario: Golpe inexistente
- **GIVEN** um endereço de golpe que não existe no conteúdo
- **WHEN** o aluno o abre
- **THEN** o app mostra "Golpe não encontrado" e um link para a lista

### Requirement: Favoritos no aparelho (R12)
O sistema SHALL permitir favoritar e desfavoritar um golpe, guardar os favoritos apenas no navegador do aparelho (RN11) e oferecer o filtro "Meus favoritos".

#### Scenario: Favorito persiste (CA11)
- **GIVEN** o aluno favoritou o Meori chigi
- **WHEN** ele fecha e reabre o app
- **THEN** o Meori chigi aparece no filtro "Meus favoritos"

#### Scenario: Armazenamento indisponível
- **GIVEN** o navegador bloqueia o armazenamento local
- **WHEN** o aluno favorita um golpe
- **THEN** o favorito vale até fechar o app e nenhuma mensagem de erro técnico é exibida

#### Scenario: Favorito de golpe removido do conteúdo
- **GIVEN** um favorito cujo golpe saiu do conteúdo numa nova versão
- **WHEN** o aluno abre "Meus favoritos"
- **THEN** esse favorito é ignorado e não aparece na lista
