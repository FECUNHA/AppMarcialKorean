import type { Video } from '../../conteudo/schema'
import { conteudoVideos } from '../../test/fixtures/conteudo'
import { filtrarVideos } from './filtro'

const videos = conteudoVideos().videos as Video[]

describe('filtrarVideos (R15)', () => {
  test('sem filtro ou "todas" devolve todos', () => {
    expect(filtrarVideos(videos, {})).toHaveLength(3)
    expect(filtrarVideos(videos, { categoria: 'todas' })).toHaveLength(3)
  })

  test('"historia" devolve só os vídeos de História', () => {
    expect(filtrarVideos(videos, { categoria: 'historia' }).map((v) => v.id)).toEqual(['yt-002'])
  })

  test('categoria sem vídeos devolve vazio', () => {
    expect(filtrarVideos(videos, { categoria: 'formas' })).toEqual([])
  })
})
