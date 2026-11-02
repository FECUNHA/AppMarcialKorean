/**
 * Valida public/conteudo/conteudo.json e public/conteudo/videos.json antes do build (design D3 de
 * setup-pwa-base, D4 de videos-em-arquivo-proprio).
 * Uso: npm run validate:conteudo — sai com código 1 e lista os problemas quando o conteúdo é inválido.
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { imageSize } from 'image-size'
import { validarConteudo, validarVideos } from '../src/conteudo/schema'

const LIMITE_KB = 200

export function validarConteudoPublicado(raiz: string): string[] {
  const dir = join(raiz, 'public', 'conteudo')
  let dados: unknown
  try {
    dados = JSON.parse(readFileSync(join(dir, 'conteudo.json'), 'utf8'))
  } catch (e) {
    return [`conteudo.json não é um JSON válido ou não foi encontrado: ${(e as Error).message}`]
  }

  const resultado = validarConteudo(dados)
  if (!resultado.ok) return resultado.erros

  const erros: string[] = []
  try {
    const videos = validarVideos(JSON.parse(readFileSync(join(dir, 'videos.json'), 'utf8')), resultado.conteudo)
    if (!videos.ok) erros.push(...videos.erros)
  } catch (e) {
    erros.push(`videos.json não é um JSON válido ou não foi encontrado: ${(e as Error).message}`)
  }

  for (const g of resultado.conteudo.golpes) {
    if (!g.imagem) continue
    const caminho = join(dir, g.imagem)
    const prefixo = `golpe ${g.id}: imagem ${g.imagem}`
    if (!existsSync(caminho)) {
      erros.push(`${prefixo} não encontrada`)
      continue
    }
    const kb = Math.round(statSync(caminho).size / 1024)
    if (statSync(caminho).size > LIMITE_KB * 1024) erros.push(`${prefixo} tem ${kb} KB (máximo ${LIMITE_KB} KB)`)
    const { width, height } = imageSize(caminho)
    if (!width || !height || width !== height)
      erros.push(`${prefixo} tem ${width} × ${height} px (proporção deve ser 1:1)`)
  }
  for (const c of resultado.conteudo.capitulos) {
    for (const img of c.imagens) {
      if (!existsSync(join(dir, img.arquivo))) erros.push(`capítulo ${c.id}: imagem ${img.arquivo} não encontrada`)
    }
  }
  return erros
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const erros = validarConteudoPublicado(process.cwd())
  if (erros.length) {
    console.error(`Conteúdo inválido (${erros.length} problema(s)):\n${erros.map((e) => `  - ${e}`).join('\n')}`)
    process.exit(1)
  }
  console.log('Conteúdo válido.')
}
