/**
 * Armazenamento local resiliente (design D3). Quando o localStorage lança (modo privado, cota,
 * bloqueio), os valores ficam só em memória até fechar o app — sem erro para o aluno.
 * Reutilizado pelo quiz (melhor pontuação).
 */
const memoria = new Map<string, string>()

export function ler<T>(chave: string, padrao: T): T {
  let bruto: string | null | undefined
  try {
    bruto = localStorage.getItem(chave)
  } catch {
    bruto = undefined
  }
  if (bruto == null) bruto = memoria.get(chave)
  if (bruto == null) return padrao
  try {
    return JSON.parse(bruto) as T
  } catch {
    return padrao
  }
}

export function gravar<T>(chave: string, valor: T) {
  const bruto = JSON.stringify(valor)
  memoria.set(chave, bruto)
  try {
    localStorage.setItem(chave, bruto)
  } catch {
    // indisponível: o valor vale só nesta sessão (memória)
  }
}
