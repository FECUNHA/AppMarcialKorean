import { createContext, useContext } from 'react'
import type { Conteudo } from './schema'

export type EstadoConteudo =
  | { estado: 'carregando' }
  | {
      estado: 'pronto'
      conteudo: Conteudo
      /** videos.json não pôde ser lido: `conteudo.videos` fica vazio e só o módulo Vídeos avisa (D3). */
      videosIndisponiveis: boolean
      tentarDeNovo: () => void
    }
  | { estado: 'erro'; tentarDeNovo: () => void }

export const ConteudoContext = createContext<EstadoConteudo | null>(null)

export function useConteudo(): EstadoConteudo {
  const estado = useContext(ConteudoContext)
  if (!estado) throw new Error('useConteudo precisa estar dentro de <ConteudoProvider>')
  return estado
}
