import { render } from '@testing-library/react'
import { RouterProvider, createMemoryRouter, type RouteObject } from 'react-router-dom'
import { futuroRouter, rotas } from '../app/rotas'
import { ConteudoProvider } from '../conteudo/ConteudoProvider'
import { conteudoValido } from './fixtures/conteudo'

/**
 * Renderiza a árvore de rotas real do app (seam do roteador), com conteúdo de fixture.
 * `caminho` pode ser um histórico: a última entrada é a tela aberta.
 */
/** Resolve os `lazy()` das rotas uma vez, para os testes renderizarem as telas de forma síncrona. */
async function resolverLazy(lista: RouteObject[]): Promise<RouteObject[]> {
  return Promise.all(
    lista.map(async (rota) => {
      const extra = rota.lazy ? await rota.lazy() : {}
      const resolvida = { ...rota, ...extra, lazy: undefined } as RouteObject
      if (rota.children) resolvida.children = await resolverLazy(rota.children)
      return resolvida
    }),
  )
}

const rotasResolvidas = await resolverLazy(rotas)

type Entrada = string | { pathname: string; search?: string; state?: unknown }

export function renderRota(caminho: Entrada | Entrada[] = '/', conteudo: unknown = conteudoValido()) {
  const historico = Array.isArray(caminho) ? caminho : [caminho]
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(conteudo))))
  const router = createMemoryRouter(rotasResolvidas, {
    initialEntries: historico,
    initialIndex: historico.length - 1,
    future: futuroRouter,
  })
  return {
    router,
    ...render(
      <ConteudoProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </ConteudoProvider>,
    ),
  }
}
