# AGENTS.md

## What this is
**MEGA STREAMING** — a premium, cinematic video-streaming front end (React + Vite +
Tailwind v4). Films, series, live TV, sports, kids and more. All content is mock data
in `src/data/catalog.js`, shaped to mirror the planned API so a backend can replace it
without touching the UI.

Identity: dark cinematic theme (near-black `ink-*` surfaces), **red + gold** brand
(`mega-red`, `mega-gold`), glassmorphism surfaces (`.glass`, `.glass-strong`).

## Running it (Base44 dev environment)
- `docker compose -f docker-compose.base44.yml up -d --build`
- Dev server listens on container port `5173`, mapped to host `3000`.
- Source is bind-mounted; Vite hot-reloads on edits.
- `hls.js` is a runtime dependency (HLS playback in Chrome/Firefox). After changing
  `package.json`, restart the service so `npm install` re-runs: `docker compose restart web`.
- No external services or credentials required.

## Verify it works
- `docker compose -f docker-compose.base44.yml ps` → `web` healthy
- `curl -s localhost:3000 | grep -i "MEGA STREAMING"` → served HTML

## Structure
- `src/App.jsx` — routes + layout shell (TopNav, SideRail, Toasts)
- `src/context/AppContext.jsx` — user state (my list, favorites, progress, history,
  profile, kids mode, toasts), persisted to `localStorage` under `mega-streaming:v1`
- `src/data/catalog.js` — `TITLES`, `LIVE_CHANNELS`, `PLANS`, `ROWS`, `NAV`, `RAIL`,
  `buildEPG()`, `searchTitles()`, `byTag()`
- `src/player/` — `VideoPlayer.jsx` (custom controls) + `useHls.js` (HLS adapter)
- `src/components/` — `HeroBanner`, `ContentRow`, `ContentCard`, `ContinueCard`,
  `Badges`, `Brand`, `Icons`, `Toasts`, `layout/TopNav`, `layout/SideRail`
- `src/pages/` — `Home`, `Browse`, `TitleDetail`, `Watch`, `Live`, `LiveChannel`,
  `Search`, `MyList`, `Plans`, `Kids`, `Profile`, `Placeholder`
- `src/hooks/useClickOutside.js`

### Routes
`/` · `/filmes` `/series` `/documentarios` `/shows` `/musica` `/gospel` `/noticias`
`/esportes` (via `<Browse kind=…/>`) · `/catalogo/:rowId` · `/infantil` · `/ao-vivo`
`/canais` · `/ao-vivo/:id` · `/titulo/:id` · `/assistir/:id` · `/busca` · `/minha-lista`
`/favoritos` · `/planos` · `/perfil` · `*` → Placeholder (roadmap: admin, auth, backend)

## Player notes
- `useHls` attaches the source: MP4 plays natively; `.m3u8` uses native HLS (Safari) or
  `hls.js`. **DASH (.mpd) is reserved** for a dash.js adapter.
- Subtitles are a generated WebVTT blob so the caption control is functional.
  Do NOT add a cleanup that revokes the blob URL — React StrictMode double-invokes
  effects and would revoke it before the track loads.
- Do NOT set `crossOrigin` on the `<video>`: most sample video hosts (test-videos.co.uk,
  media.w3.org) send no CORS headers and the video would fail to load.
- Quality selector swaps between the `qualities[]` ladder entries, preserving position.
- Content images come from `picsum.photos` (deterministic by seed) and are `loading="lazy"`;
  only above-the-fold images load on first paint, which is expected.

## Deployment
No built-in publish flow — a static Vite SPA deployed from Git. Configs included for
Docker/VPS (`Dockerfile` + `nginx.conf`), Vercel (`vercel.json`), Netlify (`netlify.toml`)
and GitHub Pages (`.github/workflows/deploy-pages.yml`). Subpath hosting works via
`VITE_BASE_PATH` + `BrowserRouter basename`.
