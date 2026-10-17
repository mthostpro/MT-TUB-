import { Link } from 'react-router-dom'
import logo from '../assets/brand/mt-tub-logo.webp'

// MT TUB logo + MEGA STREAMING wordmark.
export default function Brand({ compact = false, to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2" aria-label="MEGA STREAMING — início">
      <img
        src={logo}
        alt="MT TUB"
        className={`rounded-lg object-cover shadow-[0_0_18px_-4px_rgba(225,29,46,0.8)] ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}
      />
      {!compact && (
        <span className="brand-wordmark text-[22px] text-white">
          MEGA<span className="text-mega-red-bright"> STREAMING</span>
        </span>
      )}
    </Link>
  )
}
