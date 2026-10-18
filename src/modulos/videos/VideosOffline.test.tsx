import { act, screen } from '@testing-library/react'
import { conteudoVideos } from '../../test/fixtures/conteudo'
import { PlayerYoutubeFalso } from '../../test/playerFalso'
import { renderRota } from '../../test/renderRota'

vi.mock('./PlayerYoutube', () => ({ PlayerYoutube: PlayerYoutubeFalso }))

function definirConexao(online: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(online)
  window.dispatchEvent(new Event(online ? 'online' : 'offline'))
}

describe('Vídeos sem internet (R14, RN10)', () => {
  test('aba Vídeos offline mostra "Conecte-se para assistir" e a lista volta ao reconectar (CA07)', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    renderRota('/videos', conteudoVideos())
    expect(await screen.findByText('Conecte-se para assistir')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Vídeos' })).not.toBeInTheDocument()

    act(() => definirConexao(true))
    expect(await screen.findByRole('list', { name: 'Vídeos' })).toBeInTheDocument()
    expect(screen.queryByText('Conecte-se para assistir')).not.toBeInTheDocument()
  })

  test('cair a conexão troca o player do vídeo pelo aviso', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    renderRota('/videos/yt-001', conteudoVideos())
    expect(await screen.findByTestId('player-youtube')).toBeInTheDocument()
    act(() => definirConexao(false))
    expect(screen.queryByTestId('player-youtube')).not.toBeInTheDocument()
    expect(screen.getByText('Conecte-se para assistir')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Meori chigi passo a passo' })).toBeInTheDocument()
  })
})
