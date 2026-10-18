import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { conteudoQuiz } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

const erro = (id: string, nome_hangul: string, nome_romanizado: string, nome_pt: string) => ({
  id,
  nome_hangul,
  nome_romanizado,
  nome_pt,
})

const rodada7de10 = {
  acertos: 7,
  total: 10,
  percentual: 70,
  erros: [
    erro('sonmok-chigi', '손목치기', 'Sonmok chigi', 'Corte no punho'),
    erro('jjireugi', '찌르기', 'Jjireugi', 'Estocada'),
    erro('makgi', '막기', 'Makgi', 'Defesa/bloqueio'),
  ],
}

function abrirResultado(resumo: object) {
  sessionStorage.setItem('hk:quiz:ultimo', JSON.stringify(resumo))
  return renderRota([{ pathname: '/quiz', state: { resultado: true } }], conteudoQuiz())
}

afterEach(() => sessionStorage.clear())

describe('Resultado da rodada (R18)', () => {
  test('mostra "7/10", "70%" e os 3 golpes errados com link para o detalhe', async () => {
    abrirResultado(rodada7de10)
    expect(await screen.findByText('7/10')).toBeInTheDocument()
    expect(screen.getByText('70%')).toBeInTheDocument()
    const lista = within(screen.getByRole('list', { name: 'Golpes errados' }))
    const links = lista.getAllByRole('link')
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/golpes/sonmok-chigi', '/golpes/jjireugi', '/golpes/makgi'])
    expect(lista.getByText('손목치기 · Sonmok chigi — Corte no punho')).toBeInTheDocument()
  })

  test('"Revisar golpes errados" abre o primeiro errado e voltar reabre o resultado', async () => {
    const { router } = abrirResultado(rodada7de10)
    await userEvent.click(await screen.findByRole('button', { name: 'Revisar golpes errados' }))
    expect(router.state.location.pathname).toBe('/golpes/sonmok-chigi')
    expect(await screen.findByText('Faixa: Branca')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    expect(router.state.location.pathname).toBe('/quiz')
    expect(await screen.findByText('7/10')).toBeInTheDocument()
  })

  test('rodada sem erros não mostra "Revisar golpes errados"', async () => {
    abrirResultado({ acertos: 10, total: 10, percentual: 100, erros: [] })
    expect(await screen.findByText('10/10')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Revisar golpes errados' })).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Golpes errados' })).not.toBeInTheDocument()
  })

  test('"Jogar de novo" gera uma nova rodada', async () => {
    abrirResultado(rodada7de10)
    await userEvent.click(await screen.findByRole('button', { name: 'Jogar de novo' }))
    expect(screen.getByText('Pergunta 1 de 10')).toBeInTheDocument()
    expect(sessionStorage.getItem('hk:quiz:ultimo')).toBeNull()
  })

  test('abrir o Quiz pela aba (sem estado de resultado) mostra a tela inicial', async () => {
    sessionStorage.setItem('hk:quiz:ultimo', JSON.stringify(rodada7de10))
    renderRota('/quiz', conteudoQuiz())
    expect(await screen.findByRole('button', { name: 'Iniciar' })).toBeInTheDocument()
    expect(screen.queryByText('7/10')).not.toBeInTheDocument()
  })

  test('jogar a rodada inteira termina no resultado e guarda o resumo na sessão', async () => {
    const { router } = renderRota('/quiz', conteudoQuiz())
    await userEvent.click(await screen.findByRole('button', { name: 'Iniciar' }))
    for (let i = 0; i < 10; i++) {
      const grupo = within(screen.getByRole('group', { name: 'Alternativas' }))
      await userEvent.click(grupo.getAllByRole('button')[0])
      await userEvent.click(screen.getByRole('button', { name: i === 9 ? 'Ver resultado' : 'Próxima' }))
    }
    expect(screen.getByText(/^\d+\/10$/)).toBeInTheDocument()
    expect(JSON.parse(sessionStorage.getItem('hk:quiz:ultimo')!)).toMatchObject({ total: 10 })
    expect(router.state.location.state).toEqual({ resultado: true })
  })
})
