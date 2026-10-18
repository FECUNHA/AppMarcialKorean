// Lighthouse CI — RNF1 (instalabilidade) e RNF3 (LCP ≤ 3 s no perfil mobile padrão: Moto G Power, 4G lento).
module.exports = {
  ci: {
    collect: {
      // serve aplica gzip e fallback SPA, como um host estático de produção (vite preview não comprime).
      startServerCommand: 'npx serve dist --single --listen 4174 --no-clipboard',
      startServerReadyPattern: 'Accepting connections|Serving',
      url: ['http://localhost:4174/'],
      numberOfRuns: 3,
      settings: { preset: 'perf', onlyCategories: ['performance', 'pwa'] },
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 3000, aggregationMethod: 'median' }],
        'installable-manifest': 'error',
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/relatorios' },
  },
}
