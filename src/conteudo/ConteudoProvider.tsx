import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { Conteudo } from './schema'
import { ConteudoContext, useConteudo, type EstadoConteudo } from './useConteudo'

const URL_CONTEUDO = `${import.meta.env.BASE_URL}conteudo/conteudo.json`

async function buscarConteudo(url: string): Promise<Conteudo> {
  const resposta = await fetch(url)
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
  // Zod fica fora do bundle inicial: a tela inicial pinta sem esperar o schema (RNF3).
  const [{ validarConteudo }, dados] = await Promise.all([import('./schema'), resposta.json()])
  const resultado = validarConteudo(dados)
  if (!resultado.ok) throw new Error(resultado.erros.join('; '))
  return resultado.conteudo
}

/** Lê conteudo.json uma vez e o expõe a todos os módulos (design D2). */
export function ConteudoProvider({ children, url = URL_CONTEUDO }: { children: ReactNode; url?: string }) {
  const [tentativa, setTentativa] = useState(0)
  const tentarDeNovo = useCallback(() => setTentativa((t) => t + 1), [])
  const [estado, setEstado] = useState<EstadoConteudo>({ estado: 'carregando' })

  useEffect(() => {
    let ativo = true
    setEstado({ estado: 'carregando' })
    buscarConteudo(url).then(
      (conteudo) => ativo && setEstado({ estado: 'pronto', conteudo }),
      (erro: unknown) => {
        console.error('Falha ao carregar o conteúdo:', erro)
        if (ativo) setEstado({ estado: 'erro', tentarDeNovo })
      },
    )
    return () => {
      ativo = false
    }
  }, [url, tentativa, tentarDeNovo])

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
