import { useState } from 'react'
import Icon, { paths } from '../components/Icons.jsx'
import { Pill } from '../components/Badges.jsx'
import { PLANS } from '../data/catalog.js'
import { useApp } from '../context/AppContext.jsx'

const FAQ = [
  { q: 'Posso cancelar quando quiser?', a: 'Sim. Não há fidelidade — você cancela a qualquer momento e mantém o acesso até o fim do período pago.' },
  { q: 'Quais formas de pagamento são aceitas?', a: 'Cartão de crédito, PIX e débito automático. Pagamentos recorrentes são processados com segurança pelo gateway integrado.' },
  { q: 'Quantas telas posso usar ao mesmo tempo?', a: 'Gratuito: 1 tela. Premium: 2 telas. Ultra: 4 telas simultâneas, inclusive em 4K.' },
  { q: 'O plano Ultra tem conteúdo exclusivo?', a: 'Sim. Estreias antecipadas, eventos ao vivo em 4K e produções originais MEGA Ultra.' },
]

export default function Plans() {
  const { profile, notify } = useApp()
  const [open, setOpen] = useState(0)

  return (
    <div className="px-4 pb-20 pt-10 lg:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <Pill tone="gold" className="mb-4">Assinaturas</Pill>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Escolha seu plano MEGA</h1>
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          Filmes, séries, esportes e TV ao vivo em todos os seus dispositivos. Troque de plano ou cancele quando quiser.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const current = profile.plan?.toLowerCase() === plan.name.toLowerCase()
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-6 ${
                plan.highlight ? 'bg-gradient-to-b from-mega-red/20 to-ink-900 ring-2 ring-mega-red/60' : 'glass'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-mega-red px-4 py-1 text-[11px] font-bold uppercase tracking-wide">
                  Mais popular
                </span>
              )}
              <h2 className="text-lg font-bold">{plan.name}</h2>
              <p className="mt-1 text-xs text-white/50">{plan.tagline}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="pb-1 text-sm text-white/50">{plan.period}</span>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f.label} className={`flex items-start gap-2.5 ${f.ok ? 'text-white/85' : 'text-white/35'}`}>
                    <Icon path={f.ok ? paths.check : paths.close} className={`mt-0.5 h-4 w-4 shrink-0 ${f.ok ? 'text-mega-red-bright' : 'text-white/30'}`} />
                    {f.label}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => notify(current ? `Você já está no plano ${plan.name}` : `Assinatura ${plan.name} — integração de pagamento será conectada`)}
                disabled={current}
                className={`mt-7 rounded-full py-3 text-sm font-bold transition ${
                  current ? 'cursor-default bg-white/10 text-white/50'
                    : plan.highlight ? 'bg-mega-red text-white hover:bg-mega-red-bright'
                      : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                {current ? 'Plano atual' : `Assinar ${plan.name}`}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mx-auto mt-12 max-w-6xl">
        <h2 className="mb-4 text-xl font-bold">Comparativo de recursos</h2>
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/50">
                <th className="px-5 py-3 font-medium">Recurso</th>
                {PLANS.map((p) => <th key={p.id} className="px-5 py-3 font-medium">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['Sem anúncios', false, true, true],
                ['Qualidade máxima', '720p', '1080p', '4K HDR'],
                ['Telas simultâneas', '1', '2', '4'],
                ['Download offline', false, true, true],
                ['Áudio 5.1', false, false, true],
                ['Eventos ao vivo em 4K', false, false, true],
              ].map(([label, ...vals]) => (
                <tr key={label} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 text-white/80">{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="px-5 py-3">
                      {typeof v === 'boolean'
                        ? <Icon path={v ? paths.check : paths.close} className={`h-4 w-4 ${v ? 'text-mega-red-bright' : 'text-white/25'}`} />
                        : <span className="text-white/80">{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <h2 className="mb-4 text-xl font-bold">Perguntas frequentes</h2>
        <div className="flex flex-col gap-2">
          {FAQ.map((f, i) => (
            <div key={f.q} className="glass overflow-hidden rounded-2xl">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="text-sm font-semibold">{f.q}</span>
                <Icon path={paths.chevronDown} className={`h-4 w-4 shrink-0 transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="px-5 pb-4 text-sm text-white/60">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
