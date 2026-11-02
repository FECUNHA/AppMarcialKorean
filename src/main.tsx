import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './app/App'
import './fontes.css'
import './styles.css'

const raiz = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Na tela inicial o build já entrega a casca pré-renderizada (redesign-visual-doodle, D6): hidratar
// reaproveita esses nós em vez de recriá-los — recriar faria o navegador contar um LCP tardio.
// Nas demais rotas o script inline esvazia o #root e o render é normal.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
