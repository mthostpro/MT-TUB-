import { useEffect, useState } from 'react'
import Icon, { paths } from '../components/Icons.jsx'
import { listPublishedVideos, publishVideo, slackStatus } from '../lib/api.js'
import { registerPublished } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

const TYPES = [
  { value: 'movie', label: 'Filme' },
  { value: 'series', label: 'Série' },
  { value: 'documentary', label: 'Documentário' },
  { value: 'show', label: 'Programa' },
  { value: 'music', label: 'Música' },
  { value: 'kids', label: 'Infantil' },
]

const RATINGS = ['L', '10', '12', '14', '16', '18']

const emptyForm = () => ({
  title: '',
  type: 'movie',
  year: new Date().getFullYear(),
  genres: '',
  rating: 'L',
  duration: 100,
  score: 8,
  badge: 'Novo',
  synopsis: '',
})

const FIELD = 'h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-mega-red/60 focus:bg-white/10'
const LABEL = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/40'

export default function Admin() {
  const { notify } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [videos, setVideos] = useState([])
  const [slack, setSlack] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    listPublishedVideos().then(setVideos).catch(() => {})
    slackStatus().then(setSlack).catch(() => {})
  }, [])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { video, slack: result } = await publishVideo(form)
      const next = await listPublishedVideos()
      setVideos(next)
      registerPublished(next)
      setForm(emptyForm())
      notify(`"${video.title}" publicado`)
      if (!result.configured) notify('Slack não configurado — nenhuma notificação enviada')
      else if (result.failed.length) notify(`Slack: falha em ${result.failed.length} transporte(s)`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mega-red/15 text-mega-red-bright">
          <Icon path={paths.chart} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Painel administrativo</h1>
          <p className="text-sm text-white/55">Publique um vídeo e notifique o canal do Slack automaticamente.</p>
        </div>
      </div>

      <div className="glass mt-6 flex flex-wrap items-center gap-3 rounded-2xl p-4 text-sm">
        <Icon path={paths.bell} className={`h-5 w-5 ${slack?.configured ? 'text-mega-gold' : 'text-white/40'}`} />
        {slack?.configured ? (
          <p className="text-white/80">
            Slack conectado via <span className="font-semibold text-white">{slack.transports.join(', ')}</span>.
          </p>
        ) : (
          <p className="text-white/70">
            Nenhum transporte Slack configurado. Defina <code className="text-mega-gold">SLACK_WEBHOOK_URL</code>,{' '}
            <code className="text-mega-gold">SLACK_WORKFLOW_WEBHOOK_URL</code> ou{' '}
            <code className="text-mega-gold">SLACK_BOT_TOKEN</code> + <code className="text-mega-gold">SLACK_CHANNEL</code>{' '}
            nos segredos do app.
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={submit} className="glass-strong rounded-2xl p-5">
          <h2 className="mb-4 text-lg font-bold">Novo vídeo</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className={LABEL} htmlFor="title">Título</label>
              <input id="title" value={form.title} onChange={set('title')} required placeholder="Nome do vídeo" className={FIELD} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={LABEL} htmlFor="type">Tipo</label>
                <select id="type" value={form.type} onChange={set('type')} className={FIELD}>
                  {TYPES.map((t) => <option key={t.value} value={t.value} className="bg-ink-900">{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL} htmlFor="year">Ano</label>
                <input id="year" type="number" value={form.year} onChange={set('year')} className={FIELD} />
              </div>
              <div>
                <label className={LABEL} htmlFor="duration">Duração (min)</label>
                <input id="duration" type="number" value={form.duration} onChange={set('duration')} className={FIELD} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="genres">Gêneros (separados por vírgula)</label>
                <input id="genres" value={form.genres} onChange={set('genres')} placeholder="Drama, Aventura" className={FIELD} />
              </div>
              <div>
                <label className={LABEL} htmlFor="rating">Classificação</label>
                <select id="rating" value={form.rating} onChange={set('rating')} className={FIELD}>
                  {RATINGS.map((r) => <option key={r} value={r} className="bg-ink-900">{r}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={LABEL} htmlFor="synopsis">Sinopse</label>
              <textarea id="synopsis" value={form.synopsis} onChange={set('synopsis')} rows={3} className={`${FIELD} h-auto py-2.5`} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL} htmlFor="badge">Selo</label>
                <input id="badge" value={form.badge} onChange={set('badge')} className={FIELD} />
              </div>
              <div>
                <label className={LABEL} htmlFor="score">Nota</label>
                <input id="score" type="number" step="0.1" value={form.score} onChange={set('score')} className={FIELD} />
              </div>
            </div>
          </div>

          {error && <p className="mt-4 rounded-xl bg-mega-red/15 px-3 py-2 text-sm text-mega-red-bright">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-50"
          >
            <Icon path={paths.plus} className="h-5 w-5" />
            {busy ? 'Publicando...' : 'Publicar e notificar o Slack'}
          </button>
        </form>

        <section className="glass rounded-2xl p-5">
          <h2 className="mb-4 text-lg font-bold">Publicados</h2>
          {videos.length === 0 ? (
            <p className="text-sm text-white/55">Nenhum vídeo publicado ainda.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {videos.map((v) => (
                <li key={v.id} className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mega-red/15 text-mega-red-bright">
                    <Icon path={paths.film} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{v.title}</p>
                    <p className="text-xs text-white/50">
                      {v.year} • {v.genres?.join(', ') || 'sem gênero'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
