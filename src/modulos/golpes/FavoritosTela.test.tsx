import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { conteudoGolpes } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

const nomesNaLista = async () =>
  within(await screen.findByRole('list', { name: 'Golpes' }))
    .getAllByRole('listitem')
    .map((li) => li.querySelector('.cartao-golpe__romanizado')?.textContent)

describe('Favoritos na tela (R12)', () => {
  test('botão no detalhe alterna "Favoritar" / "Remover dos favoritos" com aria-pressed', async () => {
    renderRota('/golpes/meori-chigi', conteudoGolpes())
    const favoritar = await screen.findByRole('button', { name: 'Favoritar' })
    expect(favoritar).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(favoritar)
    const remover = screen.getByRole('button', { name: 'Remover dos favoritos' })
    expect(remover).toHaveAttribute('aria-pressed', 'true')
    expect(JSON.parse(localStorage.getItem('hk:favoritos')!)).toEqual(['meori-chigi'])

    await userEvent.click(remover)
    expect(screen.getByRole('button', { name: 'Favoritar' })).toHaveAttribute('aria-pressed', 'false')
  })

  test('seletor oferece "Meus favoritos"', async () => {
    renderRota('/golpes', conteudoGolpes())
    const seletor = await screen.findByRole('combobox', { name: 'Categoria' })
    expect(within(seletor).getByRole('option', { name: 'Meus favoritos' })).toHaveValue('favoritos')
  })

  test('?categoria=favoritos lista só os favoritos', async () => {
    localStorage.setItem('hk:favoritos', JSON.stringify(['jjireugi', 'makgi']))
    renderRota('/golpes?categoria=favoritos', conteudoGolpes())
    expect(await nomesNaLista()).toEqual(['Jjireugi', 'Makgi'])
  })

  test('favoritos combinam com a busca', async () => {
    localStorage.setItem('hk:favoritos', JSON.stringify(['jjireugi', 'makgi']))
    renderRota('/golpes?categoria=favoritos&q=makgi', conteudoGolpes())
    expect(await nomesNaLista()).toEqual(['Makgi'])
  })

  test('sem favoritos mostra mensagem orientando a favoritar', async () => {
    renderRota('/golpes?categoria=favoritos', conteudoGolpes())
    expect(await screen.findByText('Você ainda não tem favoritos. Abra um golpe e toque em "Favoritar".')).toBeInTheDocument()
  })

  test('favoritar no detalhe e voltar mostra o golpe em "Meus favoritos"', async () => {
    renderRota(['/golpes?categoria=favoritos', '/golpes/heori-chigi'], conteudoGolpes())
    await userEvent.click(await screen.findByRole('button', { name: 'Favoritar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    expect(await nomesNaLista()).toEqual(['Heori chigi'])
  })
})
