import { useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { track } from '../../analytics/track'
import { ComConteudo } from '../../conteudo/ConteudoProvider'
import type { Conteudo } from '../../conteudo/schema'
import { InicioQuiz } from './InicioQuiz'
import { lerMelhor, registrarMelhor } from './melhor'
import { PerguntaQuiz } from './PerguntaQuiz'
import { reducerQuiz, resumir } from './reducer'
import { gerarRodada, MINIMO_ELEGIVEIS, TAMANHO_RODADA } from './regras'
import { ResultadoQuiz } from './ResultadoQuiz'
import { lerUltimo, limparUltimo, paraResumoSalvo, salvarUltimo, type ResumoSalvo } from './ultimo'

export function TelaQuiz() {
  return (
    <main className="tela">
      <h1>Quiz</h1>
      <ComConteudo>{(conteudo) => <Quiz conteudo={conteudo} />}</ComConteudo>
    </main>
  )
}

function Quiz({ conteudo }: { conteudo: Conteudo }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [melhor] = useState(lerMelhor)
  const [estado, despachar] = useReducer(reducerQuiz, { fase: 'inicio' })
  // Voltar do detalhe de um golpe errado reabre o resultado guardado na sessão (design D4).
  const [resultado, setResultado] = useState<ResumoSalvo | null>(() =>
    (location.state as { resultado?: boolean } | null)?.resultado ? lerUltimo() : null,
  )
  const elegiveis = conteudo.golpes.filter((g) => g.imagem).length

  function iniciar() {
    const rodada = gerarRodada(conteudo.golpes)
    if (!rodada.disponivel) return
    limparUltimo()
    setResultado(null)
    if (location.state) navigate('.', { replace: true, state: null })
    despachar({ tipo: 'iniciar', perguntas: rodada.perguntas })
    track('quiz_iniciado', { total: rodada.perguntas.length })
  }

  if (resultado) return <ResultadoQuiz resumo={resultado} onJogarDeNovo={iniciar} />

  if (estado.fase === 'jogando') {
    const ultima = estado.indice + 1 === estado.perguntas.length
    const avancar = () => {
      if (ultima && estado.respostas.length === estado.perguntas.length) {
        const rodada = resumir(estado.perguntas, estado.respostas)
        const resumo = paraResumoSalvo(rodada, registrarMelhor(rodada))
        salvarUltimo(resumo)
        track('quiz_concluido', { acertos: rodada.acertos, total: rodada.total })
        setResultado(resumo)
        navigate('.', { replace: true, state: { resultado: true } })
      }
      despachar({ tipo: 'avancar' })
    }
    return (
      <PerguntaQuiz
        key={estado.indice}
        pergunta={estado.perguntas[estado.indice]}
        indice={estado.indice}
        total={estado.perguntas.length}
        resposta={estado.respostas[estado.indice]}
        onResponder={(id) => despachar({ tipo: 'responder', id })}
        onAvancar={avancar}
      />
    )
  }

  return (
    <InicioQuiz
      totalPerguntas={Math.min(TAMANHO_RODADA, elegiveis)}
      disponivel={elegiveis >= MINIMO_ELEGIVEIS}
      melhor={melhor}
      onIniciar={iniciar}
    />
  )
}
