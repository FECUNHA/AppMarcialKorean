export type ModuloId = 'historia' | 'golpes' | 'videos' | 'quiz'

export interface Modulo {
  id: ModuloId
  nome: string
  caminho: `/${ModuloId}`
  descricao: string
}

export const MODULOS: readonly Modulo[] = [
  { id: 'historia', nome: 'História', caminho: '/historia', descricao: 'Origem e tradição do Hwarang Kumdo' },
  { id: 'golpes', nome: 'Golpes', caminho: '/golpes', descricao: 'Técnicas com nome em coreano e tradução' },
  { id: 'videos', nome: 'Vídeos', caminho: '/videos', descricao: 'Demonstrações e treinos' },
  { id: 'quiz', nome: 'Quiz', caminho: '/quiz', descricao: 'Teste o que você aprendeu' },
]
