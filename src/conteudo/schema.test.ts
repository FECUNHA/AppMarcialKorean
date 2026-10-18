import { conteudoValido } from '../test/fixtures/conteudo'
import { golpesElegiveisQuiz, validarConteudo } from './schema'

function golpe(alterar: (g: Record<string, unknown>) => void) {
  const c = conteudoValido()
  alterar(c.golpes[0] as Record<string, unknown>)
  return c
}

describe('schema do conteúdo (R3)', () => {
  test('conteúdo válido passa', () => {
    expect(validarConteudo(conteudoValido())).toMatchObject({ ok: true })
  })

  test.each(['nome_hangul', 'nome_romanizado', 'nome_pt', 'categoria'])(
    'golpe sem %s falha indicando id e campo (RN01)',
    (campo) => {
      const r = validarConteudo(golpe((g) => delete g[campo]))
      expect(r.ok).toBe(false)
      if (!r.ok) expect(r.erros).toContain(`golpe meori-chigi: campo ${campo} ausente`)
    },
  )

  test('golpe com nome_pt vazio conta como ausente', () => {
    const r = validarConteudo(golpe((g) => (g.nome_pt = '  ')))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain('golpe meori-chigi: campo nome_pt ausente')
  })

  test('golpe com categoria inexistente falha (RN01)', () => {
    const r = validarConteudo(golpe((g) => (g.categoria = 'chutes')))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain('golpe meori-chigi: categoria chutes não existe')
  })

  test('golpe sem imagem passa e não é elegível ao quiz', () => {
    const r = validarConteudo(
      golpe((g) => {
        delete g.imagem
        delete g.alt
      }),
    )
    expect(r.ok).toBe(true)
    if (r.ok) expect(golpesElegiveisQuiz(r.conteudo)).toEqual([])
  })

  test('golpe com imagem é elegível ao quiz', () => {
    const r = validarConteudo(conteudoValido())
    if (!r.ok) throw new Error(r.erros.join('\n'))
    expect(golpesElegiveisQuiz(r.conteudo).map((g) => g.id)).toEqual(['meori-chigi'])
  })

  test('golpe com imagem e sem alt falha (RNF6)', () => {
    const r = validarConteudo(golpe((g) => delete g.alt))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros).toContain('golpe meori-chigi: campo alt ausente')
  })

  test('romanização com hangul falha indicando o id (RN02)', () => {
    const r = validarConteudo(golpe((g) => (g.nome_romanizado = 'Meori 치기')))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erros.some((e) => e.startsWith('golpe meori-chigi:') && e.includes('nome_romanizado'))).toBe(true)
  })

  test('conteúdo sem padrão de romanização declarado falha (RN02)', () => {
    const c = conteudoValido() as Record<string, unknown>
    delete c.padrao_romanizacao
    expect(validarConteudo(c).ok).toBe(false)
  })

  test('capítulo com mais de 3 imagens falha (R5)', () => {
    const c = conteudoValido()
    const img = { arquivo: 'historia/x.webp', legenda: 'Legenda', alt: 'Descrição' }
    ;(c.capitulos[0].imagens as unknown[]) = [img, img, img, img]
    expect(validarConteudo(c).ok).toBe(false)
  })

  test('JSON que não é objeto falha sem lançar', () => {
    expect(validarConteudo('lixo').ok).toBe(false)
    expect(validarConteudo(null).ok).toBe(false)
  })
})
