import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { track } from '../analytics/track'
import { BarraAbas } from './BarraAbas'
import { MODULOS } from './modulos'

export function LayoutRaiz() {
  const { pathname } = useLocation()

  useEffect(() => {
    const modulo = MODULOS.find((m) => m.caminho === pathname)
    if (modulo) track('modulo_aberto', { modulo: modulo.id })
  }, [pathname])

  return (
    <div className="layout">
      <Outlet />
      <BarraAbas />
      <ScrollRestoration />
    </div>
  )
}
