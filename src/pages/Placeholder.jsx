import { useLocation } from 'react-router-dom'

const titles = {
  '/shorts': 'Shorts',
  '/inscricoes': 'Inscrições',
  '/historico': 'Histórico',
  '/playlists': 'Playlists',
  '/seus-videos': 'Seus vídeos',
  '/mais-tarde': 'Assistir mais tarde',
  '/curtidos': 'Vídeos curtidos',
  '/musica': 'Música',
  '/jogos': 'Jogos',
  '/noticias': 'Notícias',
}

export default function Placeholder() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'Em breve'

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-white/60">Em construção — em breve por aqui.</p>
    </div>
  )
}
