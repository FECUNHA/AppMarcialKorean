import type { Golpe } from '../../conteudo/schema'
import { conteudoGolpes } from '../../test/fixtures/conteudo'
import { filtrarGolpes, normalizar } from './filtro'

const golpes = conteudoGolpes().golpes as Golpe[]
const ids = (lista: Golpe[]) => lista.map((g) => g.id)

describe('filtrarGolpes — categoria (R8)', () => {
  test('sem filtro ou "todas" devolve todos', () => {
    expect(filtrarGolpes(golpes, {})).toHaveLength(5)
    expect(filtrarGolpes(golpes, { categoria: 'todas' })).toHaveLength(5)
  })

  test('"cortes" devolve só os golpes de Cortes', () => {
    expect(ids(filtrarGolpes(golpes, { categoria: 'cortes' }))).toEqual(['meori-chigi', 'heori-chigi'])
  })

  test('categoria sem golpes devolve lista vazia', () => {
    expect(filtrarGolpes(golpes, { categoria: 'formas' })).toEqual([])
  })
})

describe('normalizar (design D1)', () => {
  test('remove acentos, caixa e espaços das pontas', () => {
    expect(normalizar('  Corte na CABEÇA ')).toBe('corte na cabeca')
    expect(normalizar('Ação')).toBe('acao')
  })
})

describe('filtrarGolpes — busca (R9)', () => {
  test.each(['cabeca', 'MEORI', 'Cabeça', 'meori chi'])('"%s" acha o Meori chigi (CA04)', (q) => {
    expect(ids(filtrarGolpes(golpes, { q }))).toContain('meori-chigi')
  })

  test('combina com a categoria ativa', () => {
    expect(ids(filtrarGolpes(golpes, { q: 'corte', categoria: 'cortes' }))).toEqual(['meori-chigi', 'heori-chigi'])
    expect(filtrarGolpes(golpes, { q: 'corte', categoria: 'estocadas' })).toEqual([])
  })

  test('"xyz" não acha nada', () => {
    expect(filtrarGolpes(golpes, { q: 'xyz' })).toEqual([])
  })

  test('busca vazia ou só espaços não filtra', () => {
    expect(filtrarGolpes(golpes, { q: '   ' })).toHaveLength(5)
  })
})

describe('filtrarGolpes — favoritos (R12)', () => {
  test('"favoritos" devolve só os ids favoritados, na ordem do conteúdo', () => {
    expect(ids(filtrarGolpes(golpes, { categoria: 'favoritos', favoritos: ['makgi', 'meori-chigi'] }))).toEqual([
      'meori-chigi',
      'makgi',
    ])
  })

  test('"favoritos" sem favoritos devolve vazio', () => {
    expect(filtrarGolpes(golpes, { categoria: 'favoritos' })).toEqual([])
  })
})
