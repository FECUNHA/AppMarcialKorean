import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { Golpe } from '../../conteudo/schema'
import { conteudoQuiz } from '../../test/fixtures/conteudo'
import { PerguntaQuiz } from './PerguntaQuiz'
import type { Pergunta } from './regras'

const golpes = conteudoQuiz().golpes as Golpe[]
const porId = (id: string) => golpes.find((g) => g.id === id)!
const pergunta: Pergunta = {
  golpe: porId('meori-chigi'),
  alternativas: ['sonmok-chigi', 'meori-chigi', 'heori-chigi', 'mok-chigi'].map(porId),
}

function Harness({ onAvancar = () => {} }: { onAvancar?: () => void }) {
  const [resposta, setResposta] = useState<string>()
  return (
    <PerguntaQuiz
      pergunta={pergunta}
      indice={0}
      total={5}
      resposta={resposta}
      onResponder={setResposta}
      onAvancar={onAvancar}
    />
  )
}

const alternativas = () => within(screen.getByRole('group', { name: 'Alternativas' }))

describe('Pergunta do quiz (R16, R17)', () => {
  test('mostra a imagem com alt, o progresso e 4 alternativas', () => {
    render(<Harness />)
    expect(screen.getByText('Pergunta 1 de 5')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Ilustração do golpe meori-chigi' })).toHaveAttribute(
      'src',
      '/conteudo/golpes/meori-chigi.webp',
    )
    expect(alternativas().getAllByRole('button')).toHaveLength(4)
    expect(screen.queryByRole('button', { name: 'Próxima' })).not.toBeInTheDocument()
  })

  test('resposta errada: marca a escolha, destaca a correta, bloqueia, anuncia e libera "Próxima" (CA09)', async () => {
    const onAvancar = vi.fn()
    render(<Harness onAvancar={onAvancar} />)
    await userEvent.click(alternativas().getByRole('button', { name: /Sonmok chigi/ }))

    const escolhida = alternativas().getByRole('button', { name: /Sonmok chigi/ })
    expect(escolhida).toHaveAccessibleName(/Errado/)
    expect(alternativas().getByRole('button', { name: /Meori chigi/ })).toHaveAccessibleName(/Correta/)
    for (const b of alternativas().getAllByRole('button')) expect(b).toBeDisabled()

    expect(screen.getByText('머리치기 · Meori chigi — Corte na cabeça')).toBeInTheDocument()
    const anuncio = document.querySelector('[aria-live="polite"]')!
    expect(anuncio).toHaveTextContent('Errado. Resposta correta: 머리치기 · Meori chigi — Corte na cabeça')

    const proxima = screen.getByRole('button', { name: 'Próxima' })
    expect(proxima).toHaveFocus()
    await userEvent.click(proxima)
    expect(onAvancar).toHaveBeenCalled()
  })

  test('resposta certa: marca como certa e mostra hangul e português', async () => {
    render(<Harness />)
    await userEvent.click(alternativas().getByRole('button', { name: /Meori chigi/ }))
    expect(alternativas().getByRole('button', { name: /Meori chigi/ })).toHaveAccessibleName(/Certo/)
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('Certo. 머리치기 · Meori chigi — Corte na cabeça')
  })

  test('na última pergunta o botão diz "Ver resultado"', async () => {
    render(
      <PerguntaQuiz pergunta={pergunta} indice={4} total={5} resposta="meori-chigi" onResponder={() => {}} onAvancar={() => {}} />,
    )
    expect(screen.getByRole('button', { name: 'Ver resultado' })).toBeInTheDocument()
  })
})
