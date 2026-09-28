const comments = [
  {
    name: '@joaosilva',
    initials: 'JS',
    color: 'bg-blue-600',
    time: 'há 2 horas',
    text: 'Melhor conteúdo sobre o assunto, salvou meu dia! 🔥',
    likes: '1,2 mil',
  },
  {
    name: '@maria.dev',
    initials: 'MD',
    color: 'bg-pink-600',
    time: 'há 5 horas',
    text: 'Já assisti três vezes. A parte do minuto 12 é ouro.',
    likes: '842',
  },
  {
    name: '@carlosedu',
    initials: 'CE',
    color: 'bg-green-600',
    time: 'há 1 dia',
    text: 'Dá pra fazer uma parte 2 explicando o deploy?',
    likes: '310',
  },
]

function ThumbUp({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 11v10H4v-9a1 1 0 011-1h2zm0 0l4.5-8a2 2 0 012.9 2.3L13 9h5.5a2 2 0 011.9 2.6l-2 6A2 2 0 0116.5 19H7" />
    </svg>
  )
}

export default function Comments() {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold">1.284 comentários</h2>

      <div className="mt-5 flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-semibold text-white">
          R
        </span>
        <input
          placeholder="Adicione um comentário..."
          className="w-full border-b border-white/15 bg-transparent pb-2 text-sm outline-none placeholder:text-white/50 focus:border-white"
        />
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {comments.map((c) => (
          <div key={c.name} className="flex gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${c.color}`}
            >
              {c.initials}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-medium">
                {c.name} <span className="text-white/50">{c.time}</span>
              </p>
              <p className="mt-1 text-sm">{c.text}</p>
              <div className="mt-2 flex items-center gap-4 text-white/70">
                <button className="flex items-center gap-1.5 text-xs hover:text-white">
                  <ThumbUp />
                  {c.likes}
                </button>
                <button className="hover:text-white">
                  <ThumbUp className="h-5 w-5 rotate-180" />
                </button>
                <button className="text-xs font-medium hover:text-white">
                  Responder
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
