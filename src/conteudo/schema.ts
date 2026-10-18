import { z } from 'zod'

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
    video_id: slug.optional(),
  })
  .superRefine((g, ctx) => {
    if (g.imagem && !g.alt) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['alt'], message: 'ausente' })
  })

export const VideoSchema = z.object({
  id: slug,
  youtube_id: obrigatorio.regex(/^[A-Za-z0-9_-]{11}$/, 'deve ser um id de vídeo do YouTube (11 caracteres)'),
  titulo: obrigatorio,
  duracao: obrigatorio.regex(/^PT(\d+H)?(\d+M)?(\d+S)?$/, 'deve estar no formato ISO 8601 (ex.: PT4M12S)'),
  categoria: slug,
  golpe_id: slug.optional(),
})

export const ConteudoSchema = z
  .object({
    versao: obrigatorio,
    padrao_romanizacao: obrigatorio,
    categorias: z.array(CategoriaSchema),
    capitulos: z.array(CapituloSchema),
    golpes: z.array(GolpeSchema),
    videos: z.array(VideoSchema).default([]),
  })
  .superRefine((c, ctx) => {
    const erro = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path, message, params: { completo: true } })
    const categorias = new Map(c.categorias.map((cat) => [cat.id, cat]))
    const golpes = new Set(c.golpes.map((g) => g.id))
    const videos = new Set(c.videos.map((v) => v.id))

    for (const [colecao, itens] of [['categorias', c.categorias], ['capitulos', c.capitulos], ['golpes', c.golpes], ['videos', c.videos]] as const) {
      const vistos = new Set<string>()
      itens.forEach((item, i) => {
        if (vistos.has(item.id)) erro([colecao, i], `${ROTULO[colecao]} ${item.id}: id repetido`)
        vistos.add(item.id)
      })
    }

    c.golpes.forEach((g, i) => {
      if (!categorias.get(g.categoria)?.aplica_a.includes('golpes'))
        erro(['golpes', i, 'categoria'], `golpe ${g.id}: categoria ${g.categoria} não existe`)
      if (g.video_id && !videos.has(g.video_id))
        erro(['golpes', i, 'video_id'], `golpe ${g.id}: vídeo ${g.video_id} não existe`)
    })
    c.videos.forEach((v, i) => {
      if (!categorias.get(v.categoria)?.aplica_a.includes('videos'))
        erro(['videos', i, 'categoria'], `vídeo ${v.id}: categoria ${v.categoria} não existe`)
      if (v.golpe_id && !golpes.has(v.golpe_id))
        erro(['videos', i, 'golpe_id'], `vídeo ${v.id}: golpe ${v.golpe_id} não existe`)
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

/** Golpes que podem aparecer no quiz: só os que têm imagem (cenário "Golpe sem imagem"). */
export function golpesElegiveisQuiz(conteudo: Conteudo): Golpe[] {
  return conteudo.golpes.filter((g) => Boolean(g.imagem))
}
