import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Icon({ path, className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    // search is visual only for now
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-[#0f0f0f]/95 px-3 backdrop-blur md:gap-4 md:px-4">
      <button
        onClick={onToggleSidebar}
        aria-label="Alternar menu"
        className="rounded-full p-2 hover:bg-white/10"
      >
        <Icon path="M4 6h16M4 12h16M4 18h16" />
      </button>

      <Link to="/" className="flex items-center gap-1.5">
        <span className="flex h-7 w-9 items-center justify-center rounded-md bg-red-600 text-sm font-black text-white">
          MT
        </span>
        <span className="hidden text-xl font-bold tracking-tight sm:block">
          TUB
        </span>
      </Link>

      <form
        onSubmit={submit}
        className="mx-auto flex w-full max-w-2xl items-center"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar"
          className="h-10 w-full rounded-l-full border border-white/15 bg-[#121212] px-4 text-sm outline-none placeholder:text-white/40 focus:border-sky-500"
        />
        <button
          type="submit"
          aria-label="Pesquisar"
          className="flex h-10 items-center rounded-r-full border border-l-0 border-white/15 bg-white/10 px-5 hover:bg-white/15"
        >
          <Icon path="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" className="h-5 w-5" />
        </button>
      </form>

      <div className="ml-auto flex items-center gap-1 md:gap-2">
        <button
          aria-label="Criar"
          className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/15 sm:flex"
        >
          <Icon path="M12 5v14M5 12h14" className="h-5 w-5" />
          Criar
        </button>
        <button aria-label="Notificações" className="rounded-full p-2 hover:bg-white/10">
          <Icon path="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
        </button>
        <button
          onClick={() => navigate('/')}
          aria-label="Perfil"
          className="ml-1 h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-semibold"
        >
          <span className="flex h-full w-full items-center justify-center">R</span>
        </button>
      </div>
    </header>
  )
}
