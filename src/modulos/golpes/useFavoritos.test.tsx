import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ConteudoProvider } from '../../conteudo/ConteudoProvider'
import { conteudoGolpes } from '../../test/fixtures/conteudo'
import { useFavoritos } from './useFavoritos'

function wrapper({ children }: { children: ReactNode }) {
  return <ConteudoProvider>{children}</ConteudoProvider>
}

async function renderFavoritos() {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(conteudoGolpes()))))
  const r = renderHook(() => useFavoritos(), { wrapper })
  await waitFor(() => expect(r.result.current.pronto).toBe(true))
  return r
}

describe('useFavoritos (R12)', () => {
  test('alternar favorita e desfavorita', async () => {
    const { result } = await renderFavoritos()
    expect(result.current.ehFavorito('meori-chigi')).toBe(false)
    act(() => result.current.alternar('meori-chigi'))
    expect(result.current.ehFavorito('meori-chigi')).toBe(true)
    expect(result.current.ids).toEqual(['meori-chigi'])
    act(() => result.current.alternar('meori-chigi'))
    expect(result.current.ehFavorito('meori-chigi')).toBe(false)
  })

  test('persiste em hk:favoritos e relê ao reabrir (CA11)', async () => {
    const primeira = await renderFavoritos()
    act(() => primeira.result.current.alternar('jjireugi'))
    expect(JSON.parse(localStorage.getItem('hk:favoritos')!)).toEqual(['jjireugi'])
    primeira.unmount()

    const reaberto = await renderFavoritos()
    expect(reaberto.result.current.ehFavorito('jjireugi')).toBe(true)
  })

  test('ignora favorito de golpe removido do conteúdo', async () => {
    localStorage.setItem('hk:favoritos', JSON.stringify(['golpe-antigo', 'makgi']))
    const { result } = await renderFavoritos()
    expect(result.current.ids).toEqual(['makgi'])
    expect(result.current.ehFavorito('golpe-antigo')).toBe(false)
  })

  test('armazenamento bloqueado: favorito vale na sessão, sem erro', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('bloqueado', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('bloqueado', 'SecurityError')
    })
    const { result } = await renderFavoritos()
    expect(() => act(() => result.current.alternar('makgi'))).not.toThrow()
    expect(result.current.ehFavorito('makgi')).toBe(true)
  })
})
