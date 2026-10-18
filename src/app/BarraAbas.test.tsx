import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRota } from '../test/renderRota'

function barra() {
  return within(screen.getByRole('navigation', { name: 'Módulos' }))
}

describe('Barra de abas (R2)', () => {
  test('mostra as 4 abas na ordem', () => {
    renderRota('/golpes')
    expect(barra().getAllByRole('link').map((a) => a.textContent)).toEqual(['História', 'Golpes', 'Vídeos', 'Quiz'])
  })

  test('marca só a aba ativa com aria-current="page"', () => {
    renderRota('/golpes')
    expect(barra().getByRole('link', { name: 'Golpes' })).toHaveAttribute('aria-current', 'page')
    for (const nome of ['História', 'Vídeos', 'Quiz']) {
      expect(barra().getByRole('link', { name: nome })).not.toHaveAttribute('aria-current')
    }
  })

  test('tocar na aba Quiz troca de módulo e de aba ativa', async () => {
    const { router } = renderRota('/golpes')
    await userEvent.click(barra().getByRole('link', { name: 'Quiz' }))
    expect(router.state.location.pathname).toBe('/quiz')
    expect(screen.getByRole('heading', { level: 1, name: 'Quiz' })).toBeInTheDocument()
    expect(barra().getByRole('link', { name: 'Quiz' })).toHaveAttribute('aria-current', 'page')
    expect(barra().getByRole('link', { name: 'Golpes' })).not.toHaveAttribute('aria-current')
  })

  test('aparece nas telas de primeiro nível, inclusive a inicial', () => {
    renderRota('/')
    expect(screen.getByRole('navigation', { name: 'Módulos' })).toBeInTheDocument()
  })
})
