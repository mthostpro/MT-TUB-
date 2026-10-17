import banner from '../assets/brand/mt-tub-banner.webp'

// MT TUB channel masthead — full-bleed strip at the top of the Home page.
export default function ChannelBanner() {
  return (
    <section className="relative w-full">
      <img
        src={banner}
        alt="MT TUB — vídeos que edificam e inspiram"
        loading="eager"
        className="h-[16vh] min-h-[104px] max-h-[150px] w-full object-cover object-center sm:h-[20vh] sm:min-h-[140px] sm:max-h-[210px] lg:h-[24vh] lg:max-h-[300px]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-950 to-transparent" />
    </section>
  )
}
