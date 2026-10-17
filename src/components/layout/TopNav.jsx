import { useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Brand from '../Brand.jsx'
import Icon, { paths } from '../Icons.jsx'
import { NAV } from '../../data/catalog.js'
import { useApp } from '../../context/AppContext.jsx'
import useClickOutside from '../../hooks/useClickOutside.js'

const NOTIFICATIONS = [
  { id: 1, icon: 'film', title: 'Novo episódio disponível', body: 'Fronteira Digital — T3E1 já está no ar.', time: 'há 12 min' },
  { id: 2, icon: 'live', title: 'Transmissão ao vivo', body: 'MEGA Esportes entrou ao vivo agora.', time: 'há 1 h' },
  { id: 3, icon: 'star', title: 'Estreia hoje', body: 'Noite Neon chegou ao catálogo.', time: 'há 3 h' },
]

function Dropdown({ children, className = '' }) {
  return (
    <div className={`glass-strong animate-float-up absolute right-0 top-[calc(100%+10px)] z-50 rounded-2xl p-2 shadow-2xl ${className}`}>
      {children}
    </div>
  )
}

export default function TopNav() {
  const navigate = useNavigate()
  const { profile, profiles, activeProfile, setActiveProfile, kidsMode, setKidsMode, notify } = useApp()

  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const notifRef = useRef(null)
  const userRef = useRef(null)
  useClickOutside(notifRef, () => setNotifOpen(false), notifOpen)
  useClickOutside(userRef, () => setUserOpen(false), userOpen)

  function submitSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/busca?q=${encodeURIComponent(q)}`)
    setDrawer(false)
  }

  return (
    <>
      <header className="glass-strong sticky top-0 z-40 flex h-16 items-center gap-3 px-4 lg:px-6">
        <button
          onClick={() => setDrawer(true)}
          className="rounded-lg p-2 text-white/80 hover:bg-white/10 xl:hidden"
          aria-label="Abrir menu"
        >
          <Icon path={paths.menu} />
        </button>

        <Brand />

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden w-full max-w-sm items-center md:flex">
          <div className="relative w-full">
            <Icon path={paths.search} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar filmes, séries, canais..."
              aria-label="Buscar"
              className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-sm outline-none transition placeholder:text-white/40 focus:border-mega-red/60 focus:bg-white/10"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Link to="/busca" className="rounded-lg p-2 text-white/80 hover:bg-white/10 md:hidden" aria-label="Buscar">
            <Icon path={paths.search} />
          </Link>

          <button
            onClick={() => { setKidsMode(!kidsMode); notify(kidsMode ? 'Modo infantil desativado' : 'Modo infantil ativado') }}
            className={`hidden rounded-lg p-2 sm:block ${kidsMode ? 'text-mega-gold' : 'text-white/80 hover:bg-white/10'}`}
            aria-label="Modo infantil"
            title="Modo infantil"
          >
            <Icon path={paths.kids} />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen((o) => !o); setUserOpen(false) }}
              className="relative rounded-lg p-2 text-white/80 hover:bg-white/10"
              aria-label="Notificações"
            >
              <Icon path={paths.bell} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-mega-red" />
            </button>
            {notifOpen && (
              <Dropdown className="w-80">
                <p className="px-3 py-2 text-sm font-semibold">Notificações</p>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mega-red/15 text-mega-red-bright">
                      <Icon path={paths[n.icon]} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-white/60">{n.body}</p>
                      <p className="mt-0.5 text-[11px] text-white/40">{n.time}</p>
                    </div>
                  </div>
                ))}
              </Dropdown>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => { setUserOpen((o) => !o); setNotifOpen(false) }}
              className="ml-1 flex items-center gap-2 rounded-full p-0.5 pr-2 hover:bg-white/10"
              aria-label="Perfil"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-mega-red-bright to-mega-red-deep text-xs font-bold">
                {kidsMode ? 'IN' : profile.initials}
              </span>
              <Icon path={paths.chevronDown} className="hidden h-4 w-4 text-white/60 sm:block" />
            </button>
            {userOpen && (
              <Dropdown className="w-60">
                <div className="flex flex-col gap-1 px-1 py-1">
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/40">Perfis</p>
                  {profiles.map((p, i) => (
                    <button
                      key={p.name}
                      onClick={() => { setActiveProfile(i); setKidsMode(!!p.kid); setUserOpen(false) }}
                      className={`flex items-center gap-3 rounded-xl px-2 py-2 text-left text-sm hover:bg-white/5 ${i === activeProfile ? 'bg-white/5' : ''}`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${p.kid ? 'bg-mega-gold/25 text-mega-gold' : 'bg-white/15'}`}>
                        {p.initials}
                      </span>
                      <span className="flex-1 truncate">{p.name}</span>
                      {i === activeProfile && <Icon path={paths.check} className="h-4 w-4 text-mega-red-bright" />}
                    </button>
                  ))}
                </div>
                <hr className="my-1 border-white/10" />
                <Link to="/perfil" onClick={() => setUserOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/5">
                  <Icon path={paths.user} className="h-4 w-4" /> Perfil e preferências
                </Link>
                <Link to="/minha-lista" onClick={() => setUserOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/5">
                  <Icon path={paths.bookmark} className="h-4 w-4" /> Minha Lista
                </Link>
                <Link to="/planos" onClick={() => setUserOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/5">
                  <Icon path={paths.star} className="h-4 w-4" /> Assinatura e planos
                </Link>
                <Link to="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/5">
                  <Icon path={paths.chart} className="h-4 w-4" /> Painel administrativo
                </Link>
                <hr className="my-1 border-white/10" />
                <button
                  onClick={() => { setUserOpen(false); notify('Sessão encerrada (demonstração)') }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                >
                  <Icon path={paths.logout} className="h-4 w-4" /> Sair
                </button>
              </Dropdown>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="glass-strong animate-fade-in absolute left-0 top-0 h-full w-72 overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
              <Brand />
              <button onClick={() => setDrawer(false)} className="rounded-lg p-2 hover:bg-white/10" aria-label="Fechar menu">
                <Icon path={paths.close} />
              </button>
            </div>
            <form onSubmit={submitSearch} className="mb-4">
              <div className="relative">
                <Icon path={paths.search} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-sm outline-none focus:border-mega-red/60"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setDrawer(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`
                  }
                >
                  <Icon path={paths[item.icon]} className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
              <hr className="my-2 border-white/10" />
              {[
                { to: '/favoritos', label: 'Favoritos', icon: 'heart' },
                { to: '/minha-lista', label: 'Minha Lista', icon: 'bookmark' },
                { to: '/planos', label: 'Planos', icon: 'star' },
                { to: '/perfil', label: 'Perfil', icon: 'user' },
                { to: '/admin', label: 'Admin', icon: 'chart' },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setDrawer(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`
                  }
                >
                  <Icon path={paths[item.icon]} className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
