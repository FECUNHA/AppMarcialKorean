import { expect, test } from '@playwright/test'

test('abre os módulos de conteúdo sem internet após o 1º acesso @smoke', async ({ page, context }) => {
  await page.goto('/')
  // Espera o service worker assumir a página — a partir daí o precache está completo.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller)
      await new Promise((ok) => navigator.serviceWorker.addEventListener('controllerchange', ok, { once: true }))
  })

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Hwarang Kumdo' })).toBeVisible()

  for (const [caminho, titulo] of [
    ['/historia', 'História'],
    ['/golpes', 'Golpes'],
    ['/quiz', 'Quiz'],
  ]) {
    await page.goto(caminho)
    await expect(page.getByRole('heading', { level: 1, name: titulo })).toBeVisible()
  }

  // Conteúdo e imagens vêm do cache, sem rede.
  const recursos = await page.evaluate(async () => {
    const conteudo: { golpes: { imagem: string }[] } = await (await fetch('/conteudo/conteudo.json')).json()
    const imagens = await Promise.all(
      conteudo.golpes.map(async (g) => {
        const r = await fetch(`/conteudo/${g.imagem}`)
        return { arquivo: g.imagem, ok: r.ok, tipo: r.headers.get('content-type') }
      }),
    )
    return { golpes: conteudo.golpes.length, imagens }
  })
  expect(recursos.golpes).toBe(5)
  for (const img of recursos.imagens) expect(img, img.arquivo).toMatchObject({ ok: true, tipo: 'image/webp' })
})
