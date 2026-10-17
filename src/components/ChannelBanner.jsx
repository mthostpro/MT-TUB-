import banner from '../assets/brand/mt-tub-banner.webp'

// MT TUB channel masthead — full-bleed strip at the top of the Home page.
// Shown at the image's natural 16:9 ratio so the whole artwork is always visible.
export default function ChannelBanner() {
  return (
    <section className="w-full">
      <img
        src={banner}
        alt="MT TUB — vídeos que edificam e inspiram"
        loading="eager"
        className="block h-auto w-full"
      />
    </section>
  )
}
