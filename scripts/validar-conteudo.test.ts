// @vitest-environment node
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { arquivoVideos, conteudoValido } from '../src/test/fixtures/conteudo'
import { validarConteudoPublicado } from './validar-conteudo'

/** PNG com cabeçalho IHDR real (largura × altura) completado com zeros até `bytes`. */
function png(largura: number, altura: number, bytes = 1024) {
  const assinatura = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(25)
  ihdr.writeUInt32BE(13, 0)
  ihdr.write('IHDR', 4, 'ascii')
  ihdr.writeUInt32BE(largura, 8)
  ihdr.writeUInt32BE(altura, 12)
  ihdr.writeUInt8(8, 16)
  ihdr.writeUInt8(6, 17)
  const cabecalho = Buffer.concat([assinatura, ihdr])
  return Buffer.concat([cabecalho, Buffer.alloc(Math.max(0, bytes - cabecalho.length))])
}

let raiz: string

/**
 * Publica conteudo.json, as imagens e videos.json — por padrão os vídeos da fixture no formato do
 * curador; `videos: null` não cria o arquivo e uma string é gravada como está (JSON quebrado).
 */
function publicar(conteudo: unknown, imagens: Record<string, Buffer>, videos?: unknown) {
  const dir = join(raiz, 'public', 'conteudo')
  mkdirSync(join(dir, 'golpes'), { recursive: true })
  writeFileSync(join(dir, 'conteudo.json'), JSON.stringify(conteudo))
  const arquivo = videos === undefined ? arquivoVideos(conteudo as Parameters<typeof arquivoVideos>[0]) : videos
  if (arquivo !== null)
    writeFileSync(join(dir, 'videos.json'), typeof arquivo === 'string' ? arquivo : JSON.stringify(arquivo))
  for (const [arquivo, dados] of Object.entries(imagens)) writeFileSync(join(dir, arquivo), dados)
}

function comImagem(arquivo: string) {
  const c = conteudoValido()
  c.golpes[0].imagem = arquivo
  return c
}

beforeEach(() => {
  raiz = mkdtempSync(join(tmpdir(), 'conteudo-'))
})
afterEach(() => rmSync(raiz, { recursive: true, force: true }))

describe('scripts/validar-conteudo (R3, RNF4)', () => {
  test('conteúdo válido passa', () => {
    publicar(comImagem('golpes/meori-chigi.png'), { 'golpes/meori-chigi.png': png(400, 400) })
    expect(validarConteudoPublicado(raiz)).toEqual([])
  })

  test('imagem de 350 KB falha indicando arquivo e tamanho', () => {
    publicar(comImagem('golpes/meori-chigi.png'), { 'golpes/meori-chigi.png': png(400, 400, 350 * 1024) })
    expect(validarConteudoPublicado(raiz)).toEqual([
      'golpe meori-chigi: imagem golpes/meori-chigi.png tem 350 KB (máximo 200 KB)',
    ])
  })

  test('imagem 800 × 600 falha indicando arquivo e dimensões', () => {
    publicar(comImagem('golpes/meori-chigi.png'), { 'golpes/meori-chigi.png': png(800, 600) })
    expect(validarConteudoPublicado(raiz)).toEqual([
      'golpe meori-chigi: imagem golpes/meori-chigi.png tem 800 × 600 px (proporção deve ser 1:1)',
    ])
  })

  test('imagem inexistente falha', () => {
    publicar(comImagem('golpes/meori-chigi.png'), {})
    expect(validarConteudoPublicado(raiz)).toEqual(['golpe meori-chigi: imagem golpes/meori-chigi.png não encontrada'])
  })

  test('formato diferente de WebP/PNG falha', () => {
    publicar(comImagem('golpes/meori-chigi.jpg'), {})
    expect(validarConteudoPublicado(raiz)).toContain(
      'golpe meori-chigi: campo imagem deve ser um arquivo .webp ou .png',
    )
  })

  test('golpe incompleto falha com a mensagem do schema', () => {
    const c = comImagem('golpes/meori-chigi.png') as Record<string, unknown> & ReturnType<typeof conteudoValido>
    delete (c.golpes[0] as Record<string, unknown>).nome_pt
    publicar(c, { 'golpes/meori-chigi.png': png(400, 400) })
    expect(validarConteudoPublicado(raiz)).toEqual(['golpe meori-chigi: campo nome_pt ausente'])
  })

  test('JSON corrompido falha sem lançar', () => {
    publicar({}, {})
    writeFileSync(join(raiz, 'public', 'conteudo', 'conteudo.json'), '{ isso não é json')
    expect(validarConteudoPublicado(raiz)[0]).toMatch(/^conteudo\.json não é um JSON válido/)
  })
})

describe('scripts/validar-conteudo — videos.json (R13)', () => {
  const imagens = () => ({ 'golpes/meori-chigi.png': png(400, 400) })

  test('videos.json válido passa', () => {
    publicar(comImagem('golpes/meori-chigi.png'), imagens(), {
      videos: [{ url: 'https://www.youtube.com/watch?v=2mG4A7Sr1fU&t=5s', titulo: 'Básico', categoria: 'treinos' }],
    })
    expect(validarConteudoPublicado(raiz)).toEqual([])
  })

  test('link inválido falha indicando a posição', () => {
    publicar(comImagem('golpes/meori-chigi.png'), imagens(), {
      videos: [
        { url: 'https://youtu.be/qjrYw-LjlB0', titulo: 'Ok', categoria: 'treinos' },
        { url: 'https://vimeo.com/123456', titulo: 'Fora', categoria: 'treinos' },
      ],
    })
    expect(validarConteudoPublicado(raiz)).toEqual(['vídeo #2: link do YouTube inválido (https://vimeo.com/123456)'])
  })

  test('videos.json ausente falha citando o arquivo', () => {
    publicar(comImagem('golpes/meori-chigi.png'), imagens(), null)
    expect(validarConteudoPublicado(raiz)[0]).toMatch(/^videos\.json não é um JSON válido ou não foi encontrado/)
  })

  test('videos.json quebrado falha citando o arquivo', () => {
    publicar(comImagem('golpes/meori-chigi.png'), imagens(), '{ quebrado')
    expect(validarConteudoPublicado(raiz)[0]).toMatch(/^videos\.json não é um JSON válido/)
  })
})
