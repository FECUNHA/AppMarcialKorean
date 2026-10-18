import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { conteudoValido } from '../test/fixtures/conteudo'
import { ComConteudo, ConteudoProvider } from './ConteudoProvider'
import { useConteudo } from './useConteudo'

function resposta(corpo: string, status = 200) {
  return Promise.resolve(new Response(corpo, { status, headers: { 'Content-Type': 'application/json' } }))
}

function Estado() {
  const r = useConteudo()
  return <p>estado: {r.estado}</p>
}

function Modulo() {
  return <ComConteudo>{(c) => <p>{c.golpes.length} golpe(s)</p>}</ComConteudo>
}

afterEach(() => vi.unstubAllGlobals())

describe('ConteudoProvider (R3)', () => {
  test('vai de carregando para pronto com uma única requisição', async () => {
    const fetchMock = vi.fn(() => resposta(JSON.stringify(conteudoValido())))
    vi.stubGlobal('fetch', fetchMock)
    render(
      <ConteudoProvider>
        <Estado />
        <Modulo />
      </ConteudoProvider>,
    )
    expect(screen.getByText('estado: carregando')).toBeInTheDocument()
    expect(await screen.findByText('estado: pronto')).toBeInTheDocument()
    expect(screen.getByText('1 golpe(s)')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/conteudo/conteudo.json')
  })

  test.each([
    ['JSON corrompido', () => resposta('{ quebrado')],
    ['conteúdo fora do schema', () => resposta(JSON.stringify({ versao: '1' }))],
    ['HTTP 404', () => resposta('não achei', 404)],
    ['falha de rede', () => Promise.reject(new TypeError('Failed to fetch'))],
  ])('%s mostra a mensagem de erro com "Tentar de novo"', async (_caso, falha) => {
    vi.stubGlobal('fetch', vi.fn(falha))
    render(
      <ConteudoProvider>
        <Modulo />
      </ConteudoProvider>,
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar o conteúdo')
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument()
  })

  test('"Tentar de novo" busca outra vez e mostra o conteúdo', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => resposta('{ quebrado'))
      .mockImplementationOnce(() => resposta(JSON.stringify(conteudoValido())))
    vi.stubGlobal('fetch', fetchMock)
    render(
      <ConteudoProvider>
        <Modulo />
      </ConteudoProvider>,
    )
    await userEvent.click(await screen.findByRole('button', { name: 'Tentar de novo' }))
    expect(await screen.findByText('1 golpe(s)')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
