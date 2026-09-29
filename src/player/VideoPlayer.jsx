import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Icon, { paths } from '../components/Icons.jsx'
import useHls from './useHls.js'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

function fmt(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  const mm = h ? String(m).padStart(2, '0') : m
  return `${h ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`
}

// A generated WebVTT track so the subtitle control is genuinely functional.
function demoVtt(title) {
  const body = [
    'WEBVTT',
    '',
    '00:00:00.000 --> 00:00:04.000',
    `MEGA STREAMING — ${title}`,
    '',
    '00:00:04.000 --> 00:00:09.000',
    'Legendas de demonstração ativadas.',
    '',
    '00:00:09.000 --> 00:00:15.000',
    'Selecione idioma, qualidade e velocidade no menu de configurações.',
    '',
  ].join('\n')
  return URL.createObjectURL(new Blob([body], { type: 'text/vtt' }))
}

export default function VideoPlayer({
  item,
  src,
  qualities = [],
  poster,
  title,
  subtitle,
  live = false,
  startAt = 0,
  hasNext = false,
  onNext,
  onProgress,
  cinema = false,
  onToggleCinema,
}) {
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const barRef = useRef(null)
  const hideTimer = useRef(null)
  const lastSaved = useRef(0)
  const didSeek = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [rate, setRate] = useState(1)
  const [quality, setQuality] = useState(0)
  const [subtitles, setSubtitles] = useState(false)
  const [audio, setAudio] = useState('Português (original)')
  const [fs, setFs] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [controls, setControls] = useState(true)
  const [menu, setMenu] = useState(null) // 'settings' | 'captions' | null
  const [hoverX, setHoverX] = useState(null)
  const [scrub, setScrub] = useState(null)
  const [ended, setEnded] = useState(false)
  const [error, setError] = useState(false)

  const activeSrc = qualities[quality]?.url || src
  useHls(videoRef, activeSrc)

  const vtt = useMemo(() => (item ? demoVtt(item.title) : null), [item])

  // ---------------------------------------------------------------- controls
  const showControls = useCallback(() => {
    setControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      const v = videoRef.current
      if (v && !v.paused) setControls(false)
    }, 3200)
  }, [])

  useEffect(() => () => clearTimeout(hideTimer.current), [])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
    showControls()
  }, [showControls])

  const seekTo = useCallback((time) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.max(0, Math.min(time, v.duration || 0))
  }, [])

  const skip = useCallback((delta) => {
    const v = videoRef.current
    if (!v) return
    seekTo(v.currentTime + delta)
    showControls()
  }, [seekTo, showControls])

  const toggleMute = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await wrapRef.current?.requestFullscreen()
      else await document.exitFullscreen()
    } catch {
      /* fullscreen unsupported */
    }
  }, [])

  const togglePip = useCallback(async () => {
    const v = videoRef.current
    if (!v) return
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture()
      else await v.requestPictureInPicture()
    } catch {
      /* PiP unsupported */
    }
  }, [])

  const cast = useCallback(async () => {
    const v = videoRef.current
    try {
      if (v?.remote?.prompt) await v.remote.prompt()
      else throw new Error('no remote')
    } catch {
      onProgress?.({ notice: 'Chromecast/AirPlay indisponível neste dispositivo.' })
    }
  }, [onProgress])

  const changeQuality = useCallback((i) => {
    const v = videoRef.current
    if (!v) return
    const wasPlaying = !v.paused
    const at = v.currentTime
    didSeek.current = true // keep the restore listener in charge of the position
    setQuality(i)
    setMenu(null)
    // restore position once the new source is ready
    const restore = () => {
      v.currentTime = at
      if (wasPlaying) v.play().catch(() => {})
      v.removeEventListener('loadedmetadata', restore)
    }
    v.addEventListener('loadedmetadata', restore)
  }, [])

  const applySubs = useCallback((on) => {
    const v = videoRef.current
    if (!v) return
    const tracks = v.textTracks
    for (let i = 0; i < tracks.length; i++) tracks[i].mode = on ? 'showing' : 'hidden'
    setSubtitles(on)
  }, [])

  // ------------------------------------------------------------------ events
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => {
      setCurrent(v.currentTime)
      if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1))
      if (onProgress && v.duration && v.currentTime - lastSaved.current > 5) {
        lastSaved.current = v.currentTime
        onProgress({ position: v.currentTime, duration: v.duration, percent: (v.currentTime / v.duration) * 100 })
      }
    }
    const onMeta = () => {
      setDuration(v.duration || 0)
      if (startAt && !didSeek.current) {
        didSeek.current = true
        v.currentTime = startAt
      }
      const tracks = v.textTracks
      for (let i = 0; i < tracks.length; i++) tracks[i].mode = 'hidden'
    }
    const onPlay = () => { setPlaying(true); setEnded(false); showControls() }
    const onPause = () => { setPlaying(false); setControls(true) }
    const onEnd = () => {
      setPlaying(false)
      setEnded(true)
      if (onProgress && v.duration) onProgress({ position: v.duration, duration: v.duration, percent: 100 })
    }
    const onErr = () => setError(true)

    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('progress', onTime)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('ended', onEnd)
    v.addEventListener('error', onErr)
    return () => {
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('progress', onTime)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('ended', onEnd)
      v.removeEventListener('error', onErr)
    }
  }, [onProgress, startAt, showControls])

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  // autoplay next episode
  useEffect(() => {
    if (!ended || !autoplay || !hasNext) return
    const t = setTimeout(() => onNext?.(), 2500)
    return () => clearTimeout(t)
  }, [ended, autoplay, hasNext, onNext])

  // keyboard shortcuts
  const onKeyDown = (e) => {
    const k = e.key.toLowerCase()
    if (k === ' ' || k === 'k') { e.preventDefault(); togglePlay() }
    else if (k === 'arrowright') skip(10)
    else if (k === 'arrowleft') skip(-10)
    else if (k === 'f') toggleFullscreen()
    else if (k === 'm') toggleMute()
    else if (k === 'p') togglePip()
    else if (k === 'c') applySubs(!subtitles)
    else showControls()
  }

  // --------------------------------------------------------------- scrubbing
  const ratioFromEvent = (clientX) => {
    const rect = barRef.current.getBoundingClientRect()
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
  }
  const onBarDown = (e) => {
    barRef.current.setPointerCapture?.(e.pointerId)
    setScrub(ratioFromEvent(e.clientX))
  }
  const onBarMove = (e) => {
    if (scrub != null) setScrub(ratioFromEvent(e.clientX))
    else setHoverX(ratioFromEvent(e.clientX))
  }
  const onBarUp = (e) => {
    if (scrub != null) {
      seekTo(scrub * duration)
      setScrub(null)
    }
  }

  const display = scrub != null ? scrub * duration : current
  const pct = duration ? (display / duration) * 100 : 0
  const bufPct = duration ? (buffered / duration) * 100 : 0

  const Btn = ({ icon, label, onClick, active, fill, className = '' }) => (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 ${
        active ? 'text-mega-red-bright' : 'text-white'
      } ${className}`}
    >
      <Icon path={icon} fill={fill} className="h-5 w-5" />
    </button>
  )

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={showControls}
      onMouseLeave={() => playing && setControls(false)}
      className={`group relative w-full overflow-hidden bg-black outline-none ${
        fs ? 'h-screen' : cinema ? 'aspect-[21/9]' : 'aspect-video'
      } rounded-none ${fs ? '' : 'rounded-2xl ring-1 ring-white/10'}`}
    >
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        className="h-full w-full bg-black object-contain"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      >
        {vtt && <track kind="subtitles" src={vtt} srcLang="pt" label="Português" default={false} />}
      </video>

      {/* live badge */}
      {live && (
        <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded bg-mega-red px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            <span className="animate-live h-1.5 w-1.5 rounded-full bg-white" /> Ao vivo
          </span>
        </div>
      )}

      {/* big play button when paused */}
      {!playing && !ended && !error && (
        <button
          onClick={togglePlay}
          aria-label="Reproduzir"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/25 transition hover:bg-black/35"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-2xl transition hover:scale-105">
            <Icon path={paths.play} fill className="ml-1 h-9 w-9 text-black" />
          </span>
        </button>
      )}

      {/* end overlay */}
      {ended && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/80">
          {autoplay && hasNext ? (
            <>
              <p className="text-sm text-white/70">Reproduzindo o próximo episódio...</p>
              <button onClick={onNext} className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black">
                <Icon path={paths.next} fill className="h-4 w-4" /> Reproduzir agora
              </button>
            </>
          ) : (
            <button onClick={() => { seekTo(0); videoRef.current?.play() }} className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black">
              <Icon path={paths.play} fill className="h-4 w-4" /> Assistir novamente
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/85 text-center">
          <p className="text-sm font-semibold text-white">Não foi possível carregar este vídeo.</p>
          <p className="text-xs text-white/60">Tente novamente ou escolha outra qualidade.</p>
        </div>
      )}

      {/* ------------------------------------------------------------ controls */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-3 pb-3 pt-16 transition-opacity duration-300 ${
          controls || !playing ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* progress */}
        {!live && (
          <div className="mb-1 px-1">
            <div
              ref={barRef}
              onPointerDown={onBarDown}
              onPointerMove={onBarMove}
              onPointerUp={onBarUp}
              onPointerLeave={() => setHoverX(null)}
              className="group/bar relative flex h-4 cursor-pointer items-center"
              role="slider"
              aria-label="Progresso"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(display)}
            >
              <div className="relative h-1 w-full rounded-full bg-white/25">
                <div className="absolute inset-y-0 left-0 rounded-full bg-white/35" style={{ width: `${bufPct}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-mega-red" style={{ width: `${pct}%` }} />
                <div
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mega-red opacity-0 shadow transition group-hover/bar:opacity-100"
                  style={{ left: `${pct}%`, opacity: scrub != null ? 1 : undefined }}
                />
              </div>
              {hoverX != null && (
                <span
                  className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded bg-black/90 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white"
                  style={{ left: `${hoverX * 100}%` }}
                >
                  {fmt(hoverX * duration)}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Btn icon={playing ? paths.pause : paths.play} fill label={playing ? 'Pausar' : 'Reproduzir'} onClick={togglePlay} />
          <Btn icon={paths.back10} label="Voltar 10 segundos" onClick={() => skip(-10)} />
          <Btn icon={paths.fwd10} label="Avançar 10 segundos" onClick={() => skip(10)} />
          {hasNext && <Btn icon={paths.next} fill label="Próximo episódio" onClick={onNext} />}

          {/* volume */}
          <div className="group/vol flex items-center">
            <Btn icon={muted || volume === 0 ? paths.mute : paths.volume} label="Volume" onClick={toggleMute} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = videoRef.current
                const val = Number(e.target.value)
                setVolume(val)
                setMuted(val === 0)
                if (v) { v.volume = val; v.muted = val === 0 }
              }}
              aria-label="Ajustar volume"
              className="player-range h-1 w-0 rounded-full bg-white/25 opacity-0 transition-all duration-200 group-hover/vol:w-20 group-hover/vol:opacity-100"
              style={{ background: `linear-gradient(to right, #e11d2e ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.25) ${(muted ? 0 : volume) * 100}%)` }}
            />
          </div>

          <span className="ml-2 text-xs font-medium tabular-nums text-white/85">
            {live ? 'AO VIVO' : `${fmt(display)} / ${fmt(duration)}`}
          </span>

          <div className="ml-auto flex items-center gap-0.5">
            <Btn
              icon={paths.captions}
              label="Legendas"
              active={subtitles}
              onClick={() => applySubs(!subtitles)}
            />
            <Btn icon={paths.cast} label="Transmitir (Chromecast/AirPlay)" onClick={cast} />
            <Btn icon={paths.cinema} label="Modo cinema" active={cinema} onClick={onToggleCinema} />

            {/* settings */}
            <div className="relative">
              <Btn
                icon={paths.gear}
                label="Configurações"
                active={menu === 'settings'}
                onClick={() => setMenu(menu === 'settings' ? null : 'settings')}
              />
              {menu === 'settings' && (
                <div className="glass-strong animate-float-up absolute bottom-12 right-0 w-64 rounded-2xl p-2 text-sm">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">Velocidade</p>
                  <div className="flex flex-wrap gap-1 px-2 pb-2">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => { const v = videoRef.current; if (v) v.playbackRate = s; setRate(s) }}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${rate === s ? 'bg-mega-red text-white' : 'bg-white/5 hover:bg-white/10'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                  <hr className="my-1 border-white/10" />
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">Qualidade</p>
                  {qualities.map((q, i) => (
                    <button
                      key={q.label}
                      onClick={() => changeQuality(i)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/5 ${i === quality ? 'text-mega-red-bright' : ''}`}
                    >
                      {q.label}
                      {i === quality && <Icon path={paths.check} className="h-4 w-4" />}
                    </button>
                  ))}
                  <hr className="my-1 border-white/10" />
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">Áudio</p>
                  <button
                    onClick={() => { setAudio('Português (original)'); setMenu(null) }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/5"
                  >
                    Português (original)
                    <Icon path={paths.check} className="h-4 w-4 text-mega-red-bright" />
                  </button>
                  <button disabled className="flex w-full cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-left text-white/35">
                    English 5.1 <span className="text-[10px] uppercase">em breve</span>
                  </button>
                </div>
              )}
            </div>

            <Btn icon={paths.pip} label="Picture-in-Picture" onClick={togglePip} />
            <Btn icon={fs ? paths.exitFullscreen : paths.fullscreen} label="Tela cheia" onClick={toggleFullscreen} />
          </div>
        </div>

        {subtitle && (
          <p className="mt-1 truncate px-2 text-xs text-white/60">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
