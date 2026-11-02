const ID = /^[A-Za-z0-9_-]{11}$/
const HOSTS_YOUTUBE = new Set(['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com'])

/**
 * Id de 11 caracteres de um link do YouTube (design D2 de videos-em-arquivo-proprio), ou `null`.
 * Aceita página do vídeo (`watch?v=`), link curto (`youtu.be/`), `shorts/`, `embed/` e `live/`;
 * parâmetros como `t`, `si` e `list` são ignorados.
 */
export function extrairIdYoutube(link: string): string | null {
  let url: URL
  try {
    url = new URL(link.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  const host = url.hostname.replace(/^www\./, '')
  const partes = url.pathname.split('/').filter(Boolean)

  let id: string | null | undefined
  if (host === 'youtu.be') id = partes[0]
  else if (HOSTS_YOUTUBE.has(host)) {
    if (partes[0] === 'watch') id = url.searchParams.get('v')
    else if (['shorts', 'embed', 'live', 'v'].includes(partes[0])) id = partes[1]
  }
  return id && ID.test(id) ? id : null
}
