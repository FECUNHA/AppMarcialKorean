/** Gerador de números em [0, 1). Produção usa Math.random; testes usam semente (design D1). */
export type Rng = () => number

/** mulberry32: gerador pequeno e determinístico para testes reproduzíveis. */
export function criarRng(semente: number): Rng {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher–Yates: cópia embaralhada, sem alterar a original. */
export function embaralhar<T>(itens: readonly T[], rng: Rng): T[] {
  const copia = [...itens]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}
