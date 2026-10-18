import { expect, test, type Page } from '@playwright/test'
import { expectSemViolacoes } from './a11y'

const TITULOS = [
  'O que é o Hwarang Kumdo',
  'Significado do nome',
  'Como é treinado',
  'Equipamentos',
  'Diferenças para outras artes de espada',
  'Contexto histórico',
  'Kumdo: o caminho da espada',
  'Kumdo x Kendo',
  'Não confundir com Haidong Gumdo',
]

async function lerPrimeiroEProximo(page: Page) {
  await page.getByRole('navigation', { name: 'Módulos' }).getByRole('link', { name: 'História' }).click()
  const lista = page.getByRole('list', { name: 'Capítulos' })
  await expect(lista.getByRole('link')).toHaveText(TITULOS)

  await lista.getByRole('link', { name: TITULOS[0] }).click()
  await expect(page.getByRole('heading', { level: 1, name: TITULOS[0] })).toBeVisible()
  await expect(page.getByText(/arte marcial coreana de espada/)).toBeVisible()

  await page.getByRole('navigation', { name: 'Capítulos' }).getByRole('link', { name: /Próximo/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: TITULOS[1] })).toBeVisible()
  await expect(page.getByText('Hwarang:', { exact: true })).toBeVisible()
}

test.describe('Módulo História', () => {
  test('abre pela barra, lê o 1º capítulo e vai ao próximo — online e offline @smoke', async ({ page, context }) => {
    await page.goto('/')
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready
      if (!navigator.serviceWorker.controller)
        await new Promise((ok) => navigator.serviceWorker.addEventListener('controllerchange', ok, { once: true }))
    })
    await lerPrimeiroEProximo(page)

    await context.setOffline(true)
    await page.goto('/')
    await lerPrimeiroEProximo(page)
  })

  test('lista e capítulo sem violações de acessibilidade @smoke', async ({ page }) => {
    await page.goto('/historia')
    await expect(page.getByRole('list', { name: 'Capítulos' }).getByRole('link')).toHaveCount(TITULOS.length)
    await expectSemViolacoes(page)

    await page.goto('/historia/significado-do-nome')
    await expect(page.getByRole('heading', { level: 1, name: TITULOS[1] })).toBeVisible()
    await expectSemViolacoes(page)
  })
})
