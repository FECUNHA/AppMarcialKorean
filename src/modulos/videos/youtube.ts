/** Miniatura pública do YouTube (design D3). Nunca entra no precache (design D4). */
export function urlMiniatura(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
}

/** Subconjunto da IFrame Player API que o app usa. */
export interface PlayerYT {
  destroy(): void
}
export interface ApiYT {
  Player: new (
    elemento: HTMLElement,
    opcoes: {
      host: string
      videoId: string
      width?: string
      height?: string
      playerVars: Record<string, number>
      events: {
        onReady?: (e: { target: { getIframe(): HTMLIFrameElement } }) => void
        onError?: (e: { data: number }) => void
      }
    },
  ) => PlayerYT
}

declare global {
  interface Window {
    YT?: ApiYT
    onYouTubeIframeAPIReady?: () => void
  }
}

const URL_API = 'https://www.youtube.com/iframe_api'
let carregando: Promise<ApiYT> | null = null

/** Carrega a IFrame Player API sob demanda, uma única vez (design D1). */
export function carregarApiYoutube(): Promise<ApiYT> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (carregando) return carregando
  carregando = new Promise<ApiYT>((resolver, rejeitar) => {
    const anterior = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      anterior?.()
      if (window.YT?.Player) resolver(window.YT)
      else rejeitar(new Error('IFrame API sem Player'))
    }
    const script = document.createElement('script')
    script.src = URL_API
    script.async = true
    script.addEventListener('error', () => {
      carregando = null // permite tentar de novo quando a rede voltar
      script.remove()
      rejeitar(new Error('Falha ao carregar a IFrame API do YouTube'))
    })
    document.head.appendChild(script)
  })
  return carregando
}

/** Só para testes: esquece a API carregada. */
export function _reiniciarApiYoutube() {
  carregando = null
  delete window.onYouTubeIframeAPIReady
}
