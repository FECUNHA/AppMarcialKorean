import { expect, test } from '@playwright/test'
import { expectSemViolacoes } from './a11y'

test.describe('Casca do app', () => {
  test('navega pelos 4 módulos pela barra @smoke', async ({ page }) => {
    await page.goto('/')
    const barra = page.getByRole('navigation', { name: 'Módulos' })
    for (const nome of ['História', 'Golpes', 'Vídeos', 'Quiz']) {
      await barra.getByRole('link', { name: nome }).click()
      await expect(page.getByRole('heading', { level: 1, name: nome })).toBeVisible()
      await expect(barra.getByRole('link', { name: nome })).toHaveAttribute('aria-current', 'page')
    }
  })

  test('tela inicial sem violações de acessibilidade e com alvos ≥ 44 px @smoke', async ({ page }) => {
    await page.goto('/')
    await expectSemViolacoes(page)
    const tocaveis = page.locator('a, button')
    const total = await tocaveis.count()
    expect(total).toBeGreaterThan(0)
    for (let i = 0; i < total; i++) {
      const caixa = await tocaveis.nth(i).boundingBox()
      expect(caixa, await tocaveis.nth(i).innerText()).not.toBeNull()
      expect(caixa!.width).toBeGreaterThanOrEqual(44)
      expect(caixa!.height).toBeGreaterThanOrEqual(44)
    }
  })

  test('hangul renderizado com Noto Sans KR, sem caractere substituto (RNF5) @smoke', async ({ page }) => {
    await page.goto('/')
    const hangul = page.getByText('화랑검도')
    await expect(hangul).toBeVisible()
    const resultado = await hangul.evaluate(async (el) => {
      await document.fonts.ready
      const estilo = getComputedStyle(el)
      const facesCoreanasCarregadas = [...document.fonts].filter(
        (f) => f.family.replace(/["']/g, '') === 'Noto Sans KR' && f.unicodeRange.includes('AC00') && f.status === 'loaded',
      ).length
      return { familia: estilo.fontFamily, tamanho: parseFloat(estilo.fontSize), facesCoreanasCarregadas, texto: el.textContent }
    })
    expect(resultado.familia).toMatch(/^"?Noto Sans KR"?,/)
    expect(resultado.facesCoreanasCarregadas).toBeGreaterThan(0)
    expect(resultado.tamanho).toBeGreaterThanOrEqual(16)
    expect(resultado.texto).not.toContain('�')
  })
})
