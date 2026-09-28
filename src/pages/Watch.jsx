import { Link, useParams } from 'react-router-dom'
import { channels, getVideo, videos } from '../data/videos.js'

function ActionButton({ icon, label }) {
  return (
    <button className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium hover:bg-white/15">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d={icon} />
      </svg>
      {label}
    </button>
  )
}

export default function Watch() {
  const { id } = useParams()
  const video = getVideo(id)

  if (!video) {
    return (
      <div className="p-10 text-center text-white/70">
        Vídeo não encontrado.{' '}
        <Link to="/" className="text-sky-400 underline">
          Voltar ao início
        </Link>
      </div>
    )
  }

  const ch = channels[video.channel]
  const related = videos.filter((v) => v.id !== video.id)

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 lg:flex-row">
      <div className="min-w-0 flex-1">
        <div
          className={`relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br ${video.gradient}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </div>

        <h1 className="mt-4 text-xl font-semibold leading-snug">{video.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${ch.color}`}
          >
            {ch.initials}
          </span>
          <div className="mr-2">
            <p className="text-sm font-medium">{ch.name}</p>
            <p className="text-xs text-white/60">1,2 mi de inscritos</p>
          </div>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
            Inscrever-se
          </button>
          <div className="ml-auto flex flex-wrap gap-2">
            <ActionButton
              icon="M7 11v10H4a1 1 0 01-1-1v-8a1 1 0 011-1h3zm0 0l4.5-8a2 2 0 012.9 2.3L13 9h5.5a2 2 0 011.9 2.6l-2 6A2 2 0 0116.5 19H7"
              label="Gostei"
            />
            <ActionButton
              icon="M4 12v7a1 1 0 001 1h12.5a2 2 0 001.9-1.4l2-6A2 2 0 0019.5 10H14l1.4-4.7A2 2 0 0012.5 3L8 11v8"
              label="Compartilhar"
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white/5 p-3 text-sm">
          <p className="font-medium">
            {video.views} • {video.uploaded}
          </p>
          <p className="mt-2 whitespace-pre-line text-white/80">
            {video.description}
          </p>
        </div>
      </div>

      <div className="w-full shrink-0 lg:w-[400px]">
        <h2 className="mb-3 text-base font-semibold">A seguir</h2>
        <div className="flex flex-col gap-3">
          {related.map((v) => {
            const rc = channels[v.channel]
            return (
              <Link
                key={v.id}
                to={`/watch/${v.id}`}
                className="group flex gap-3 rounded-lg p-1 hover:bg-white/5"
              >
                <div
                  className={`relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${v.gradient}`}
                >
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium">
                    {v.duration}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/60">{rc.name}</p>
                  <p className="text-xs text-white/60">
                    {v.views} • {v.uploaded}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
