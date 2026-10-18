import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { extname, join, normalize } from 'node:path'
import { expect, test } from '@playwright/test'

const PORTA = 4181
const TIPOS: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

let tmp: string
let raiz: string
let servidor: Server

/** Build de produção com um public/ cuja versão do conteúdo é `versao`. */
function build(nome: string, versao: string) {
  const publicDir = join(tmp, `public-${nome}`)
  cpSync('public', publicDir, { recursive: true })
  const arquivo = join(publicDir, 'conteudo', 'conteudo.json')
  writeFileSync(arquivo, JSON.stringify({ ...JSON.parse(readFileSync(arquivo, 'utf8')), versao }))
  const outDir = join(tmp, `dist-${nome}`)
  execSync(`npx vite build --outDir "${outDir}" --emptyOutDir --logLevel error`, {
    env: { ...process.env, PUBLIC_DIR: publicDir },
    stdio: 'inherit',
  })
  return outDir
}

test.describe('atualização por nova versão (RNF9)', () => {
  test.describe.configure({ timeout: 180_000 })

  let distA: string
  let distB: string

  test.beforeAll(() => {
    tmp = mkdtempSync(join(tmpdir(), 'kumdo-atualizacao-'))
    distA = build('a', '1.0.0-a')
    distB = build('b', '1.0.0-b')
    raiz = distA
    servidor = createServer((req, res) => {
      const caminho = normalize(decodeURIComponent(new URL(req.url!, 'http://x').pathname)).replace(/^[\\/]+/, '')
      let arquivo = join(raiz, caminho)
      if (!existsSync(arquivo) || statSync(arquivo).isDirectory()) arquivo = join(raiz, 'index.html')
      res.writeHead(200, {
        'Content-Type': TIPOS[extname(arquivo)] ?? 'application/octet-stream',
        'Cache-Control': 'no-cache',
      })
      res.end(readFileSync(arquivo))
    }).listen(PORTA)
  })

  test.afterAll(() => {
    servidor?.close()
    rmSync(tmp, { recursive: true, force: true })
  })

  test('conteúdo do novo deploy aparece no máximo após recarregar', async ({ page }) => {
    const url = `http://localhost:${PORTA}/`
    await page.goto(url)
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready
      if (!navigator.serviceWorker.controller)
        await new Promise((ok) => navigator.serviceWorker.addEventListener('controllerchange', ok, { once: true }))
    })
    await expect(page.getByText('Versão do conteúdo: 1.0.0-a')).toBeVisible()

    raiz = distB // "deploy" do build B

    // 1º recarregamento: o navegador acha o sw.js novo e instala o service worker do build B em segundo plano.
    await page.reload()
    await page.evaluate(async () => {
      const registro = await navigator.serviceWorker.ready
      await registro.update()
      const novo = registro.installing ?? registro.waiting
      if (novo && novo.state !== 'activated')
        await new Promise((ok) => novo.addEventListener('statechange', () => novo.state === 'activated' && ok(null)))
    })
    // 2º recarregamento: já servido pelo precache do build B.
    await page.reload()
    await expect(page.getByText('Versão do conteúdo: 1.0.0-b')).toBeVisible()
  })
})
