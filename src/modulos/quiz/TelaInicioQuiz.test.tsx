import { screen } from '@testing-library/react'
import { conteudoGolpes, conteudoQuiz } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

describe('Tela inicial do quiz (R16, R18)', () => {
  test('com 3 elegíveis avisa o motivo e desabilita "Iniciar" (CA12)', async () => {
    renderRota('/quiz', conteudoGolpes())
    expect(await screen.findByText('O quiz precisa de pelo menos 4 golpes com imagem')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar' })).toBeDisabled()
  })

  test('com catálogo suficiente "Iniciar" fica habilitado e diz o tamanho da rodada', async () => {
    renderRota('/quiz', conteudoQuiz())
    expect(await screen.findByRole('button', { name: 'Iniciar' })).toBeEnabled()
    expect(screen.getByText('10 perguntas: veja a imagem e escolha o nome do golpe.')).toBeInTheDocument()
  })

  test('mostra a melhor pontuação salva no aparelho', async () => {
    localStorage.setItem('hk:quiz:melhor', JSON.stringify({ percentual: 70, acertos: 7, total: 10, data: '2026-10-18' }))
    renderRota('/quiz', conteudoQuiz())
    expect(await screen.findByText('Melhor pontuação: 70%')).toBeInTheDocument()
  })

  test('sem pontuação salva não mostra recorde', async () => {
    renderRota('/quiz', conteudoQuiz())
    await screen.findByRole('button', { name: 'Iniciar' })
    expect(screen.queryByText(/Melhor pontuação/)).not.toBeInTheDocument()
  })
})
