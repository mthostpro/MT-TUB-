// Shared line-icon set for MEGA STREAMING.
// Every icon renders a single <path> (or a small group) on a 24x24 grid.

export function Icon({ path, className = 'h-5 w-5', fill = false, strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

export const paths = {
  play: 'M8 5v14l11-7z',
  pause: 'M9 5v14M15 5v14',
  next: 'M6 5l9 7-9 7V5zM18 5v14',
  prev: 'M18 19l-9-7 9-7v14zM6 5v14',
  back10: 'M11 8H7l2-2M7 8a8 8 0 116 13',
  fwd10: 'M13 8h4l-2-2M17 8a8 8 0 10-6 13',
  volume: 'M11 5L6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 010 7M18.5 6a8 8 0 010 12',
  mute: 'M11 5L6 9H3v6h3l5 4V5zM17 9l4 6M21 9l-4 6',
  fullscreen: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  exitFullscreen: 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5',
  pip: 'M3 5h18v14H3zM12 11h7v5h-7z',
  gear: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.1A1.6 1.6 0 007 19.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003 15H3a2 2 0 110-4h.1A1.6 1.6 0 004.6 9l-.1-.1a2 2 0 112.8-2.8l.1.1A1.6 1.6 0 0010 5V5a2 2 0 114 0v.1a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8',
  captions: 'M4 5h16v14H4zM7 12h3M14 12h3M7 15h10',
  audio: 'M12 3v18M8 8v8M16 8v8M4 11v2M20 11v2',
  speed: 'M12 20a8 8 0 100-16 8 8 0 000 16zM12 12l4-4',
  cast: 'M3 7V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-6M3 15a6 6 0 016 6M3 19a2 2 0 002 2M3 11a10 10 0 0110 10',
  cinema: 'M3 5h18v14H3zM7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 13l4 4L19 7',
  heart: 'M12 20s-7-4.6-7-9.6A4.4 4.4 0 0112 7a4.4 4.4 0 017 3.4C19 15.4 12 20 12 20z',
  info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h.01',
  star: 'M12 3l2.9 5.9 6.1.9-4.5 4.3 1.1 6.2L12 17.8 6.4 20.3l1.1-6.2L3 9.8l6.1-.9L12 3z',
  search: 'M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  user: 'M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  chevronLeft: 'M15 6l-6 6 6 6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  home: 'M3 11l9-8 9 8M5 10v10h14V10',
  film: 'M4 4h16v16H4zM4 9h16M4 15h16M9 4v16M15 4v16',
  tv: 'M4 7h16v12H4zM8 3l4 4 4-4',
  live: 'M12 12h.01M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7M5.5 5.5a9 9 0 000 13M18.5 5.5a9 9 0 010 13',
  trophy: 'M8 4h8v5a4 4 0 11-8 0V4zM8 6H5a3 3 0 003 3M16 6h3a3 3 0 01-3 3M9 20h6M12 13v7',
  music: 'M9 18V6l10-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zm10-2a3 3 0 11-6 0 3 3 0 016 0z',
  news: 'M4 5h13v14H4zM17 8h3v9a2 2 0 01-2 2M7 9h7M7 13h7M7 17h4',
  kids: 'M12 21a9 9 0 100-18 9 9 0 000 18zM9 10h.01M15 10h.01M8.5 14.5a4.5 4.5 0 007 0',
  bookmark: 'M6 4h12v17l-6-4-6 4V4z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z',
  download: 'M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2',
  share: 'M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M12 3v13M8 7l4-4 4 4',
  filter: 'M4 5h16M7 12h10M10 19h4',
  clock: 'M12 8v4l3 2M3.5 12a8.5 8.5 0 1017 0 8.5 8.5 0 00-17 0z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
  trash: 'M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13',
  edit: 'M4 20h4l10-10-4-4L4 16v4zM14 6l4 4',
  logout: 'M15 12H4M8 8l-4 4 4 4M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4',
  wifi: 'M5 12a10 10 0 0114 0M8 15a6 6 0 018 0M12 18h.01',
}

export default Icon
