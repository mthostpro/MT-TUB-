import { Link } from 'react-router-dom'
import Icon, { paths } from '../components/Icons.jsx'
import { LiveBadge, Pill } from '../components/Badges.jsx'
import { LIVE_CHANNELS, TITLES } from '../data/catalog.js'

const EVENTS = TITLES.filter((t) => t.tags.includes('esportes') || t.tags.includes('shows')).slice(0, 4)

const nf = new Intl.NumberFormat('pt-BR')

export default function Live() {
  return (
    <div className="px-4 pb-16 pt-6 lg:px-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mega-red/15 text-mega-red-bright">
          <Icon path={paths.live} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Ao Vivo</h1>
          <p className="text-sm text-white/50">{LIVE_CHANNELS.length} canais transmitindo agora</p>
        </div>
      </div>

      {/* featured live */}
      <Link
        to={`/ao-vivo/${LIVE_CHANNELS[0].id}`}
        className="group relative mb-8 block overflow-hidden rounded-3xl ring-1 ring-white/10"
      >
        <div className={`aspect-[21/9] w-full bg-gradient-to-br ${LIVE_CHANNELS[0].color}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 lg:p-8">
          <LiveBadge />
          <h2 className="mt-3 text-2xl font-extrabold lg:text-4xl">{LIVE_CHANNELS[0].name}</h2>
          <p className="mt-1 text-sm text-white/70">
            {nf.format(LIVE_CHANNELS[0].viewers)} espectadores • {LIVE_CHANNELS[0].quality}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition group-hover:scale-105">
            <Icon path={paths.play} fill className="h-4 w-4" /> Assistir agora
          </span>
        </div>
      </Link>

      <h2 className="mb-3 text-lg font-bold">Todos os canais</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {LIVE_CHANNELS.map((ch) => (
          <Link
            key={ch.id}
            to={`/ao-vivo/${ch.id}`}
            className="group overflow-hidden rounded-2xl bg-ink-850 ring-1 ring-white/5 transition hover:ring-mega-red/50"
          >
            <div className={`relative aspect-video bg-gradient-to-br ${ch.color}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm transition group-hover:bg-mega-red">
                  <Icon path={paths.play} fill className="ml-0.5 h-6 w-6 text-white" />
                </span>
              </div>
              <span className="absolute left-3 top-3"><LiveBadge /></span>
              <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-0.5 text-[11px] font-semibold">{ch.quality}</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-3.5">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{ch.name}</h3>
                <p className="mt-0.5 text-xs text-white/50">{ch.category}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs text-white/60">
                <Icon path={paths.eye} className="h-3.5 w-3.5" /> {nf.format(ch.viewers)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-bold">Próximos eventos ao vivo</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EVENTS.map((e) => (
          <div key={e.id} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <Pill tone="red">Hoje</Pill>
              <span className="text-xs text-white/50">21:30</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{e.title}</h3>
            <p className="mt-1 text-xs text-white/50">{e.genres.join(' • ')}</p>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-2 text-xs font-semibold transition hover:bg-white/20">
              <Icon path={paths.bell} className="h-4 w-4" /> Avisar-me
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
