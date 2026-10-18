# quiz Specification

## Purpose

Exercita a memorização da nomenclatura coreana: o aluno vê a imagem de um golpe, escolhe o nome entre 4 alternativas, recebe a correção na hora e, no fim da rodada, vê a pontuação e revisa os golpes que errou.

## Requirements

### Requirement: Composição da rodada (R16)
O sistema SHALL montar cada rodada com até 10 perguntas sobre golpes com imagem, sem repetir golpe na mesma rodada (RN03), cada pergunta com a imagem do golpe e 4 alternativas de nome em ordem embaralhada (RN05).

#### Scenario: Rodada padrão (CA08)
- **GIVEN** um catálogo com 30 golpes com imagem
- **WHEN** o aluno inicia o quiz
- **THEN** a rodada tem 10 perguntas, nenhum golpe se repete
- **AND** cada pergunta mostra a imagem e 4 alternativas, das quais exatamente 1 é o nome correto

#### Scenario: Catálogo com menos de 10 golpes elegíveis
- **GIVEN** 5 golpes com imagem e 2 sem imagem
- **WHEN** o aluno inicia o quiz
- **THEN** a rodada tem 5 perguntas e nenhum golpe sem imagem aparece como pergunta

### Requirement: Alternativas erradas da mesma categoria (R16)
O sistema SHALL escolher as 3 alternativas erradas entre golpes da mesma categoria do golpe da pergunta quando a categoria tiver ao menos 4 golpes com imagem, completando com outras categorias quando não tiver (RN04).

#### Scenario: Categoria grande (CA13)
- **GIVEN** a categoria Cortes com 6 golpes com imagem
- **WHEN** é gerada uma pergunta sobre um golpe de Cortes
- **THEN** as 3 alternativas erradas são golpes de Cortes

#### Scenario: Categoria pequena
- **GIVEN** a categoria Estocadas com 1 golpe com imagem
- **WHEN** é gerada uma pergunta sobre esse golpe
- **THEN** as 3 alternativas erradas vêm de outras categorias e nenhuma repete

### Requirement: Quiz indisponível com catálogo insuficiente (R16)
O sistema SHALL impedir o início do quiz quando houver menos de 4 golpes com imagem (RN06), informando o motivo.

#### Scenario: Menos de 4 golpes (CA12)
- **GIVEN** 3 golpes com imagem
- **WHEN** o aluno abre o Quiz
- **THEN** ele vê "O quiz precisa de pelo menos 4 golpes com imagem"
- **AND** o botão "Iniciar" fica desabilitado

### Requirement: Correção imediata (R17)
O sistema SHALL, após a resposta, indicar acerto ou erro, destacar a alternativa correta com o nome em coreano (hangul e romanização) e em português, e só então permitir avançar.

#### Scenario: Resposta errada (CA09)
- **GIVEN** a pergunta sobre o Meori chigi
- **WHEN** o aluno escolhe "Sonmok chigi"
- **THEN** a escolha aparece como errada, e "머리치기 · Meori chigi — Corte na cabeça" aparece como correta
- **AND** as alternativas ficam bloqueadas e o botão "Próxima" fica disponível

#### Scenario: Resposta certa
- **GIVEN** a pergunta sobre o Meori chigi
- **WHEN** o aluno escolhe "Meori chigi"
- **THEN** a escolha aparece como certa, com o nome em hangul e em português

#### Scenario: Correção não depende só de cor
- **GIVEN** a correção exibida
- **WHEN** um leitor de tela lê a pergunta
- **THEN** ele anuncia "Certo" ou "Errado" e o nome correto

### Requirement: Resultado da rodada (R18)
O sistema SHALL exibir, ao fim da rodada, os acertos sobre o total e o percentual (1 ponto por acerto — RN07), a lista de golpes errados e as opções "Jogar de novo" e "Revisar golpes errados".

#### Scenario: Rodada com erros
- **GIVEN** uma rodada de 10 perguntas com 7 acertos
- **WHEN** a última pergunta é respondida e o aluno avança
- **THEN** o resultado mostra "7/10" e "70%" e lista os 3 golpes errados
- **AND** "Jogar de novo" inicia uma nova rodada sorteada

#### Scenario: Revisar golpes errados
- **GIVEN** o resultado com 3 golpes errados
- **WHEN** o aluno toca em "Revisar golpes errados"
- **THEN** o detalhe do primeiro golpe errado é aberto
- **AND** voltar retorna ao resultado, de onde cada golpe errado abre o próprio detalhe

#### Scenario: Rodada sem erros
- **GIVEN** uma rodada com todos os acertos
- **WHEN** o resultado é exibido
- **THEN** a opção "Revisar golpes errados" não aparece

### Requirement: Melhor pontuação no aparelho (R18)
O sistema SHALL guardar no aparelho apenas a melhor pontuação (RN08) e exibi-la na tela inicial do Quiz.

#### Scenario: Novo recorde (CA10)
- **GIVEN** a melhor pontuação salva é 60%
- **WHEN** o aluno termina uma rodada com 70%
- **THEN** a tela do Quiz passa a mostrar "Melhor pontuação: 70%"

#### Scenario: Abaixo do recorde
- **GIVEN** a melhor pontuação salva é 80%
- **WHEN** o aluno termina uma rodada com 70%
- **THEN** a melhor pontuação continua 80%
