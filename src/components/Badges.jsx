// Age rating chip + generic pill used across cards and detail pages.

const RATING_STYLES = {
  L: 'border-emerald-400/60 text-emerald-300',
  '10': 'border-sky-400/60 text-sky-300',
  '12': 'border-amber-400/60 text-amber-300',
  '14': 'border-orange-400/60 text-orange-300',
  '16': 'border-red-400/60 text-red-300',
  '18': 'border-red-500/70 text-red-400',
}

export function AgeRating({ value, className = '' }) {
  if (!value) return null
  return (
    <span
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px] font-bold ${
        RATING_STYLES[value] || 'border-white/30 text-white/70'
      } ${className}`}
      title={`Classificação indicativa ${value}`}
    >
      {value}
    </span>
  )
}

export function Pill({ children, className = '', tone = 'default' }) {
  const tones = {
    default: 'bg-white/10 text-white/85',
    red: 'bg-mega-red text-white',
    gold: 'bg-mega-gold/15 text-mega-gold',
    outline: 'border border-white/20 text-white/80',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function LiveBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded bg-mega-red px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${className}`}>
      <span className="animate-live h-1.5 w-1.5 rounded-full bg-white" />
      Ao vivo
    </span>
  )
}
