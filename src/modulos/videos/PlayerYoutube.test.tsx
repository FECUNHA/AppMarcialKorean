import { act, render, screen, waitFor } from '@testing-library/react'
import { PlayerYoutube } from './PlayerYoutube'
import { _reiniciarApiYoutube } from './youtube'

interface OpcoesPlayer {
  host: string
  videoId: string
  playerVars: Record<string, number>
  events: { onError: (e: { data: number }) => void; onReady: (e: { target: { getIframe(): HTMLIFrameElement } }) => void }
}

function simularApi() {
  const destroy = vi.fn()
  const Player = vi.fn(function (this: unknown, _el: HTMLElement, _opcoes: OpcoesPlayer) {
    return { destroy }
  })
  vi.stubGlobal('YT', { Player })
  return { Player, destroy, opcoes: () => Player.mock.calls[0][1] as OpcoesPlayer }
}

afterEach(() => {
  _reiniciarApiYoutube()
  document.querySelectorAll('script[src*="iframe_api"]').forEach((s) => s.remove())
})

describe('PlayerYoutube (R14, RNF7)', () => {
  test('cria o player no host youtube-nocookie, inline e sem relacionados de outros canais', async () => {
    const api = simularApi()
    render(<PlayerYoutube youtubeId="AAAAAAAAAAA" titulo="Meori chigi" />)
    await waitFor(() => expect(api.Player).toHaveBeenCalledTimes(1))
    expect(api.opcoes()).toMatchObject({
      host: 'https://www.youtube-nocookie.com',
      videoId: 'AAAAAAAAAAA',
      playerVars: { playsinline: 1, rel: 0 },
    })
  })

  test('dá ao iframe o título do vídeo (leitor de tela)', async () => {
    const api = simularApi()
    render(<PlayerYoutube youtubeId="AAAAAAAAAAA" titulo="Meori chigi" />)
    await waitFor(() => expect(api.Player).toHaveBeenCalled())
    const iframe = document.createElement('iframe')
    act(() => api.opcoes().events.onReady({ target: { getIframe: () => iframe } }))
    expect(iframe).toHaveAttribute('title', 'Vídeo: Meori chigi')
  })

  test.each([2, 5, 100, 101, 150])('onError %i mostra "Este vídeo não está disponível"', async (codigo) => {
    const api = simularApi()
    render(<PlayerYoutube youtubeId="AAAAAAAAAAA" titulo="Meori chigi" />)
    await waitFor(() => expect(api.Player).toHaveBeenCalled())
    act(() => api.opcoes().events.onError({ data: codigo }))
    expect(screen.getByRole('status')).toHaveTextContent('Este vídeo não está disponível')
    expect(api.destroy).toHaveBeenCalled()
  })

  test('destrói o player ao sair da tela', async () => {
    const api = simularApi()
    const { unmount } = render(<PlayerYoutube youtubeId="AAAAAAAAAAA" titulo="x" />)
    await waitFor(() => expect(api.Player).toHaveBeenCalled())
    unmount()
    expect(api.destroy).toHaveBeenCalled()
  })

  test('sem a API carregada, injeta o script do YouTube uma única vez', async () => {
    render(
      <>
        <PlayerYoutube youtubeId="AAAAAAAAAAA" titulo="a" />
        <PlayerYoutube youtubeId="BBBBBBBBBBB" titulo="b" />
      </>,
    )
    await waitFor(() =>
      expect(document.querySelectorAll('script[src="https://www.youtube.com/iframe_api"]')).toHaveLength(1),
    )
    const api = simularApi()
    act(() => (window as unknown as { onYouTubeIframeAPIReady: () => void }).onYouTubeIframeAPIReady())
    await waitFor(() => expect(api.Player).toHaveBeenCalledTimes(2))
  })

  test('script do YouTube que falha ao carregar mostra indisponível', async () => {
    render(<PlayerYoutube youtubeId="AAAAAAAAAAA" titulo="a" />)
    const script = await waitFor(() => {
      const s = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]')
      if (!s) throw new Error('sem script')
      return s
    })
    act(() => script.dispatchEvent(new Event('error')))
    expect(await screen.findByText('Este vídeo não está disponível')).toBeInTheDocument()
  })
})
