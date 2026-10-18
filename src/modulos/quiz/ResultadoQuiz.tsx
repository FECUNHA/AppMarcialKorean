import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { nomeCompleto } from './nomes'
import type { ResumoSalvo } from './ultimo'

export function ResultadoQuiz({ resumo, onJogarDeNovo }: { resumo: ResumoSalvo; onJogarDeNovo: () => void }) {
  const navigate = useNavigate()
  const titulo = useRef<HTMLHeadingElement>(null)
  useEffect(() => titulo.current?.focus(), [])

  return (
    <section className="quiz-resultado">
      <h2 ref={titulo} tabIndex={-1}>
        Resultado
      </h2>
      <p className="quiz-resultado__placar">
        <span className="quiz-resultado__acertos">
          {resumo.acertos}/{resumo.total}
        </span>
        <span className="quiz-resultado__percentual">{resumo.percentual}%</span>
      </p>
      {resumo.novoRecorde && <p className="quiz-inicio__recorde">Novo recorde!</p>}

      {resumo.erros.length > 0 && (
        <>
          <h3>Golpes para revisar</h3>
          <ul className="quiz-resultado__erros" aria-label="Golpes errados">
            {resumo.erros.map((g) => (
              <li key={g.id}>
                <Link to={`/golpes/${g.id}`}>{nomeCompleto(g)}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="quiz-resultado__acoes">
        <button type="button" className="botao" onClick={onJogarDeNovo}>
          Jogar de novo
        </button>
        {resumo.erros.length > 0 && (
          <button
            type="button"
            className="botao botao--secundario"
            onClick={() => navigate(`/golpes/${resumo.erros[0].id}`)}
          >
            Revisar golpes errados
          </button>
        )}
      </div>
    </section>
  )
}
