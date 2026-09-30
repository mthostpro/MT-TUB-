// ---------------------------------------------------------------------------
// MEGA STREAMING — publishing API
// ---------------------------------------------------------------------------
// Small dependency-free Node service. A video is "published" by POSTing it
// here; the service stores it in the catalogue and notifies Slack. Callers can
// be the in-app admin panel (through the Vite dev proxy) or any external
// system (YouTube, a CMS, a CI job) hitting the public port directly.
//
//   GET  /api/videos  → published videos
//   POST /api/videos  → publish a video + notify Slack
//   GET  /api/slack   → which Slack transports are configured
// ---------------------------------------------------------------------------

import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { readVideos, writeVideos } from './store.js'
import { notifyNewVideo, transports } from './slack.js'

const PORT = Number(process.env.PORT || 8000)

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  })
  res.end(JSON.stringify(body))
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 1_000_000) req.destroy()
    })
    req.on('end', () => {
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('Corpo da requisição não é um JSON válido.'))
      }
    })
    req.on('error', reject)
  })
}

const slugify = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)

const list = (value) =>
  Array.isArray(value)
    ? value.map((v) => String(v).trim()).filter(Boolean)
    : String(value ?? '').split(',').map((v) => v.trim()).filter(Boolean)

// Normalises an incoming payload into the catalogue title shape.
function toTitle(input) {
  const title = String(input.title ?? '').trim()
  if (!title) return { error: 'O campo "title" é obrigatório.' }

  return {
    title: {
      id: slugify(input.id || title) || randomUUID(),
      type: String(input.type || 'movie'),
      title,
      year: Number(input.year) || new Date().getFullYear(),
      genres: list(input.genres),
      rating: String(input.rating || 'L'),
      duration: Number(input.duration) || 0,
      score: Number(input.score) || 0,
      badge: String(input.badge || 'Novo'),
      synopsis: String(input.synopsis ?? '').trim(),
      free: Boolean(input.free),
      publishedAt: new Date().toISOString(),
    },
  }
}

async function publish(req, res) {
  let body
  try {
    body = await readJson(req)
  } catch (err) {
    return send(res, 400, { error: err.message })
  }

  const { title, error } = toTitle(body)
  if (error) return send(res, 400, { error })

  const videos = await readVideos()
  if (videos.some((v) => v.id === title.id)) {
    return send(res, 409, { error: `Já existe um vídeo com o id "${title.id}".` })
  }

  videos.unshift(title)
  await writeVideos(videos)

  const slack = await notifyNewVideo(title, { appUrl: process.env.PUBLIC_APP_URL })
  console.log(`[publish] ${title.id} — Slack: ${slack.configured ? `${slack.delivered.length} enviado(s), ${slack.failed.length} falha(s)` : 'não configurado'}`)

  return send(res, 201, { video: title, slack })
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')

  if (req.method === 'OPTIONS') return send(res, 204, {})

  try {
    if (pathname === '/api/videos' && req.method === 'GET') {
      return send(res, 200, { videos: await readVideos() })
    }
    if (pathname === '/api/videos' && req.method === 'POST') {
      return publish(req, res)
    }
    if (pathname === '/api/slack' && req.method === 'GET') {
      const names = transports().map((t) => t.name)
      return send(res, 200, { configured: names.length > 0, transports: names })
    }
    return send(res, 404, { error: 'Rota não encontrada.' })
  } catch (err) {
    console.error('[api]', err.message)
    return send(res, 500, { error: 'Erro interno.' })
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[api] ouvindo em http://0.0.0.0:${PORT}`)
})
