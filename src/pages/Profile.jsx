import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon, { paths } from '../components/Icons.jsx'
import { Pill } from '../components/Badges.jsx'
import { useApp } from '../context/AppContext.jsx'

const CATEGORIES = ['Terror', 'Violência', 'Linguagem forte', 'Conteúdo adulto']
const DEVICES = [
  { name: 'Smart TV — Sala', type: 'Samsung 55"', last: 'ativo agora' },
  { name: 'Celular — Ana', type: 'Android', last: 'há 2 horas' },
  { name: 'Notebook', type: 'Chrome / Windows', last: 'ontem' },
]

function Card({ title, icon, children, action }) {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-bold"><Icon path={paths[icon]} className="h-5 w-5 text-mega-red-bright" /> {title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-mega-red' : 'bg-white/15'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

export default function Profile() {
  const { profile, updateProfile, kidsMode, setKidsMode, parentalPin, notify, myList, favorites, history } = useApp()

  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [pin, setPin] = useState(parentalPin)
  const [autoplay, setAutoplay] = useState(true)
  const [quality, setQuality] = useState('Auto (melhor disponível)')
  const [blocked, setBlocked] = useState(['Conteúdo adulto'])
  const [limit, setLimit] = useState('Sem limite')

  function saveIdentity(e) {
    e.preventDefault()
    updateProfile({ name, email, initials: name.slice(0, 2).toUpperCase() })
    notify('Perfil atualizado')
  }

  return (
    <div className="px-4 pb-16 pt-8 lg:px-6">
      <div className="mx-auto max-w-5xl">
        {/* header */}
        <div className="glass mb-6 flex flex-col items-center gap-5 rounded-3xl p-6 sm:flex-row sm:items-center">
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mega-red-bright to-mega-red-deep text-3xl font-extrabold">
            {profile.initials}
          </span>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold">{profile.name}</h1>
            <p className="text-sm text-white/55">{profile.email}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Pill tone="gold">Plano {profile.plan}</Pill>
              <Pill tone="outline">{myList.length} na lista</Pill>
              <Pill tone="outline">{favorites.length} favoritos</Pill>
              <Pill tone="outline">{history.length} no histórico</Pill>
            </div>
          </div>
          <Link to="/planos" className="sm:ml-auto rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white/90">
            Gerenciar assinatura
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Dados da conta" icon="user">
            <form onSubmit={saveIdentity} className="flex flex-col gap-4">
              <label className="text-sm">
                <span className="text-white/60">Nome</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-mega-red/60" />
              </label>
              <label className="text-sm">
                <span className="text-white/60">E-mail</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-mega-red/60" />
              </label>
              <button type="submit" className="self-start rounded-full bg-mega-red px-5 py-2.5 text-sm font-bold transition hover:bg-mega-red-bright">Salvar alterações</button>
            </form>
          </Card>

          <Card title="Preferências de reprodução" icon="gear">
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Reprodução automática</p>
                  <p className="text-xs text-white/50">Inicia o próximo episódio automaticamente</p>
                </div>
                <Toggle checked={autoplay} onChange={setAutoplay} label="Reprodução automática" />
              </div>
              <div>
                <p className="font-medium">Qualidade padrão</p>
                <select value={quality} onChange={(e) => setQuality(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-mega-red/60">
                  {['Auto (melhor disponível)', '4K HDR', '1080p', '720p', 'Economia de dados'].map((q) => <option key={q} className="bg-ink-800">{q}</option>)}
                </select>
              </div>
              <div>
                <p className="font-medium">Idioma da interface</p>
                <select className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-mega-red/60">
                  {['Português (Brasil)', 'English', 'Español'].map((l) => <option key={l} className="bg-ink-800">{l}</option>)}
                </select>
              </div>
            </div>
          </Card>

          <Card
            title="Controle parental"
            icon="shield"
            action={<Toggle checked={kidsMode} onChange={(v) => { setKidsMode(v); notify(v ? 'Modo infantil ativado' : 'Modo infantil desativado') }} label="Modo infantil" />}
          >
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="font-medium">PIN de acesso</p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    inputMode="numeric"
                    aria-label="PIN parental"
                    className="h-11 w-32 rounded-xl border border-white/10 bg-white/5 px-4 text-center tracking-[0.4em] outline-none focus:border-mega-gold/60"
                  />
                  <button onClick={() => notify('PIN parental atualizado')} className="rounded-full bg-white/10 px-4 text-sm font-semibold transition hover:bg-white/20">Atualizar PIN</button>
                </div>
              </div>

              <div>
                <p className="font-medium">Categorias bloqueadas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const on = blocked.includes(c)
                    return (
                      <button
                        key={c}
                        onClick={() => setBlocked((b) => (on ? b.filter((x) => x !== c) : [...b, c]))}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${on ? 'bg-mega-red text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="font-medium">Limite de tempo diário</p>
                <select value={limit} onChange={(e) => setLimit(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-mega-gold/60">
                  {['Sem limite', '30 minutos', '1 hora', '2 horas', '3 horas'].map((l) => <option key={l} className="bg-ink-800">{l}</option>)}
                </select>
              </div>
            </div>
          </Card>

          <Card title="Dispositivos conectados" icon="wifi">
            <div className="flex flex-col divide-y divide-white/5">
              {DEVICES.map((d) => (
                <div key={d.name} className="flex items-center justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-white/50">{d.type} • {d.last}</p>
                  </div>
                  <button onClick={() => notify(`Sessão encerrada em ${d.name}`)} className="rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/15">
                    Encerrar
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <button
          onClick={() => notify('Sessão encerrada (demonstração)')}
          className="mt-6 flex items-center gap-2 rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10"
        >
          <Icon path={paths.logout} className="h-4 w-4" /> Sair da conta
        </button>
      </div>
    </div>
  )
}
