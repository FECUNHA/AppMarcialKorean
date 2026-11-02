import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { arquivoVideos, conteudoValido } from '../test/fixtures/conteudo'
import { ComConteudo, ConteudoProvider } from './ConteudoProvider'
import { useConteudo } from './useConteudo'

function resposta(corpo: string, status = 200) {
  return Promise.resolve(new Response(corpo, { status, headers: { 'Content-Type': 'application/json' } }))
}

function Estado() {
  const r = useConteudo()
  return (
    <p>
      estado: {r.estado}
      {r.estado === 'pronto' && ` · ${r.conteudo.videos.length} vídeo(s)${r.videosIndisponiveis ? ' · vídeos indisponíveis' : ''}`}
    </p>
  )
}

/** fetch que responde conteudo.json e videos.json separadamente. */
function servir(conteudo: () => Promise<Response>, videos: () => Promise<Response>) {
  return vi.fn((url: string) => (url.endsWith('/videos.json') ? videos() : conteudo()))
}

function Modulo() {
  return <ComConteudo>{(c) => <p>{c.golpes.length} golpe(s)</p>}</ComConteudo>
}

afterEach(() => vi.unstubAllGlobals())

describe('ConteudoProvider (R3)', () => {
  test('vai de carregando para pronto buscando só conteudo.json e videos.json', async () => {
    const fetchMock = servir(
      () => resposta(JSON.stringify(conteudoValido())),
      () => resposta(JSON.stringify(arquivoVideos(conteudoValido()))),
    )
    vi.stubGlobal('fetch', fetchMock)
    render(
      <ConteudoProvider>
        <Estado />
        <Modulo />
      </ConteudoProvider>,
    )
    expect(screen.getByText('estado: carregando')).toBeInTheDocument()
    expect(await screen.findByText('estado: pronto · 1 vídeo(s)')).toBeInTheDocument()
    expect(screen.getByText('1 golpe(s)')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls.map(([url]) => url).sort()).toEqual(['/conteudo/conteudo.json', '/conteudo/videos.json'])
  })

  test.each([
    ['JSON corrompido', () => resposta('{ quebrado')],
    ['link inválido', () => resposta(JSON.stringify({ videos: [{ url: 'https://vimeo.com/1', titulo: 'x', categoria: 'treinos' }] }))],
    ['HTTP 404', () => resposta('não achei', 404)],
    ['falha de rede', () => Promise.reject(new TypeError('Failed to fetch'))],
  ])('videos.json com %s: conteúdo pronto, sem vídeos e marcado como indisponível (D3)', async (_caso, falha) => {
    vi.stubGlobal('fetch', servir(() => resposta(JSON.stringify(conteudoValido())), falha))
    render(
      <ConteudoProvider>
        <Estado />
        <Modulo />
      </ConteudoProvider>,
    )
    expect(await screen.findByText('estado: pronto · 0 vídeo(s) · vídeos indisponíveis')).toBeInTheDocument()
    expect(screen.getByText('1 golpe(s)')).toBeInTheDocument()
  })

  test.each([
    ['JSON corrompido', () => resposta('{ quebrado')],
    ['conteúdo fora do schema', () => resposta(JSON.stringify({ versao: '1' }))],
    ['HTTP 404', () => resposta('não achei', 404)],
    ['falha de rede', () => Promise.reject(new TypeError('Failed to fetch'))],
  ])('%s mostra a mensagem de erro com "Tentar de novo"', async (_caso, falha) => {
    vi.stubGlobal('fetch', servir(falha, () => resposta(JSON.stringify({ videos: [] }))))
    render(
      <ConteudoProvider>
        <Modulo />
      </ConteudoProvider>,
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar o conteúdo')
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument()
  })

  test('"Tentar de novo" busca outra vez e mostra o conteúdo', async () => {
    let tentativas = 0
    const fetchMock = servir(
      () => (++tentativas === 1 ? resposta('{ quebrado') : resposta(JSON.stringify(conteudoValido()))),
      () => resposta(JSON.stringify({ videos: [] })),
    )
    vi.stubGlobal('fetch', fetchMock)
    render(
      <ConteudoProvider>
        <Modulo />
      </ConteudoProvider>,
    )
    await userEvent.click(await screen.findByRole('button', { name: 'Tentar de novo' }))
    expect(await screen.findByText('1 golpe(s)')).toBeInTheDocument()
    expect(tentativas).toBe(2)
  })
})
