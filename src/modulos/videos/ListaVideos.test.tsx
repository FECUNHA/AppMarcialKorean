import { screen, within } from '@testing-library/react'
import { conteudoVideos, conteudoValido } from '../../test/fixtures/conteudo'
import { renderRota } from '../../test/renderRota'

describe('Lista de vídeos (R13)', () => {
  test('item mostra miniatura com alt, título, duração e categoria', async () => {
    renderRota('/videos', conteudoVideos())
    const lista = await screen.findByRole('list', { name: 'Vídeos' })
    expect(within(lista).getAllByRole('listitem')).toHaveLength(3)

    const item = within(within(lista).getAllByRole('listitem')[0])
    const miniatura = item.getByRole('img', { name: 'Miniatura: Meori chigi passo a passo' })
    expect(miniatura).toHaveAttribute('src', 'https://i.ytimg.com/vi/AAAAAAAAAAA/hqdefault.jpg')
    expect(miniatura).toHaveAttribute('loading', 'lazy')
    expect(item.getByText('Meori chigi passo a passo')).toBeInTheDocument()
    expect(item.getByText('4:12')).toBeInTheDocument()
    expect(item.getByText('Cortes')).toBeInTheDocument()
    expect(item.getByRole('link')).toHaveAttribute('href', '/videos/yt-001')
  })

  test('sem vídeos no conteúdo mostra aviso', async () => {
    renderRota('/videos', { ...conteudoValido(), golpes: [{ ...conteudoValido().golpes[0], video_id: undefined }], videos: [] })
    expect(await screen.findByText('Nenhum vídeo disponível ainda.')).toBeInTheDocument()
  })
})
