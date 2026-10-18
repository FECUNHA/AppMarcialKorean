import type { ModuloId } from '../app/modulos'

/**
 * Analítica anônima atrás de uma interface (design D7). Sem cookies, sem identificador persistente:
 * o payload leva só o evento, o módulo ou os números da rodada do quiz (quando houver) e a data do dia.
 */
export type Evento = 'modulo_aberto' | 'quiz_iniciado' | 'quiz_concluido'

export interface PropsEvento {
  modulo?: ModuloId
  /** Perguntas da rodada (quiz_iniciado, quiz_concluido). */
  total?: number
  /** Acertos da rodada (quiz_concluido). */
  acertos?: number
}

export interface PayloadEvento {
  evento: Evento
  modulo?: ModuloId
  total?: number
  acertos?: number
  /** Data local no formato AAAA-MM-DD, sem hora. */
  data: string
}

export interface ProvedorAnalitica {
  enviar(payload: PayloadEvento): void | Promise<void>
}

export const provedorNoop: ProvedorAnalitica = { enviar: () => {} }

let provedor: ProvedorAnalitica = provedorNoop

/** Troca o provedor (ferramenta real em aberto — PRD Q2). */
export function definirProvedor(novo: ProvedorAnalitica) {
  provedor = novo
}

function hoje() {
  const d = new Date()
  const doisDigitos = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`
}

/** Registra um evento de uso. Nunca lança: falha de envio (ex.: offline) é descartada. */
export function track(evento: Evento, props: PropsEvento = {}) {
  const payload: PayloadEvento = { evento, data: hoje() }
  // Lista fechada de campos: nada além disso sai do aparelho (RNF8).
  if (props.modulo) payload.modulo = props.modulo
  if (typeof props.total === 'number') payload.total = props.total
  if (typeof props.acertos === 'number') payload.acertos = props.acertos
  try {
    Promise.resolve(provedor.enviar(payload)).catch(() => {})
  } catch {
    // envio falhou de forma síncrona — descarta
  }
}
