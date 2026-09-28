import { Link } from 'react-router-dom'
import { useState } from 'react'

function Icon({ path, className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  )
}

export default function Header({ onToggleSidebar }) {
  const [query, setQuery] = useState('')

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 bg-[#0f0f0f] px-4">
      <button
        onClick={onToggleSidebar}
        aria-label="Alternar menu"
        className="rounded-full p-2 hover:bg-white/10"
      >
        <Icon path="M4 6h16M4 12h16M4 18h16" />
      </button>

      <Link to="/" className="flex items-center gap-1">
        <span className="relative flex h-[22px] w-[32px] items-center justify-center rounded-[5px] bg-[#ff0000]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="text-[19px] font-bold tracking-[-0.6px]">MT-TUB</span>
      </Link>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto hidden max-w-[640px] flex-1 items-center sm:flex"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar"
          className="h-10 w-full rounded-l-full border border-[#303030] bg-[#121212] px-4 text-[15px] outline-none placeholder:text-white/50 focus:border-[#3ea6ff]"
        />
        <button
          type="submit"
          aria-label="Pesquisar"
          className="flex h-10 items-center rounded-r-full border border-l-0 border-[#303030] bg-[#222222] px-5 hover:bg-[#303030]"
        >
          <Icon
            path="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            className="h-5 w-5"
          />
        </button>
        <button
          aria-label="Pesquisar por voz"
          className="ml-3 rounded-full bg-[#181818] p-2.5 hover:bg-[#303030]"
        >
          <Icon path="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3zM19 11a7 7 0 01-14 0M12 18v3" />
        </button>
      </form>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          aria-label="Criar"
          className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20 sm:flex"
        >
          <Icon path="M12 5v14M5 12h14" className="h-5 w-5" />
          Criar
        </button>
        <button
          aria-label="Notificações"
          className="rounded-full p-2 hover:bg-white/10"
        >
          <Icon path="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
        </button>
        <button
          aria-label="Perfil"
          className="ml-1 h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-semibold text-white"
        >
          R
        </button>
      </div>
    </header>
  )
}
