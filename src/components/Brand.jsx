import { Link } from 'react-router-dom'

// MEGA STREAMING wordmark + play glyph.
export default function Brand({ compact = false, to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2" aria-label="MEGA STREAMING — início">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-mega-red-bright to-mega-red-deep shadow-[0_0_18px_-2px_rgba(225,29,46,0.7)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      {!compact && (
        <span className="brand-wordmark text-[22px] text-white">
          MEGA<span className="text-mega-red-bright"> STREAMING</span>
        </span>
      )}
    </Link>
  )
}
