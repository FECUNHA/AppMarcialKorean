import { gravar, ler } from './armazenamento'

function quebrarLocalStorage() {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('bloqueado', 'SecurityError')
  })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('cota', 'QuotaExceededError')
  })
}

describe('armazenamento local (design D3)', () => {
  test('chave ausente devolve o padrão', () => {
    expect(ler('hk:teste-ausente', ['padrao'])).toEqual(['padrao'])
  })

  test('grava e lê de volta como JSON no localStorage', () => {
    gravar('hk:teste', ['a', 'b'])
    expect(localStorage.getItem('hk:teste')).toBe('["a","b"]')
    expect(ler('hk:teste', [])).toEqual(['a', 'b'])
  })

  test('valor corrompido devolve o padrão', () => {
    localStorage.setItem('hk:teste', '{quebrado')
    expect(ler('hk:teste', 42)).toBe(42)
  })

  test('localStorage que lança: não propaga erro e usa memória', () => {
    quebrarLocalStorage()
    expect(() => gravar('hk:teste-memoria', ['x'])).not.toThrow()
    expect(ler('hk:teste-memoria', [])).toEqual(['x'])
  })
})
