import { criarRng } from './rng'
import { gerarAlternativas, gerarRodada } from './regras'
import { golpeTeste, golpesTeste } from './testeGolpes'

describe('gerarRodada (R16, design D1/D2)', () => {
  test('30 elegíveis ⇒ 10 perguntas sem repetir golpe (RN03, CA08)', () => {
    const golpes = [...golpesTeste(10, 'cortes'), ...golpesTeste(10, 'defesas'), ...golpesTeste(10, 'formas')]
    const r = gerarRodada(golpes, { rng: criarRng(1) })
    if (!r.disponivel) throw new Error('indisponível')
    expect(r.perguntas).toHaveLength(10)
    expect(new Set(r.perguntas.map((p) => p.golpe.id)).size).toBe(10)
  })

  test('cada pergunta tem 4 alternativas com exatamente 1 correta', () => {
    const golpes = [...golpesTeste(10, 'cortes'), ...golpesTeste(20, 'defesas')]
    const r = gerarRodada(golpes, { rng: criarRng(2) })
    if (!r.disponivel) throw new Error('indisponível')
    for (const p of r.perguntas) {
      expect(p.alternativas).toHaveLength(4)
      expect(p.alternativas.filter((a) => a.id === p.golpe.id)).toHaveLength(1)
    }
  })

  test('5 elegíveis + 2 sem imagem ⇒ 5 perguntas, nenhuma sem imagem', () => {
    const golpes = [...golpesTeste(5, 'cortes'), golpeTeste('sem-1', 'cortes', false), golpeTeste('sem-2', 'defesas', false)]
    const r = gerarRodada(golpes, { rng: criarRng(3) })
    if (!r.disponivel) throw new Error('indisponível')
    expect(r.perguntas).toHaveLength(5)
    expect(r.perguntas.every((p) => p.golpe.imagem)).toBe(true)
    expect(r.perguntas.flatMap((p) => p.alternativas).every((a) => a.imagem)).toBe(true)
  })

  test('3 elegíveis ⇒ indisponível (RN06)', () => {
    const golpes = [...golpesTeste(3, 'cortes'), golpeTeste('sem', 'cortes', false)]
    expect(gerarRodada(golpes, { rng: criarRng(4) })).toEqual({ disponivel: false, elegiveis: 3 })
  })

  test('mesma semente ⇒ mesma rodada; semente diferente ⇒ ordem diferente', () => {
    const golpes = golpesTeste(30, 'cortes')
    const ids = (seed: number) => {
      const r = gerarRodada(golpes, { rng: criarRng(seed) })
      return r.disponivel ? r.perguntas.map((p) => p.golpe.id) : []
    }
    expect(ids(7)).toEqual(ids(7))
    expect(ids(7)).not.toEqual(ids(8))
  })
})

describe('gerarAlternativas (R16, RN04, RN05)', () => {
  const cortes = golpesTeste(6, 'cortes')
  const estocada = golpeTeste('estocada-a', 'estocadas')
  const defesas = golpesTeste(3, 'defesas')
  const formas = golpesTeste(2, 'formas')
  const elegiveis = [...cortes, estocada, ...defesas, ...formas]

  test('categoria com 6 ⇒ os 3 distratores são da mesma categoria (CA13)', () => {
    for (let semente = 1; semente <= 20; semente++) {
      const alt = gerarAlternativas(cortes[0], elegiveis, criarRng(semente))
      expect(alt.filter((g) => g.id !== cortes[0].id).every((g) => g.categoria === 'cortes')).toBe(true)
    }
  })

  test('categoria com 1 ⇒ distratores de outras categorias, sem repetir', () => {
    for (let semente = 1; semente <= 20; semente++) {
      const alt = gerarAlternativas(estocada, elegiveis, criarRng(semente))
      const distratores = alt.filter((g) => g.id !== estocada.id)
      expect(distratores.every((g) => g.categoria !== 'estocadas')).toBe(true)
      expect(new Set(alt.map((g) => g.id)).size).toBe(4)
    }
  })

  test('categoria com 3 (2 outros) ⇒ usa os 2 da categoria e completa com 1 de fora', () => {
    const alt = gerarAlternativas(defesas[0], elegiveis, criarRng(5))
    const distratores = alt.filter((g) => g.id !== defesas[0].id)
    expect(distratores.filter((g) => g.categoria === 'defesas')).toHaveLength(2)
    expect(distratores.filter((g) => g.categoria !== 'defesas')).toHaveLength(1)
  })

  test('sempre 4 alternativas com exatamente 1 correta', () => {
    for (const golpe of elegiveis) {
      const alt = gerarAlternativas(golpe, elegiveis, criarRng(9))
      expect(alt).toHaveLength(4)
      expect(alt.filter((g) => g.id === golpe.id)).toHaveLength(1)
    }
  })

  test('a posição da correta varia com a semente', () => {
    const posicoes = new Set(
      Array.from({ length: 20 }, (_, s) => gerarAlternativas(cortes[0], elegiveis, criarRng(s + 1)).findIndex((g) => g.id === cortes[0].id)),
    )
    expect(posicoes.size).toBeGreaterThan(1)
  })
})
