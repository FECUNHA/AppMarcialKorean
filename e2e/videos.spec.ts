import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { expectSemViolacoes } from './a11y'

/** Conteúdo real + vídeos de exemplo em Cortes, História e Treinos (ids fictícios: o YouTube fica bloqueado). */
function conteudoComVideos() {
  const conteudo = JSON.parse(readFileSync('public/conteudo/conteudo.json', 'utf8'))
  conteudo.videos = [
    { id: 'e2e-cortes', youtube_id: 'AAAAAAAAAAA', titulo: 'Cortes básicos', duracao: 'PT4M12S', categoria: 'cortes' },
    { id: 'e2e-historia', youtube_id: 'BBBBBBBBBBB', titulo: 'Origem do Hwarang', duracao: 'PT1H2M5S', categoria: 'historia' },
    { id: 'e2e-treinos', youtube_id: 'CCCCCCCCCCC', titulo: 'Aquecimento', duracao: 'PT45S', categoria: 'treinos' },
  ]
  if (!conteudo.categorias.some((c: { id: string }) => c.id === 'historia'))
    conteudo.categorias.push({ id: 'historia', nome: 'História', aplica_a: ['videos'] })
  return conteudo
}

async function prepararSemYoutube(page: Page) {
  await page.route(/youtube\.com|youtube-nocookie\.com|ytimg\.com/, (rota) => rota.abort())
  await page.route('**/conteudo/conteudo.json', (rota) => rota.fulfill({ json: conteudoComVideos() }))
}

test.describe('Módulo Vídeos (YouTube bloqueado)', () => {
  // Sem service worker, para o page.route servir o conteúdo de teste.
  test.use({ serviceWorkers: 'block' })

  test('lista, filtro História, aviso offline e demais módulos navegáveis @smoke', async ({ page, context }) => {
    await prepararSemYoutube(page)
    await page.goto('/')
    const barra = page.getByRole('navigation', { name: 'Módulos' })
    await barra.getByRole('link', { name: 'Vídeos' }).click()

    const lista = page.getByRole('list', { name: 'Vídeos' })
    await expect(lista.getByRole('listitem')).toHaveCount(3)
    const primeiro = lista.getByRole('listitem').first()
    await expect(primeiro.getByRole('img', { name: 'Miniatura: Cortes básicos' })).toBeAttached()
    await expect(primeiro.getByText('4:12')).toBeVisible()
    await expect(primeiro.getByText('Cortes', { exact: true })).toBeVisible()

    await page.getByRole('combobox', { name: 'Categoria' }).selectOption({ label: 'História' })
    await expect(lista.getByRole('listitem')).toHaveCount(1)
    await expect(lista.getByText('Origem do Hwarang')).toBeVisible()

    // Sem service worker neste teste: abre os outros módulos uma vez online para os chunks ficarem
    // carregados (em produção o service worker pré-cacheia todos — ver offline.spec e quiz.spec).
    for (const aba of ['Golpes', 'História', 'Quiz', 'Vídeos']) {
      await barra.getByRole('link', { name: aba }).click()
      await expect(page.getByRole('heading', { level: 1, name: aba })).toBeVisible()
    }
    await page.getByRole('combobox', { name: 'Categoria' }).selectOption({ label: 'História' })

    await context.setOffline(true)
    await expect(page.getByText('Conecte-se para assistir')).toBeVisible()
    await expect(lista).toHaveCount(0)

    for (const [aba, titulo] of [
      ['Golpes', 'Golpes'],
      ['História', 'História'],
      ['Quiz', 'Quiz'],
    ]) {
      await barra.getByRole('link', { name: aba }).click()
      await expect(page.getByRole('heading', { level: 1, name: titulo })).toBeVisible()
    }

    await context.setOffline(false)
    await barra.getByRole('link', { name: 'Vídeos' }).click()
    await expect(lista.getByRole('listitem')).toHaveCount(3)
  })

  test('vídeo bloqueado no YouTube mostra "Este vídeo não está disponível" @smoke', async ({ page }) => {
    await prepararSemYoutube(page)
    await page.goto('/videos/e2e-cortes')
    await expect(page.getByRole('heading', { level: 1, name: 'Cortes básicos' })).toBeVisible()
    await expect(page.getByText('Este vídeo não está disponível')).toBeVisible()
  })

  test('lista e detalhe do vídeo sem violações de acessibilidade @smoke', async ({ page }) => {
    await prepararSemYoutube(page)
    await page.goto('/videos')
    await expect(page.getByRole('list', { name: 'Vídeos' }).getByRole('listitem')).toHaveCount(3)
    await expectSemViolacoes(page)

    await page.goto('/videos/e2e-historia')
    await expect(page.getByRole('heading', { level: 1, name: 'Origem do Hwarang' })).toBeVisible()
    await expectSemViolacoes(page)
  })

  test('service worker gerado não guarda nada do YouTube (RN09) @smoke', async ({ request }) => {
    const sw = await (await request.get('/sw.js')).text()
    expect(sw).toContain('precacheAndRoute')
    // Nenhuma URL do YouTube no precache (o chunk local `youtube-<hash>.js` é código do app, não conta)
    // e nenhum cache em tempo de execução: a única rota registrada é o fallback de navegação do SPA.
    expect(sw).not.toMatch(/https?:\/\/[^"']*(youtube|ytimg)/i)
    expect(sw.match(/registerRoute\(/g)).toHaveLength(1)
    expect(sw).toContain('NavigationRoute')
  })
})

test.describe('Módulo Vídeos (YouTube real)', () => {
  test('o player incorporado aponta para youtube-nocookie.com (RNF7) @externo', async ({ page }) => {
    const id = process.env.YT_VIDEO_ID ?? 'qjrYw-LjlB0'
    await page.route('**/conteudo/conteudo.json', async (rota) => {
      const conteudo = JSON.parse(readFileSync('public/conteudo/conteudo.json', 'utf8'))
      conteudo.videos = [{ id: 'externo', youtube_id: id, titulo: 'Vídeo real', duracao: 'PT50S', categoria: 'treinos' }]
      await rota.fulfill({ json: conteudo })
    })
    await page.goto('/videos/externo')
    const iframe = page.locator('.player-youtube iframe')
    await expect(iframe).toHaveAttribute('src', /^https:\/\/www\.youtube-nocookie\.com\/embed\//, { timeout: 20_000 })
    await expect(iframe).toHaveAttribute('title', 'Vídeo: Vídeo real')
  })
})
