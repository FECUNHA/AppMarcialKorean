import { z } from 'zod'
import { extrairIdYoutube } from './linkYoutube'

/**
 * Contrato único do conteúdo (design D3). O mesmo schema roda no app (runtime)
 * e em scripts/validar-conteudo.ts (prebuild).
 */

const obrigatorio = z.string({ required_error: 'ausente' }).trim().min(1, 'ausente')
const slug = obrigatorio.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'deve ser um slug (a-z, 0-9 e hífens)')
const romanizacao = obrigatorio.regex(/^[A-Za-z]+([ -][A-Za-z]+)*$/, 'deve ter só letras latinas, espaços e hífens')
const arquivoImagem = obrigatorio.regex(/^[a-z0-9/_-]+\.(webp|png)$/, 'deve ser um arquivo .webp ou .png')

export const CategoriaSchema = z.object({
  id: slug,
  nome: obrigatorio,
  aplica_a: z.array(z.enum(['golpes', 'videos'])).min(1, 'ausente'),
})

export const ImagemCapituloSchema = z.object({
  arquivo: arquivoImagem,
  legenda: obrigatorio,
  alt: obrigatorio,
})

export const CapituloSchema = z.object({
  id: slug,
  ordem: z.number().int().positive(),
  titulo: obrigatorio,
  texto: obrigatorio,
  imagens: z.array(ImagemCapituloSchema).max(3, 'aceita no máximo 3 imagens').default([]),
})

export const GolpeSchema = z
  .object({
    id: slug,
    nome_hangul: obrigatorio,
    nome_romanizado: romanizacao,
    nome_pt: obrigatorio,
    categoria: slug,
    descricao: obrigatorio,
    faixa: obrigatorio,
    imagem: arquivoImagem.optional(),
    alt: obrigatorio.optional(),
  })
  .superRefine((g, ctx) => {
    if (g.imagem && !g.alt) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['alt'], message: 'ausente' })
  })

const duracaoIso = obrigatorio.regex(/^PT(\d+H)?(\d+M)?(\d+S)?$/, 'deve estar no formato ISO 8601 (ex.: PT4M12S)')

/** Vídeo no formato interno usado pelos módulos (id = id do YouTube). */
export const VideoSchema = z.object({
  id: obrigatorio,
  youtube_id: obrigatorio.regex(/^[A-Za-z0-9_-]{11}$/, 'deve ser um id de vídeo do YouTube (11 caracteres)'),
  titulo: obrigatorio,
  duracao: duracaoIso.optional(),
  categoria: slug,
  golpe_id: slug.optional(),
})

/** Uma entrada de `videos.json`, como o curador cadastra (videos-em-arquivo-proprio, D1). */
const EntradaVideoSchema = z.object({
  url: obrigatorio,
  titulo: obrigatorio,
  categoria: slug,
  duracao: duracaoIso.optional(),
  golpe: slug.optional(),
})

const ArquivoVideosSchema = z.object({ videos: z.array(z.unknown(), { required_error: 'ausente', invalid_type_error: 'ausente' }) })

export const ConteudoSchema = z
  .object({
    versao: obrigatorio,
    padrao_romanizacao: obrigatorio,
    categorias: z.array(CategoriaSchema),
    capitulos: z.array(CapituloSchema),
    golpes: z.array(GolpeSchema),
  })
  // Os vídeos vêm de videos.json (validarVideos); um campo `videos` em conteudo.json é ignorado.
  .transform((c) => ({ ...c, videos: [] as Video[] }))
  .superRefine((c, ctx) => {
    const erro = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path, message, params: { completo: true } })
    const categorias = new Map(c.categorias.map((cat) => [cat.id, cat]))

    for (const [colecao, itens] of [['categorias', c.categorias], ['capitulos', c.capitulos], ['golpes', c.golpes]] as const) {
      const vistos = new Set<string>()
      itens.forEach((item, i) => {
        if (vistos.has(item.id)) erro([colecao, i], `${ROTULO[colecao]} ${item.id}: id repetido`)
        vistos.add(item.id)
      })
    }

    c.golpes.forEach((g, i) => {
      if (!categorias.get(g.categoria)?.aplica_a.includes('golpes'))
        erro(['golpes', i, 'categoria'], `golpe ${g.id}: categoria ${g.categoria} não existe`)
    })
  })

export type Categoria = z.infer<typeof CategoriaSchema>
export type Capitulo = z.infer<typeof CapituloSchema>
export type Golpe = z.infer<typeof GolpeSchema>
export type Video = z.infer<typeof VideoSchema>
export type Conteudo = z.infer<typeof ConteudoSchema>

