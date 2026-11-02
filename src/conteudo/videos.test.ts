import { conteudoVideos } from '../test/fixtures/conteudo'
import { validarConteudo, validarVideos, type Conteudo } from './schema'

function base(): Conteudo {
  const r = validarConteudo(conteudoVideos())
  if (!r.ok) throw new Error(r.erros.join('; '))
  return r.conteudo
}

const video = (url: string, extra: Record<string, unknown> = {}) => ({ url, titulo: 'Vídeo', categoria: 'treinos', ...extra })

describe('validarVideos (R13, design D1/D4/D5)', () => {
  test('arquivo válido vira vídeos internos com id = id do YouTube', () => {
    const r = validarVideos(
      {
        videos: [
          video('https://www.youtube.com/watch?v=2mG4A7Sr1fU&t=5s', { titulo: 'Básico', duracao: 'PT10M7S', categoria: 'cortes', golpe: 'meori-chigi' }),
          video('https://youtu.be/qjrYw-LjlB0'),
        ],
      },
      base(),
    )
    expect(r).toEqual({
      ok: true,
      videos: [
        { id: '2mG4A7Sr1fU', youtube_id: '2mG4A7Sr1fU', titulo: 'Básico', duracao: 'PT10M7S', categoria: 'cortes', golpe_id: 'meori-chigi' },
        { id: 'qjrYw-LjlB0', youtube_id: 'qjrYw-LjlB0', titulo: 'Vídeo', categoria: 'treinos' },
      ],
    })
  })

  test('vídeo sem duração e sem golpe passa', () => {
    expect(validarVideos({ videos: [video('https://youtu.be/qjrYw-LjlB0')] }, base()).ok).toBe(true)
  })

  test('lista vazia passa', () => {
    expect(validarVideos({ videos: [] }, base())).toEqual({ ok: true, videos: [] })
  })

  test('link que não é do YouTube falha indicando a posição e o link', () => {
    const r = validarVideos({ videos: [video('https://youtu.be/qjrYw-LjlB0'), video('https://vimeo.com/123456')] }, base())
    expect(r).toEqual({ ok: false, erros: ['vídeo #2: link do YouTube inválido (https://vimeo.com/123456)'] })
  })

  test('categoria que não se aplica a vídeos falha', () => {
    const c = base()
    c.categorias.push({ id: 'so-golpes', nome: 'Só golpes', aplica_a: ['golpes'] })
    const r = validarVideos({ videos: [video('https://youtu.be/qjrYw-LjlB0', { categoria: 'so-golpes' })] }, c)
    expect(r).toEqual({ ok: false, erros: ['vídeo #1: categoria so-golpes não existe'] })
  })

  test('golpe relacionado inexistente falha', () => {
    const r = validarVideos({ videos: [video('https://youtu.be/qjrYw-LjlB0', { golpe: 'golpe-que-nao-existe' })] }, base())
    expect(r).toEqual({ ok: false, erros: ['vídeo #1: golpe golpe-que-nao-existe não existe'] })
  })

  test('mesmo vídeo com links diferentes falha como repetido', () => {
    const r = validarVideos(
      { videos: [video('https://youtu.be/qjrYw-LjlB0'), video('https://www.youtube.com/watch?v=qjrYw-LjlB0&t=3')] },
      base(),
    )
    expect(r).toEqual({ ok: false, erros: ['vídeo #2: repete o vídeo #1'] })
  })

  test('campo obrigatório ausente ou duração mal formatada falha', () => {
    const r = validarVideos({ videos: [{ url: 'https://youtu.be/qjrYw-LjlB0', categoria: 'treinos', duracao: '10 min' }] }, base())
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.erros).toContain('vídeo #1: campo titulo ausente')
      expect(r.erros.some((e) => e.startsWith('vídeo #1: campo duracao'))).toBe(true)
    }
  })

  test('arquivo sem a lista "videos" falha', () => {
    expect(validarVideos([], base())).toEqual({ ok: false, erros: ['videos.json: campo videos ausente'] })
    expect(validarVideos(null, base()).ok).toBe(false)
  })
})

describe('conteudo.json sem vídeos (design D5)', () => {
  test('o campo videos de conteudo.json é ignorado', () => {
    const r = validarConteudo({ ...conteudoVideos(), videos: [{ qualquer: 'coisa' }] })
    expect(r.ok && r.conteudo.videos).toEqual([])
  })
})
