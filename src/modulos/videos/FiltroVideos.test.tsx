import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { conteudoVideos } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

const titulos = async () =>
  within(await screen.findByRole('list', { name: 'Vídeos' }))
    .getAllByRole('listitem')
    .map((li) => li.querySelector('.cartao-video__titulo')?.textContent)

describe('Filtro de vídeos na tela (R15)', () => {
  test('o seletor mostra "Todas" e só as categorias que se aplicam a vídeos', async () => {
    renderRota('/videos', conteudoVideos())
    const seletor = await screen.findByRole('combobox', { name: 'Categoria' })
    expect(within(seletor).getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Todas',
      'Cortes',
      'Estocadas',
      'Defesas',
      'Posturas',
      'Formas',
      'Treinos',
      'História',
    ])
  })

  test('com ?categoria=historia mostra só vídeos de História', async () => {
    renderRota('/videos?categoria=historia', conteudoVideos())
    expect(await titulos()).toEqual(['Origem do Hwarang'])
  })

  test('selecionar Treinos filtra e grava na URL', async () => {
    const { router } = renderRota('/videos', conteudoVideos())
    await userEvent.selectOptions(await screen.findByRole('combobox', { name: 'Categoria' }), 'Treinos')
    expect(router.state.location.search).toBe('?categoria=treinos')
    expect(await titulos()).toEqual(['Aquecimento'])
  })

  test('categoria sem vídeos mostra "Nenhum vídeo nesta categoria"', async () => {
    renderRota('/videos?categoria=formas', conteudoVideos())
    expect(await screen.findByText('Nenhum vídeo nesta categoria')).toBeInTheDocument()
  })
})
