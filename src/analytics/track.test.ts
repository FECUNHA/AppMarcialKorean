import { definirProvedor, provedorNoop, track, type PayloadEvento } from './track'

afterEach(() => {
  definirProvedor(provedorNoop)
  vi.useRealTimers()
})

describe('track() — analítica anônima (RNF8)', () => {
  test('payload de modulo_aberto tem só evento, módulo e data', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-18T15:42:07Z'))
    const enviados: PayloadEvento[] = []
    definirProvedor({ enviar: (p) => void enviados.push(p) })

    track('modulo_aberto', { modulo: 'golpes' })

    expect(enviados).toEqual([{ evento: 'modulo_aberto', modulo: 'golpes', data: '2026-10-18' }])
    expect(Object.keys(enviados[0]).sort()).toEqual(['data', 'evento', 'modulo'])
  })

  test('não repassa campos extras recebidos em tempo de execução', () => {
    const enviar = vi.fn()
    definirProvedor({ enviar })
    track('modulo_aberto', { modulo: 'quiz', idAluno: 'abc', ip: '1.2.3.4' } as never)
    expect(Object.keys(enviar.mock.calls[0][0]).sort()).toEqual(['data', 'evento', 'modulo'])
  })

  test('falha de rede síncrona não lança erro', () => {
    definirProvedor({
      enviar: () => {
        throw new TypeError('Failed to fetch')
      },
    })
    expect(() => track('modulo_aberto', { modulo: 'historia' })).not.toThrow()
  })

  test('falha de rede assíncrona é descartada sem rejeição não tratada', async () => {
    const naoTratada = vi.fn()
    process.on('unhandledRejection', naoTratada)
    definirProvedor({ enviar: () => Promise.reject(new TypeError('Failed to fetch')) })
    expect(() => track('quiz_iniciado')).not.toThrow()
    await new Promise((ok) => setTimeout(ok, 0))
    process.off('unhandledRejection', naoTratada)
    expect(naoTratada).not.toHaveBeenCalled()
  })

  test('o provedor padrão é no-op', () => {
    expect(() => track('quiz_concluido')).not.toThrow()
  })
})
