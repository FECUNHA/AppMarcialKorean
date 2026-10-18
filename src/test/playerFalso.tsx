/** PlayerYoutube falso para testes de tela: nenhum acesso ao YouTube (design: Risks). */
export function PlayerYoutubeFalso({ youtubeId, titulo }: { youtubeId: string; titulo: string }) {
  return <div data-testid="player-youtube" data-youtube-id={youtubeId} aria-label={`Player: ${titulo}`} />
}
