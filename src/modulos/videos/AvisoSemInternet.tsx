/** Aviso no lugar da lista ou do player quando não há internet (RN10). */
export function AvisoSemInternet() {
  return (
    <div role="status" className="aviso-video">
      <p>
        Conecte-se para assistir
        <span className="aviso-video__detalhe">Os vídeos precisam de internet. Os outros módulos funcionam offline.</span>
      </p>
    </div>
  )
}
