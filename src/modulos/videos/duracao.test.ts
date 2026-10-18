import { formatarDuracao } from './duracao'

describe('formatarDuracao (design D3)', () => {
  test.each([
    ['PT4M12S', '4:12'],
    ['PT1H2M5S', '1:02:05'],
    ['PT45S', '0:45'],
    ['PT10M', '10:00'],
    ['PT2H', '2:00:00'],
  ])('%s → %s', (iso, esperado) => {
    expect(formatarDuracao(iso)).toBe(esperado)
  })
})
