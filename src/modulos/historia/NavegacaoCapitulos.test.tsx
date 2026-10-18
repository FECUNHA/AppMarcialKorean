import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { conteudoHistoria } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

async function navegacao() {
  return within(await screen.findByRole('navigation', { name: 'Capítulos' }))
}

describe('Navegação entre capítulos (R6)', () => {
  test('no primeiro não há "Anterior" e "Próximo" leva ao segundo', async () => {
    const { router } = renderRota('/historia/o-que-e', conteudoHistoria())
    const nav = await navegacao()
    expect(nav.queryByRole('link', { name: /Anterior/ })).not.toBeInTheDocument()
    await userEvent.click(nav.getByRole('link', { name: /Próximo/ }))
    expect(router.state.location.pathname).toBe('/historia/significado-do-nome')
    expect(await screen.findByRole('heading', { level: 1, name: 'Significado do nome' })).toBeInTheDocument()
  })

  test('no último não há "Próximo"', async () => {
    renderRota('/historia/contexto-historico', conteudoHistoria())
    const nav = await navegacao()
    expect(nav.queryByRole('link', { name: /Próximo/ })).not.toBeInTheDocument()
    expect(nav.getByRole('link', { name: /Anterior/ })).toHaveAttribute('href', '/historia/diferencas-outras-artes')
  })

  test('os links dizem o título do capítulo de destino', async () => {
    renderRota('/historia/equipamentos', conteudoHistoria())
    const nav = await navegacao()
    expect(nav.getByRole('link', { name: 'Anterior: Como é treinado' })).toBeInTheDocument()
    expect(nav.getByRole('link', { name: 'Próximo: Diferenças para outras artes de espada' })).toBeInTheDocument()
  })
})
