import { useApp } from '../context/AppContext.jsx'

export default function Toasts() {
  const { toasts } = useApp()
  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass-strong animate-float-up rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-2xl"
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
