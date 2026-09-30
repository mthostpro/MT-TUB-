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
- Two services: `web` (Vite, host 3000) and `api` (publishing API, host 8000).
  Vite proxies `/api` → `http://api:8000`, so the app stays single-origin.
- Slack credentials are optional — the app boots and publishes without them.

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
  `Badges`, `Brand`, `ChannelBanner`, `Icons`, `Toasts`, `layout/TopNav`, `layout/SideRail`
- `src/assets/brand/` — MT TUB brand art (WebP, ~1200px wide). `Brand` renders the logo
  in the header; `ChannelBanner` renders the masthead strip at the top of Home.
- `src/pages/` — `Home`, `Browse`, `TitleDetail`, `Watch`, `Live`, `LiveChannel`,
  `Search`, `MyList`, `Plans`, `Kids`, `Profile`, `Admin`, `Placeholder`
- `src/hooks/useClickOutside.js`
- `src/lib/api.js` — client for the publishing API (`/api`, proxied by Vite)
- `server/` — publishing API: `index.js` (routes), `slack.js` (delivery), `store.js` (JSON store)

### Routes
`/` · `/filmes` `/series` `/documentarios` `/shows` `/musica` `/gospel` `/noticias`
`/esportes` (via `<Browse kind=…/>`) · `/catalogo/:rowId` · `/infantil` · `/ao-vivo`
`/canais` · `/ao-vivo/:id` · `/titulo/:id` · `/assistir/:id` · `/busca` · `/minha-lista`
`/favoritos` · `/planos` · `/perfil` · `/admin` · `*` → Placeholder (roadmap: auth, backend)

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

## Publishing + Slack notifications
`server/` is a dependency-free Node service (plain `node:http`, no npm install).
- `GET /api/videos` — published videos (also what the Compose healthcheck probes)
- `POST /api/videos` — publish: stores the video, then notifies Slack
- `GET /api/slack` — which Slack transports are configured

Published videos live in the `api-data` volume (`/data/videos.json`), never in the repo.
They join the catalogue at runtime through `registerPublished()` in `src/data/catalog.js`
and show up in the "Novidades na plataforma" row on Home and at `/titulo/:id`.

Slack transports come from the environment and **every** configured one receives the
message (see `server/slack.js`): `SLACK_WEBHOOK_URL` (Incoming Webhook),
`SLACK_WORKFLOW_WEBHOOK_URL` (Workflow trigger), `SLACK_BOT_TOKEN` + `SLACK_CHANNEL`
(`chat.postMessage`). They arrive via `env_file: /run/base44/app.env`. A Slack failure
never blocks publishing — it is reported in the response instead.

Verify delivery without a real workspace: start a throwaway node container on the compose
network that logs POST bodies, then
`docker compose -f docker-compose.base44.yml exec -T -e SLACK_WEBHOOK_URL=http://<mock>:9099/hook api node -e "…"`
calling `notifyNewVideo`. External systems publish by POSTing JSON to
`https://8000-<public host>/api/videos` (no auth in dev).

## Deployment
No built-in publish flow — a static Vite SPA deployed from Git. Configs included for
Docker/VPS (`Dockerfile` + `nginx.conf`), Vercel (`vercel.json`), Netlify (`netlify.toml`)
and GitHub Pages (`.github/workflows/deploy-pages.yml`). Subpath hosting works via
`VITE_BASE_PATH` + `BrowserRouter basename`.
