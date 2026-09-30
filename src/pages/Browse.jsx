import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ContentCard from '../components/ContentCard.jsx'
import Icon, { paths } from '../components/Icons.jsx'
import { byTag, ROWS, TITLES } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

// Route → catalogue configuration. Keeps every listing page in one place.
export const BROWSE = {
  filmes: { title: 'Filmes', filter: (t) => t.type === 'movie' },
  series: { title: 'Séries', filter: (t) => t.type === 'series' },
  documentarios: { title: 'Documentários', filter: (t) => t.type === 'documentary' },
  shows: { title: 'Shows', filter: (t) => t.type === 'show' },
  musica: { title: 'Música', filter: (t) => t.type === 'music' || t.genres.includes('Música') },
  gospel: { title: 'Gospel', filter: (t) => t.genres.includes('Gospel') },
  noticias: { title: 'Notícias', filter: (t) => t.type === 'news' },
  esportes: { title: 'Esportes', filter: (t) => t.type === 'sports' },
  infantil: { title: 'Infantil', filter: (t) => t.type === 'kids' || t.tags.includes('infantil') },
}

const SORTS = [
  { id: 'relevance', label: 'Relevância' },
  { id: 'year', label: 'Mais recentes' },
  { id: 'score', label: 'Melhor avaliados' },
  { id: 'az', label: 'A – Z' },
]

export default function Browse({ kind }) {
  const { rowId } = useParams()

  const { title, items } = useMemo(() => {
    if (kind && BROWSE[kind]) return { title: BROWSE[kind].title, items: TITLES.filter(BROWSE[kind].filter) }
    if (rowId) return { title: ROWS.find((r) => r.id === rowId)?.label || 'Catálogo', items: byTag(rowId) }
    return { title: 'Catálogo', items: TITLES }
  }, [kind, rowId])

  const { kidsMode } = useApp()
  const [genre, setGenre] = useState('Todos')
  const [sort, setSort] = useState('relevance')

  const genres = useMemo(() => ['Todos', ...new Set(items.flatMap((t) => t.genres))], [items])

  const list = useMemo(() => {
    let out = kidsMode ? items.filter((t) => t.rating === 'L') : items
    if (genre !== 'Todos') out = out.filter((t) => t.genres.includes(genre))
    if (sort === 'year') out = [...out].sort((a, b) => b.year - a.year)
    if (sort === 'score') out = [...out].sort((a, b) => b.score - a.score)
    if (sort === 'az') out = [...out].sort((a, b) => a.title.localeCompare(b.title))
    return out
  }, [items, genre, sort, kidsMode])

  return (
    <div className="px-4 pb-16 pt-6 lg:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-white/50">{list.length} títulos disponíveis</p>
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Ordenar"
            className="appearance-none rounded-full border border-white/10 bg-white/5 py-2 pl-4 pr-9 text-sm outline-none focus:border-mega-red/60"
          >
            {SORTS.map((s) => <option key={s.id} value={s.id} className="bg-ink-800">{s.label}</option>)}
          </select>
          <Icon path={paths.chevronDown} className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        </div>
      </div>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              genre === g ? 'bg-mega-red text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="glass flex flex-col items-center gap-2 rounded-2xl py-20 text-center">
          <Icon path={paths.filter} className="h-8 w-8 text-white/30" />
          <p className="text-sm text-white/60">Nenhum título encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {list.map((item) => <ContentCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
