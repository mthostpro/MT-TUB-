import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon, { paths } from '../components/Icons.jsx'
import { TITLES, imageFor } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

// Simplified, safe interface for children. Content is limited to L-rated
// kids titles and the parent PIN is required to leave the mode.
function PinGate({ onClose, onSuccess }) {
  const { parentalPin } = useApp()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (pin === parentalPin) onSuccess()
    else { setError(true); setPin('') }
  }

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/85 p-4">
      <form onSubmit={submit} className="glass-strong animate-fade-up w-full max-w-sm rounded-3xl p-6 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mega-gold/20 text-2xl">🔒</span>
        <h2 className="mt-4 text-lg font-bold">Controle parental</h2>
        <p className="mt-1 text-sm text-white/60">Digite o PIN para sair do modo infantil.</p>
        <input
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false) }}
          inputMode="numeric"
          maxLength={4}
          autoFocus
          placeholder="••••"
          aria-label="PIN"
          className={`mt-5 h-14 w-full rounded-2xl border bg-white/5 text-center text-2xl tracking-[0.5em] outline-none ${error ? 'border-mega-red' : 'border-white/10 focus:border-mega-gold/60'}`}
        />
        {error && <p className="mt-2 text-xs text-mega-red-bright">PIN incorreto. Tente novamente.</p>}
        <p className="mt-2 text-[11px] text-white/35">Dica de demonstração: o PIN padrão é 1234.</p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-full bg-white/10 py-2.5 text-sm font-semibold hover:bg-white/20">Cancelar</button>
          <button type="submit" className="flex-1 rounded-full bg-mega-gold py-2.5 text-sm font-bold text-black hover:brightness-110">Confirmar</button>
        </div>
      </form>
    </div>
  )
}

export default function Kids() {
  const { kidsMode, setKidsMode, notify } = useApp()
  const [gate, setGate] = useState(false)

  const items = useMemo(() => TITLES.filter((t) => t.type === 'kids' || t.tags.includes('infantil') || t.rating === 'L'), [])

  const groups = [
    { title: 'Desenhos animados', items: items.filter((t) => t.type === 'kids') },
    { title: 'Para toda a família', items: items.filter((t) => t.rating === 'L' && t.type !== 'kids') },
  ]

  function exit() {
    setKidsMode(false)
    notify('Modo infantil desativado')
    setGate(false)
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-[#1a1233] via-ink-950 to-ink-950 pb-16">
      <div className="px-4 pt-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-mega-gold/20 text-3xl">🧒</span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">MEGA Kids</h1>
              <p className="text-sm text-white/60">Um espaço seguro, colorido e só com conteúdo aprovado.</p>
            </div>
          </div>
          <button
            onClick={() => (kidsMode ? setGate(true) : setKidsMode(true))}
            className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:bg-white/15"
          >
            <Icon path={paths.shield} className="h-4 w-4" /> {kidsMode ? 'Sair do modo infantil' : 'Ativar modo infantil'}
          </button>
        </div>
      </div>

      {groups.map((g) => g.items.length > 0 && (
        <section key={g.title} className="mt-10">
          <h2 className="mb-4 px-4 text-xl font-bold lg:px-8">{g.title}</h2>
          <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 lg:px-8">
            {g.items.map((t) => (
              <Link
                key={t.id}
                to={`/titulo/${t.id}`}
                className="group w-56 shrink-0 sm:w-64"
              >
                <div className="relative aspect-video overflow-hidden rounded-3xl bg-ink-800 ring-2 ring-white/10 transition group-hover:ring-mega-gold">
                  <img src={imageFor(`${t.id}-bd`, 600, 340)} alt={t.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-3 py-1 text-xs font-bold">{t.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-12 px-4 lg:px-8">
        <div className="glass flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold"><Icon path={paths.shield} className="h-5 w-5 text-mega-gold" /> Controle parental ativo</h3>
            <p className="mt-1 text-sm text-white/60">PIN obrigatório para sair, categorias bloqueadas e limite de tempo configurável no Perfil.</p>
          </div>
          <Link to="/perfil" className="rounded-full bg-mega-gold px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-110">Configurar</Link>
        </div>
      </section>

      {gate && <PinGate onClose={() => setGate(false)} onSuccess={exit} />}
    </div>
  )
}
