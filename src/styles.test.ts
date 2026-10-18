import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// O Vitest troca imports de CSS por string vazia, então o arquivo é lido direto do disco.
const css = readFileSync(resolve(__dirname, 'styles.css'), 'utf8')

describe('estilos globais (RNF5)', () => {
  beforeAll(() => {
    const estilo = document.createElement('style')
    estilo.textContent = css
    document.head.appendChild(estilo)
  })

  test('a fonte do corpo é Noto Sans KR (renderiza hangul)', () => {
    expect(getComputedStyle(document.body).fontFamily).toMatch(/^["']?Noto Sans KR["']?,/)
  })

  test('o tamanho base do texto é no mínimo 16 px', () => {
    expect(parseFloat(getComputedStyle(document.body).fontSize)).toBeGreaterThanOrEqual(16)
  })
})
