# Tasks — add-modulo-golpes

## 1. Lista de golpes (R7)

- [x] 1.1 Teste primeiro — seam: render de `/golpes` com conteúdo de fixture: cada item mostra imagem com `alt`, hangul, romanização e tradução; golpe sem imagem mostra o marcador neutro; verificar que falha (R7)
- [x] 1.2 Implementar a lista e o card do golpe (design D5); verificar o teste 1.1 verde (R7)

## 2. Filtro por categoria (R8)

- [x] 2.1 Teste primeiro — seam: `filtrarGolpes(golpes, { categoria })` (unidade) e render com `?categoria=cortes`: só Cortes; categoria vazia mostra "Nenhum golpe nesta categoria"; verificar que falha (R8)
- [x] 2.2 Implementar o seletor de categoria ligado à URL (design D2); verificar o teste 2.1 verde (R8)

## 3. Busca (R9)

- [x] 3.1 Teste primeiro — seam: `normalizar()` e `filtrarGolpes(golpes, { q })` (unidade): "cabeca" e "MEORI" acham Meori chigi; combina com categoria; "xyz" vazio; render mostra "Nenhum golpe encontrado"; verificar que falha (R9)
- [x] 3.2 Implementar o campo de busca (design D1, D2); verificar o teste 3.1 verde (R9)

## 4. Detalhe do golpe (R10)

- [x] 4.1 Teste primeiro — seam: render de `/golpes/:id`: imagem, 3 nomes, descrição e "Faixa: Branca"; id inexistente mostra "Golpe não encontrado"; voltar preserva `?categoria&q`; verificar que falha (R10)
- [x] 4.2 Implementar o detalhe com o `SlotVideoGolpe` vazio (design D4); verificar o teste 4.1 verde (R10)

## 5. Favoritos (R12)

- [x] 5.1 Teste primeiro — seam: `armazenamento.ts` com `localStorage` que lança (fallback em memória) e `useFavoritos()` (alternar, persistir, ignorar id removido do conteúdo); verificar que falha (R12)
- [x] 5.2 Implementar o utilitário e o hook (design D3); verificar o teste 5.1 verde (R12)
- [x] 5.3 Teste primeiro — seam: render do detalhe e da lista: botão "Favoritar"/"Remover dos favoritos" com `aria-pressed`; filtro `?categoria=favoritos` lista só favoritos; verificar que falha (R12)
- [x] 5.4 Implementar o botão e o filtro "Meus favoritos"; verificar o teste 5.3 verde (R12)

## 6. Integração

- [x] 6.1 E2e `@smoke`: filtrar Cortes, buscar "meori", abrir o detalhe, favoritar, recarregar e conferir em "Meus favoritos"; repetir a navegação offline; rodar `expectSemViolacoes` na lista e no detalhe e verificar que passa (R7, R8, R9, R10, R12, RNF6)
