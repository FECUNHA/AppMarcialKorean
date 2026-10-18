/** Conteúdo mínimo válido para testes. Cada teste clona e altera o que precisa. */
export function conteudoValido() {
  return {
    versao: '1.0.0',
    padrao_romanizacao: 'Romanização Revisada do Coreano',
    categorias: [
      { id: 'cortes', nome: 'Cortes', aplica_a: ['golpes', 'videos'] },
      { id: 'treinos', nome: 'Treinos', aplica_a: ['videos'] },
    ],
    capitulos: [
      {
        id: 'o-que-e',
        ordem: 1,
        titulo: 'O que é o Hwarang Kumdo',
        texto: 'Hwarang Kumdo (검도) é uma arte marcial coreana de espada.',
        imagens: [],
      },
    ],
    golpes: [
      {
        id: 'meori-chigi',
        nome_hangul: '머리치기',
        nome_romanizado: 'Meori chigi',
        nome_pt: 'Corte na cabeça',
        categoria: 'cortes',
        descricao: 'Corte vertical descendente.',
        faixa: 'Branca',
        imagem: 'golpes/meori-chigi.webp',
        alt: 'Praticante finalizando um corte vertical',
        video_id: 'yt-001',
      },
    ],
    videos: [
      {
        id: 'yt-001',
        youtube_id: 'dQw4w9WgXcQ',
        titulo: 'Meori chigi',
        duracao: 'PT4M12S',
        categoria: 'cortes',
        golpe_id: 'meori-chigi',
      },
    ],
  }
}

/** Catálogo com várias categorias para os testes do módulo Golpes. Formas fica sem golpes. */
export function conteudoGolpes() {
  const base = conteudoValido()
  const cat = (id: string, nome: string) => ({ id, nome, aplica_a: ['golpes', 'videos'] })
  return {
    ...base,
    categorias: [
      cat('cortes', 'Cortes'),
      cat('estocadas', 'Estocadas'),
      cat('defesas', 'Defesas'),
      cat('posturas', 'Posturas'),
      cat('formas', 'Formas'),
      { id: 'treinos', nome: 'Treinos', aplica_a: ['videos'] },
    ],
    golpes: [
      base.golpes[0],
      {
        id: 'heori-chigi',
        nome_hangul: '허리치기',
        nome_romanizado: 'Heori chigi',
        nome_pt: 'Corte na cintura',
        categoria: 'cortes',
        descricao: 'Corte horizontal na cintura.',
        faixa: 'Amarela',
        imagem: 'golpes/heori-chigi.webp',
        alt: 'Praticante num corte horizontal',
      },
      {
        id: 'jjireugi',
        nome_hangul: '찌르기',
        nome_romanizado: 'Jjireugi',
        nome_pt: 'Estocada',
        categoria: 'estocadas',
        descricao: 'Ataque em linha reta com a ponta.',
        faixa: 'Verde',
        imagem: 'golpes/jjireugi.webp',
        alt: 'Praticante avançando a ponta da espada',
      },
      {
        id: 'makgi',
        nome_hangul: '막기',
        nome_romanizado: 'Makgi',
        nome_pt: 'Defesa/bloqueio',
        categoria: 'defesas',
        descricao: 'Bloqueio alto.',
        faixa: 'Branca',
      },
      {
        id: 'junbi-seogi',
        nome_hangul: '준비서기',
        nome_romanizado: 'Junbi seogi',
        nome_pt: 'Postura de preparação',
        categoria: 'posturas',
        descricao: 'Postura inicial.',
        faixa: 'Branca',
      },
    ],
  }
}

