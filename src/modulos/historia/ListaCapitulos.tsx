import { Link } from 'react-router-dom'
import { ComConteudo } from '../../conteudo/ConteudoProvider'
import { capitulosOrdenados } from './selectors'

export function TelaHistoria() {
  return (
    <main className="tela">
      <h1>História</h1>
      <ComConteudo>
        {(conteudo) => (
          <ol className="lista-capitulos" aria-label="Capítulos">
            {capitulosOrdenados(conteudo).map((c) => (
              <li key={c.id}>
                <Link to={`/historia/${c.id}`} className="lista-capitulos__item">
                  {c.titulo}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </ComConteudo>
    </main>
  )
}
