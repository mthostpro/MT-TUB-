// ---------------------------------------------------------------------------
// Slack delivery
// ---------------------------------------------------------------------------
// Three ways to reach a channel, driven entirely by environment variables, so
// any combination can be enabled at once:
//   SLACK_WEBHOOK_URL                — Incoming Webhook URL of the channel
//   SLACK_WORKFLOW_WEBHOOK_URL       — Workflow Builder trigger URL
//   SLACK_BOT_TOKEN + SLACK_CHANNEL  — chat.postMessage as a bot
// Every configured transport receives the message. Having none configured is
// not an error: the publish still succeeds and reports `configured: false`.
// ---------------------------------------------------------------------------

const POST_MESSAGE = 'https://slack.com/api/chat.postMessage'
const TIMEOUT_MS = 8000

const TYPE_LABEL = {
  movie: 'Filme',
  series: 'Série',
  documentary: 'Documentário',
  show: 'Programa',
  music: 'Música',
  kids: 'Infantil',
  live: 'Ao vivo',
}

export function transports(env = process.env) {
  const list = []
  if (env.SLACK_WEBHOOK_URL) list.push({ name: 'incoming-webhook', url: env.SLACK_WEBHOOK_URL })
  if (env.SLACK_WORKFLOW_WEBHOOK_URL) list.push({ name: 'workflow-webhook', url: env.SLACK_WORKFLOW_WEBHOOK_URL })
  if (env.SLACK_BOT_TOKEN && env.SLACK_CHANNEL) {
    list.push({ name: 'bot-token', token: env.SLACK_BOT_TOKEN, channel: env.SLACK_CHANNEL })
  }
  return list
}

export function buildMessage(video, appUrl) {
  const meta = [TYPE_LABEL[video.type] ?? 'Vídeo', video.year, (video.genres ?? []).join(' • ')]
    .filter(Boolean)
    .join(' · ')

  const text = `:clapper: Novo vídeo publicado: *${video.title}* (${meta})`

  const blocks = [
    { type: 'section', text: { type: 'mrkdwn', text: `:clapper: *Novo vídeo publicado*\n*${video.title}*\n${meta}` } },
  ]
  if (video.synopsis) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: video.synopsis } })
  }
  if (appUrl) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `<${appUrl}/titulo/${video.id}|Assistir na plataforma>` }],
    })
  }

  return { text, blocks }
}

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  const raw = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${raw.slice(0, 200)}`)
  return raw
}

async function deliver(transport, message) {
  if (transport.url) {
    await postJson(transport.url, message)
    return
  }
  const raw = await postJson(
    POST_MESSAGE,
    { channel: transport.channel, ...message },
    { Authorization: `Bearer ${transport.token}` },
  )
  const data = JSON.parse(raw)
  if (!data.ok) throw new Error(`Slack: ${data.error}`)
}

// Notifies every configured transport. Never throws: a Slack outage must not
// break publishing. Never logs credentials.
export async function notifyNewVideo(video, { appUrl } = {}) {
  const list = transports()
  if (!list.length) {
    return {
      configured: false,
      delivered: [],
      failed: [],
      hint: 'Nenhum transporte Slack configurado. Defina SLACK_WEBHOOK_URL, SLACK_WORKFLOW_WEBHOOK_URL ou SLACK_BOT_TOKEN + SLACK_CHANNEL.',
    }
  }

  const message = buildMessage(video, appUrl)
  const delivered = []
  const failed = []

  await Promise.all(
    list.map(async (transport) => {
      try {
        await deliver(transport, message)
        delivered.push(transport.name)
      } catch (err) {
        failed.push({ transport: transport.name, error: err.message })
      }
    }),
  )

  return { configured: true, delivered, failed }
}
