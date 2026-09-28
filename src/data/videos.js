// Mock catalogue for MT-TUB. Swap for a real API later.

export const categories = [
  'Todos',
  'Em alta',
  'Música',
  'Jogos',
  'Ao vivo',
  'Programação',
  'Notícias',
  'Podcasts',
  'Esportes',
]

export const channels = {
  devbr: { name: 'Dev Brasil', initials: 'DB', color: 'bg-emerald-600' },
  lofi: { name: 'Lofi Sessions', initials: 'LS', color: 'bg-indigo-600' },
  games: { name: 'PixelPlay', initials: 'PP', color: 'bg-rose-600' },
  news: { name: 'Mundo Hoje', initials: 'MH', color: 'bg-amber-600' },
  code: { name: 'CodeCast', initials: 'CC', color: 'bg-sky-600' },
  music: { name: 'Som & Cia', initials: 'SC', color: 'bg-fuchsia-600' },
}

export const videos = [
  {
    id: 'v1',
    title: 'Construindo um clone de streaming do zero — parte 1',
    channel: 'devbr',
    views: '182 mil visualizações',
    uploaded: 'há 2 dias',
    duration: '24:11',
    category: 'Programação',
    gradient: 'from-emerald-500 to-teal-700',
    description:
      'Neste episódio começamos o front-end do projeto: layout, roteamento e o primeiro componente de player. Código-fonte na descrição.',
  },
  {
    id: 'v2',
    title: 'Lofi para programar a noite inteira 🌙',
    channel: 'lofi',
    views: '1,4 mi de visualizações',
    uploaded: 'há 1 semana',
    duration: '1:02:45',
    category: 'Música',
    gradient: 'from-indigo-500 to-purple-800',
    description:
      'Uma hora de beats calmos para focar. Sem interrupções, sem anúncios no meio.',
  },
  {
    id: 'v3',
    title: 'Zerei o indie mais difícil do ano (sem morrer)',
    channel: 'games',
    views: '623 mil visualizações',
    uploaded: 'há 3 dias',
    duration: '18:39',
    category: 'Jogos',
    gradient: 'from-rose-500 to-orange-600',
    description:
      'Run completa, comentada, com os melhores momentos e as piores mortes que ficaram de fora.',
  },
  {
    id: 'v4',
    title: 'AO VIVO: resumo das notícias de tecnologia',
    channel: 'news',
    views: '8,2 mil assistindo agora',
    uploaded: 'ao vivo',
    duration: 'AO VIVO',
    category: 'Ao vivo',
    live: true,
    gradient: 'from-amber-500 to-red-700',
    description:
      'Cobertura ao vivo dos principais lançamentos da semana em tecnologia e IA.',
  },
  {
    id: 'v5',
    title: 'Arquitetura limpa na prática: um caso real',
    channel: 'code',
    views: '97 mil visualizações',
    uploaded: 'há 5 dias',
    duration: '31:02',
    category: 'Programação',
    gradient: 'from-sky-500 to-blue-800',
    description:
      'Como organizamos um monólito que cresceu demais: camadas, contratos e testes.',
  },
  {
    id: 'v6',
    title: 'Mix de hits brasileiros — as melhores do momento',
    channel: 'music',
    views: '2,1 mi de visualizações',
    uploaded: 'há 2 semanas',
    duration: '47:20',
    category: 'Música',
    gradient: 'from-fuchsia-500 to-pink-700',
    description:
      'Seleção das faixas mais tocadas, atualizada toda semana.',
  },
  {
    id: 'v7',
    title: 'Do zero ao deploy: CI/CD explicado em 20 minutos',
    channel: 'devbr',
    views: '54 mil visualizações',
    uploaded: 'há 1 dia',
    duration: '20:14',
    category: 'Programação',
    gradient: 'from-teal-500 to-cyan-800',
    description:
      'Pipelines, testes automáticos e deploy contínuo sem complicação.',
  },
  {
    id: 'v8',
    title: 'Speedrun comentado: recorde mundial ao vivo',
    channel: 'games',
    views: '312 mil visualizações',
    uploaded: 'há 4 dias',
    duration: '12:58',
    category: 'Jogos',
    gradient: 'from-red-500 to-rose-800',
    description:
      'O recorde caiu de novo. Veja o momento exato e a reação do corredor.',
  },
]

export const getVideo = (id) => videos.find((v) => v.id === id)
