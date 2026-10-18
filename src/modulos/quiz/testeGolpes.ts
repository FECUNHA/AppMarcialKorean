import type { Golpe } from '../../conteudo/schema'

/** Golpe sintético para testes das regras do quiz. */
export function golpeTeste(id: string, categoria: string, comImagem = true): Golpe {
  return {
    id,
    nome_hangul: `한${id}`,
    nome_romanizado: `Golpe ${id.replace(/[^a-z]/gi, ' ')}`.trim(),
    nome_pt: `Golpe ${id}`,
    categoria,
    descricao: 'Descrição.',
    faixa: 'Branca',
    ...(comImagem && { imagem: `golpes/${id}.webp`, alt: `Imagem de ${id}` }),
  }
}

/** `n` golpes com imagem numa categoria: `cat-a`, `cat-b`… */
export function golpesTeste(n: number, categoria: string, prefixo = categoria): Golpe[] {
  return Array.from({ length: n }, (_, i) => golpeTeste(`${prefixo}-${String.fromCharCode(97 + (i % 26))}${i >= 26 ? i : ''}`, categoria))
}
