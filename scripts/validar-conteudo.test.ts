// @vitest-environment node
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { conteudoValido } from '../src/test/fixtures/conteudo'
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

function publicar(conteudo: unknown, imagens: Record<string, Buffer>) {
  const dir = join(raiz, 'public', 'conteudo')
  mkdirSync(join(dir, 'golpes'), { recursive: true })
  writeFileSync(join(dir, 'conteudo.json'), JSON.stringify(conteudo))
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
