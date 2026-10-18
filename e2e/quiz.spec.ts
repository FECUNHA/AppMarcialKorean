import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { expectSemViolacoes } from './a11y'

const conteudo: { golpes: { id: string; nome_romanizado: string; imagem?: string }[] } = JSON.parse(
  readFileSync('public/conteudo/conteudo.json', 'utf8'),
)
const elegiveis = conteudo.golpes.filter((g) => g.imagem)
const romanizadoPorId = new Map(elegiveis.map((g) => [g.id, g.nome_romanizado]))

/** Golpe da pergunta atual, descoberto pela imagem (`/conteudo/golpes/<id>.webp`). */
async function golpeAtual(page: Page) {
  const src = await page.locator('.quiz-pergunta__imagem').getAttribute('src')
  const id = /golpes\/([^/]+)\.(webp|png)$/.exec(src ?? '')?.[1]
  return { id: id!, romanizado: romanizadoPorId.get(id!)! }
}

/** Responde a pergunta atual: errado na 1ª, certo nas demais. Devolve o id do golpe errado. */
async function responderRodada(page: Page, aoResponderPrimeira?: () => Promise<void>) {
  const total = elegiveis.length
  let errado = ''
  for (let i = 0; i < total; i++) {
    await expect(page.getByText(`Pergunta ${i + 1} de ${total}`)).toBeVisible()
    const { id, romanizado } = await golpeAtual(page)
    const grupo = page.getByRole('group', { name: 'Alternativas' })
    if (i === 0) {
      errado = id
      await grupo.getByRole('button').filter({ hasNotText: romanizado }).first().click()
      await expect(page.getByText(/Errado\. Resposta correta:/)).toBeVisible()
      await aoResponderPrimeira?.()
    } else {
      await grupo.getByRole('button', { name: new RegExp(romanizado) }).click()
      await expect(page.locator('[aria-live="polite"]')).toContainText('Certo.')
    }
    await page.getByRole('button', { name: i === total - 1 ? 'Ver resultado' : 'Próxima' }).click()
  }
  return errado
}

test('quiz offline: responde a rodada, vê o resultado, revisa um erro, volta e joga de novo @smoke', async ({
  page,
  context,
}) => {
  await page.goto('/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller)
      await new Promise((ok) => navigator.serviceWorker.addEventListener('controllerchange', ok, { once: true }))
  })
  await context.setOffline(true)
  await page.reload()

  await page.getByRole('navigation', { name: 'Módulos' }).getByRole('link', { name: 'Quiz' }).click()
  await page.getByRole('button', { name: 'Iniciar' }).click()

  const errado = await responderRodada(page, async () => {
    // Pergunta respondida: imagem carregada do cache e sem violações de acessibilidade.
    await expect(page.locator('.quiz-pergunta__imagem')).toHaveJSProperty('complete', true)
    expect(await page.locator('.quiz-pergunta__imagem').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
    await expectSemViolacoes(page)
  })

  const total = elegiveis.length
  await expect(page.getByText(`${total - 1}/${total}`)).toBeVisible()
  await expect(page.getByText(`${Math.round(((total - 1) / total) * 100)}%`)).toBeVisible()
  await expect(page.getByRole('list', { name: 'Golpes errados' }).getByRole('link')).toHaveCount(1)
  await expectSemViolacoes(page)

  await page.getByRole('button', { name: 'Revisar golpes errados' }).click()
  await expect(page).toHaveURL(new RegExp(`/golpes/${errado}$`))
  await expect(page.getByRole('heading', { level: 1, name: new RegExp(romanizadoPorId.get(errado)!) })).toBeVisible()

  await page.getByRole('button', { name: 'Voltar' }).click()
  await expect(page.getByText(`${total - 1}/${total}`)).toBeVisible()

  await page.getByRole('button', { name: 'Jogar de novo' }).click()
  await expect(page.getByText(`Pergunta 1 de ${total}`)).toBeVisible()
})
