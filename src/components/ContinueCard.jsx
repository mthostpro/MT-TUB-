import { Link } from 'react-router-dom'
import Icon, { paths } from './Icons.jsx'
import { imageFor } from '../data/catalog.js'

// Wide "Continue assistindo" card with a visual progress bar.
export default function ContinueCard({ item, progress, className = '' }) {
  const percent = Math.round(progress?.percent || 0)
  const label = progress?.episode
    ? `T${progress.episode.season}E${progress.episode.number} · ${progress.episode.title}`
    : null

  return (
    <Link
      to={`/assistir/${item.id}`}
      className={`group relative block overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/5 transition hover:ring-mega-red/50 ${className}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageFor(`${item.id}-bd`, 640, 360)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <span className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition group-hover:bg-mega-red">
          <Icon path={paths.play} fill className="ml-0.5 h-5 w-5 text-white" />
        </span>
        <span className="absolute right-3 top-3 rounded bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white/90">
          {percent}% assistido
        </span>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{item.title}</h3>
        <p className="mt-0.5 truncate text-xs text-white/50">{label || `${item.year} • ${item.genres[0]}`}</p>
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-mega-red" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </Link>
  )
}
