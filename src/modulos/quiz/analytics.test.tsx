import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { definirProvedor, provedorNoop, track, type PayloadEvento } from '../../analytics/track'
import { conteudoQuiz } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

afterEach(() => {
  definirProvedor(provedorNoop)
  sessionStorage.clear()
})

describe('Analítica do quiz (RNF8, design D5)', () => {
  test('track aceita total e acertos e descarta o resto', () => {
    const enviados: PayloadEvento[] = []
    definirProvedor({ enviar: (p) => void enviados.push(p) })
    track('quiz_concluido', { acertos: 7, total: 10, nome: 'aluno' } as never)
    expect(Object.keys(enviados[0]).sort()).toEqual(['acertos', 'data', 'evento', 'total'])
  })

  test('iniciar dispara quiz_iniciado com { total } e terminar dispara quiz_concluido com { acertos, total }', async () => {
    const enviados: PayloadEvento[] = []
    definirProvedor({ enviar: (p) => void enviados.push(p) })
    renderRota('/quiz', conteudoQuiz())
    enviados.length = 0 // ignora modulo_aberto

    await userEvent.click(await screen.findByRole('button', { name: 'Iniciar' }))
    expect(enviados).toHaveLength(1)
    expect(enviados[0]).toEqual({ evento: 'quiz_iniciado', total: 10, data: expect.any(String) })

    for (let i = 0; i < 10; i++) {
      await userEvent.click(within(screen.getByRole('group', { name: 'Alternativas' })).getAllByRole('button')[0])
      await userEvent.click(screen.getByRole('button', { name: i === 9 ? 'Ver resultado' : 'Próxima' }))
    }
    const concluido = enviados.filter((e) => e.evento === 'quiz_concluido')
    expect(concluido).toHaveLength(1)
    expect(Object.keys(concluido[0]).sort()).toEqual(['acertos', 'data', 'evento', 'total'])
    expect(concluido[0]).toMatchObject({ total: 10, acertos: expect.any(Number) })
  })
})
