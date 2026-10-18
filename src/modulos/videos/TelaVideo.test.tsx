import { screen } from '@testing-library/react'
import { conteudoVideos } from '../../test/fixtures/conteudo'
import { PlayerYoutubeFalso } from '../../test/playerFalso'
import { renderRota } from '../../test/renderRota'

vi.mock('./PlayerYoutube', () => ({ PlayerYoutube: PlayerYoutubeFalso }))

describe('Tela do vídeo (R14)', () => {
  test('mostra título, categoria e o player incorporado do vídeo (CA06)', async () => {
    renderRota('/videos/yt-002', conteudoVideos())
    expect(await screen.findByRole('heading', { level: 1, name: 'Origem do Hwarang' })).toBeInTheDocument()
    expect(screen.getByTestId('player-youtube')).toHaveAttribute('data-youtube-id', 'BBBBBBBBBBB')
    expect(screen.getByText('História · 1:02:05')).toBeInTheDocument()
    expect(document.querySelector('a[target="_blank"]')).toBeNull()
  })

  test('id inexistente mostra "Vídeo não encontrado" com link para a lista', async () => {
    renderRota('/videos/nao-existe', conteudoVideos())
    expect(await screen.findByRole('heading', { level: 1, name: 'Vídeo não encontrado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver todos os vídeos' })).toHaveAttribute('href', '/videos')
  })

  test('tocar num vídeo da lista abre a tela dele dentro do app', async () => {
    const { router } = renderRota('/videos', conteudoVideos())
    ;(await screen.findByRole('link', { name: /Aquecimento/ })).click()
    expect(await screen.findByRole('heading', { level: 1, name: 'Aquecimento' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/videos/yt-003')
  })
})
