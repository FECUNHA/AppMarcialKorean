import { expect, test, type Locator, type Page } from '@playwright/test'
import { expectSemViolacoes } from './a11y'

const TRACO = 'rgb(31, 42, 55)' // --cor-traco
const SOMBRA = /^rgb\(31, 42, 55\) [34]px [34]px 0px/

async function familia(alvo: Locator) {
  return alvo.evaluate((el) => getComputedStyle(el).fontFamily)
}

async function esperarTraco(alvo: Locator) {
  await expect(alvo).toHaveCSS('border-top-width', '2px')
  await expect(alvo).toHaveCSS('border-top-color', TRACO)
  expect(await alvo.evaluate((el) => getComputedStyle(el).boxShadow)).toMatch(SOMBRA)
}

/** Vídeos de exemplo sem tocar no YouTube. */
async function semYoutube(page: Page) {
  await page.route(/youtube\.com|youtube-nocookie\.com|ytimg\.com/, (rota) => rota.abort())
  await page.route('**/conteudo/videos.json', (rota) =>
    rota.fulfill({
      json: { videos: [{ url: 'https://youtu.be/AAAAAAAAAAA', titulo: 'Cortes básicos', duracao: 'PT4M12S', categoria: 'cortes' }] },
    }),
  )
}

test.describe('Módulos no estilo Doodle (RNF5, RNF6)', () => {
  // Sem service worker: o page.route precisa servir o videos.json de exemplo (o SW serviria o real do precache).
  test.use({ serviceWorkers: 'block' })

  test('Golpes: cartão rabiscado; no detalhe o hangul em Noto Sans KR e a romanização na manuscrita @smoke', async ({ page }) => {
    await page.goto('/golpes')
    await esperarTraco(page.locator('.cartao-golpe').first())
    await expectSemViolacoes(page)

    await page.goto('/golpes/meori-chigi')
    expect(await familia(page.locator('.detalhe-golpe__hangul'))).toMatch(/^"?Noto Sans KR"?,/)
    expect(await familia(page.locator('.detalhe-golpe__romanizado'))).toMatch(/^"?Delius Swash Caps"?,/)
    expect(await familia(page.locator('.detalhe-golpe__faixa'))).toMatch(/^"?JetBrains Mono"?,/)
    await expectSemViolacoes(page)
  })

  test('História: lista e capítulo rabiscados e sem violações @smoke', async ({ page }) => {
    await page.goto('/historia')
    await esperarTraco(page.locator('.lista-capitulos__item').first())
    await expectSemViolacoes(page)

    await page.goto('/historia/o-que-e')
    await esperarTraco(page.locator('.navegacao-capitulos__link').first())
    await expectSemViolacoes(page)
  })

  test('Vídeos: cartão rabiscado, duração em JetBrains Mono e sem violações @smoke', async ({ page }) => {
    await semYoutube(page)
    await page.goto('/videos')
    await esperarTraco(page.locator('.cartao-video__miniatura').first())
    expect(await familia(page.locator('.cartao-video__duracao').first())).toMatch(/^"?JetBrains Mono"?,/)
    await expectSemViolacoes(page)

    await page.goto('/videos/AAAAAAAAAAA')
    await expect(page.getByText('Este vídeo não está disponível')).toBeVisible()
    await esperarTraco(page.locator('.aviso-video'))
    await expectSemViolacoes(page)
  })

  test('Quiz: alternativas rabiscadas, certa/errada com cor e texto e sem violações @smoke', async ({ page }) => {
    await page.goto('/quiz')
    await page.getByRole('button', { name: 'Iniciar' }).click()
    const alternativa = page.getByRole('group', { name: 'Alternativas' }).getByRole('button').first()
    await esperarTraco(alternativa)
    expect(await familia(page.locator('.quiz-pergunta__progresso'))).toMatch(/^"?JetBrains Mono"?,/)
    await alternativa.click()
    await expect(page.locator('.quiz-alternativa--certa')).toHaveCSS('border-top-color', 'rgb(22, 163, 74)') // --cor-sucesso
    await expectSemViolacoes(page)
  })
})
