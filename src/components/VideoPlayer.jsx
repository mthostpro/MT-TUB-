function Ctrl({ path, className = 'h-6 w-6', fill = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  )
}

export default function VideoPlayer({ video }) {
  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient}`} />

      <button
        aria-label="Reproduzir"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition group-hover:bg-[#ff0000]">
          <svg viewBox="0 0 24 24" className="h-9 w-9 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-3 pb-2 pt-10">
        <div className="relative h-1 w-full rounded-full bg-white/30">
          <div className="absolute inset-y-0 left-0 w-[35%] rounded-full bg-[#ff0000]" />
          <div className="absolute left-[35%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff0000]" />
        </div>

        <div className="mt-2 flex items-center gap-4 text-white">
          <button aria-label="Pausar">
            <Ctrl path="M9 6v12M15 6v12" className="h-6 w-6" />
          </button>
          <button aria-label="Próximo">
            <Ctrl path="M6 6l8 6-8 6V6zM18 6v12" fill />
          </button>
          <button aria-label="Volume">
            <Ctrl path="M11 5L6 9H3v6h3l5 4V5zM16 9a4 4 0 010 6" />
          </button>
          <span className="text-xs tabular-nums">7:32 / {video.duration}</span>

          <div className="ml-auto flex items-center gap-4">
            <button aria-label="Configurações">
              <Ctrl path="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.1A1.6 1.6 0 007 19.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003 15H3a2 2 0 110-4h.1A1.6 1.6 0 004.6 9l-.1-.1a2 2 0 112.8-2.8l.1.1A1.6 1.6 0 0010 5V5a2 2 0 114 0v.1a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8" />
            </button>
            <button aria-label="Miniplayer">
              <Ctrl path="M3 5h18v14H3zM12 10h7v6h-7z" />
            </button>
            <button aria-label="Tela cheia">
              <Ctrl path="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
