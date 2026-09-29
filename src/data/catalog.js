// ============================================================================
// MEGA STREAMING — mock catalogue
// ----------------------------------------------------------------------------
// Front-end data source. Shapes mirror the planned API so a real backend can
// replace this file without touching the UI:
//   TITLES[]         → movies / series / documentaries / shows / music / kids
//   LIVE_CHANNELS[]  → 24/7 live channels + EPG
//   PLANS[]          → subscription plans
// Images use picsum.photos (deterministic by seed) and video sources use free,
// publicly available sample streams.
// ============================================================================

const V = 'https://test-videos.co.uk/vids'
const W3 = 'https://media.w3.org/2010/05'

export const HLS_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

// Reusable quality ladders (used by the player's quality selector).
const q = (o) => Object.entries(o).map(([label, url]) => ({ label, url }))

const Q = {
  bbb: q({
    '1080p': `${V}/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_2MB.mp4`,
    '720p': `${V}/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4`,
    '360p': `${V}/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_2MB.mp4`,
  }),
  jelly: q({
    '720p': `${V}/jellyfish/mp4/h264/720/Jellyfish_720_10s_2MB.mp4`,
    '360p': `${V}/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4`,
  }),
  sintel: q({
    '720p': `${V}/sintel/mp4/h264/720/Sintel_720_10s_2MB.mp4`,
    '360p': `${V}/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4`,
  }),
  oceans: q({ '1080p': 'https://vjs.zencdn.net/v/oceans.mp4' }),
  bunny: q({ '720p': `${W3}/bunny/movie.mp4`, '480p': `${W3}/bunny/trailer.mp4` }),
  hls: q({ 'Adaptativo (HLS)': HLS_STREAM }),
}

const TRAILER = `${W3}/sintel/trailer.mp4`

