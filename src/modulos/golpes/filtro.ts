import type { Golpe } from '../../conteudo/schema'

export interface FiltroGolpes {
  /** `todas` (padrão), `favoritos` ou o id de uma categoria. */
  categoria?: string
  /** Texto buscado na romanização e na tradução. */
  q?: string
  /** Ids favoritados, usados quando `categoria` é `favoritos`. */
  favoritos?: readonly string[]
}

/** Design D1: sem acentos, sem diferença de caixa, sem espaços nas pontas. */
export function normalizar(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

/** Filtro puro sobre a lista de golpes (design D2: o estado vem da URL). */
export function filtrarGolpes(
  golpes: readonly Golpe[],
  { categoria = 'todas', q = '', favoritos = [] }: FiltroGolpes,
): Golpe[] {
  const termo = normalizar(q)
  const naCategoria = (g: Golpe) =>
    categoria === 'todas' || (categoria === 'favoritos' ? favoritos.includes(g.id) : g.categoria === categoria)
  return golpes.filter(
    (g) =>
      naCategoria(g) &&
      (!termo || normalizar(g.nome_romanizado).includes(termo) || normalizar(g.nome_pt).includes(termo)),
  )
}
