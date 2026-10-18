import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { conteudoGolpes } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

const nomesNaLista = async () =>
  within(await screen.findByRole('list', { name: 'Golpes' }))
    .getAllByRole('listitem')
    .map((li) => li.querySelector('.cartao-golpe__romanizado')?.textContent)

describe('Busca na tela (R9)', () => {
  test('digitar filtra a lista e grava q na URL', async () => {
    const { router } = renderRota('/golpes', conteudoGolpes())
    await userEvent.type(await screen.findByRole('searchbox', { name: 'Buscar golpe' }), 'cabeca')
    expect(await nomesNaLista()).toEqual(['Meori chigi'])
    expect(router.state.location.search).toBe('?q=cabeca')
  })

  test('campo indica que a busca é em português ou romanizado', async () => {
    renderRota('/golpes', conteudoGolpes())
    expect(await screen.findByRole('searchbox', { name: 'Buscar golpe' })).toHaveAttribute(
      'placeholder',
      'Busque em português ou romanizado',
    )
  })

  test('com ?categoria e ?q combina os dois filtros', async () => {
    renderRota('/golpes?categoria=cortes&q=cintura', conteudoGolpes())
    expect(await nomesNaLista()).toEqual(['Heori chigi'])
    expect(screen.getByRole('searchbox', { name: 'Buscar golpe' })).toHaveValue('cintura')
  })

  test('busca sem resultado mostra "Nenhum golpe encontrado"', async () => {
    renderRota('/golpes?q=xyz', conteudoGolpes())
    expect(await screen.findByText('Nenhum golpe encontrado')).toBeInTheDocument()
  })
})
