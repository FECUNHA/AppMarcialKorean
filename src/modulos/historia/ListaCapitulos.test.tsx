import { screen, within } from '@testing-library/react'
import { conteudoHistoria } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

describe('Lista de capítulos (R4)', () => {
  test('mostra os 6 títulos na ordem do conteúdo, cada um levando ao capítulo', async () => {
    renderRota('/historia', conteudoHistoria())
    const links = within(await screen.findByRole('list', { name: 'Capítulos' })).getAllByRole('link')
    expect(links.map((a) => a.textContent)).toEqual([
      'O que é o Hwarang Kumdo',
      'Significado do nome',
      'Como é treinado',
      'Equipamentos',
      'Diferenças para outras artes de espada',
      'Contexto histórico',
    ])
    expect(links[0]).toHaveAttribute('href', '/historia/o-que-e')
  })

  test('mantém o título do módulo', async () => {
    renderRota('/historia', conteudoHistoria())
    expect(screen.getByRole('heading', { level: 1, name: 'História' })).toBeInTheDocument()
  })
})
