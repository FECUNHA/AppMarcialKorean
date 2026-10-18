import { Fragment } from 'react'

/**
 * Design D1: parágrafos separados por linha em branco e `**negrito**`. Tudo vira nó React
 * (nunca innerHTML), então HTML no conteúdo aparece como texto.
 */
export function TextoCapitulo({ texto }: { texto: string }) {
  const paragrafos = texto
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  return (
    <div className="capitulo__texto">
      {paragrafos.map((p, i) => (
        <p key={i}>{comNegrito(p)}</p>
      ))}
    </div>
  )
}

function comNegrito(paragrafo: string) {
  return paragrafo.split(/\*\*(.+?)\*\*/g).map((trecho, i) =>
    i % 2 === 1 ? <strong key={i}>{trecho}</strong> : <Fragment key={i}>{trecho}</Fragment>,
  )
}
