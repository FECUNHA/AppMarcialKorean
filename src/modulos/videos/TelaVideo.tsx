import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ComConteudo } from '../../conteudo/ConteudoProvider'
import type { Conteudo, Video } from '../../conteudo/schema'
import { useOnline } from '../../lib/useOnline'
import { AvisoSemInternet } from './AvisoSemInternet'
import { formatarDuracao } from './duracao'
import { PlayerYoutube } from './PlayerYoutube'

export function TelaVideo() {
  const { id } = useParams()
  return (
    <main className="tela">
      <BotaoVoltar />
      <ComConteudo>
        {(conteudo) => {
          const video = conteudo.videos.find((v) => v.id === id)
          return video ? <DetalheVideo video={video} conteudo={conteudo} /> : <VideoNaoEncontrado />
        }}
      </ComConteudo>
    </main>
  )
}

function BotaoVoltar() {
  const navigate = useNavigate()
  const { key } = useLocation()
  return (
    <button
      type="button"
      className="botao-voltar"
      onClick={() => (key === 'default' ? navigate('/videos') : navigate(-1))}
    >
      Voltar
    </button>
  )
}

function DetalheVideo({ video, conteudo }: { video: Video; conteudo: Conteudo }) {
  const online = useOnline()
  const categoria = conteudo.categorias.find((c) => c.id === video.categoria)?.nome ?? video.categoria
  return (
    <article className="detalhe-video">
      <h1>{video.titulo}</h1>
      <p className="detalhe-video__meta">
        {categoria} · {formatarDuracao(video.duracao)}
      </p>
      <div className="detalhe-video__player">
        {online ? <PlayerYoutube youtubeId={video.youtube_id} titulo={video.titulo} /> : <AvisoSemInternet />}
      </div>
    </article>
  )
}

function VideoNaoEncontrado() {
  return (
    <>
      <h1>Vídeo não encontrado</h1>
      <p>
        <Link to="/videos">Ver todos os vídeos</Link>
      </p>
    </>
  )
}
