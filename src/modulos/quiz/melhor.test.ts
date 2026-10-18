import { lerMelhor, registrarMelhor } from './melhor'

const salvar = (percentual: number) =>
  localStorage.setItem('hk:quiz:melhor', JSON.stringify({ percentual, acertos: percentual / 10, total: 10, data: '2026-10-01' }))

describe('registrarMelhor (R18, RN08)', () => {
  test('sem recorde salvo grava e indica novo recorde', () => {
    expect(registrarMelhor({ acertos: 7, total: 10, percentual: 70 })).toBe(true)
    expect(lerMelhor()).toMatchObject({ percentual: 70, acertos: 7, total: 10 })
  })

  test('60% → 70% grava (CA10)', () => {
    salvar(60)
    expect(registrarMelhor({ acertos: 7, total: 10, percentual: 70 })).toBe(true)
    expect(lerMelhor()?.percentual).toBe(70)
    expect(lerMelhor()?.data).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('80% → 70% mantém 80%', () => {
    salvar(80)
    expect(registrarMelhor({ acertos: 7, total: 10, percentual: 70 })).toBe(false)
    expect(lerMelhor()?.percentual).toBe(80)
  })

  test('empate mantém o recorde anterior', () => {
    salvar(70)
    expect(registrarMelhor({ acertos: 7, total: 10, percentual: 70 })).toBe(false)
    expect(lerMelhor()?.data).toBe('2026-10-01')
  })

  test('armazenamento indisponível não lança', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('cota', 'QuotaExceededError')
    })
    expect(() => registrarMelhor({ acertos: 9, total: 10, percentual: 90 })).not.toThrow()
  })
})
