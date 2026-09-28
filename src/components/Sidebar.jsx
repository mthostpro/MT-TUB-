import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Início', icon: 'M3 11l9-8 9 8M5 10v10h14V10' },
  { to: '/em-alta', label: 'Em alta', icon: 'M12 2s4 4 4 9a4 4 0 01-8 0c0-1 .5-2 .5-2S6 11 6 14a6 6 0 1012 0c0-5-6-12-6-12z' },
  { to: '/inscricoes', label: 'Inscrições', icon: 'M4 6h16M4 12h16M4 18h10' },
  { to: '/biblioteca', label: 'Biblioteca', icon: 'M4 4h6v16H4zM14 4l4 16M14 4l-4 16' },
]

export default function Sidebar({ open }) {
  return (
    <aside
      className={`${
        open ? 'w-60' : 'w-0 md:w-20'
      } shrink-0 overflow-hidden border-r border-white/5 bg-[#0f0f0f] transition-all duration-200`}
    >
      <nav className="flex flex-col gap-1 p-2">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `flex items-center gap-5 rounded-lg px-3 py-2.5 text-sm hover:bg-white/10 ${
                isActive ? 'bg-white/10 font-medium' : ''
              } ${open ? '' : 'md:flex-col md:gap-1 md:px-1 md:text-[10px]'}`
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 shrink-0"
            >
              <path d={it.icon} />
            </svg>
            <span className={open ? '' : 'md:hidden'}>{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
