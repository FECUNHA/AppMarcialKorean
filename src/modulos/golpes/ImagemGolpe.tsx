import { urlConteudo } from '../../conteudo/urls'
import type { Golpe } from '../../conteudo/schema'

/** Imagem 1:1 do golpe; sem imagem, um marcador neutro decorativo ocupa o mesmo espaço. */
export function ImagemGolpe({ golpe, tamanho, className }: { golpe: Golpe; tamanho: number; className?: string }) {
  if (!golpe.imagem)
    return (
      <div
        className={`marcador-sem-imagem ${className ?? ''}`}
        data-testid="marcador-sem-imagem"
        aria-hidden="true"
        style={{ aspectRatio: '1 / 1' }}
      />
    )
  return (
    <img
      className={className}
      src={urlConteudo(golpe.imagem)}
      alt={golpe.alt ?? ''}
      width={tamanho}
      height={tamanho}
      loading="lazy"
      decoding="async"
    />
  )
}
