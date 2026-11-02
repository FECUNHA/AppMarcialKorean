import type { Golpe } from '../../conteudo/schema'
import { useConteudo } from '../../conteudo/useConteudo'
import { useOnline } from '../../lib/useOnline'
import { AvisoSemInternet } from '../videos/AvisoSemInternet'
import { PlayerYoutube } from '../videos/PlayerYoutube'

export interface SlotVideoGolpeProps {
  golpe: Golpe
}

/**
 * Vídeo relacionado no detalhe do golpe (R11) — ponto de extensão do design D4 de add-modulo-golpes.
 * Sem vídeo associado ao golpe, a seção não aparece; sem internet, mostra o aviso no lugar do player.
 */
export function SlotVideoGolpe({ golpe }: SlotVideoGolpeProps) {
  const estado = useConteudo()
  const online = useOnline()
  if (estado.estado !== 'pronto') return null
  // A ligação golpe → vídeo é declarada no vídeo (`golpe` em videos.json).
  const video = estado.conteudo.videos.find((v) => v.golpe_id === golpe.id)
  if (!video) return null
  return (
    <section className="video-golpe" aria-labelledby="titulo-video-golpe">
      <h2 id="titulo-video-golpe">Vídeo</h2>
      <div className="detalhe-video__player">
        {online ? <PlayerYoutube youtubeId={video.youtube_id} titulo={video.titulo} /> : <AvisoSemInternet />}
      </div>
    </section>
  )
}
