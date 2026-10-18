import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRota } from '../test/renderRota'

const MODULOS = [
  { nome: 'História', caminho: '/historia' },
  { nome: 'Golpes', caminho: '/golpes' },
  { nome: 'Vídeos', caminho: '/videos' },
  { nome: 'Quiz', caminho: '/quiz' },
]

describe('Tela inicial (R1)', () => {
  test('mostra os 4 módulos', () => {
    renderRota('/')
    const inicio = within(screen.getByRole('main'))
    for (const { nome, caminho } of MODULOS) {
      expect(inicio.getByRole('link', { name: new RegExp(nome) })).toHaveAttribute('href', caminho)
    }
  })

  test.each(MODULOS)('tocar em $nome abre $caminho', async ({ nome, caminho }) => {
    const { router } = renderRota('/')
    await userEvent.click(within(screen.getByRole('main')).getByRole('link', { name: new RegExp(nome) }))
    expect(router.state.location.pathname).toBe(caminho)
    expect(await screen.findByRole('heading', { level: 1, name: nome })).toBeInTheDocument()
  })
})

test('mostra a versão do conteúdo carregado', async () => {
  renderRota('/')
  expect(await screen.findByText('Versão do conteúdo: 1.0.0')).toBeInTheDocument()
})
