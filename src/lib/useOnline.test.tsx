import { act, renderHook } from '@testing-library/react'
import { useOnline } from './useOnline'

function definirConexao(online: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(online)
  window.dispatchEvent(new Event(online ? 'online' : 'offline'))
}

describe('useOnline (design D2)', () => {
  test('começa com navigator.onLine', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    expect(renderHook(() => useOnline()).result.current).toBe(false)
  })

  test('reage aos eventos offline e online sem recarregar', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    const { result } = renderHook(() => useOnline())
    expect(result.current).toBe(true)
    act(() => definirConexao(false))
    expect(result.current).toBe(false)
    act(() => definirConexao(true))
    expect(result.current).toBe(true)
  })
})
