import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { Conteudo } from './schema'
import { ConteudoContext, useConteudo, type EstadoConteudo } from './useConteudo'

const URL_CONTEUDO = `${import.meta.env.BASE_URL}conteudo/conteudo.json`
const URL_VIDEOS = `${import.meta.env.BASE_URL}conteudo/videos.json`

async function lerJson(url: string): Promise<unknown> {
  const resposta = await fetch(url)
  if (!resposta.ok) throw new Error(`${url}: HTTP ${resposta.status}`)
  return resposta.json()
}

/**
 * Lê conteudo.json e videos.json em paralelo (videos-em-arquivo-proprio, D3). Falha no conteúdo
 * derruba o carregamento; falha nos vídeos só deixa a lista vazia e marcada como indisponível.
 */
async function buscarConteudo(url: string, urlVideos: string): Promise<{ conteudo: Conteudo; videosIndisponiveis: boolean }> {
  // Zod fica fora do bundle inicial: a tela inicial pinta sem esperar o schema (RNF3).
  const [{ validarConteudo, validarVideos }, dados, videos] = await Promise.all([
    import('./schema'),
    lerJson(url),
    lerJson(urlVideos).then(
      (v) => ({ ok: true as const, v }),
      (erro: unknown) => ({ ok: false as const, erro }),
    ),
  ])
  const resultado = validarConteudo(dados)
  if (!resultado.ok) throw new Error(resultado.erros.join('; '))
  const r = videos.ok ? validarVideos(videos.v, resultado.conteudo) : null
  if (r?.ok) return { conteudo: { ...resultado.conteudo, videos: r.videos }, videosIndisponiveis: false }
  console.error('Falha ao carregar os vídeos:', r ? r.erros.join('; ') : !videos.ok && videos.erro)
  return { conteudo: resultado.conteudo, videosIndisponiveis: true }
}

/** Lê o conteúdo uma vez e o expõe a todos os módulos (design D2 de setup-pwa-base). */
export function ConteudoProvider({
  children,
  url = URL_CONTEUDO,
  urlVideos = URL_VIDEOS,
}: {
  children: ReactNode
  url?: string
  urlVideos?: string
}) {
  const [tentativa, setTentativa] = useState(0)
  const tentarDeNovo = useCallback(() => setTentativa((t) => t + 1), [])
  const [estado, setEstado] = useState<EstadoConteudo>({ estado: 'carregando' })

  useEffect(() => {
    let ativo = true
    setEstado({ estado: 'carregando' })
    buscarConteudo(url, urlVideos).then(
      (r) => ativo && setEstado({ estado: 'pronto', ...r, tentarDeNovo }),
      (erro: unknown) => {
        console.error('Falha ao carregar o conteúdo:', erro)
        if (ativo) setEstado({ estado: 'erro', tentarDeNovo })
      },
    )
    return () => {
      ativo = false
    }
  }, [url, urlVideos, tentativa, tentarDeNovo])

  return <ConteudoContext.Provider value={estado}>{children}</ConteudoContext.Provider>
}

/** Renderiza os filhos com o conteúdo pronto; mostra carregamento ou erro com "Tentar de novo". */
export function ComConteudo({ children }: { children: (conteudo: Conteudo) => ReactNode }) {
  const r = useConteudo()
  if (r.estado === 'carregando') return <p aria-busy="true">Carregando…</p>
  if (r.estado === 'erro')
    return (
      <div role="alert" className="aviso-erro">
        <p>Não foi possível carregar o conteúdo.</p>
        <button type="button" className="botao" onClick={r.tentarDeNovo}>
          Tentar de novo
        </button>
      </div>
    )
  return <>{children(r.conteudo)}</>
}
