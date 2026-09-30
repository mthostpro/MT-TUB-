// Thin client for the publishing API (see server/). In dev, Vite proxies /api
// to the `api` service, so the app stays single-origin.
const BASE = '/api'

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Falha na requisição (${res.status})`)
  return data
}

export async function listPublishedVideos() {
  const data = await request('/videos')
  return data.videos ?? []
}

export function publishVideo(input) {
  return request('/videos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

export function slackStatus() {
  return request('/slack')
}
