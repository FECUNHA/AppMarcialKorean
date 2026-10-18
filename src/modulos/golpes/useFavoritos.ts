import { useCallback, useMemo, useState } from 'react'
import { gravar, ler } from '../../lib/armazenamento'
import { useConteudo } from '../../conteudo/useConteudo'

const CHAVE = 'hk:favoritos'

/** Favoritos de golpes guardados só no aparelho (R12, RN11). Ids que saíram do conteúdo são ignorados. */
export function useFavoritos() {
  const estado = useConteudo()
  const [salvos, setSalvos] = useState<string[]>(() => {
    const lidos = ler<unknown>(CHAVE, [])
    return Array.isArray(lidos) ? lidos.filter((id): id is string => typeof id === 'string') : []
  })

  const existentes = useMemo(
    () => (estado.estado === 'pronto' ? new Set(estado.conteudo.golpes.map((g) => g.id)) : null),
    [estado],
  )
  const ids = useMemo(() => (existentes ? salvos.filter((id) => existentes.has(id)) : salvos), [salvos, existentes])

  const alternar = useCallback((id: string) => {
    setSalvos((atuais) => {
      const novos = atuais.includes(id) ? atuais.filter((x) => x !== id) : [...atuais, id]
      gravar(CHAVE, novos)
      return novos
    })
  }, [])

  const ehFavorito = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, ehFavorito, alternar, pronto: existentes !== null }
}