/** 6 capítulos guardados fora de ordem (a ordem vale pelo campo `ordem`); só o 1º tem imagem. */
export function conteudoHistoria() {
  const cap = (id: string, ordem: number, titulo: string, texto = `Texto de ${titulo}.`) => ({
    id,
    ordem,
    titulo,
    texto,
    imagens: [] as { arquivo: string; legenda: string; alt: string }[],
  })
  const capitulos = [
    cap('equipamentos', 4, 'Equipamentos'),
    cap('o-que-e', 1, 'O que é o Hwarang Kumdo', 'Primeiro parágrafo com **Hwarang** em negrito.\n\nSegundo parágrafo.'),
    cap('contexto-historico', 6, 'Contexto histórico'),
    cap('significado-do-nome', 2, 'Significado do nome'),
    cap('diferencas-outras-artes', 5, 'Diferenças para outras artes de espada'),
    cap('como-e-treinado', 3, 'Como é treinado'),
  ]
  capitulos[1].imagens = [{ arquivo: 'historia/treino.webp', legenda: 'Treino em dupla', alt: 'Dois praticantes treinando cortes' }]
  return { ...conteudoValido(), capitulos }
}

/** Catálogo de golpes + vídeos de exemplo em Cortes, História e Treinos. Meori chigi tem vídeo; os outros não. */
export function conteudoVideos() {
  const base = conteudoGolpes()
  return {
    ...base,
    categorias: [...base.categorias, { id: 'historia', nome: 'História', aplica_a: ['videos'] }],
    videos: [
      { id: 'yt-001', youtube_id: 'AAAAAAAAAAA', titulo: 'Meori chigi passo a passo', duracao: 'PT4M12S', categoria: 'cortes', golpe_id: 'meori-chigi' },
      { id: 'yt-002', youtube_id: 'BBBBBBBBBBB', titulo: 'Origem do Hwarang', duracao: 'PT1H2M5S', categoria: 'historia' },
      { id: 'yt-003', youtube_id: 'CCCCCCCCCCC', titulo: 'Aquecimento', duracao: 'PT45S', categoria: 'treinos' },
    ],
  }
}

/** Catálogo do quiz: 10 golpes com imagem (Cortes 6, Estocadas 1, Defesas 3) + 2 sem imagem. */
export function conteudoQuiz() {
  const base = conteudoGolpes()
  const golpe = (id: string, hangul: string, romanizado: string, pt: string, categoria: string, comImagem = true) => ({
    id,
    nome_hangul: hangul,
    nome_romanizado: romanizado,
    nome_pt: pt,
    categoria,
    descricao: `Descrição de ${romanizado}.`,
    faixa: 'Branca',
    ...(comImagem && { imagem: `golpes/${id}.webp`, alt: `Ilustração do golpe ${id}` }),
  })
  return {
    ...base,
    golpes: [
      golpe('meori-chigi', '머리치기', 'Meori chigi', 'Corte na cabeça', 'cortes'),
      golpe('sonmok-chigi', '손목치기', 'Sonmok chigi', 'Corte no punho', 'cortes'),
      golpe('heori-chigi', '허리치기', 'Heori chigi', 'Corte na cintura', 'cortes'),
      golpe('eokkae-chigi', '어깨치기', 'Eokkae chigi', 'Corte no ombro', 'cortes'),
      golpe('dari-chigi', '다리치기', 'Dari chigi', 'Corte na perna', 'cortes'),
      golpe('mok-chigi', '목치기', 'Mok chigi', 'Corte no pescoço', 'cortes'),
      golpe('jjireugi', '찌르기', 'Jjireugi', 'Estocada', 'estocadas'),
      golpe('makgi', '막기', 'Makgi', 'Defesa/bloqueio', 'defesas'),
      golpe('olyeo-makgi', '올려막기', 'Olyeo makgi', 'Defesa alta', 'defesas'),
      golpe('naeryeo-makgi', '내려막기', 'Naeryeo makgi', 'Defesa baixa', 'defesas'),
      golpe('junbi-seogi', '준비서기', 'Junbi seogi', 'Postura de preparação', 'posturas', false),
      golpe('ap-seogi', '앞서기', 'Ap seogi', 'Postura frontal', 'posturas', false),
    ],
  }
}
