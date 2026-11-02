import { expect, test, type Locator, type Page } from '@playwright/test'

const TRACO = 'rgb(31, 42, 55)' // --cor-traco #1F2A37
const PRIMARIA = 'rgb(73, 182, 229)' // --cor-primaria #49B6E5

async function estilo(alvo: Locator, ...props: string[]) {
  return alvo.evaluate((el, nomes) => {
    const cs = getComputedStyle(el)
    return Object.fromEntries(nomes.map((n) => [n, cs.getPropertyValue(n)]))
  }, props)
}

async function fontesDoTemaCarregadas(page: Page) {
  return page.evaluate(async () => {
    await document.fonts.ready
    const carregadas = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/["']/g, ''))
    return { delius: carregadas.includes('Delius Swash Caps'), check: document.fonts.check('24px "Delius Swash Caps"', 'Hwarang') }
  })
}

test.describe('Identidade visual Doodle (RNF6)', () => {
  test('tela inicial: fonte manuscrita, papel pontilhado, traço e sombra sólida @smoke', async ({ page }) => {
    await page.goto('/')
    const h1 = page.getByRole('heading', { level: 1, name: 'Hwarang Kumdo' })
    expect((await estilo(h1, 'font-family'))['font-family']).toMatch(/^"?Delius Swash Caps"?,/)
    expect(await fontesDoTemaCarregadas(page)).toEqual({ delius: true, check: true })

    expect((await estilo(page.locator('body'), 'background-image'))['background-image']).toContain('radial-gradient')

    const cartao = page.locator('.cartao-modulo').first()
    const c = await estilo(cartao, 'border-top-width', 'border-top-color', 'box-shadow')
    expect(c['border-top-width']).toBe('2px')
    expect(c['border-top-color']).toBe(TRACO)
    expect(c['box-shadow']).toMatch(/^rgb\(31, 42, 55\) 4px 4px 0px/)

    const ativa = page.getByRole('navigation', { name: 'Módulos' }).locator('[aria-current="page"]')
    await page.getByRole('navigation', { name: 'Módulos' }).getByRole('link', { name: 'Golpes' }).click()
    // toHaveCSS espera a transição de 120 ms terminar
    await expect(ativa).toHaveCSS('background-color', PRIMARIA)
    await expect(ativa).toHaveCSS('border-top-width', '2px')
    await expect(ativa).toHaveCSS('border-top-color', TRACO)
    await expect(ativa).not.toHaveCSS('box-shadow', 'none')
  })

  test('foco por teclado num cartão mostra contorno visível @smoke', async ({ page }) => {
    await page.goto('/')
    const cartao = page.locator('.cartao-modulo').first()
    await cartao.focus()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab')
    await expect(cartao).toBeFocused()
    const f = await estilo(cartao, 'outline-style', 'outline-width', 'outline-color')
    expect(f['outline-style']).not.toBe('none')
    expect(parseFloat(f['outline-width'])).toBeGreaterThanOrEqual(3)
  })

  test('fontes do tema continuam sem internet @smoke', async ({ page, context }) => {
    await page.goto('/')
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready
      if (!navigator.serviceWorker.controller)
        await new Promise((ok) => navigator.serviceWorker.addEventListener('controllerchange', ok, { once: true }))
    })
    await context.setOffline(true)
    await page.reload()
    expect(await fontesDoTemaCarregadas(page)).toEqual({ delius: true, check: true })
  })
})
