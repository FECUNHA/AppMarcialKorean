import { createContext, useContext } from 'react'
import type { Conteudo } from './schema'

export type EstadoConteudo =
  | { estado: 'carregando' }
  | { estado: 'pronto'; conteudo: Conteudo }
  | { estado: 'erro'; tentarDeNovo: () => void }

export const ConteudoContext = createContext<EstadoConteudo | null>(null)

export function useConteudo(): EstadoConteudo {
  const estado = useContext(ConteudoContext)
  if (!estado) throw new Error('useConteudo precisa estar dentro de <ConteudoProvider>')
  return estado
}
