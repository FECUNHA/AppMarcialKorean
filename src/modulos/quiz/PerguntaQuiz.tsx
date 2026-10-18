import { useEffect, useRef } from 'react'
import { urlConteudo } from '../../conteudo/urls'
import { nomeCompleto } from './nomes'
import type { Pergunta } from './regras'

/** Pergunta imagem → nome com correção imediata e acessível (R17, design D6). */
export function PerguntaQuiz({
  pergunta,
  indice,
  total,
  resposta,
  onResponder,
  onAvancar,
}: {
  pergunta: Pergunta
  indice: number
  total: number
  resposta?: string
  onResponder: (id: string) => void
  onAvancar: () => void
}) {
  const respondida = resposta !== undefined
  const acertou = resposta === pergunta.golpe.id
  const titulo = useRef<HTMLHeadingElement>(null)
  const proxima = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    titulo.current?.focus()
  }, [indice])
  useEffect(() => {
    if (respondida) proxima.current?.focus()
  }, [respondida])

  return (
    <section className="quiz-pergunta">
      <h2 ref={titulo} tabIndex={-1} className="quiz-pergunta__progresso">
        Pergunta {indice + 1} de {total}
      </h2>
      <img
        className="quiz-pergunta__imagem"
        src={urlConteudo(pergunta.golpe.imagem ?? '')}
        alt={pergunta.golpe.alt ?? ''}
        width={320}
        height={320}
      />
      <p className="quiz-pergunta__enunciado">Qual é o nome deste golpe?</p>
      <div role="group" aria-label="Alternativas" className="quiz-alternativas">
        {pergunta.alternativas.map((alt) => {
          const correta = alt.id === pergunta.golpe.id
          const escolhida = alt.id === resposta
          let marca: string | null = null
          let estado = ''
          if (respondida) {
            if (correta) {
              marca = escolhida ? '✓ Certo' : '✓ Correta'
              estado = 'certa'
            } else if (escolhida) {
              marca = '✗ Errado'
              estado = 'errada'
            } else {
              estado = 'neutra'
            }
          }
          return (
            <button
              key={alt.id}
              type="button"
              className={estado ? `quiz-alternativa quiz-alternativa--${estado}` : 'quiz-alternativa'}
              disabled={respondida}
              onClick={() => onResponder(alt.id)}
            >
              <span lang="ko" className="quiz-alternativa__hangul">
                {alt.nome_hangul}
              </span>{' '}
              <span className="quiz-alternativa__romanizado">{alt.nome_romanizado}</span>
              {marca && <span className="quiz-alternativa__marca"> {marca}</span>}
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="quiz-correcao">
        {respondida && (
          <p className={acertou ? 'quiz-correcao--certo' : 'quiz-correcao--errado'}>
            <strong>{acertou ? 'Certo.' : 'Errado.'}</strong> {acertou ? '' : 'Resposta correta: '}
            <span>{nomeCompleto(pergunta.golpe)}</span>
          </p>
        )}
      </div>

      {respondida && (
        <button ref={proxima} type="button" className="botao" onClick={onAvancar}>
          {indice + 1 === total ? 'Ver resultado' : 'Próxima'}
        </button>
      )}
    </section>
  )
}
