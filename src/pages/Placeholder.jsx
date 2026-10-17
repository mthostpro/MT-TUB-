import { Link, useLocation } from 'react-router-dom'
import Icon, { paths } from '../components/Icons.jsx'

const ROADMAP = [
  'Autenticação completa (login, cadastro, recuperação de senha e login social)',
  'Backend, banco de dados e API para o catálogo',
  'Painel administrativo e gestão de conteúdo',
  'Pagamentos recorrentes (cartão e PIX) e cupons',
  'Analytics, notificações push e aplicativos mobile',
]

const LABELS = {
  '/admin': 'Painel administrativo',
  '/canais': 'Canais',
}

export default function Placeholder() {
  const { pathname } = useLocation()
  const title = LABELS[pathname] ?? 'Em breve'

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-mega-red/15 text-mega-red-bright">
        <Icon path={paths.gear} className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-white/55">
        Esta área faz parte da próxima fase da plataforma. A interface premium já está pronta para receber a integração.
      </p>

      <div className="glass mt-8 w-full max-w-lg rounded-2xl p-5 text-left">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Próximas entregas</p>
        <ul className="flex flex-col gap-2.5 text-sm text-white/75">
          {ROADMAP.map((r) => (
            <li key={r} className="flex items-start gap-2.5">
              <Icon path={paths.check} className="mt-0.5 h-4 w-4 shrink-0 text-mega-red-bright" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      <Link to="/" className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90">
        Voltar ao início
      </Link>
    </div>
  )
}