const img = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`

// ---------------------------------------------------------------------------
// Rows / categories shown on the home feed
// ---------------------------------------------------------------------------
export const ROWS = [
  { id: 'destaque', label: 'Em Destaque' },
  { id: 'lancamentos', label: 'Lançamentos' },
  { id: 'mais-assistidos', label: 'Mais Assistidos' },
  { id: 'tendencias', label: 'Tendências' },
  { id: 'filmes', label: 'Filmes' },
  { id: 'series', label: 'Séries' },
  { id: 'documentarios', label: 'Documentários' },
  { id: 'shows', label: 'Shows' },
  { id: 'musica', label: 'Música' },
  { id: 'infantil', label: 'Infantil' },
  { id: 'gospel', label: 'Gospel' },
  { id: 'noticias', label: 'Notícias' },
  { id: 'esportes', label: 'Esportes' },
  { id: 'exclusivo', label: 'Conteúdo Exclusivo' },
]

// Top navigation
export const NAV = [
  { to: '/', label: 'Início', icon: 'home' },
  { to: '/filmes', label: 'Filmes', icon: 'film' },
  { to: '/series', label: 'Séries', icon: 'tv' },
  { to: '/ao-vivo', label: 'Ao Vivo', icon: 'live' },
  { to: '/canais', label: 'Canais', icon: 'grid' },
  { to: '/esportes', label: 'Esportes', icon: 'trophy' },
  { to: '/infantil', label: 'Infantil', icon: 'kids' },
  { to: '/musica', label: 'Música', icon: 'music' },
]

export const RAIL = [
  { to: '/', label: 'Início', icon: 'home' },
  { to: '/filmes', label: 'Filmes', icon: 'film' },
  { to: '/series', label: 'Séries', icon: 'tv' },
  { to: '/ao-vivo', label: 'Ao Vivo', icon: 'live' },
  { to: '/canais', label: 'Canais', icon: 'grid' },
  { to: '/esportes', label: 'Esportes', icon: 'trophy' },
  { to: '/musica', label: 'Música', icon: 'music' },
  { to: '/favoritos', label: 'Favoritos', icon: 'heart' },
  { to: '/minha-lista', label: 'Minha Lista', icon: 'bookmark' },
]

// ---------------------------------------------------------------------------
// Series episode generator
// ---------------------------------------------------------------------------
const EP_TITLES = [
  'O Começo', 'Sombras', 'A Fenda', 'Fuga', 'Recomeço', 'O Preço',
  'A Verdade', 'Tempestade', 'Última Luz', 'Depois do Fim', 'Raízes', 'O Chamado',
]

function makeSeasons(seriesTitle, count, perSeason, qualities) {
  return Array.from({ length: count }, (_, si) => ({
    number: si + 1,
    episodes: Array.from({ length: perSeason }, (_, ei) => ({
      number: ei + 1,
      title: EP_TITLES[(si * perSeason + ei) % EP_TITLES.length],
      synopsis: `Temporada ${si + 1}, episódio ${ei + 1} de ${seriesTitle}. A trama avança e novas revelações mudam tudo.`,
      duration: 41 + ((si * 3 + ei * 5) % 17),
      qualities,
    })),
  }))
}

// ---------------------------------------------------------------------------
// Titles
// ---------------------------------------------------------------------------
export const TITLES = [
  {
    id: 'noite-neon', type: 'movie', title: 'Noite Neon', year: 2024,
    genres: ['Ação', 'Suspense'], rating: '16', duration: 118, score: 8.4,
    tags: ['destaque', 'lancamentos', 'tendencias', 'filmes', 'exclusivo'],
    free: false, badge: 'Exclusivo',
    synopsis: 'Um detetive aposentado volta às ruas de uma cidade movida a luzes de neon para desvendar uma conspiração que atinge o topo do poder.',
    cast: ['Rafael Antunes', 'Marina Coelho', 'Diego Salles'],
    director: 'Helena Prado', qualities: Q.bbb, trailer: TRAILER,
  },
  {
    id: 'ceu-de-aco', type: 'movie', title: 'Céu de Aço', year: 2023,
    genres: ['Ficção', 'Aventura'], rating: '12', duration: 134, score: 7.9,
    tags: ['destaque', 'mais-assistidos', 'filmes'],
    free: false,
    synopsis: 'A última piloto da Terra precisa atravessar uma tempestade orbital para salvar a colônia que a exilou.',
    cast: ['Luísa Ferraz', 'Caio Muniz', 'Nina Rocha'],
    director: 'Bruno Tavares', qualities: Q.oceans, trailer: TRAILER,
  },
  {
    id: 'o-ultimo-horizonte', type: 'movie', title: 'O Último Horizonte', year: 2025,
    genres: ['Drama', 'Aventura'], rating: '12', duration: 127, score: 8.1,
    tags: ['lancamentos', 'tendencias', 'filmes'],
    free: false,
    synopsis: 'Dois irmãos partem em busca do mapa que o pai deixou e descobrem que o maior tesouro era a própria jornada.',
    cast: ['André Lima', 'Paula Reis'],
    director: 'Sofia Menezes', qualities: Q.jelly, trailer: TRAILER,
  },
  {
    id: 'codigo-vermelho', type: 'movie', title: 'Código Vermelho', year: 2024,
    genres: ['Ação', 'Crime'], rating: '16', duration: 109, score: 7.6,
    tags: ['mais-assistidos', 'filmes'],
    free: false,
    synopsis: 'Um assalto perfeito vira uma caçada implacável quando o plano sai do controle.',
    cast: ['Tiago Barros', 'Camila Nunes'],
    director: 'Rui Amaral', qualities: Q.bbb, trailer: TRAILER,
  },
  {
    id: 'cartas-de-inverno', type: 'movie', title: 'Cartas de Inverno', year: 2022,
    genres: ['Romance', 'Drama'], rating: '12', duration: 102, score: 7.4,
    tags: ['filmes'],
    free: true,
    synopsis: 'Uma correspondência esquecida reacende um amor que o tempo tentou apagar.',
    cast: ['Isabel Duarte', 'Henrique Sá'],
    director: 'Clara Vaz', qualities: Q.sintel, trailer: TRAILER,
  },
  {
    id: 'instinto-selvagem', type: 'movie', title: 'Instinto Selvagem', year: 2023,
    genres: ['Suspense'], rating: '16', duration: 96, score: 7.2,
    tags: ['filmes', 'tendencias'],
    free: false,
    synopsis: 'Presos em uma reserva isolada, um grupo descobre que a maior ameaça não é a natureza.',
    cast: ['Vitor Andrade', 'Larissa Pires'],
    director: 'Marcos Dias', qualities: Q.jelly, trailer: TRAILER,
  },

  // -------- Séries --------
  {
    id: 'fronteira-digital', type: 'series', title: 'Fronteira Digital', year: 2024,
    genres: ['Ficção', 'Thriller'], rating: '14', score: 8.9,
    tags: ['destaque', 'lancamentos', 'mais-assistidos', 'series', 'exclusivo'],
    free: false, badge: 'Exclusivo',
    synopsis: 'Em um mundo onde memórias podem ser editadas, uma analista forense descobre um arquivo que nunca deveria existir.',
    cast: ['Aline Castro', 'Gustavo Reis', 'Renata Lopes'],
    director: 'Fábio Marques', qualities: Q.bbb, trailer: TRAILER,
    seasons: makeSeasons('Fronteira Digital', 3, 8, Q.bbb),
  },
  {
    id: 'herdeiros-da-luz', type: 'series', title: 'Herdeiros da Luz', year: 2023,
    genres: ['Drama', 'Fantasia'], rating: '12', score: 8.3,
    tags: ['series', 'tendencias'],
    free: false,
    synopsis: 'Três gerações de uma família guardiã de um poder antigo precisam decidir o destino de sua cidade.',
    cast: ['Beatriz Alves', 'Rodrigo Farias'],
    director: 'Joana Freitas', qualities: Q.sintel, trailer: TRAILER,
    seasons: makeSeasons('Herdeiros da Luz', 2, 6, Q.sintel),
  },
  {
    id: 'linha-de-comando', type: 'series', title: 'Linha de Comando', year: 2025,
    genres: ['Crime', 'Policial'], rating: '16', score: 8.6,
    tags: ['lancamentos', 'series', 'mais-assistidos'],
    free: false, badge: 'Novo',
    synopsis: 'Uma força-tarefa improvável persegue a maior rede criminosa da costa leste.',
    cast: ['Sérgio Nogueira', 'Tânia Melo'],
    director: 'Caio Rocha', qualities: Q.jelly, trailer: TRAILER,
    seasons: makeSeasons('Linha de Comando', 2, 10, Q.jelly),
  },
  {
    id: 'estacao-orion', type: 'series', title: 'Estação Órion', year: 2022,
    genres: ['Ficção', 'Drama'], rating: '14', score: 8.0,
    tags: ['series'],
    free: true,
    synopsis: 'A tripulação de uma estação orbital enfrenta o isolamento — e algo mais.',
    cast: ['Pedro Sampaio', 'Helena Braga'],
    director: 'Vera Lúcia', qualities: Q.oceans, trailer: TRAILER,
    seasons: makeSeasons('Estação Órion', 2, 7, Q.oceans),
  },

  // -------- Documentários --------
  {
    id: 'planeta-azul-profundo', type: 'documentary', title: 'Planeta Azul Profundo', year: 2024,
    genres: ['Documentário', 'Natureza'], rating: 'L', duration: 88, score: 9.1,
    tags: ['documentarios', 'destaque', 'mais-assistidos'],
    free: false,
    synopsis: 'Uma imersão nas profundezas dos oceanos e nas criaturas que nunca viram a luz do sol.',
    cast: [], director: 'Equipe MEGA Nature', qualities: Q.oceans, trailer: TRAILER,
  },
  {
    id: 'cidades-invisiveis', type: 'documentary', title: 'Cidades Invisíveis', year: 2023,
    genres: ['Documentário', 'Cultura'], rating: 'L', duration: 74, score: 8.5,
    tags: ['documentarios', 'tendencias'],
    free: true,
    synopsis: 'Histórias de metrópoles que crescem mais rápido do que a própria imaginação.',
    cast: [], director: 'Marta Ribeiro', qualities: Q.jelly, trailer: TRAILER,
  },
  {
    id: 'mentes-brilhantes', type: 'documentary', title: 'Mentes Brilhantes', year: 2025,
    genres: ['Documentário', 'Ciência'], rating: '10', duration: 91, score: 8.7,
    tags: ['documentarios', 'lancamentos'],
    free: false,
    synopsis: 'Os cientistas que estão reescrevendo o futuro da humanidade, contados por eles mesmos.',
    cast: [], director: 'Ana Beatriz Luz', qualities: Q.sintel, trailer: TRAILER,
  },

  // -------- Shows --------
  {
    id: 'arena-mega-2025', type: 'show', title: 'Arena MEGA 2025', year: 2025,
    genres: ['Show', 'Música'], rating: 'L', duration: 112, score: 8.8,
    tags: ['shows', 'musica', 'lancamentos', 'exclusivo'],
    free: false, badge: 'Exclusivo',
    synopsis: 'O maior festival de música do país, direto do palco principal e em qualidade máxima.',
    cast: [], director: 'Produção MEGA', qualities: Q.bbb, trailer: TRAILER,
  },
  {
    id: 'vozes-da-madrugada', type: 'show', title: 'Vozes da Madrugada', year: 2024,
    genres: ['Show', 'Acústico'], rating: 'L', duration: 86, score: 8.2,
    tags: ['shows', 'musica'],
    free: true,
    synopsis: 'Sessões acústicas intimistas com artistas que marcaram geração.',
    cast: [], director: 'Produção MEGA', qualities: Q.jelly, trailer: TRAILER,
  },
  {
    id: 'stand-up-sem-filtro', type: 'show', title: 'Stand-up Sem Filtro', year: 2023,
    genres: ['Comédia', 'Show'], rating: '14', duration: 68, score: 7.8,
    tags: ['shows', 'tendencias'],
    free: true,
    synopsis: 'Uma hora de piadas afiadas sobre a vida adulta, o trabalho e o caos do dia a dia.',
    cast: ['Marcelo Pinto'], director: 'Produção MEGA', qualities: Q.sintel, trailer: TRAILER,
  },

  // -------- Música --------
  {
    id: 'sinfonia-do-oceano', type: 'music', title: 'Sinfonia do Oceano', year: 2024,
    genres: ['Música', 'Instrumental'], rating: 'L', duration: 54, score: 8.6,
    tags: ['musica', 'destaque'],
    free: true,
    synopsis: 'Uma jornada sonora gravada ao vivo em alto-mar, com orquestra e sons da natureza.',
    cast: [], director: 'Orquestra MEGA', qualities: Q.oceans, trailer: TRAILER,
  },
  {
    id: 'batidas-urbanas', type: 'music', title: 'Batidas Urbanas', year: 2025,
    genres: ['Música', 'Hip Hop'], rating: '12', duration: 61, score: 8.0,
    tags: ['musica', 'lancamentos', 'tendencias'],
    free: false,
    synopsis: 'A nova cena do rap nacional em apresentações exclusivas.',
    cast: [], director: 'Produção MEGA', qualities: Q.bbb, trailer: TRAILER,
  },

  // -------- Infantil --------
  {
    id: 'aventuras-do-bolinho', type: 'kids', title: 'Aventuras do Bolinho', year: 2024,
    genres: ['Infantil', 'Animação'], rating: 'L', duration: 45, score: 8.5,
    tags: ['infantil', 'destaque'],
    free: true,
    synopsis: 'Bolinho e seus amigos exploram a floresta dos sonhos e aprendem sobre amizade.',
    cast: [], director: 'Estúdio MEGA Kids', qualities: Q.jelly, trailer: TRAILER,
  },
  {
    id: 'turma-do-espaco', type: 'kids', title: 'Turma do Espaço', year: 2023,
    genres: ['Infantil', 'Animação'], rating: 'L', duration: 42, score: 8.1,
    tags: ['infantil'],
    free: true,
    synopsis: 'Uma turma de crianças astronautas vive aventuras entre planetas coloridos.',
    cast: [], director: 'Estúdio MEGA Kids', qualities: Q.oceans, trailer: TRAILER,
  },

  // -------- Gospel --------
  {
    id: 'louvor-ao-vivo', type: 'show', title: 'Louvor Ao Vivo', year: 2025,
    genres: ['Gospel', 'Música'], rating: 'L', duration: 95, score: 9.0,
    tags: ['gospel', 'musica', 'destaque'],
    free: true,
    synopsis: 'Uma noite de adoração com os maiores nomes da música gospel nacional.',
    cast: [], director: 'Produção MEGA', qualities: Q.sintel, trailer: TRAILER,
  },
  {
    id: 'caminho-de-fe', type: 'series', title: 'Caminho de Fé', year: 2024,
    genres: ['Gospel', 'Drama'], rating: '10', score: 8.4,
    tags: ['gospel', 'series'],
    free: true,
    synopsis: 'Histórias reais de superação e fé que transformaram comunidades inteiras.',
    cast: ['Débora Campos', 'Elias Moreira'],
    director: 'Rute Nascimento', qualities: Q.bbb, trailer: TRAILER,
    seasons: makeSeasons('Caminho de Fé', 2, 6, Q.bbb),
  },

  // -------- Notícias --------
  {
    id: 'mega-news', type: 'news', title: 'MEGA News — Edição da Noite', year: 2025,
    genres: ['Notícias', 'Jornalismo'], rating: 'L', duration: 38, score: 7.9,
    tags: ['noticias', 'lancamentos'],
    free: true,
    synopsis: 'As principais notícias do Brasil e do mundo, com análise e correspondentes internacionais.',
    cast: [], director: 'Redação MEGA', qualities: Q.jelly, trailer: TRAILER,
  },
  {
    id: 'giro-tecnologico', type: 'news', title: 'Giro Tecnológico', year: 2025,
    genres: ['Notícias', 'Tecnologia'], rating: 'L', duration: 29, score: 8.0,
    tags: ['noticias', 'tendencias'],
    free: true,
    synopsis: 'O que há de novo em tecnologia, IA e ciência, explicado de forma simples.',
    cast: [], director: 'Redação MEGA', qualities: Q.sintel, trailer: TRAILER,
  },

  // -------- Esportes --------
  {
    id: 'classico-da-rodada', type: 'sports', title: 'Clássico da Rodada', year: 2025,
    genres: ['Esportes', 'Futebol'], rating: 'L', duration: 120, score: 8.3,
    tags: ['esportes', 'destaque', 'mais-assistidos'],
    free: false, badge: 'Ao vivo',
    synopsis: 'O maior confronto do campeonato, com análise tática e melhores momentos.',
    cast: [], director: 'MEGA Esportes', qualities: Q.bbb, trailer: TRAILER,
  },
  {
    id: 'mundial-de-velocidade', type: 'sports', title: 'Mundial de Velocidade', year: 2025,
    genres: ['Esportes', 'Automobilismo'], rating: 'L', duration: 105, score: 8.1,
    tags: ['esportes', 'lancamentos'],
    free: false,
    synopsis: 'Cobertura completa da temporada, com câmeras a bordo e telemetria em tempo real.',
    cast: [], director: 'MEGA Esportes', qualities: Q.oceans, trailer: TRAILER,
  },
  {
    id: 'basquete-finais', type: 'sports', title: 'Finais do Basquete', year: 2024,
    genres: ['Esportes', 'Basquete'], rating: 'L', duration: 98, score: 7.7,
    tags: ['esportes'],
    free: true,
    synopsis: 'A decisão do título em uma série melhor de sete eletrizante.',
    cast: [], director: 'MEGA Esportes', qualities: Q.jelly, trailer: TRAILER,
  },
]

// ---------------------------------------------------------------------------
// Live channels
// ---------------------------------------------------------------------------
const progPool = [
  ['Bom Dia MEGA', 'Notícias'],
  ['MEGA Esportes — Ao Vivo', 'Esportes'],
  ['Sessão Cinema', 'Filmes'],
  ['Música Sem Parar', 'Música'],
  ['Mundo Kids', 'Infantil'],
  ['Adoração 24h', 'Gospel'],
  ['Debate da Noite', 'Notícias'],
  ['Documentário Especial', 'Documentários'],
]

export const LIVE_CHANNELS = [
  { id: 'mega-news-tv', name: 'MEGA News TV', category: 'Notícias', viewers: 18420, color: 'from-red-600 to-rose-800', quality: 'FHD' },
  { id: 'mega-esportes', name: 'MEGA Esportes', category: 'Esportes', viewers: 42310, color: 'from-emerald-600 to-teal-800', quality: '4K' },
  { id: 'mega-cinema', name: 'MEGA Cinema', category: 'Filmes', viewers: 9210, color: 'from-indigo-600 to-violet-900', quality: 'FHD' },
  { id: 'mega-music', name: 'MEGA Music', category: 'Música', viewers: 15340, color: 'from-fuchsia-600 to-pink-800', quality: 'FHD' },
  { id: 'mega-kids', name: 'MEGA Kids', category: 'Infantil', viewers: 7640, color: 'from-amber-500 to-orange-700', quality: 'HD' },
  { id: 'mega-fe', name: 'MEGA Fé', category: 'Gospel', viewers: 11280, color: 'from-sky-600 to-blue-900', quality: 'FHD' },
  { id: 'mega-docs', name: 'MEGA Docs', category: 'Documentários', viewers: 4310, color: 'from-teal-600 to-cyan-900', quality: 'HD' },
  { id: 'mega-shows', name: 'MEGA Shows', category: 'Shows', viewers: 6180, color: 'from-purple-600 to-indigo-900', quality: 'FHD' },
]

// Build a 24h EPG for a channel (deterministic, no randomness at runtime).
export function buildEPG(channelId) {
  const seed = channelId.length
  const slots = []
  let hour = 6
  for (let i = 0; i < 12; i++) {
    const [title, genre] = progPool[(seed + i) % progPool.length]
    const start = hour % 24
    const end = (hour + 2) % 24
    slots.push({
      id: `${channelId}-${i}`,
      title,
      genre,
      start: `${String(start).padStart(2, '0')}:00`,
      end: `${String(end).padStart(2, '0')}:00`,
      live: i === 2,
    })
    hour += 2
  }
  return slots
}

// ---------------------------------------------------------------------------
// Subscription plans
// ---------------------------------------------------------------------------
export const PLANS = [
  {
    id: 'free', name: 'Gratuito', price: 'R$ 0', period: 'para sempre',
    tagline: 'Comece a assistir agora', highlight: false,
    features: [
      { label: 'Catálogo gratuito com anúncios', ok: true },
      { label: 'Qualidade até 720p', ok: true },
      { label: '1 tela por vez', ok: true },
      { label: 'Download para assistir offline', ok: false },
      { label: 'Conteúdo premium e estreias', ok: false },
      { label: 'Sem anúncios', ok: false },
    ],
  },
  {
    id: 'premium', name: 'Premium', price: 'R$ 29,90', period: '/mês',
    tagline: 'O favorito dos assinantes', highlight: true,
    features: [
      { label: 'Catálogo completo, sem anúncios', ok: true },
      { label: 'Full HD (1080p)', ok: true },
      { label: '2 telas ao mesmo tempo', ok: true },
      { label: 'Download para assistir offline', ok: true },
      { label: 'Estreias e conteúdo premium', ok: true },
      { label: 'Áudio 5.1', ok: false },
    ],
  },
  {
    id: 'ultra', name: 'Ultra', price: 'R$ 49,90', period: '/mês',
    tagline: 'Máxima qualidade e recursos', highlight: false,
    features: [
      { label: 'Tudo do Premium', ok: true },
      { label: '4K + HDR e áudio 5.1', ok: true },
      { label: '4 telas ao mesmo tempo', ok: true },
      { label: 'Conteúdo exclusivo Ultra', ok: true },
      { label: 'Eventos ao vivo em 4K', ok: true },
      { label: 'Downloads ilimitados', ok: true },
    ],
  },
]

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------
export const getTitle = (id) => TITLES.find((t) => t.id === id)
export const getChannel = (id) => LIVE_CHANNELS.find((c) => c.id === id)

export function byTag(tag, limit) {
  const list = TITLES.filter((t) => t.tags.includes(tag))
  return limit ? list.slice(0, limit) : list
}

export function searchTitles(query, limit = 20) {
  const s = query.trim().toLowerCase()
  if (!s) return []
  return TITLES.filter((t) => {
    const hay = [
      t.title, t.director, t.year, t.type,
      ...t.genres, ...(t.cast || []),
    ].join(' ').toLowerCase()
    return hay.includes(s)
  }).slice(0, limit)
}

export const imageFor = img
