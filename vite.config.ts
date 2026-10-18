/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/** Embute o CSS (≈ 4 KB) no index.html: tira um recurso que bloqueia a 1ª pintura (RNF3). */
function cssEmbutido(): Plugin {
  return {
    name: 'css-embutido',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((a) => a.type === 'asset' && a.fileName === 'index.html')
      if (!html || html.type !== 'asset') return
      let fonte = String(html.source)
      for (const css of Object.values(bundle)) {
        if (css.type !== 'asset' || !css.fileName.endsWith('.css')) continue
        const tag = new RegExp(`<link rel="stylesheet"[^>]*href="[^"]*/${css.fileName}"[^>]*>`)
        if (!tag.test(fonte)) continue
        fonte = fonte.replace(tag, () => `<style>${String(css.source)}</style>`)
        delete bundle[css.fileName]
      }
      html.source = fonte
    },
  }
}

/**
 * Caminho em que o app é publicado. No GitLab Pages o site fica em `/<projeto>/` (ou na raiz, com
 * domínio único); o CI passa BASE_PATH. Local e testes usam a raiz.
 */
const base = `/${(process.env.BASE_PATH ?? '/').replace(/^\/+|\/+$/g, '')}/`.replace(/\/{2,}/g, '/')

/**
 * GitLab Pages não reescreve rotas do SPA para o index.html; ele serve `404.html` para caminhos
 * desconhecidos. Uma cópia do index.html como 404.html faz `/golpes/meori-chigi` abrir o app
 * mesmo no 1º acesso (depois disso o service worker atende as navegações).
 */
function paginaSpa404(): Plugin {
  return {
    name: 'pagina-spa-404',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (html?.type === 'asset') this.emitFile({ type: 'asset', fileName: '404.html', source: html.source })
    },
  }
}

export default defineConfig({
  base,
  // PUBLIC_DIR só é usado pelo e2e de atualização (e2e/atualizacao.spec.ts) para gerar um 2º build.
  publicDir: process.env.PUBLIC_DIR ?? 'public',
  plugins: [
    react(),
    cssEmbutido(),
    paginaSpa404(),
    // Design D4: autoUpdate — o novo service worker assume no próximo carregamento (RNF9).
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['icone.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Hwarang Kumdo',
        short_name: 'Kumdo',
        description: 'Estudo de Hwarang Kumdo: história, golpes, vídeos e quiz.',
        lang: 'pt-BR',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#9f1d20',
        background_color: '#faf7f2',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,webp,png,svg,woff2}'],
        navigateFallback: `${base}index.html`,
        globIgnores: ['**/404.html'],
        cleanupOutdatedCaches: true,
        // Design D4 (RN09): nada do YouTube é guardado — só arquivos do build entram no precache
        // e não há runtimeCaching (o player e as miniaturas são de outra origem).
        // Explícitos: o SW novo assume na hora, inclusive a página do 1º acesso (D4, RNF2, RNF9).
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
  },
})
