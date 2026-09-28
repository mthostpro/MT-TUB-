export default function Placeholder({ title }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-white/60">Em construção — em breve por aqui.</p>
    </div>
  )
}
