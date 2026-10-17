import { Link, useNavigate } from 'react-router-dom'
import Icon, { paths } from './Icons.jsx'
import { AgeRating, Pill } from './Badges.jsx'
import { imageFor } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

const TYPE_LABEL = {
  movie: 'Filme', series: 'Série', documentary: 'Documentário',
  show: 'Show', music: 'Música', kids: 'Infantil', news: 'Notícia', sports: 'Esporte',
}

export function Poster({ item, className = '' }) {
  return (
    <img
      src={imageFor(`${item.id}-po`, 300, 450)}
      alt={item.title}
      loading="lazy"
      className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.06] ${className}`}
    />
  )
}

export default function ContentCard({ item, progress = null, className = '' }) {
  const navigate = useNavigate()
  const { isFavorite, isInList, toggleFavorite, toggleList } = useApp()
  const fav = isFavorite(item.id)
  const listed = isInList(item.id)

  return (
    <div className={`group relative ${className}`}>
      <Link to={`/titulo/${item.id}`} className="block" aria-label={item.title}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-gradient-to-br from-ink-700 to-ink-900 ring-1 ring-white/5 transition duration-300 group-hover:ring-mega-red/50">
          <Poster item={item} />

          {/* top badges */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
            {item.badge ? (
              <Pill tone={item.badge === 'Ao vivo' ? 'red' : 'gold'}>{item.badge}</Pill>
            ) : <span />}
            <AgeRating value={item.rating} />
          </div>

          {/* hover actions */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.preventDefault(); navigate(`/assistir/${item.id}`) }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
                aria-label="Reproduzir"
              >
                <Icon path={paths.play} fill className="ml-0.5 h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); toggleFavorite(item.id, item.title) }}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition hover:scale-105 ${
                  fav ? 'border-mega-red bg-mega-red text-white' : 'border-white/40 bg-black/40 text-white hover:border-white'
                }`}
                aria-label="Favoritar"
              >
                <Icon path={paths.heart} fill={fav} className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); toggleList(item.id, item.title) }}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition hover:scale-105 ${
                  listed ? 'border-white bg-white text-black' : 'border-white/40 bg-black/40 text-white hover:border-white'
                }`}
                aria-label="Minha Lista"
              >
                <Icon path={listed ? paths.check : paths.plus} className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); navigate(`/titulo/${item.id}`) }}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white transition hover:border-white"
                aria-label="Mais informações"
              >
                <Icon path={paths.info} className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* progress */}
          {progress?.percent > 0 && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
              <div className="h-full bg-mega-red" style={{ width: `${Math.min(progress.percent, 100)}%` }} />
            </div>
          )}
        </div>
      </Link>

      <div className="mt-2.5 px-0.5">
        <Link to={`/titulo/${item.id}`}>
          <h3 className="truncate text-sm font-semibold text-white/95 group-hover:text-white">{item.title}</h3>
        </Link>
        <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-white/50">
          <span>{item.year}</span>
          <span>•</span>
          <span className="truncate">{item.genres[0]}</span>
          <span>•</span>
          <span>{TYPE_LABEL[item.type]}</span>
        </p>
      </div>
    </div>
  )
}
