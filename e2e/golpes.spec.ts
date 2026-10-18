import { expect, test, type Page } from '@playwright/test'
import { expectSemViolacoes } from './a11y'

async function esperarServiceWorker(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller)
      await new Promise((ok) => navigator.serviceWorker.addEventListener('controllerchange', ok, { once: true }))
  })
}

/** Filtra Cortes, busca "meori", abre o detalhe e favorita (se ainda não for favorito). */
async function percorrerCatalogo(page: Page) {
  await page.getByRole('navigation', { name: 'Módulos' }).getByRole('link', { name: 'Golpes' }).click()
  const lista = page.getByRole('list', { name: 'Golpes' })
  await expect(lista.getByRole('listitem')).toHaveCount(5)

  await page.getByRole('combobox', { name: 'Categoria' }).selectOption({ label: 'Cortes' })
  await expect(lista.getByRole('listitem')).toHaveCount(3)

  await page.getByRole('searchbox', { name: 'Buscar golpe' }).fill('meori')
  await expect(lista.getByRole('listitem')).toHaveCount(1)
  await expect(page).toHaveURL(/categoria=cortes/)
  await expect(page).toHaveURL(/q=meori/)

  await lista.getByRole('link', { name: /Meori chigi/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: /Meori chigi/ })).toBeVisible()
  await expect(page.getByRole('img', { name: /corte vertical/ })).toBeVisible()
  await expect(page.getByText('머리치기')).toBeVisible()
  await expect(page.getByText('Corte na cabeça')).toBeVisible()
}

test.describe('Módulo Golpes', () => {
  test('filtra, busca, abre o detalhe, favorita e encontra em "Meus favoritos" — online e offline @smoke', async ({
    page,
    context,
  }) => {
    await page.goto('/')
    await esperarServiceWorker(page)

    await percorrerCatalogo(page)
    await page.getByRole('button', { name: 'Favoritar' }).click()
    await expect(page.getByRole('button', { name: 'Remover dos favoritos' })).toHaveAttribute('aria-pressed', 'true')

    // Voltar preserva o filtro.
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page.getByRole('searchbox', { name: 'Buscar golpe' })).toHaveValue('meori')

    // Fechar e reabrir: o favorito continua (CA11).
    await page.goto('/golpes?categoria=favoritos')
    await page.reload()
    await expect(page.getByRole('list', { name: 'Golpes' }).getByRole('listitem')).toHaveCount(1)
    await expect(page.getByText('Meori chigi')).toBeVisible()

    // Mesma navegação sem internet.
    await context.setOffline(true)
    await page.goto('/')
    await percorrerCatalogo(page)
    await expect(page.getByRole('button', { name: 'Remover dos favoritos' })).toBeVisible()
    await page.goto('/golpes?categoria=favoritos')
    await expect(page.getByText('Meori chigi')).toBeVisible()
  })

  test('lista e detalhe sem violações de acessibilidade @smoke', async ({ page }) => {
    await page.goto('/golpes')
    await expect(page.getByRole('list', { name: 'Golpes' }).getByRole('listitem')).toHaveCount(5)
    await expectSemViolacoes(page)

    await page.goto('/golpes/meori-chigi')
    await expect(page.getByRole('heading', { level: 1, name: /Meori chigi/ })).toBeVisible()
    await expectSemViolacoes(page)

    await page.goto('/golpes?categoria=formas')
    await expect(page.getByText('Nenhum golpe nesta categoria')).toBeVisible()
    await expectSemViolacoes(page)
  })
})
