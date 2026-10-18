import { Link, useParams } from 'react-router-dom'
import { ComConteudo } from '../../conteudo/ConteudoProvider'
import type { Capitulo, Conteudo } from '../../conteudo/schema'
import { urlConteudo } from '../../conteudo/urls'
import { vizinhos } from './selectors'
import { TextoCapitulo } from './TextoCapitulo'

export function TelaCapitulo() {
  const { id } = useParams()
  return (
    <main className="tela">
      <ComConteudo>
        {(conteudo) => {
          const capitulo = conteudo.capitulos.find((c) => c.id === id)
          return capitulo ? (
            <>
              <LeituraCapitulo capitulo={capitulo} />
              <NavegacaoCapitulos conteudo={conteudo} id={capitulo.id} />
            </>
          ) : (
            <CapituloNaoEncontrado />
          )
        }}
      </ComConteudo>
    </main>
  )
}

function LeituraCapitulo({ capitulo }: { capitulo: Capitulo }) {
  return (
    <article className="capitulo">
      <h1>{capitulo.titulo}</h1>
      <TextoCapitulo texto={capitulo.texto} />
      {capitulo.imagens.map((img) => (
        <figure key={img.arquivo} className="capitulo__figura">
          <img src={urlConteudo(img.arquivo)} alt={img.alt} loading="lazy" decoding="async" />
          <figcaption>{img.legenda}</figcaption>
        </figure>
      ))}
    </article>
  )
}

function NavegacaoCapitulos({ conteudo, id }: { conteudo: Conteudo; id: string }) {
  const { anterior, proximo } = vizinhos(conteudo, id)
  return (
    <nav className="navegacao-capitulos" aria-label="Capítulos">
      {anterior && (
        <Link
          to={`/historia/${anterior.id}`}
          className="navegacao-capitulos__link"
          aria-label={`Anterior: ${anterior.titulo}`}
        >
          <span className="navegacao-capitulos__rotulo">← Anterior</span>
          <span>{anterior.titulo}</span>
        </Link>
      )}
      {proximo && (
        <Link
          to={`/historia/${proximo.id}`}
          className="navegacao-capitulos__link navegacao-capitulos__link--proximo"
          aria-label={`Próximo: ${proximo.titulo}`}
        >
          <span className="navegacao-capitulos__rotulo">Próximo →</span>
          <span>{proximo.titulo}</span>
        </Link>
      )}
    </nav>
  )
}

function CapituloNaoEncontrado() {
  return (
    <>
      <h1>Capítulo não encontrado</h1>
      <p>
        <Link to="/historia">Ver todos os capítulos</Link>
      </p>
    </>
  )
}
