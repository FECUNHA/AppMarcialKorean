/**
 * Gera os ícones PNG do PWA a partir de public/icone.svg (Chromium do Playwright).
 * Uso: npx tsx scripts/gerar-icones.ts — rode de novo só quando o SVG mudar.
 */
import { readFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const svg = readFileSync('public/icone.svg', 'utf8')
const ICONES = [
  { arquivo: 'public/pwa-192x192.png', tamanho: 192, escala: 1 },
  { arquivo: 'public/pwa-512x512.png', tamanho: 512, escala: 1 },
  { arquivo: 'public/apple-touch-icon.png', tamanho: 180, escala: 1 },
  // Maskable: o desenho cabe na zona segura (80% central), o fundo cobre tudo.
  { arquivo: 'public/maskable-512x512.png', tamanho: 512, escala: 0.8 },
]

const browser = await chromium.launch()
const page = await browser.newPage()
for (const { arquivo, tamanho, escala } of ICONES) {
  await page.setViewportSize({ width: tamanho, height: tamanho })
  await page.setContent(
    `<html><body style="margin:0;background:#9f1d20;display:grid;place-items:center;height:100vh">
      <div style="width:${tamanho * escala}px;height:${tamanho * escala}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div>
    </body></html>`,
  )
  await page.screenshot({ path: arquivo, omitBackground: false })
  console.log(`gerado ${arquivo}`)
}
await browser.close()
