import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon, { paths } from './Icons.jsx'
import { AgeRating } from './Badges.jsx'
import { imageFor } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

const INTERVAL = 8000

// Cinematic auto-rotating hero.
export default function HeroBanner({ items }) {
  const navigate = useNavigate()
  const { isInList, toggleList } = useApp()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (paused || items.length < 2) return
    timer.current = setInterval(() => setIndex((i) => (i + 1) % items.length), INTERVAL)
    return () => clearInterval(timer.current)
  }, [paused, items.length])

  useEffect(() => { setIndex(0) }, [items])

  if (!items?.length) return null
  const item = items[index]
  const listed = isInList(item.id)

  return (
    <section
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrossel"
      aria-label="Destaques"
    >
      {items.map((it, i) => {
        const visible = i === index
        const near = visible || i === (index + 1) % items.length // preload only the next slide
        if (!near) return null
        return (
          <div
            key={it.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={!visible}
          >
            <img
              src={imageFor(`${it.id}-bd`, 1600, 900)}
              alt=""
              loading={visible ? 'eager' : 'lazy'}
              className={`h-full w-full object-cover ${visible ? 'animate-kenburns' : ''}`}
            />
          </div>
        )
      })}

      {/* cinematic gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />

      <div className="relative z-10 flex h-full items-end pb-14 lg:items-center lg:pb-0">
        <div key={item.id} className="animate-fade-up max-w-2xl px-5 lg:px-10">
          {item.badge && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-mega-red px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <Icon path={paths.star} fill className="h-3 w-3" /> {item.badge}
            </span>
          )}

          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight drop-shadow-lg sm:text-5xl lg:text-6xl">
            {item.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="flex items-center gap-1 font-semibold text-mega-gold">
              <Icon path={paths.star} fill className="h-4 w-4" /> {item.score}
            </span>
            <span>{item.year}</span>
            <AgeRating value={item.rating} />
            <span>{item.genres.join(' • ')}</span>
            <span>{item.type === 'series' ? `${item.seasons.length} temporadas` : `${item.duration} min`}</span>
          </div>

          <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            {item.synopsis}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(`/assistir/${item.id}`)}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-[1.03] hover:bg-white/90"
            >
              <Icon path={paths.play} fill className="h-5 w-5" /> ASSISTIR AGORA
            </button>
            <button
              onClick={() => toggleList(item.id, item.title)}
              className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <Icon path={listed ? paths.check : paths.plus} className="h-5 w-5" />
              {listed ? 'NA MINHA LISTA' : 'ADICIONAR À MINHA LISTA'}
            </button>
            <button
              onClick={() => navigate(`/titulo/${item.id}`)}
              className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <Icon path={paths.info} className="h-5 w-5" /> Informações
            </button>
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="absolute bottom-6 right-5 z-10 flex items-center gap-2 lg:right-10">
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={() => setIndex(i)}
            aria-label={`Ir para ${it.title}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-mega-red' : 'w-3 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  )
}