export type ResultadoValidacao = { ok: true; conteudo: Conteudo } | { ok: false; erros: string[] }

const ROTULO = { categorias: 'categoria', capitulos: 'capítulo', golpes: 'golpe', videos: 'vídeo' } as const

/** Valida dados brutos e devolve mensagens legíveis para o curador, ex.: `golpe meori-chigi: campo nome_pt ausente`. */
export function validarConteudo(dados: unknown): ResultadoValidacao {
  const r = ConteudoSchema.safeParse(dados)
  if (r.success) return { ok: true, conteudo: r.data }
  return { ok: false, erros: [...new Set(r.error.issues.map((issue) => formatarErro(issue, dados)))] }
}

function formatarErro(issue: z.ZodIssue, dados: unknown): string {
  if (issue.code === z.ZodIssueCode.custom && issue.params?.completo) return issue.message
  const [colecao, indice, ...resto] = issue.path
  const ausente =
    issue.message === 'ausente' || (issue.code === z.ZodIssueCode.invalid_type && issue.received === 'undefined')
  const descricao = ausente ? 'ausente' : issue.message

  if (typeof colecao === 'string' && colecao in ROTULO && typeof indice === 'number') {
    const item = (dados as Record<string, unknown[]>)[colecao]?.[indice] as { id?: unknown } | undefined
    const id = typeof item?.id === 'string' && item.id ? item.id : `#${indice + 1}`
    const prefixo = `${ROTULO[colecao as keyof typeof ROTULO]} ${id}`
    return resto.length ? `${prefixo}: campo ${resto.join('.')} ${descricao}` : `${prefixo}: ${descricao}`
  }
  return issue.path.length ? `campo ${issue.path.join('.')} ${descricao}` : `conteúdo inválido: ${descricao}`
}

export type ResultadoVideos = { ok: true; videos: Video[] } | { ok: false; erros: string[] }

/**
 * Valida `videos.json` contra o conteúdo já validado (videos-em-arquivo-proprio, D4) e converte cada
 * entrada para o formato interno. Mensagens apontam a posição 1-based: `vídeo #2: link do YouTube inválido (…)`.
 */
export function validarVideos(dados: unknown, conteudo: Pick<Conteudo, 'categorias' | 'golpes'>): ResultadoVideos {
  const arquivo = ArquivoVideosSchema.safeParse(dados)
  if (!arquivo.success) return { ok: false, erros: ['videos.json: campo videos ausente'] }

  const categorias = new Map(conteudo.categorias.map((c) => [c.id, c]))
  const golpes = new Set(conteudo.golpes.map((g) => g.id))
  const posicaoPorId = new Map<string, number>()
  const erros: string[] = []
  const videos: Video[] = []

  arquivo.data.videos.forEach((bruto, i) => {
    const pos = `vídeo #${i + 1}`
    const r = EntradaVideoSchema.safeParse(bruto)
    if (!r.success) {
      for (const issue of r.error.issues) {
        const ausente =
          issue.message === 'ausente' || (issue.code === z.ZodIssueCode.invalid_type && issue.received === 'undefined')
        erros.push(issue.path.length ? `${pos}: campo ${issue.path.join('.')} ${ausente ? 'ausente' : issue.message}` : `${pos}: ${issue.message}`)
      }
      return
    }
    const e = r.data
    const id = extrairIdYoutube(e.url)
    if (!id) {
      erros.push(`${pos}: link do YouTube inválido (${e.url})`)
      return
    }
    const anterior = posicaoPorId.get(id)
    if (anterior) erros.push(`${pos}: repete o vídeo #${anterior}`)
    else posicaoPorId.set(id, i + 1)
    if (!categorias.get(e.categoria)?.aplica_a.includes('videos')) erros.push(`${pos}: categoria ${e.categoria} não existe`)
    if (e.golpe && !golpes.has(e.golpe)) erros.push(`${pos}: golpe ${e.golpe} não existe`)
    videos.push({
      id,
      youtube_id: id,
      titulo: e.titulo,
      ...(e.duracao && { duracao: e.duracao }),
      categoria: e.categoria,
      ...(e.golpe && { golpe_id: e.golpe }),
    })
  })
  return erros.length ? { ok: false, erros } : { ok: true, videos }
}

/** Golpes que podem aparecer no quiz: só os que têm imagem (cenário "Golpe sem imagem"). */
export function golpesElegiveisQuiz(conteudo: Conteudo): Golpe[] {
  return conteudo.golpes.filter((g) => Boolean(g.imagem))
}
