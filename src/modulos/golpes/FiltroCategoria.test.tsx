import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { conteudoGolpes } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

const nomesNaLista = async () =>
  within(await screen.findByRole('list', { name: 'Golpes' }))
    .getAllByRole('listitem')
    .map((li) => li.querySelector('.cartao-golpe__romanizado')?.textContent)

describe('Filtro por categoria na tela (R8)', () => {
  test('oferece "Todas", só as categorias de golpe e "Meus favoritos"', async () => {
    renderRota('/golpes', conteudoGolpes())
    const seletor = await screen.findByRole('combobox', { name: 'Categoria' })
    expect(within(seletor).getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Todas',
      'Cortes',
      'Estocadas',
      'Defesas',
      'Posturas',
      'Formas',
      'Meus favoritos',
    ])
  })

  test('com ?categoria=cortes mostra só Cortes (CA03)', async () => {
    renderRota('/golpes?categoria=cortes', conteudoGolpes())
    expect(await nomesNaLista()).toEqual(['Meori chigi', 'Heori chigi'])
    expect(screen.getByRole('combobox', { name: 'Categoria' })).toHaveValue('cortes')
  })

  test('selecionar uma categoria filtra e grava na URL', async () => {
    const { router } = renderRota('/golpes', conteudoGolpes())
    await userEvent.selectOptions(await screen.findByRole('combobox', { name: 'Categoria' }), 'Estocadas')
    expect(router.state.location.search).toBe('?categoria=estocadas')
    expect(await nomesNaLista()).toEqual(['Jjireugi'])
  })

  test('categoria vazia mostra "Nenhum golpe nesta categoria"', async () => {
    renderRota('/golpes?categoria=formas', conteudoGolpes())
    expect(await screen.findByText('Nenhum golpe nesta categoria')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Golpes' })).not.toBeInTheDocument()
  })
})
