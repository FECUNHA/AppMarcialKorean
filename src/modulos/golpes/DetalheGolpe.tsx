import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ComConteudo } from '../../conteudo/ConteudoProvider'
import type { Golpe } from '../../conteudo/schema'
import { ImagemGolpe } from './ImagemGolpe'
import { SlotVideoGolpe } from './SlotVideoGolpe'
import { useFavoritos } from './useFavoritos'

export function TelaDetalheGolpe() {
  const { id } = useParams()
  return (
    <main className="tela">
      <BotaoVoltar />
      <ComConteudo>
        {(conteudo) => {
          const golpe = conteudo.golpes.find((g) => g.id === id)
          return golpe ? <DetalheGolpe golpe={golpe} /> : <GolpeNaoEncontrado />
        }}
      </ComConteudo>
    </main>
  )
}

/** Volta para a lista com o filtro intacto (design D2); sem histórico no app, abre a lista. */
function BotaoVoltar() {
  const navigate = useNavigate()
  const { key } = useLocation()
  return (
    <button
      type="button"
      className="botao-voltar"
      onClick={() => (key === 'default' ? navigate('/golpes') : navigate(-1))}
    >
      Voltar
    </button>
  )
}

function DetalheGolpe({ golpe }: { golpe: Golpe }) {
  return (
    <article className="detalhe-golpe">
      <ImagemGolpe golpe={golpe} tamanho={480} className="detalhe-golpe__imagem" />
      <h1>
        <span className="detalhe-golpe__hangul" lang="ko">
          {golpe.nome_hangul}
        </span>
        <span className="detalhe-golpe__romanizado">{golpe.nome_romanizado}</span>
      </h1>
      <p className="detalhe-golpe__pt">{golpe.nome_pt}</p>
      <p className="detalhe-golpe__faixa">Faixa: {golpe.faixa}</p>
      <BotaoFavoritar id={golpe.id} />
      <p>{golpe.descricao}</p>
      <SlotVideoGolpe golpe={golpe} />
    </article>
  )
}

function BotaoFavoritar({ id }: { id: string }) {
  const { ehFavorito, alternar } = useFavoritos()
  const favorito = ehFavorito(id)
  return (
    <button
      type="button"
      className="botao botao-favoritar"
      aria-pressed={favorito}
      onClick={() => alternar(id)}
    >
      <span aria-hidden="true">{favorito ? '★ ' : '☆ '}</span>
      {favorito ? 'Remover dos favoritos' : 'Favoritar'}
    </button>
  )
}

function GolpeNaoEncontrado() {
  return (
    <>
      <h1>Golpe não encontrado</h1>
      <p>
        <Link to="/golpes">Ver todos os golpes</Link>
      </p>
    </>
  )
}
