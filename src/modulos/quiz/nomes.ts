import type { Golpe } from '../../conteudo/schema'

export type NomesGolpe = Pick<Golpe, 'id' | 'nome_hangul' | 'nome_romanizado' | 'nome_pt'>

/** "머리치기 · Meori chigi — Corte na cabeça" (R17). */
export function nomeCompleto(g: NomesGolpe) {
  return `${g.nome_hangul} · ${g.nome_romanizado} — ${g.nome_pt}`
}
