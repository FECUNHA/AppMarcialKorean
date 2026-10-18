import type { Golpe } from '../../conteudo/schema'
import type { Pergunta } from './regras'

/** Máquina de estados do quiz (design D3). `respostas[i]` é o id escolhido na pergunta i. */
export type EstadoQuiz =
  | { fase: 'inicio' }
  | { fase: 'jogando'; perguntas: Pergunta[]; indice: number; respostas: string[] }
  | { fase: 'resultado'; perguntas: Pergunta[]; respostas: string[] }

export type AcaoQuiz =
  | { tipo: 'iniciar'; perguntas: Pergunta[] }
  | { tipo: 'responder'; id: string }
  | { tipo: 'avancar' }

export function reducerQuiz(estado: EstadoQuiz, acao: AcaoQuiz): EstadoQuiz {
  switch (acao.tipo) {
    case 'iniciar':
      return { fase: 'jogando', perguntas: acao.perguntas, indice: 0, respostas: [] }
    case 'responder':
      if (estado.fase !== 'jogando' || estado.respostas.length > estado.indice) return estado
      return { ...estado, respostas: [...estado.respostas, acao.id] }
    case 'avancar': {
      if (estado.fase !== 'jogando' || estado.respostas.length <= estado.indice) return estado
      const proximo = estado.indice + 1
      if (proximo >= estado.perguntas.length)
        return { fase: 'resultado', perguntas: estado.perguntas, respostas: estado.respostas }
      return { ...estado, indice: proximo }
    }
  }
}

export interface ResumoRodada {
  acertos: number
  total: number
  percentual: number
  erros: Golpe[]
}

/** 1 ponto por acerto (RN07); percentual arredondado ao inteiro. */
export function resumir(perguntas: readonly Pergunta[], respostas: readonly string[]): ResumoRodada {
  const erros = perguntas.filter((p, i) => respostas[i] !== p.golpe.id).map((p) => p.golpe)
  const total = perguntas.length
  const acertos = total - erros.length
  return { acertos, total, percentual: total ? Math.round((acertos / total) * 100) : 0, erros }
}
