import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { conteudoGolpes } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

describe('Detalhe do golpe (R10)', () => {
  test('mostra imagem, os 3 nomes, a descrição e a faixa (CA05)', async () => {
    renderRota('/golpes/meori-chigi', conteudoGolpes())
    expect(await screen.findByRole('heading', { level: 1, name: /Meori chigi/ })).toBeInTheDocument()
    const img = screen.getByRole('img', { name: 'Praticante finalizando um corte vertical' })
    expect(img).toHaveAttribute('src', '/conteudo/golpes/meori-chigi.webp')
    expect(screen.getByText('머리치기')).toHaveAttribute('lang', 'ko')
    expect(screen.getByText('Corte na cabeça')).toBeInTheDocument()
    expect(screen.getByText('Corte vertical descendente.')).toBeInTheDocument()
    expect(screen.getByText('Faixa: Branca')).toBeInTheDocument()
  })

  test('golpe sem imagem mostra o marcador neutro', async () => {
    renderRota('/golpes/makgi', conteudoGolpes())
    expect(await screen.findByRole('heading', { level: 1, name: /Makgi/ })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByTestId('marcador-sem-imagem')).toBeInTheDocument()
  })

  test('id inexistente mostra "Golpe não encontrado" com link para a lista', async () => {
    renderRota('/golpes/nao-existe', conteudoGolpes())
    expect(await screen.findByRole('heading', { level: 1, name: 'Golpe não encontrado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver todos os golpes' })).toHaveAttribute('href', '/golpes')
  })

  test('tocar no golpe na lista abre o detalhe', async () => {
    const { router } = renderRota('/golpes', conteudoGolpes())
    await userEvent.click(await screen.findByRole('link', { name: /Meori chigi/ }))
    expect(router.state.location.pathname).toBe('/golpes/meori-chigi')
    expect(await screen.findByText('Faixa: Branca')).toBeInTheDocument()
  })

  test('voltar preserva ?categoria e ?q da lista', async () => {
    const { router } = renderRota(['/golpes?categoria=cortes&q=meori', '/golpes/meori-chigi'], conteudoGolpes())
    await userEvent.click(await screen.findByRole('button', { name: 'Voltar' }))
    expect(router.state.location.pathname).toBe('/golpes')
    expect(router.state.location.search).toBe('?categoria=cortes&q=meori')
  })

  test('voltar sem histórico (link aberto direto) vai para a lista', async () => {
    const { router } = renderRota('/golpes/meori-chigi', conteudoGolpes())
    await userEvent.click(await screen.findByRole('button', { name: 'Voltar' }))
    expect(router.state.location.pathname).toBe('/golpes')
  })
})
