import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// O Vitest troca imports de CSS por string vazia, então o arquivo é lido direto do disco.
const css = readFileSync(resolve(__dirname, 'styles.css'), 'utf8')

/** Lista de famílias, resolvendo um token `var(--x)` em :root (o jsdom não resolve var() em font-family). */
function familias(valor: string): string[] {
  const token = /^var\((--[\w-]+)\)$/.exec(valor.trim())
  const real = token ? getComputedStyle(document.documentElement).getPropertyValue(token[1]) : valor
  return real.split(',').map((f) => f.trim().replace(/^["']|["']$/g, ''))
}

describe('estilos globais (RNF5, RNF6 — redesign-visual-doodle)', () => {
  beforeAll(() => {
    const estilo = document.createElement('style')
    estilo.textContent = css
    document.head.appendChild(estilo)
  })

  test('o corpo usa a fonte manuscrita com Noto Sans KR logo atrás para o hangul', () => {
    expect(familias(getComputedStyle(document.body).fontFamily).slice(0, 2)).toEqual(['Delius Swash Caps', 'Noto Sans KR'])
  })

  test('texto marcado como coreano usa Noto Sans KR primeiro', () => {
    const hangul = document.createElement('span')
    hangul.lang = 'ko'
    hangul.textContent = '머리치기'
    document.body.appendChild(hangul)
    expect(familias(getComputedStyle(hangul).fontFamily)[0]).toBe('Noto Sans KR')
  })

  test('o tamanho base do texto é no mínimo 16 px', () => {
    expect(parseFloat(getComputedStyle(document.body).fontSize)).toBeGreaterThanOrEqual(16)
  })

  test.each([
    ['--cor-primaria', '#49B6E5'],
    ['--cor-secundaria', '#263D5B'],
    ['--cor-texto', '#111827'],
    ['--cor-superficie', '#FFFFFF'],
    ['--cor-sucesso', '#16A34A'],
    ['--cor-alerta', '#D97706'],
    ['--cor-perigo', '#DC2626'],
  ])('o token %s é %s (paleta Doodle)', (token, cor) => {
    expect(getComputedStyle(document.documentElement).getPropertyValue(token).trim().toUpperCase()).toBe(cor)
  })
})
