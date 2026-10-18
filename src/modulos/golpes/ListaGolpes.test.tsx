import { screen, within } from '@testing-library/react'
import { conteudoGolpes } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

async function itens() {
  const lista = await screen.findByRole('list', { name: 'Golpes' })
  return within(lista).getAllByRole('listitem')
}

function item(itensLista: HTMLElement[], romanizado: string) {
  const achado = itensLista.find((li) => within(li).queryByText(romanizado))
  if (!achado) throw new Error(`item ${romanizado} não encontrado`)
  return within(achado)
}

describe('Lista de golpes (R7)', () => {
  test('lista todos os golpes do conteúdo', async () => {
    renderRota('/golpes', conteudoGolpes())
    expect(await itens()).toHaveLength(5)
  })

  test('item completo mostra imagem com alt, hangul, romanização e tradução', async () => {
    renderRota('/golpes', conteudoGolpes())
    const meori = item(await itens(), 'Meori chigi')
    const img = meori.getByRole('img', { name: 'Praticante finalizando um corte vertical' })
    expect(img).toHaveAttribute('src', '/conteudo/golpes/meori-chigi.webp')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('width')
    expect(img).toHaveAttribute('height')
    expect(meori.getByText('머리치기')).toHaveAttribute('lang', 'ko')
    expect(meori.getByText('Corte na cabeça')).toBeInTheDocument()
  })

  test('golpe sem imagem mostra o marcador neutro e os três nomes', async () => {
    renderRota('/golpes', conteudoGolpes())
    const makgi = item(await itens(), 'Makgi')
    expect(makgi.queryByRole('img')).not.toBeInTheDocument()
    expect(makgi.getByTestId('marcador-sem-imagem')).toBeInTheDocument()
    expect(makgi.getByText('막기')).toBeInTheDocument()
    expect(makgi.getByText('Defesa/bloqueio')).toBeInTheDocument()
  })

  test('cada item leva ao detalhe do golpe', async () => {
    renderRota('/golpes', conteudoGolpes())
    const meori = item(await itens(), 'Meori chigi')
    expect(meori.getByRole('link')).toHaveAttribute('href', '/golpes/meori-chigi')
  })
})
