import { MINIMO_ELEGIVEIS } from './regras'
import type { MelhorPontuacao } from './melhor'

export function InicioQuiz({
  totalPerguntas,
  disponivel,
  melhor,
  onIniciar,
}: {
  totalPerguntas: number
  disponivel: boolean
  melhor: MelhorPontuacao | null
  onIniciar: () => void
}) {
  return (
    <section className="quiz-inicio">
      {disponivel ? (
        <p>{totalPerguntas} perguntas: veja a imagem e escolha o nome do golpe.</p>
      ) : (
        <p role="status" className="aviso-erro">
          O quiz precisa de pelo menos {MINIMO_ELEGIVEIS} golpes com imagem
        </p>
      )}
      {melhor && <p className="quiz-inicio__recorde">Melhor pontuação: {melhor.percentual}%</p>}
      <button type="button" className="botao" disabled={!disponivel} onClick={onIniciar}>
        Iniciar
      </button>
    </section>
  )
}
