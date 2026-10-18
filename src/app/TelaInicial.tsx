import { Link } from 'react-router-dom'
import { ComConteudo } from '../conteudo/ConteudoProvider'
import { MODULOS } from './modulos'

export function TelaInicial() {
  return (
    <main className="tela">
      <h1>Hwarang Kumdo</h1>
      <p className="nome-hangul" lang="ko">화랑검도</p>
      <p className="subtitulo">Escolha um módulo para estudar</p>
      <ul className="grade-modulos">
        {MODULOS.map((m) => (
          <li key={m.id}>
            <Link to={m.caminho} className="cartao-modulo">
              <span className="cartao-modulo__nome">{m.nome}</span>
              <span className="cartao-modulo__descricao">{m.descricao}</span>
            </Link>
          </li>
        ))}
      </ul>
      <footer className="rodape">
        <ComConteudo>{(c) => <p>Versão do conteúdo: {c.versao}</p>}</ComConteudo>
      </footer>
    </main>
  )
}
