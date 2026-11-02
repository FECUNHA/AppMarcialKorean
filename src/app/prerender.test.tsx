import { renderRota } from '../test/renderRota'
import { renderizarCasca } from './prerender'

describe('casca pré-renderizada da tela inicial (redesign-visual-doodle, D6)', () => {
  test('é igual ao primeiro render do app em "/"', () => {
    const { container } = renderRota('/')
    expect(renderizarCasca('/')).toBe(container.innerHTML)
  })

  test('traz o h1, os 4 módulos e a barra de abas', () => {
    const html = renderizarCasca('/')
    expect(html).toContain('<h1>Hwarang Kumdo</h1>')
    for (const caminho of ['/historia', '/golpes', '/videos', '/quiz']) expect(html).toContain(`href="${caminho}"`)
    expect(html).toContain('aria-label="Módulos"')
  })

  test('links respeitam a base de publicação', () => {
    const html = renderizarCasca('/AppMarcialKorean/')
    expect(html).toContain('href="/AppMarcialKorean/golpes"')
    expect(html).not.toMatch(/href="\/golpes"/)
  })
})
