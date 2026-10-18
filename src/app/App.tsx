import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ConteudoProvider } from '../conteudo/ConteudoProvider'
import { futuroRouter, rotas } from './rotas'

// Publicado em subcaminho (ex.: GitLab Pages em /<projeto>/): o roteador trabalha relativo à base.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
const router = createBrowserRouter(rotas, { basename, future: futuroRouter })

export function App() {
  return (
    <ConteudoProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ConteudoProvider>
  )
}
