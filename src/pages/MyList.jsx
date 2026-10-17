import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ContentCard from '../components/ContentCard.jsx'
import ContinueCard from '../components/ContinueCard.jsx'
import Icon, { paths } from '../components/Icons.jsx'
import { getTitle } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

const TABS = [
  { id: 'list', label: 'Minha Lista', icon: 'bookmark' },
  { id: 'favorites', label: 'Favoritos', icon: 'heart' },
  { id: 'continue', label: 'Continue assistindo', icon: 'play' },
  { id: 'history', label: 'Histórico', icon: 'clock' },
]

function Empty({ label, cta }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-2xl py-20 text-center">
      <Icon path={paths.bookmark} className="h-8 w-8 text-white/25" />
      <p className="text-sm text-white/60">{label}</p>
      <Link to={cta.to} className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold transition hover:bg-white/20">{cta.label}</Link>
    </div>
  )
}

export default function MyList({ initialTab = 'list' }) {
  const { myList, favorites, history, progress, clearHistory } = useApp()
  const [tab, setTab] = useState(initialTab)

  const listItems = useMemo(() => myList.map(getTitle).filter(Boolean), [myList])
  const favItems = useMemo(() => favorites.map(getTitle).filter(Boolean), [favorites])
  const continueItems = useMemo(
    () => Object.entries(progress)
      .filter(([, p]) => p.percent > 1 && p.percent < 97)
      .sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0))
      .map(([id]) => getTitle(id))
      .filter(Boolean),
    [progress],
  )
  const historyItems = useMemo(() => history.map(getTitle).filter(Boolean), [history])

  return (
    <div className="px-4 pb-16 pt-6 lg:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Minha Lista</h1>
      <p className="mt-1 text-sm text-white/50">Seus títulos salvos, favoritos e o que você está assistindo.</p>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.id ? 'bg-mega-red text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Icon path={paths[t.icon]} className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'list' && (listItems.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {listItems.map((i) => <ContentCard key={i.id} item={i} />)}
          </div>
        ) : <Empty label="Sua lista está vazia. Adicione títulos para assistir depois." cta={{ to: '/', label: 'Explorar catálogo' }} />)}

        {tab === 'favorites' && (favItems.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {favItems.map((i) => <ContentCard key={i.id} item={i} />)}
          </div>
        ) : <Empty label="Você ainda não favoritou nenhum título." cta={{ to: '/', label: 'Explorar catálogo' }} />)}

        {tab === 'continue' && (continueItems.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {continueItems.map((i) => <ContinueCard key={i.id} item={i} progress={progress[i.id]} />)}
          </div>
        ) : <Empty label="Nada em andamento. Comece a assistir algo novo." cta={{ to: '/', label: 'Explorar catálogo' }} />)}

        {tab === 'history' && (historyItems.length ? (
          <>
            <div className="mb-4 flex justify-end">
              <button onClick={clearHistory} className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10">
                <Icon path={paths.trash} className="h-4 w-4" /> Limpar histórico
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {historyItems.map((i) => <ContentCard key={i.id} item={i} progress={progress[i.id]} />)}
            </div>
          </>
        ) : <Empty label="Seu histórico está vazio." cta={{ to: '/', label: 'Explorar catálogo' }} />)}
      </div>
    </div>
  )
}
