import type { NomesGolpe } from './nomes'
import type { ResumoRodada } from './reducer'

/** Resultado da última rodada, guardado na sessão para voltar do detalhe do golpe ao resultado (design D4). */
export interface ResumoSalvo {
  acertos: number
  total: number
  percentual: number
  erros: NomesGolpe[]
  novoRecorde?: boolean
}

const CHAVE = 'hk:quiz:ultimo'

export function paraResumoSalvo(resumo: ResumoRodada, novoRecorde = false): ResumoSalvo {
  return {
    acertos: resumo.acertos,
    total: resumo.total,
    percentual: resumo.percentual,
    erros: resumo.erros.map(({ id, nome_hangul, nome_romanizado, nome_pt }) => ({ id, nome_hangul, nome_romanizado, nome_pt })),
    novoRecorde,
  }
}

export function salvarUltimo(resumo: ResumoSalvo) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(resumo))
  } catch {
    // sessão indisponível: voltar do detalhe abre a tela inicial do quiz
  }
}

export function lerUltimo(): ResumoSalvo | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE)
    const r = bruto ? (JSON.parse(bruto) as ResumoSalvo) : null
    return r && typeof r.total === 'number' && Array.isArray(r.erros) ? r : null
  } catch {
    return null
  }
}

export function limparUltimo() {
  try {
    sessionStorage.removeItem(CHAVE)
  } catch {
    // nada a limpar
  }
}
