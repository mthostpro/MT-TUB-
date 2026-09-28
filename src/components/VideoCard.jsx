import { Link } from 'react-router-dom'
import { channels } from '../data/videos.js'
import ChannelAvatar from './ChannelAvatar.jsx'

export default function VideoCard({ video }) {
  const ch = channels[video.channel]

  return (
    <Link to={`/watch/${video.id}`} className="group block">
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br ${video.gradient}`}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <span
          className={`absolute bottom-1.5 right-1.5 rounded px-1 py-0.5 text-xs font-medium ${
            video.live ? 'bg-[#ff0000] text-white' : 'bg-black/80 text-white'
          }`}
        >
          {video.duration}
        </span>
      </div>

      <div className="mt-3 flex gap-3">
        <ChannelAvatar channel={video.channel} size="md" />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-snug">
            {video.title}
          </h3>
          <p className="mt-1 text-[13px] text-white/60 hover:text-white">
            {ch.name}
          </p>
          <p className="text-[13px] text-white/60">
            {video.views} • {video.uploaded}
          </p>
        </div>
      </div>
    </Link>
  )
}
