import { useSearchParams } from 'react-router-dom'
import { ComConteudo } from '../../conteudo/ConteudoProvider'
import type { Conteudo } from '../../conteudo/schema'
import { CartaoGolpe } from './CartaoGolpe'
import { filtrarGolpes, normalizar } from './filtro'
import { useFavoritos } from './useFavoritos'

export function TelaGolpes() {
  return (
    <main className="tela">
      <h1>Golpes</h1>
      <ComConteudo>{(conteudo) => <CatalogoGolpes conteudo={conteudo} />}</ComConteudo>
    </main>
  )
}

function CatalogoGolpes({ conteudo }: { conteudo: Conteudo }) {
  const [params, setParams] = useSearchParams()
  const categoria = params.get('categoria') ?? 'todas'
  const q = params.get('q') ?? ''
  const categorias = conteudo.categorias.filter((c) => c.aplica_a.includes('golpes'))
  const favoritos = useFavoritos()
  const golpes = filtrarGolpes(conteudo.golpes, { categoria, q, favoritos: favoritos.ids })

  function alterar(chave: string, valor: string, padrao: string) {
    const novos = new URLSearchParams(params)
    if (valor === padrao) novos.delete(chave)
    else novos.set(chave, valor)
    setParams(novos, { replace: true })
  }

  return (
    <>
      <div className="filtros-golpes" role="search">
        <label className="campo">
          <span className="campo__rotulo">Buscar golpe</span>
          <input
            type="search"
            value={q}
            placeholder="Busque em português ou romanizado"
            autoComplete="off"
            onChange={(e) => alterar('q', e.target.value, '')}
          />
        </label>
        <label className="campo">
          <span className="campo__rotulo">Categoria</span>
          <select value={categoria} onChange={(e) => alterar('categoria', e.target.value, 'todas')}>
            <option value="todas">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
            <option value="favoritos">Meus favoritos</option>
          </select>
        </label>
      </div>

      {golpes.length === 0 ? (
        <p className="vazio" role="status">
          {mensagemVazia(categoria, q, favoritos.ids.length)}
        </p>
      ) : (
        <ul className="lista-golpes" aria-label="Golpes">
          {golpes.map((g) => (
            <li key={g.id}>
              <CartaoGolpe golpe={g} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function mensagemVazia(categoria: string, q: string, totalFavoritos: number) {
  if (categoria === 'favoritos' && totalFavoritos === 0)
    return 'Você ainda não tem favoritos. Abra um golpe e toque em "Favoritar".'
  return normalizar(q) ? 'Nenhum golpe encontrado' : 'Nenhum golpe nesta categoria'
}
