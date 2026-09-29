import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ContentCard from './ContentCard.jsx'
import Icon, { paths } from './Icons.jsx'
import { useApp } from '../context/AppContext.jsx'

// Horizontally scrolling row of posters with arrow controls (desktop) and
// native swipe (mobile / touch).
export default function ContentRow({ title, items, seeAllTo, showProgress = false }) {
  const scroller = useRef(null)
  const { progressOf } = useApp()
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  function onScroll() {
    const el = scroller.current
    if (!el) return
    setAtStart(el.scrollLeft < 8)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8)
  }

  function scrollBy(dir) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.85, 300), behavior: 'smooth' })
  }

  if (!items?.length) return null

  return (
    <section className="group/row relative py-4">
      <div className="mb-3 flex items-center justify-between gap-3 px-4 lg:px-6">
        <h2 className="text-lg font-bold tracking-tight text-white lg:text-xl">{title}</h2>
        {seeAllTo && (
          <Link to={seeAllTo} className="flex items-center gap-1 text-xs font-semibold text-white/50 transition hover:text-mega-red-bright">
            Ver tudo <Icon path={paths.chevronRight} className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="relative">
        {!atStart && (
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Anterior"
            className="glass-strong absolute left-1 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full opacity-0 transition group-hover/row:opacity-100 lg:flex"
          >
            <Icon path={paths.chevronLeft} />
          </button>
        )}
        {!atEnd && (
          <button
            onClick={() => scrollBy(1)}
            aria-label="Próximo"
            className="glass-strong absolute right-1 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full opacity-0 transition group-hover/row:opacity-100 lg:flex"
          >
            <Icon path={paths.chevronRight} />
          </button>
        )}

        <div
          ref={scroller}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 lg:px-6"
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              progress={showProgress ? progressOf(item.id) : null}
              className="w-[44vw] shrink-0 snap-start sm:w-[30vw] md:w-[22vw] lg:w-[15.5vw] xl:w-[13vw]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
