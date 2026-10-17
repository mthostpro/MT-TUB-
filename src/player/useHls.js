import { useEffect } from 'react'
import Hls from 'hls.js'

// Attaches a media source to a <video> element, transparently handling HLS
// (.m3u8) via hls.js where the browser has no native support.
//   MP4 / progressive  → native playback
//   HLS                → native (Safari/iOS) or hls.js (Chrome/Firefox/Edge)
//   DASH (.mpd)        → reserved for a dash.js adapter (see AGENTS.md)
export default function useHls(videoRef, src) {
  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    const isHls = /\.m3u8($|\?)/i.test(src)

    if (!isHls) {
      video.src = src
      return
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      return
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true })
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    }

    // Last resort — let the element try.
    video.src = src
  }, [videoRef, src])
}
