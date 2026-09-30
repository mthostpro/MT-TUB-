import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import VideoPlayer from '../player/VideoPlayer.jsx'
import Icon, { paths } from '../components/Icons.jsx'
import { LiveBadge, Pill } from '../components/Badges.jsx'
import { buildEPG, getChannel, HLS_STREAM, LIVE_CHANNELS } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

const nf = new Intl.NumberFormat('pt-BR')
const REACTIONS = ['🔥', '👏', '😂', '❤️', '⚽', '🎉']

const SEED_CHAT = [
  { id: 1, user: 'lucas_br', color: 'text-emerald-400', text: 'Boa noite a todos! 🔥' },
  { id: 2, user: 'mariana.tv', color: 'text-sky-400', text: 'Esse canal é o melhor pra acompanhar' },
  { id: 3, user: 'pedro.gamer', color: 'text-fuchsia-400', text: 'Qualidade tá incrível hoje' },
  { id: 4, user: 'ana_clara', color: 'text-amber-400', text: 'Alguém mais assistindo do celular?' },
]

function LiveChat({ channel }) {
  const [messages, setMessages] = useState(SEED_CHAT)
  const [text, setText] = useState('')
  const [count, setCount] = useState(0)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  function send(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setMessages((m) => [...m, { id: Date.now(), user: 'você', color: 'text-mega-red-bright', text: t }])
    setText('')
  }

  function react(emoji) {
    setCount((c) => c + 1)
    setMessages((m) => [...m, { id: Date.now() + Math.random(), user: 'você', color: 'text-mega-red-bright', text: emoji }])
  }

  return (
    <div className="glass flex h-[520px] flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Chat ao vivo</p>
          <p className="text-xs text-white/50">{nf.format(channel.viewers + count)} espectadores</p>
        </div>
        <LiveBadge />
      </div>

      <div ref={listRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3 text-sm">
        {messages.map((m) => (
          <p key={m.id} className="leading-snug">
            <span className={`font-semibold ${m.color}`}>{m.user}</span>{' '}
            <span className="text-white/85">{m.text}</span>
          </p>
        ))}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {REACTIONS.map((r) => (
            <button key={r} onClick={() => react(r)} className="rounded-full bg-white/5 px-2.5 py-1 text-base transition hover:bg-white/15" aria-label={`Reagir ${r}`}>
              {r}
            </button>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Diga algo..."
            aria-label="Mensagem do chat"
            className="h-10 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-mega-red/60"
          />
          <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-full bg-mega-red text-white transition hover:bg-mega-red-bright" aria-label="Enviar">
            <Icon path={paths.share} className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LiveChannel() {
  const { id } = useParams()
  const channel = getChannel(id)
  const { notify } = useApp()
  const [notifyOn, setNotifyOn] = useState(false)
  const epg = useMemo(() => (channel ? buildEPG(channel.id) : []), [channel])

  if (!channel) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-lg font-semibold">Canal não encontrado</p>
        <Link to="/ao-vivo" className="text-sm text-mega-red-bright underline">Ver todos os canais</Link>
      </div>
    )
  }

  const current = epg.find((p) => p.live) || epg[0]

  return (
    <div className="px-4 pb-16 pt-6 lg:px-6">
      <Link to="/ao-vivo" className="mb-4 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
        <Icon path={paths.chevronLeft} className="h-4 w-4" /> Ao Vivo
      </Link>

      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <VideoPlayer
            item={{ id: channel.id, title: channel.name }}
            src={HLS_STREAM}
            qualities={[{ label: 'Adaptativo (HLS)', url: HLS_STREAM }]}
            poster={`https://picsum.photos/seed/${channel.id}-bd/1280/720`}
            title={channel.name}
            live
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${channel.color} font-bold`}>
                {channel.name.split(' ')[1]?.[0] || 'M'}
              </span>
              <div>
                <h1 className="flex items-center gap-2 text-xl font-bold">
                  {channel.name} <LiveBadge />
                </h1>
                <p className="text-sm text-white/55">{channel.category} • {channel.quality} • {nf.format(channel.viewers)} assistindo</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setNotifyOn((v) => !v); notify(notifyOn ? 'Notificações desativadas' : 'Você será avisado quando este canal entrar ao vivo') }}
                className={`glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:bg-white/15 ${notifyOn ? 'text-mega-gold' : ''}`}
              >
                <Icon path={paths.bell} /> {notifyOn ? 'Avisos ativos' : 'Avisar-me'}
              </button>
              <button onClick={() => notify('Link copiado para compartilhar')} className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:bg-white/15">
                <Icon path={paths.share} /> Compartilhar
              </button>
            </div>
          </div>

          {/* EPG */}
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold">Programação de hoje</h2>
            <div className="glass overflow-hidden rounded-2xl">
              {epg.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-4 border-b border-white/5 px-4 py-3 last:border-0 ${p.live ? 'bg-mega-red/10' : ''}`}
                >
                  <span className="w-24 shrink-0 text-sm tabular-nums text-white/60">{p.start} – {p.end}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${p.live ? 'text-mega-red-bright' : ''}`}>{p.title}</p>
                    <p className="text-xs text-white/45">{p.genre}</p>
                  </div>
                  {p.live ? <Pill tone="red">No ar</Pill> : <Icon path={paths.clock} className="h-4 w-4 text-white/30" />}
                </div>
              ))}
            </div>
          </section>

          {/* other channels */}
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold">Outros canais ao vivo</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {LIVE_CHANNELS.filter((c) => c.id !== channel.id).slice(0, 4).map((c) => (
                <Link key={c.id} to={`/ao-vivo/${c.id}`} className="group overflow-hidden rounded-xl bg-ink-850 ring-1 ring-white/5 hover:ring-mega-red/50">
                  <div className={`relative aspect-video bg-gradient-to-br ${c.color}`}>
                    <span className="absolute left-2 top-2"><LiveBadge /></span>
                  </div>
                  <p className="truncate p-2.5 text-xs font-semibold">{c.name}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="w-full shrink-0 xl:w-[360px]">
          <LiveChat channel={channel} />
        </aside>
      </div>
    </div>
  )
}
