import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

// Published videos live in a JSON file on a mounted volume (DATA_FILE), so they
// survive restarts without being written back into the repository.
const FILE = process.env.DATA_FILE || '/data/videos.json'

export async function readVideos() {
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

export async function writeVideos(videos) {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(videos, null, 2))
}
