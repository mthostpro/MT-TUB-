import { useMemo } from 'react'
import ChannelBanner from '../components/ChannelBanner.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import ContentRow from '../components/ContentRow.jsx'
import ContinueCard from '../components/ContinueCard.jsx'
import Kids from './Kids.jsx'
import { byTag, getTitle, ROWS } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

const CONTINUE_LABEL = 'Continue assistindo'

export default function Home() {
  const { kidsMode, history, progress } = useApp()

  const featured = useMemo(() => byTag('destaque').slice(0, 5), [])

  const continueItems = useMemo(() => {
    const ids = history.length ? history : Object.keys(progress)
    return ids
      .map(getTitle)
      .filter(Boolean)
      .filter((t) => progress[t.id]?.percent > 1 && progress[t.id]?.percent < 97)
      .slice(0, 12)
  }, [history, progress])

  if (kidsMode) return <Kids />

  return (
    <div className="pb-16">
      <ChannelBanner />

      <HeroBanner items={featured} />

      {continueItems.length > 0 && (
        <section className="px-4 pt-8 lg:px-6">
          <h2 className="mb-3 text-lg font-bold tracking-tight lg:text-xl">{CONTINUE_LABEL}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {continueItems.map((t) => (
              <ContinueCard key={t.id} item={t} progress={progress[t.id]} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-2">
        {ROWS.map((row) => (
          <ContentRow
            key={row.id}
            title={row.label}
            items={byTag(row.id)}
            seeAllTo={`/catalogo/${row.id}`}
            showProgress={row.id === 'mais-assistidos'}
          />
        ))}
      </div>
    </div>
  )
}
