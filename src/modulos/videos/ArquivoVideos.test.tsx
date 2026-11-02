import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { arquivoVideos, conteudoVideos } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

/** videos.json fora do formato: o provider marca os vídeos como indisponíveis. */
const videosQuebrados = { videos: 'não é lista' }

describe('Arquivo de vídeos indisponível (R3, videos-em-arquivo-proprio)', () => {
  test('Vídeos mostra o aviso com "Tentar de novo", que refaz a busca e mostra a lista', async () => {
    renderRota('/videos', conteudoVideos(), videosQuebrados)
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar os vídeos')

    const conteudo = conteudoVideos()
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => new Response(JSON.stringify(url.endsWith('/videos.json') ? arquivoVideos(conteudo) : conteudo))),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(within(await screen.findByRole('list', { name: 'Vídeos' })).getAllByRole('listitem')).toHaveLength(3)
  })

  test('Golpes funciona normalmente no mesmo estado', async () => {
    renderRota('/golpes', conteudoVideos(), videosQuebrados)
    expect(within(await screen.findByRole('list', { name: 'Golpes' })).getAllByRole('listitem')).toHaveLength(5)
    expect(screen.queryByText('Não foi possível carregar os vídeos')).not.toBeInTheDocument()
  })

  test('o detalhe do golpe só esconde a seção de vídeo', async () => {
    renderRota('/golpes/meori-chigi', conteudoVideos(), videosQuebrados)
    expect(await screen.findByText('Faixa: Branca')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Vídeo' })).not.toBeInTheDocument()
  })
})

describe('Vídeo sem duração (R13)', () => {
  const semDuracao = {
    videos: [{ url: 'https://youtu.be/qjrYw-LjlB0', titulo: 'Sem duração', categoria: 'treinos' }],
  }

  test('a lista mostra miniatura, título e categoria, sem selo de duração', async () => {
    renderRota('/videos', conteudoVideos(), semDuracao)
    const item = within(within(await screen.findByRole('list', { name: 'Vídeos' })).getByRole('listitem'))
    expect(item.getByRole('img', { name: 'Miniatura: Sem duração' })).toBeInTheDocument()
    expect(item.getByText('Treinos')).toBeInTheDocument()
    expect(document.querySelector('.cartao-video__duracao')).toBeNull()
  })

  test('a tela do vídeo mostra só a categoria', async () => {
    renderRota('/videos/qjrYw-LjlB0', conteudoVideos(), semDuracao)
    expect(await screen.findByRole('heading', { level: 1, name: 'Sem duração' })).toBeInTheDocument()
    expect(document.querySelector('.detalhe-video__meta')).toHaveTextContent(/^Treinos$/)
  })
})
