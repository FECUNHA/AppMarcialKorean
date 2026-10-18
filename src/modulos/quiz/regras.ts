import type { Golpe } from '../../conteudo/schema'
import { embaralhar, type Rng } from './rng'

export const MINIMO_ELEGIVEIS = 4
export const TAMANHO_RODADA = 10

export interface Pergunta {
  golpe: Golpe
  /** 4 alternativas embaralhadas; exatamente uma é `golpe`. */
  alternativas: Golpe[]
}

export type Rodada = { disponivel: true; perguntas: Pergunta[] } | { disponivel: false; elegiveis: number }

/**
 * Alternativas da pergunta: o correto + 3 distratores, embaralhados (RN05). Os distratores vêm da
 * mesma categoria; se ela não tiver 3 outros golpes, completa com outras categorias, sem repetir (RN04).
 */
export function gerarAlternativas(golpe: Golpe, elegiveis: readonly Golpe[], rng: Rng): Golpe[] {
  const outros = elegiveis.filter((g) => g.id !== golpe.id)
  const mesmaCategoria = embaralhar(
    outros.filter((g) => g.categoria === golpe.categoria),
    rng,
  )
  const outrasCategorias = embaralhar(
    outros.filter((g) => g.categoria !== golpe.categoria),
    rng,
  )
  const distratores = [...mesmaCategoria, ...outrasCategorias].slice(0, 3)
  return embaralhar([golpe, ...distratores], rng)
}

/** Rodada de até 10 perguntas sobre golpes com imagem, sem repetição (RN01, RN03, RN06). */
export function gerarRodada(
  golpes: readonly Golpe[],
  { tamanho = TAMANHO_RODADA, rng = Math.random }: { tamanho?: number; rng?: Rng } = {},
): Rodada {
  const elegiveis = golpes.filter((g) => Boolean(g.imagem))
  if (elegiveis.length < MINIMO_ELEGIVEIS) return { disponivel: false, elegiveis: elegiveis.length }
  const sorteados = embaralhar(elegiveis, rng).slice(0, tamanho)
  return {
    disponivel: true,
    perguntas: sorteados.map((golpe) => ({ golpe, alternativas: gerarAlternativas(golpe, elegiveis, rng) })),
  }
}
