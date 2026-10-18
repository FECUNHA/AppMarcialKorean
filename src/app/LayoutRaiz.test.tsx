import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { definirProvedor, provedorNoop } from '../analytics/track'
import { renderRota } from '../test/renderRota'

afterEach(() => definirProvedor(provedorNoop))

test('trocar de aba dispara modulo_aberto com o módulo (RNF8)', async () => {
  const enviar = vi.fn()
  definirProvedor({ enviar })
  renderRota('/')
  expect(enviar).not.toHaveBeenCalled() // a tela inicial não é um módulo

  const barra = within(screen.getByRole('navigation', { name: 'Módulos' }))
  await userEvent.click(barra.getByRole('link', { name: 'Golpes' }))
  await userEvent.click(barra.getByRole('link', { name: 'Quiz' }))

  expect(enviar.mock.calls.map(([p]) => [p.evento, p.modulo])).toEqual([
    ['modulo_aberto', 'golpes'],
    ['modulo_aberto', 'quiz'],
  ])
})
