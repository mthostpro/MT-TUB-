import banner from '../assets/brand/mt-tub-banner.webp'

// MT TUB channel masthead — full-bleed strip at the top of the Home page.
export default function ChannelBanner() {
  return (
    <section className="relative w-full">
      <img
        src={banner}
        alt="MT TUB — vídeos que edificam e inspiram"
        loading="eager"
        className="h-[30vh] max-h-[380px] min-h-[190px] w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-950 to-transparent" />
    </section>
  )
}
