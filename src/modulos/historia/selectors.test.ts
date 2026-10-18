import { validarConteudo, type Conteudo } from '../../conteudo/schema'
import { conteudoHistoria } from '../../test/fixtures/conteudo'
import { capitulosOrdenados, vizinhos } from './selectors'

function conteudo(): Conteudo {
  const r = validarConteudo(conteudoHistoria())
  if (!r.ok) throw new Error(r.erros.join('\n'))
  return r.conteudo
}

describe('capitulosOrdenados (R4)', () => {
  test('ordena pelo campo ordem, não pela posição no arquivo', () => {
    expect(capitulosOrdenados(conteudo()).map((c) => c.id)).toEqual([
      'o-que-e',
      'significado-do-nome',
      'como-e-treinado',
      'equipamentos',
      'diferencas-outras-artes',
      'contexto-historico',
    ])
  })

  test('não altera o array original', () => {
    const c = conteudo()
    const antes = c.capitulos.map((x) => x.id)
    capitulosOrdenados(c)
    expect(c.capitulos.map((x) => x.id)).toEqual(antes)
  })
})

describe('vizinhos (R6)', () => {
  test('primeiro capítulo: sem anterior, próximo é o segundo', () => {
    const v = vizinhos(conteudo(), 'o-que-e')
    expect(v.anterior).toBeUndefined()
    expect(v.proximo?.id).toBe('significado-do-nome')
  })

  test('capítulo do meio tem os dois, pela ordem', () => {
    const v = vizinhos(conteudo(), 'equipamentos')
    expect(v.anterior?.id).toBe('como-e-treinado')
    expect(v.proximo?.id).toBe('diferencas-outras-artes')
  })

  test('último capítulo: sem próximo', () => {
    const v = vizinhos(conteudo(), 'contexto-historico')
    expect(v.anterior?.id).toBe('diferencas-outras-artes')
    expect(v.proximo).toBeUndefined()
  })

  test('id inexistente: nenhum vizinho', () => {
    expect(vizinhos(conteudo(), 'nao-existe')).toEqual({})
  })
})
