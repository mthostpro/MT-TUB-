import { NavLink } from 'react-router-dom'

const sections = [
  {
    items: [
      { to: '/', label: 'Início', icon: 'M3 11l9-8 9 8M5 10v10h14V10' },
      { to: '/shorts', label: 'Shorts', icon: 'M10 8l6 4-6 4V8zM5 3h14v18H5z' },
      { to: '/inscricoes', label: 'Inscrições', icon: 'M4 6h16M4 12h16M4 18h10' },
    ],
  },
  {
    title: 'Você',
    items: [
      { to: '/historico', label: 'Histórico', icon: 'M12 8v4l3 2M3.5 12a8.5 8.5 0 1017 0 8.5 8.5 0 00-17 0z' },
      { to: '/playlists', label: 'Playlists', icon: 'M4 6h16M4 12h16M4 18h10' },
      { to: '/seus-videos', label: 'Seus vídeos', icon: 'M4 5h16v14H4zM10 9l5 3-5 3z' },
      { to: '/mais-tarde', label: 'Assistir mais tarde', icon: 'M12 8v4l3 2M3.5 12a8.5 8.5 0 1017 0 8.5 8.5 0 00-17 0z' },
      { to: '/curtidos', label: 'Vídeos curtidos', icon: 'M7 11v10H4v-9a1 1 0 011-1h2zm0 0l4.5-8a2 2 0 012.9 2.3L13 9h5.5a2 2 0 011.9 2.6l-2 6A2 2 0 0116.5 19H7' },
    ],
  },
  {
    title: 'Explorar',
    items: [
      { to: '/em-alta', label: 'Em alta', icon: 'M12 2s4 4 4 9a4 4 0 01-8 0c0-1 .5-2 .5-2S6 11 6 14a6 6 0 1012 0c0-5-6-12-6-12z' },
      { to: '/musica', label: 'Música', icon: 'M9 18V6l10-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zm10-2a3 3 0 11-6 0 3 3 0 016 0z' },
      { to: '/jogos', label: 'Jogos', icon: 'M6 12h4M8 10v4M15 11h.01M17.5 13h.01M6 6h12a4 4 0 014 4v4a4 4 0 01-4 4H6a4 4 0 01-4-4v-4a4 4 0 014-4z' },
      { to: '/noticias', label: 'Notícias', icon: 'M4 5h13v14H4zM17 8h3v9a2 2 0 01-2 2M7 9h7M7 13h7M7 17h4' },
    ],
  },
]

function Item({ item, open }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-6 rounded-lg px-3 py-2 text-sm hover:bg-white/10 ${
          isActive ? 'bg-white/10 font-medium' : ''
        } ${open ? '' : 'md:flex-col md:gap-1.5 md:px-1 md:py-4 md:text-[10px]'}`
      }
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 shrink-0"
      >
        <path d={item.icon} />
      </svg>
      <span className={open ? 'truncate' : 'truncate md:hidden'}>{item.label}</span>
    </NavLink>
  )
}

export default function Sidebar({ open }) {
  return (
    <aside
      className={`${
        open ? 'w-60' : 'w-0 md:w-[72px]'
      } shrink-0 overflow-y-auto border-r border-white/5 bg-[#0f0f0f] pb-6 transition-[width] duration-200`}
    >
      <nav className="flex flex-col gap-1 p-2">
        {sections.map((section, i) => (
          <div key={i} className="flex flex-col gap-1">
            {i > 0 && <hr className="my-2 border-white/10" />}
            {section.title && open && (
              <p className="px-3 pb-1 text-base font-semibold">{section.title}</p>
            )}
            {section.items.map((item) => (
              <Item key={item.to} item={item} open={open} />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
