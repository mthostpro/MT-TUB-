import { Link, useParams } from 'react-router-dom'
import { channels, getVideo, videos } from '../data/videos.js'
import ChannelAvatar from '../components/ChannelAvatar.jsx'
import VideoPlayer from '../components/VideoPlayer.jsx'
import Comments from '../components/Comments.jsx'

function Pill({ icon, label }) {
  return (
    <button className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[#272727] px-4 py-2 text-sm font-medium hover:bg-[#3f3f3f]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
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
    <div className="mx-auto flex max-w-[1750px] flex-col gap-6 p-4 lg:flex-row">
      <div className="min-w-0 flex-1">
        <VideoPlayer video={video} />

        <h1 className="mt-3 text-xl font-semibold leading-snug">{video.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <ChannelAvatar channel={video.channel} size="lg" />
          <div className="mr-1">
            <p className="text-base font-medium">{ch.name}</p>
            <p className="text-xs text-white/60">1,2 mi de inscritos</p>
          </div>
          <button className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
            Inscrever-se
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-full bg-[#272727]">
              <button className="flex items-center gap-2 whitespace-nowrap rounded-l-full py-2 pl-4 pr-3 text-sm font-medium hover:bg-[#3f3f3f]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M7 11v10H4v-9a1 1 0 011-1h2zm0 0l4.5-8a2 2 0 012.9 2.3L13 9h5.5a2 2 0 011.9 2.6l-2 6A2 2 0 0116.5 19H7" />
                </svg>
                12 mil
              </button>
              <span className="h-6 w-px bg-white/20" />
              <button className="rounded-r-full py-2 pl-3 pr-4 hover:bg-[#3f3f3f]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 rotate-180"
                >
                  <path d="M7 11v10H4v-9a1 1 0 011-1h2zm0 0l4.5-8a2 2 0 012.9 2.3L13 9h5.5a2 2 0 011.9 2.6l-2 6A2 2 0 0116.5 19H7" />
                </svg>
              </button>
            </div>
            <Pill icon="M4 12v7a1 1 0 001 1h12.5a2 2 0 001.9-1.4l2-6A2 2 0 0019.5 10H14l1.4-4.7A2 2 0 0012.5 3L8 11" label="Compartilhar" />
            <Pill icon="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" label="Baixar" />
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[#272727] p-3 text-sm">
          <p className="font-medium">
            {video.views} • {video.uploaded}
          </p>
          <p className="mt-1 whitespace-pre-line">{video.description}</p>
          <button className="mt-2 font-medium text-white/80 hover:text-white">
            ...mostrar mais
          </button>
        </div>

        <Comments />
      </div>

      <div className="w-full shrink-0 lg:w-[402px]">
        <h2 className="mb-3 text-base font-semibold">A seguir</h2>
        <div className="flex flex-col gap-3">
          {related.map((v) => (
            <Link
              key={v.id}
              to={`/watch/${v.id}`}
              className="group flex gap-3"
            >
              <div
                className={`relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${v.gradient}`}
              >
                <span
                  className={`absolute bottom-1 right-1 rounded px-1 py-0.5 text-[10px] font-medium ${
                    v.live ? 'bg-[#ff0000] text-white' : 'bg-black/80 text-white'
                  }`}
                >
                  {v.duration}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                  {v.title}
                </h3>
                <p className="mt-1 text-xs text-white/60">{channels[v.channel].name}</p>
                <p className="text-xs text-white/60">
                  {v.views} • {v.uploaded}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
