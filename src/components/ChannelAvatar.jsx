import { channels } from '../data/videos.js'

const sizes = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-10 w-10 text-sm',
  xl: 'h-24 w-24 text-2xl',
}

export default function ChannelAvatar({ channel, size = 'md' }) {
  const ch = channels[channel]
  if (!ch) return null
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${ch.color} ${sizes[size]}`}
    >
      {ch.initials}
    </span>
  )
}
