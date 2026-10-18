import { reducerQuiz, resumir, type EstadoQuiz } from './reducer'
import type { Pergunta } from './regras'
import { golpesTeste } from './testeGolpes'

const golpes = golpesTeste(4, 'cortes')
const perguntas: Pergunta[] = golpes.slice(0, 3).map((golpe) => ({ golpe, alternativas: golpes }))
const inicio: EstadoQuiz = { fase: 'inicio' }

describe('reducerQuiz (design D3)', () => {
  test('iniciar abre a 1ª pergunta sem resposta', () => {
    expect(reducerQuiz(inicio, { tipo: 'iniciar', perguntas })).toEqual({ fase: 'jogando', perguntas, indice: 0, respostas: [] })
  })

  test('responder registra a escolha uma única vez', () => {
    let e = reducerQuiz(inicio, { tipo: 'iniciar', perguntas })
    e = reducerQuiz(e, { tipo: 'responder', id: golpes[3].id })
    e = reducerQuiz(e, { tipo: 'responder', id: golpes[0].id })
    expect(e).toMatchObject({ indice: 0, respostas: [golpes[3].id] })
  })

  test('avancar só depois de responder', () => {
    let e = reducerQuiz(inicio, { tipo: 'iniciar', perguntas })
    expect(reducerQuiz(e, { tipo: 'avancar' })).toBe(e)
    e = reducerQuiz(e, { tipo: 'responder', id: golpes[0].id })
    expect(reducerQuiz(e, { tipo: 'avancar' })).toMatchObject({ fase: 'jogando', indice: 1 })
  })

  test('avançar depois da última resposta vai ao resultado', () => {
    let e = reducerQuiz(inicio, { tipo: 'iniciar', perguntas })
    for (const p of perguntas) {
      e = reducerQuiz(e, { tipo: 'responder', id: p.golpe.id })
      e = reducerQuiz(e, { tipo: 'avancar' })
    }
    expect(e).toEqual({ fase: 'resultado', perguntas, respostas: perguntas.map((p) => p.golpe.id) })
  })

  test('jogarDeNovo começa uma nova rodada', () => {
    const outra: Pergunta[] = [{ golpe: golpes[3], alternativas: golpes }]
    const e = reducerQuiz({ fase: 'resultado', perguntas, respostas: [] }, { tipo: 'iniciar', perguntas: outra })
    expect(e).toEqual({ fase: 'jogando', perguntas: outra, indice: 0, respostas: [] })
  })
})

describe('resumir (RN07)', () => {
  test('1 ponto por acerto, percentual arredondado e lista de erros na ordem', () => {
    const r = resumir(perguntas, [golpes[0].id, golpes[3].id, golpes[3].id])
    expect(r).toMatchObject({ acertos: 1, total: 3, percentual: 33 })
    expect(r.erros.map((g) => g.id)).toEqual([golpes[1].id, golpes[2].id])
  })
})
