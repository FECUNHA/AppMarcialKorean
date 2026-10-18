import { NavLink } from 'react-router-dom'
import { MODULOS } from './modulos'

export function BarraAbas() {
  return (
    <nav className="barra-abas" aria-label="Módulos">
      <ul>
        {MODULOS.map((m) => (
          <li key={m.id}>
            {/* NavLink marca aria-current="page" na aba ativa. */}
            <NavLink to={m.caminho} className="barra-abas__aba">
              {m.nome}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
