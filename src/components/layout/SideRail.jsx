import { NavLink } from 'react-router-dom'
import Icon, { paths } from '../Icons.jsx'
import { RAIL } from '../../data/catalog.js'

// Icon rail for large screens / Smart TV layouts.
export default function SideRail() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[76px] shrink-0 flex-col items-center gap-1 border-r border-white/5 py-4 xl:flex">
      {RAIL.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          title={item.label}
          className={({ isActive }) =>
            `group flex w-16 flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[10px] font-medium transition ${
              isActive ? 'bg-mega-red/15 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon path={paths[item.icon]} className={`h-5 w-5 ${isActive ? 'text-mega-red-bright' : ''}`} />
              <span className="truncate">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </aside>
  )
}
