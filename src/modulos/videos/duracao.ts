/** Duração ISO 8601 (`PT4M12S`) para exibição (`4:12`, `1:02:05`) — design D3. */
export function formatarDuracao(iso: string) {
  const [, h = '0', m = '0', s = '0'] = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso) ?? []
  const dois = (n: string) => n.padStart(2, '0')
  return Number(h) > 0 ? `${Number(h)}:${dois(m)}:${dois(s)}` : `${Number(m)}:${dois(s)}`
}
