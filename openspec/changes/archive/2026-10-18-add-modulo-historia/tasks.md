# Tasks — add-modulo-historia

## 1. Lista de capítulos (R4)

- [x] 1.1 Teste primeiro — seam: `capitulosOrdenados()` (unidade) e render da rota `/historia` com conteúdo de fixture: 6 títulos na ordem de `ordem`; verificar que falha (R4)
- [x] 1.2 Implementar o seletor e a tela de lista; verificar o teste 1.1 verde (R4)

## 2. Tela do capítulo (R5)

- [x] 2.1 Teste primeiro — seam: render de `/historia/:id`: capítulo com imagem mostra título, texto em parágrafos e `<figure>` com `alt` e legenda; sem imagem não renderiza `<figure>`; id inexistente mostra "Capítulo não encontrado" com link para a lista; verificar que falha (R5)
- [x] 2.2 Implementar a tela do capítulo (design D1, D3); verificar o teste 2.1 verde (R5)

## 3. Anterior / próximo (R6)

- [x] 3.1 Teste primeiro — seam: `vizinhos()` (unidade): primeiro sem anterior, último sem próximo; render mostra só os botões cabíveis; verificar que falha (R6)
- [x] 3.2 Implementar a navegação entre capítulos; verificar o teste 3.1 verde (R6)

## 4. Integração

- [x] 4.1 E2e `@smoke`: abrir História pela barra, ler o 1º capítulo, ir ao próximo, e repetir com o app offline após o 1º acesso; rodar `expectSemViolacoes` nas duas telas e verificar que passa (R4, R5, RNF6)
