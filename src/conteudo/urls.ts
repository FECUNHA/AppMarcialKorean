/** URL pública de um arquivo referenciado no conteúdo (ex.: `golpes/meori-chigi.webp`). */
export function urlConteudo(arquivo: string) {
  return `${import.meta.env.BASE_URL}conteudo/${arquivo}`
}
