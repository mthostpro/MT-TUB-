# AGENTS.md

## What this is
MT-TUB — a YouTube-style video platform web app (React + Vite + Tailwind v4).
Front-end only for now; all content comes from mock data in `src/data/videos.js`.

## Running it (Base44 dev environment)
- `docker compose -f docker-compose.base44.yml up -d --build`
- Dev server listens on container port `5173`, mapped to host `3000`.
- Source is bind-mounted; Vite hot-reloads on edits. No restart needed for frontend changes.
- No external services or credentials required.

## Verify it works
- `docker compose -f docker-compose.base44.yml ps` → `web` healthy
- `curl -s localhost:3000 | grep -i mt-tub` → returns the served HTML

## Structure
- `src/pages/Home.jsx` — feed with category chips
- `src/pages/Watch.jsx` — video page (`/watch/:id`)
- `src/pages/Placeholder.jsx` — catch-all page for nav items not built yet
- `src/components/` — Header, Sidebar, VideoCard, ChannelAvatar, VideoPlayer, Comments
- `src/data/videos.js` — mock catalogue + channels (replace with a real API later)
- UI is a YouTube-style dark theme (#0f0f0f background, #272727 surfaces, #ff0000 accent).

## Notes
- Vite must bind 0.0.0.0 and allow the preview host; both handled in `vite.config.js`
  (`host: true`, `allowedHosts: true`) plus `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`.
- File-watch polling is enabled (bind mounts don't always emit inotify events).
