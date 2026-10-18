import { Link } from 'react-router-dom'
import type { Golpe } from '../../conteudo/schema'
import { ImagemGolpe } from './ImagemGolpe'

export function CartaoGolpe({ golpe }: { golpe: Golpe }) {
  return (
    <Link to={`/golpes/${golpe.id}`} className="cartao-golpe">
      <ImagemGolpe golpe={golpe} tamanho={72} className="cartao-golpe__imagem" />
      <span className="cartao-golpe__nomes">
        <span className="cartao-golpe__hangul" lang="ko">
          {golpe.nome_hangul}
        </span>
        <span className="cartao-golpe__romanizado">{golpe.nome_romanizado}</span>
        <span className="cartao-golpe__pt">{golpe.nome_pt}</span>
      </span>
    </Link>
  )
}
