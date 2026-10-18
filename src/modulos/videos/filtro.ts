import type { Video } from '../../conteudo/schema'

/** Filtro puro dos vídeos por categoria (design D5); `todas` é o padrão. */
export function filtrarVideos(videos: readonly Video[], { categoria = 'todas' }: { categoria?: string }): Video[] {
  return videos.filter((v) => categoria === 'todas' || v.categoria === categoria)
}
