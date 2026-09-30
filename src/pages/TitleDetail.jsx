import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon, { paths } from '../components/Icons.jsx'
import { AgeRating, Pill } from '../components/Badges.jsx'
import ContentRow from '../components/ContentRow.jsx'
import { getTitle, imageFor, TITLES } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

const TYPE_LABEL = { movie: 'Filme', series: 'Série', documentary: 'Documentário', show: 'Show', music: 'Música', kids: 'Infantil', news: 'Notícia', sports: 'Esporte' }

function TrailerModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <div className="animate-fade-up w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold">Trailer — {item.title}</p>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10" aria-label="Fechar trailer">
            <Icon path={paths.close} />
          </button>
        </div>
        <video src={item.trailer} poster={imageFor(`${item.id}-bd`, 1280, 720)} controls autoPlay className="aspect-video w-full rounded-2xl bg-black ring-1 ring-white/10" />
      </div>
    </div>
  )
}

export default function TitleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = getTitle(id)
  const { isInList, isFavorite, toggleList, toggleFavorite, progressOf, notify } = useApp()
  const [trailer, setTrailer] = useState(false)
  const [season, setSeason] = useState(1)

  const similar = useMemo(
    () => TITLES.filter((t) => t.id !== id && t.genres.some((g) => item?.genres.includes(g))).slice(0, 12),
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
  const seasons = item.seasons || []
  const currentSeason = seasons.find((s) => s.number === season) || seasons[0]

  return (
    <div className="pb-16">
      {/* backdrop */}
      <div className="relative h-[52vh] min-h-[380px] w-full overflow-hidden">
        <img src={imageFor(`${item.id}-bd`, 1600, 900)} alt="" className="animate-kenburns h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 to-transparent" />
      </div>

      <div className="relative z-10 -mt-40 px-4 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <img
            src={imageFor(`${item.id}-po`, 320, 480)}
            alt={item.title}
            className="hidden w-52 shrink-0 rounded-2xl object-cover ring-1 ring-white/10 lg:block"
          />

          <div className="max-w-3xl">
            {item.badge && <Pill tone={item.badge === 'Ao vivo' ? 'red' : 'gold'} className="mb-3">{item.badge}</Pill>}
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{item.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/75">
              <span className="flex items-center gap-1 font-semibold text-mega-gold">
                <Icon path={paths.star} fill className="h-4 w-4" /> {item.score}
              </span>
              <span>{item.year}</span>
              <AgeRating value={item.rating} />
              <span>{item.genres.join(' • ')}</span>
              <span>{item.type === 'series' ? `${seasons.length} temporadas` : `${item.duration} min`}</span>
              <Pill tone="outline">{TYPE_LABEL[item.type]}</Pill>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate(`/assistir/${item.id}`)}
                className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.03] hover:bg-white/90"
              >
                <Icon path={paths.play} fill className="h-5 w-5" /> ASSISTIR AGORA
              </button>
              <button
                onClick={() => setTrailer(true)}
                className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:bg-white/15"
              >
                <Icon path={paths.film} className="h-5 w-5" /> TRAILER
              </button>
              <button
                onClick={() => toggleList(item.id, item.title)}
                className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:bg-white/15"
              >
                <Icon path={listed ? paths.check : paths.plus} className="h-5 w-5" />
                {listed ? 'NA MINHA LISTA' : 'MINHA LISTA'}
              </button>
              <button
                onClick={() => toggleFavorite(item.id, item.title)}
                className={`glass flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:bg-white/15 ${fav ? 'text-mega-red-bright' : ''}`}
                aria-label="Favoritar"
              >
                <Icon path={paths.heart} fill={fav} className="h-5 w-5" />
              </button>
              <button
                onClick={() => notify('Link copiado para compartilhar')}
                className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:bg-white/15"
                aria-label="Compartilhar"
              >
                <Icon path={paths.share} className="h-5 w-5" />
              </button>
            </div>

            {progress?.percent > 0 && progress.percent < 97 && (
              <div className="mt-5 max-w-md">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Continuar de onde parou</span>
                  <span>{Math.round(progress.percent)}%</span>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/15">
                  <div className="h-full bg-mega-red" style={{ width: `${progress.percent}%` }} />
                </div>
              </div>
            )}

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/75">{item.synopsis}</p>

            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              {item.director && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-white/40">Direção</dt>
                  <dd className="mt-0.5 text-white/85">{item.director}</dd>
                </div>
              )}
              {item.cast?.length > 0 && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-white/40">Elenco</dt>
                  <dd className="mt-0.5 text-white/85">{item.cast.join(', ')}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs uppercase tracking-wide text-white/40">Disponibilidade</dt>
                <dd className="mt-0.5 text-white/85">{item.free ? 'Gratuito com anúncios' : 'Assinantes Premium / Ultra'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-white/40">Qualidade máxima</dt>
                <dd className="mt-0.5 text-white/85">{item.qualities.some((q) => q.label.includes('1080')) ? 'Full HD 1080p' : 'HD 720p'}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* series episodes */}
        {item.type === 'series' && currentSeason && (
          <section className="mt-12">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Episódios</h2>
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
                {seasons.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => setSeason(s.number)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      s.number === season ? 'bg-mega-red text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Temporada {s.number}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {currentSeason.episodes.map((ep) => (
                <button
                  key={ep.number}
                  onClick={() => navigate(`/assistir/${item.id}?s=${currentSeason.number}&e=${ep.number}`)}
                  className="group flex items-center gap-4 rounded-2xl p-2.5 text-left transition hover:bg-white/5"
                >
                  <span className="w-6 shrink-0 text-center text-lg font-bold text-white/40 group-hover:text-mega-red-bright">
                    {ep.number}
                  </span>
                  <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-xl bg-ink-800 ring-1 ring-white/5">
                    <img src={imageFor(`${item.id}-s${currentSeason.number}e${ep.number}`, 400, 225)} alt="" loading="lazy" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <Icon path={paths.play} fill className="h-7 w-7 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="truncate text-sm font-semibold">{ep.number}. {ep.title}</h3>
                      <span className="shrink-0 text-xs text-white/50">{ep.duration} min</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-white/55">{ep.synopsis}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-8">
        <ContentRow title="Conteúdos semelhantes" items={similar} />
      </div>

      {trailer && <TrailerModal item={item} onClose={() => setTrailer(false)} />}
    </div>
  )
}
