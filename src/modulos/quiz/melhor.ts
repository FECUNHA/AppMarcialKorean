import { gravar, ler } from '../../lib/armazenamento'

export const CHAVE_MELHOR = 'hk:quiz:melhor'

export interface MelhorPontuacao {
  percentual: number
  acertos: number
  total: number
  /** AAAA-MM-DD */
  data: string
}

export function lerMelhor(): MelhorPontuacao | null {
  const salvo = ler<MelhorPontuacao | null>(CHAVE_MELHOR, null)
  return salvo && typeof salvo.percentual === 'number' ? salvo : null
}

function hoje() {
  const d = new Date()
  const dois = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`
}

/**
 * Guarda a pontuação só quando supera o recorde (RN08 — empate não sobrescreve).
 * Devolve `true` quando é um novo recorde. Nunca lança (armazenamento resiliente).
 */
export function registrarMelhor(r: { acertos: number; total: number; percentual: number }): boolean {
  const atual = lerMelhor()
  if (atual && r.percentual <= atual.percentual) return false
  gravar<MelhorPontuacao>(CHAVE_MELHOR, { percentual: r.percentual, acertos: r.acertos, total: r.total, data: hoje() })
  return true
}
