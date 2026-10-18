import type { RouteObject } from 'react-router-dom'
import { CarregandoTela } from './CarregandoTela'
import { LayoutRaiz } from './LayoutRaiz'
import { TelaInicial } from './TelaInicial'

/**
 * Telas de módulo carregadas sob demanda (RNF3): o bundle inicial só leva a casca e a tela inicial.
 * Cada módulo vira um chunk próprio, pré-cacheado pelo service worker para o uso offline (RNF2).
 */
export const rotas: RouteObject[] = [
  {
    element: <LayoutRaiz />,
    // Abrir o app direto numa rota de módulo: aparece enquanto o chunk da tela carrega.
    HydrateFallback: CarregandoTela,
    children: [
      { path: '/', element: <TelaInicial /> },
      {
        path: '/historia',
        lazy: async () => ({ Component: (await import('../modulos/historia/ListaCapitulos')).TelaHistoria }),
      },
      {
        path: '/historia/:id',
        lazy: async () => ({ Component: (await import('../modulos/historia/Capitulo')).TelaCapitulo }),
      },
      {
        path: '/golpes',
        lazy: async () => ({ Component: (await import('../modulos/golpes/ListaGolpes')).TelaGolpes }),
      },
      {
        path: '/golpes/:id',
        lazy: async () => ({ Component: (await import('../modulos/golpes/DetalheGolpe')).TelaDetalheGolpe }),
      },
      {
        path: '/videos',
        lazy: async () => ({ Component: (await import('../modulos/videos/ListaVideos')).TelaVideos }),
      },
      {
        path: '/videos/:id',
        lazy: async () => ({ Component: (await import('../modulos/videos/TelaVideo')).TelaVideo }),
      },
      {
        path: '/quiz',
        lazy: async () => ({ Component: (await import('../modulos/quiz/TelaQuiz')).TelaQuiz }),
      },
    ],
  },
]

/** Adota já o comportamento do React Router v7 (silencia os avisos de migração). */
export const futuroRouter = {
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
} as const
