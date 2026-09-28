import { useState } from 'react'
import VideoCard from '../components/VideoCard.jsx'
import { videos, categories } from '../data/videos.js'

export default function Home({ onlyTrending = false }) {
  const [active, setActive] = useState('Todos')

  const list = onlyTrending
    ? videos.filter((v) => v.live || v.views.includes('mi'))
    : active === 'Todos'
      ? videos
      : videos.filter((v) => v.category === active)

  return (
    <div className="pb-10">
      <div className="sticky top-0 z-20 flex gap-3 overflow-x-auto bg-[#0f0f0f] px-4 py-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active === c
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-8 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  )
}
