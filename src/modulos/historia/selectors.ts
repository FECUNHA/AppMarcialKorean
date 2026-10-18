import type { Capitulo, Conteudo } from '../../conteudo/schema'

/** Capítulos na ordem do campo `ordem` (design D2). */
export function capitulosOrdenados(conteudo: Conteudo): Capitulo[] {
  return [...conteudo.capitulos].sort((a, b) => a.ordem - b.ordem)
}

/** Capítulos antes e depois de `id`, na ordem do conteúdo (R6). */
export function vizinhos(conteudo: Conteudo, id: string): { anterior?: Capitulo; proximo?: Capitulo } {
  const lista = capitulosOrdenados(conteudo)
  const i = lista.findIndex((c) => c.id === id)
  if (i === -1) return {}
  return {
    ...(i > 0 && { anterior: lista[i - 1] }),
    ...(i < lista.length - 1 && { proximo: lista[i + 1] }),
  }
}
