import { useEffect, useRef, useState } from 'react'
import { carregarApiYoutube, type PlayerYT } from './youtube'

/** Códigos de onError da IFrame API: id inválido, erro HTML5, removido, incorporação bloqueada. */
const ERROS_INDISPONIVEL = new Set([2, 5, 100, 101, 150])

/**
 * Player oficial incorporado do YouTube em modo de privacidade aprimorada (design D1, RNF7).
 * Reproduz dentro do app (`playsinline`); vídeo removido ou bloqueado vira um aviso.
 */
export function PlayerYoutube({ youtubeId, titulo }: { youtubeId: string; titulo: string }) {
  const alvo = useRef<HTMLDivElement>(null)
  const [indisponivel, setIndisponivel] = useState(false)

  useEffect(() => {
    let ativo = true
    let player: PlayerYT | null = null
    setIndisponivel(false)
    carregarApiYoutube().then(
      (YT) => {
        if (!ativo || !alvo.current) return
        const elemento = document.createElement('div')
        alvo.current.replaceChildren(elemento)
        player = new YT.Player(elemento, {
          host: 'https://www.youtube-nocookie.com',
          videoId: youtubeId,
          width: '100%',
          height: '100%',
          playerVars: { playsinline: 1, rel: 0 },
          events: {
            onReady: (e) => e.target.getIframe().setAttribute('title', `Vídeo: ${titulo}`),
            onError: (e) => {
              if (!ERROS_INDISPONIVEL.has(e.data)) return
              player?.destroy()
              player = null
              if (ativo) setIndisponivel(true)
            },
          },
        })
      },
      () => ativo && setIndisponivel(true),
    )
    return () => {
      ativo = false
      player?.destroy()
    }
  }, [youtubeId, titulo])

  if (indisponivel)
    return (
      <p role="status" className="aviso-video">
        Este vídeo não está disponível
      </p>
    )
  return <div ref={alvo} className="player-youtube" />
}
