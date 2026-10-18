import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

/** Falha se a página tiver violações WCAG 2.x A/AA de impacto sério ou crítico (RNF6). */
export async function expectSemViolacoes(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  expect(graves.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nós)`)).toEqual([])
}
