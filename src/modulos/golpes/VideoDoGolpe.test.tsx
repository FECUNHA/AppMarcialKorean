import { screen, within } from '@testing-library/react'
import { conteudoVideos } from '../../test/fixtures/conteudo'
import { PlayerYoutubeFalso } from '../../test/playerFalso'
import { renderRota } from '../../test/renderRota'

vi.mock('../videos/PlayerYoutube', () => ({ PlayerYoutube: PlayerYoutubeFalso }))

function secaoVideo() {
  return screen.queryByRole('region', { name: 'Vídeo' })
}

describe('Vídeo relacionado no detalhe do golpe (R11)', () => {
  test('golpe com video_id mostra a seção "Vídeo" com o player desse vídeo', async () => {
    renderRota('/golpes/meori-chigi', conteudoVideos())
    expect(await screen.findByText('Faixa: Branca')).toBeInTheDocument()
    const secao = secaoVideo()
    expect(secao).toBeInTheDocument()
    expect(within(secao!).getByTestId('player-youtube')).toHaveAttribute('data-youtube-id', 'AAAAAAAAAAA')
  })

  test('golpe sem video_id não mostra a seção', async () => {
    renderRota('/golpes/jjireugi', conteudoVideos())
    expect(await screen.findByText('Faixa: Verde')).toBeInTheDocument()
    expect(secaoVideo()).not.toBeInTheDocument()
  })

  test('offline: a seção mostra "Conecte-se para assistir" e o resto do detalhe aparece', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    renderRota('/golpes/meori-chigi', conteudoVideos())
    expect(await screen.findByText('Faixa: Branca')).toBeInTheDocument()
    expect(screen.getByText('Corte vertical descendente.')).toBeInTheDocument()
    const secao = secaoVideo()!
    expect(within(secao).getByText('Conecte-se para assistir')).toBeInTheDocument()
    expect(within(secao).queryByTestId('player-youtube')).not.toBeInTheDocument()
  })
})
