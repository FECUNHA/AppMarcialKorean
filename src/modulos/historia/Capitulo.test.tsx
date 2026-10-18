import { screen } from '@testing-library/react'
import { conteudoHistoria } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

describe('Leitura do capítulo (R5)', () => {
  test('capítulo com imagem: título, parágrafos e figure com alt e legenda (CA02)', async () => {
    const { container } = renderRota('/historia/o-que-e', conteudoHistoria())
    expect(await screen.findByRole('heading', { level: 1, name: 'O que é o Hwarang Kumdo' })).toBeInTheDocument()

    const paragrafos = container.querySelectorAll('.capitulo__texto p')
    expect([...paragrafos].map((p) => p.textContent)).toEqual([
      'Primeiro parágrafo com Hwarang em negrito.',
      'Segundo parágrafo.',
    ])
    expect(screen.getByText('Hwarang', { selector: 'strong' })).toBeInTheDocument()

    const figura = screen.getByRole('figure')
    const img = screen.getByRole('img', { name: 'Dois praticantes treinando cortes' })
    expect(figura).toContainElement(img)
    expect(img).toHaveAttribute('src', '/conteudo/historia/treino.webp')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(figura.querySelector('figcaption')).toHaveTextContent('Treino em dupla')
  })

  test('capítulo sem imagem não renderiza figure', async () => {
    renderRota('/historia/equipamentos', conteudoHistoria())
    expect(await screen.findByRole('heading', { level: 1, name: 'Equipamentos' })).toBeInTheDocument()
    expect(screen.getByText('Texto de Equipamentos.')).toBeInTheDocument()
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
  })

  test('id inexistente mostra "Capítulo não encontrado" com link para a lista', async () => {
    renderRota('/historia/nao-existe', conteudoHistoria())
    expect(await screen.findByRole('heading', { level: 1, name: 'Capítulo não encontrado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver todos os capítulos' })).toHaveAttribute('href', '/historia')
  })

  test('HTML no texto aparece como texto, sem virar marcação (design D1)', async () => {
    const c = conteudoHistoria()
    c.capitulos[0].texto = 'Antes <img src=x onerror=alert(1)> depois'
    const { container } = renderRota('/historia/equipamentos', c)
    expect(await screen.findByText('Antes <img src=x onerror=alert(1)> depois')).toBeInTheDocument()
    expect(container.querySelector('.capitulo__texto img')).toBeNull()
  })
})
