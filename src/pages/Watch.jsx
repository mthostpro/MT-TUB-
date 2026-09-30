import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import VideoPlayer from '../player/VideoPlayer.jsx'
import Icon, { paths } from '../components/Icons.jsx'
import { AgeRating, Pill } from '../components/Badges.jsx'
import ContentRow from '../components/ContentRow.jsx'
import { getTitle, imageFor, TITLES } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

export default function Watch() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const item = getTitle(id)
  const { isInList, isFavorite, toggleList, toggleFavorite, saveProgress, progressOf, notify } = useApp()
  const [cinema, setCinema] = useState(false)

  const sNum = Number(params.get('s')) || 1
  const eNum = Number(params.get('e')) || 1

  const { season, episode, qualities, nextEpisode } = useMemo(() => {
    if (!item) return {}
    if (item.type !== 'series') {
      return { qualities: item.qualities, episode: null, season: null, nextEpisode: null }
    }
    const season = item.seasons.find((x) => x.number === sNum) || item.seasons[0]
    const idx = season.episodes.findIndex((x) => x.number === eNum)
    const episode = season.episodes[idx >= 0 ? idx : 0]
    const nextEpisode = season.episodes[idx + 1] || null
    return { season, episode, qualities: episode.qualities, nextEpisode }
  }, [item, sNum, eNum])

  const similar = useMemo(
    () => TITLES.filter((t) => t.id !== id && item && t.genres.some((g) => item.genres.includes(g))).slice(0, 12),
    [id, item],
  )

  if (!item) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-lg font-semibold">Conteúdo não encontrado</p>
        <Link to="/" className="text-sm text-mega-red-bright underline">Voltar ao início</Link>
      </div>
    )
  }

  const listed = isInList(item.id)
  const fav = isFavorite(item.id)
  const progress = progressOf(item.id)
  const displayTitle = episode ? `${item.title} — T${season.number}E${episode.number} · ${episode.title}` : item.title
  const subtitle = episode ? `${item.title} · Temporada ${season.number} · Episódio ${episode.number}` : null

  function goNext() {
    if (!nextEpisode) return
    navigate(`/assistir/${item.id}?s=${season.number}&e=${nextEpisode.number}`)
  }

  function handleProgress(data) {
    if (data.notice) { notify(data.notice); return }
    saveProgress(item.id, {
      position: data.position,
      duration: data.duration,
      percent: data.percent,
      episode: episode ? { season: season.number, number: episode.number, title: episode.title } : null,
    })
  }

  return (
    <div className="pb-16">
      <div className={`mx-auto w-full ${cinema ? 'max-w-none' : 'max-w-[1400px]'} px-0 lg:px-6 lg:pt-4`}>
        <VideoPlayer
          item={item}
          src={qualities?.[0]?.url}
          qualities={qualities || []}
          poster={imageFor(`${item.id}-bd`, 1280, 720)}
          title={displayTitle}
          subtitle={subtitle}
          hasNext={!!nextEpisode}
          onNext={goNext}
          onProgress={handleProgress}
          startAt={progress?.position || 0}
          cinema={cinema}
          onToggleCinema={() => setCinema((c) => !c)}
        />

        <div className="flex flex-col gap-8 px-4 pt-6 lg:flex-row lg:px-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-bold leading-snug lg:text-2xl">{displayTitle}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/65">
                  <span className="flex items-center gap-1 font-semibold text-mega-gold">
                    <Icon path={paths.star} fill className="h-4 w-4" /> {item.score}
                  </span>
                  <span>{item.year}</span>
                  <AgeRating value={item.rating} />
                  <span>{item.genres.join(' • ')}</span>
                  <Pill tone="outline">{item.free ? 'Gratuito' : 'Premium'}</Pill>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                onClick={() => toggleList(item.id, item.title)}
                className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:bg-white/15"
              >
                <Icon path={listed ? paths.check : paths.plus} className="h-4 w-4" /> {listed ? 'Na Minha Lista' : 'Minha Lista'}
              </button>
              <button
                onClick={() => toggleFavorite(item.id, item.title)}
                className={`glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:bg-white/15 ${fav ? 'text-mega-red-bright' : ''}`}
              >
                <Icon path={paths.heart} fill={fav} className="h-4 w-4" /> Favoritar
              </button>
              <button onClick={() => notify('Link copiado para compartilhar')} className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:bg-white/15">
                <Icon path={paths.share} className="h-4 w-4" /> Compartilhar
              </button>
              <button onClick={() => notify('Download disponível nos planos Premium e Ultra')} className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:bg-white/15">
                <Icon path={paths.download} className="h-4 w-4" /> Baixar
              </button>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/70">
              {episode ? episode.synopsis : item.synopsis}
            </p>

            {nextEpisode && (
              <button
                onClick={goNext}
                className="glass mt-6 flex w-full max-w-2xl items-center gap-4 rounded-2xl p-3 text-left transition hover:bg-white/10"
              >
                <img src={imageFor(`${item.id}-s${season.number}e${nextEpisode.number}`, 320, 180)} alt="" className="aspect-video w-32 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-mega-red-bright">A seguir</p>
                  <p className="truncate text-sm font-semibold">T{season.number}E{nextEpisode.number} · {nextEpisode.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-white/55">{nextEpisode.synopsis}</p>
                </div>
                <Icon path={paths.next} fill className="ml-auto h-6 w-6 shrink-0 text-white/70" />
              </button>
            )}
          </div>

          {/* episode list / side panel */}
          <aside className="w-full shrink-0 lg:w-[360px]">
            {item.type === 'series' && season && (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-bold">Temporada {season.number}</h2>
                  <div className="relative">
                    <select
                      value={season.number}
                      onChange={(e) => navigate(`/assistir/${item.id}?s=${e.target.value}&e=1`)}
                      aria-label="Escolher temporada"
                      className="appearance-none rounded-full border border-white/10 bg-white/5 py-1.5 pl-3 pr-8 text-xs outline-none"
                    >
                      {item.seasons.map((s) => <option key={s.number} value={s.number} className="bg-ink-800">Temporada {s.number}</option>)}
                    </select>
                    <Icon path={paths.chevronDown} className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/50" />
                  </div>
                </div>
                <div className="no-scrollbar flex max-h-[520px] flex-col gap-1 overflow-y-auto pr-1">
                  {season.episodes.map((ep) => {
                    const active = ep.number === episode.number
                    return (
                      <button
                        key={ep.number}
                        onClick={() => navigate(`/assistir/${item.id}?s=${season.number}&e=${ep.number}`)}
                        className={`flex items-center gap-3 rounded-xl p-2 text-left transition ${active ? 'bg-mega-red/15 ring-1 ring-mega-red/40' : 'hover:bg-white/5'}`}
                      >
                        <img src={imageFor(`${item.id}-s${season.number}e${ep.number}`, 240, 135)} alt="" loading="lazy" className="aspect-video w-24 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className={`truncate text-sm font-medium ${active ? 'text-mega-red-bright' : ''}`}>{ep.number}. {ep.title}</p>
                          <p className="text-xs text-white/50">{ep.duration} min</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {item.type !== 'series' && (
              <>
                <h2 className="mb-3 font-bold">Recomendados para você</h2>
                <div className="flex flex-col gap-3">
                  {similar.slice(0, 6).map((t) => (
                    <Link key={t.id} to={`/titulo/${t.id}`} className="group flex gap-3">
                      <img src={imageFor(`${t.id}-bd`, 320, 180)} alt="" loading="lazy" className="aspect-video w-32 shrink-0 rounded-xl object-cover ring-1 ring-white/5" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium group-hover:text-mega-red-bright">{t.title}</p>
                        <p className="text-xs text-white/50">{t.year} • {t.genres[0]}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-mega-gold"><Icon path={paths.star} fill className="h-3 w-3" />{t.score}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>
      </div>

      <div className="mt-10">
        <ContentRow title="Você também pode gostar" items={similar} />
      </div>
    </div>
  )
}
