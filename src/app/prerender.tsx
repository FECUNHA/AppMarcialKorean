import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { ConteudoContext } from '../conteudo/useConteudo'
import { BarraAbas } from './BarraAbas'
import { TelaInicial } from './TelaInicial'

/**
 * HTML estático da casca da tela inicial (redesign-visual-doodle, D6), usado no build para o `h1`
 * pintar antes do JS (RNF3). Reproduz o 1º render do app em "/": LayoutRaiz com a tela inicial
 * e o conteúdo ainda carregando — o teste garante que os dois são iguais.
 */
export function renderizarCasca(base = '/'): string {
  const basename = base.replace(/\/$/, '') || '/'
  return renderToStaticMarkup(
    <MemoryRouter basename={basename} initialEntries={[basename === '/' ? '/' : `${basename}/`]}>
      <ConteudoContext.Provider value={{ estado: 'carregando' }}>
        <div className="layout">
          <TelaInicial />
          <BarraAbas />
        </div>
      </ConteudoContext.Provider>
    </MemoryRouter>,
  )
}
