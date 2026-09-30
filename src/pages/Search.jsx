import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContentCard from '../components/ContentCard.jsx'
import Icon, { paths } from '../components/Icons.jsx'
import { searchTitles, TITLES, LIVE_CHANNELS } from '../data/catalog.js'

const TYPE_FILTERS = [
  { id: 'all', label: 'Tudo' },
  { id: 'movie', label: 'Filmes' },
  { id: 'series', label: 'Séries' },
  { id: 'documentary', label: 'Documentários' },
  { id: 'show', label: 'Shows' },
  { id: 'sports', label: 'Esportes' },
]

const POPULAR = ['Fronteira Digital', 'Esportes', 'Gospel', 'Infantil', 'Documentário', 'Música']

export default function Search() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') || ''
  const [query, setQuery] = useState(initial)
  const [type, setType] = useState('all')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    function onDown(e) { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // keep the URL in sync (shareable searches)
  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim()) setParams({ q: query.trim() }, { replace: true })
      else setParams({}, { replace: true })
    }, 300)
    return () => clearTimeout(t)
  }, [query, setParams])

  const suggestions = useMemo(() => (query.trim() ? searchTitles(query, 6) : []), [query])

  const results = useMemo(() => {
    const base = query.trim() ? searchTitles(query, 60) : TITLES
    return type === 'all' ? base : base.filter((t) => t.type === type)
  }, [query, type])

  const channels = useMemo(
    () => (query.trim() ? LIVE_CHANNELS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())) : []),
    [query],
  )

  return (
    <div className="px-4 pb-16 pt-8 lg:px-6">
      <div ref={boxRef} className="relative mx-auto max-w-3xl">
        <div className="relative">
          <Icon path={paths.search} className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Busque por título, ator, diretor, gênero ou canal..."
            aria-label="Busca"
            className="glass h-14 w-full rounded-2xl pl-12 pr-12 text-base outline-none placeholder:text-white/40 focus:border-mega-red/50"
          />
          {query && (
            <button onClick={() => { setQuery(''); inputRef.current?.focus() }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/50 hover:text-white" aria-label="Limpar">
              <Icon path={paths.close} className="h-5 w-5" />
            </button>
          )}
        </div>

        {open && suggestions.length > 0 && (
          <div className="glass-strong animate-float-up absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl p-2">
            {suggestions.map((s) => (
              <Link
                key={s.id}
                to={`/titulo/${s.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/5"
              >
                <img src={`https://picsum.photos/seed/${s.id}-po/60/90`} alt="" className="h-12 w-8 rounded object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-white/50">{s.year} • {s.genres.join(', ')}</p>
                </div>
                <Icon path={paths.search} className="ml-auto h-4 w-4 text-white/30" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {!query.trim() && (
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="mb-3 text-sm font-semibold text-white/50">Buscas populares</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((p) => (
              <button key={p} onClick={() => setQuery(p)} className="rounded-full bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {query.trim() && (
        <>
          <div className="no-scrollbar mx-auto mt-6 flex max-w-3xl gap-2 overflow-x-auto">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setType(f.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${type === f.id ? 'bg-mega-red text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p className="mb-4 mt-6 text-sm text-white/50">
            {results.length} resultado{results.length === 1 ? '' : 's'} para “{query}”
          </p>

          {results.length === 0 ? (
            <div className="glass flex flex-col items-center gap-2 rounded-2xl py-20 text-center">
              <Icon path={paths.search} className="h-8 w-8 text-white/30" />
              <p className="text-sm text-white/60">Nada encontrado. Tente outro termo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((item) => <ContentCard key={item.id} item={item} />)}
            </div>
          )}

          {channels.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-lg font-bold">Canais ao vivo</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {channels.map((c) => (
                  <Link key={c.id} to={`/ao-vivo/${c.id}`} className="group overflow-hidden rounded-xl bg-ink-850 ring-1 ring-white/5 hover:ring-mega-red/50">
                    <div className={`relative aspect-video bg-gradient-to-br ${c.color}`} />
                    <p className="truncate p-2.5 text-xs font-semibold">{c.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
