import { Link, useSearchParams } from 'react-router-dom'
import { ComConteudo } from '../../conteudo/ConteudoProvider'
import type { Conteudo, Video } from '../../conteudo/schema'
import { useOnline } from '../../lib/useOnline'
import { AvisoSemInternet } from './AvisoSemInternet'
import { formatarDuracao } from './duracao'
import { filtrarVideos } from './filtro'
import { urlMiniatura } from './youtube'

export function TelaVideos() {
  return (
    <main className="tela">
      <h1>Vídeos</h1>
      <ComConteudo>{(conteudo) => <CatalogoVideos conteudo={conteudo} />}</ComConteudo>
    </main>
  )
}

function CatalogoVideos({ conteudo }: { conteudo: Conteudo }) {
  const online = useOnline()
  const [params, setParams] = useSearchParams()
  const categoria = params.get('categoria') ?? 'todas'
  const nomeCategoria = new Map(conteudo.categorias.map((c) => [c.id, c.nome]))
  const categorias = conteudo.categorias.filter((c) => c.aplica_a.includes('videos'))
  const videos = filtrarVideos(conteudo.videos, { categoria })

  function alterarCategoria(valor: string) {
    const novos = new URLSearchParams(params)
    if (valor === 'todas') novos.delete('categoria')
    else novos.set('categoria', valor)
    setParams(novos, { replace: true })
  }

  if (!online) return <AvisoSemInternet />
  if (conteudo.videos.length === 0) return <p className="vazio">Nenhum vídeo disponível ainda.</p>
  return (
    <>
      <label className="campo">
        <span className="campo__rotulo">Categoria</span>
        <select value={categoria} onChange={(e) => alterarCategoria(e.target.value)}>
          <option value="todas">Todas</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </label>
      {videos.length === 0 ? (
        <p className="vazio" role="status">
          Nenhum vídeo nesta categoria
        </p>
      ) : (
        <ul className="lista-videos" aria-label="Vídeos">
          {videos.map((v) => (
            <li key={v.id}>
              <CartaoVideo video={v} categoria={nomeCategoria.get(v.categoria) ?? v.categoria} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function CartaoVideo({ video, categoria }: { video: Video; categoria: string }) {
  return (
    <Link to={`/videos/${video.id}`} className="cartao-video">
      <span className="cartao-video__miniatura">
        <img
          src={urlMiniatura(video.youtube_id)}
          alt={`Miniatura: ${video.titulo}`}
          width={480}
          height={360}
          loading="lazy"
          decoding="async"
        />
        <span className="cartao-video__duracao">{formatarDuracao(video.duracao)}</span>
      </span>
      <span className="cartao-video__titulo">{video.titulo}</span>
      <span className="cartao-video__categoria">{categoria}</span>
    </Link>
  )
}
