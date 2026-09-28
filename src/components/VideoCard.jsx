import { Link } from 'react-router-dom'
import { channels } from '../data/videos.js'

export default function VideoCard({ video }) {
  const ch = channels[video.channel]

  return (
    <Link to={`/watch/${video.id}`} className="group block">
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br ${video.gradient}`}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-90">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <span
          className={`absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 text-xs font-medium ${
            video.live ? 'bg-red-600 text-white' : 'bg-black/80 text-white'
          }`}
        >
          {video.duration}
        </span>
      </div>

      <div className="mt-3 flex gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${ch.color}`}
        >
          {ch.initials}
        </span>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-white/60">{ch.name}</p>
          <p className="text-xs text-white/60">
            {video.views} • {video.uploaded}
          </p>
        </div>
      </div>
    </Link>
  )
}
