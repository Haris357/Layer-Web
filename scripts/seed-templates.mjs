// Seeds the gallery with Layer's built-in templates.
// Run with the service account:  GOOGLE_APPLICATION_CREDENTIALS=... node scripts/seed-templates.mjs
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'

const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!saPath) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to the service account JSON.')
  process.exit(1)
}

initializeApp({ credential: cert(JSON.parse(readFileSync(saPath, 'utf8'))) })
const db = getFirestore()

const TEMPLATES = [
  {
    id: 'builtin-minimal',
    name: 'Minimal',
    description:
      'A clock, a journal and a gentle countdown — just enough to keep the day in view.',
    widgets: [
      { type: 'clock', label: 'Clock', x: 140, y: 130, width: 240, height: 240 },
      { type: 'note', label: 'Journal', x: 140, y: 420, width: 560, height: 460 },
      { type: 'countdown', label: 'New Year', x: 470, y: 130, width: 330, height: 160 },
      { type: 'todo', label: 'To-do', x: 760, y: 420, width: 320, height: 320 },
      { type: 'worldclock', label: 'World Clocks', x: 880, y: 130, width: 300, height: 200 },
    ],
  },
  {
    id: 'builtin-dashboard',
    name: 'Dashboard',
    description:
      'Weather, system stats, a calendar and world clocks for a busy command desk.',
    widgets: [
      { type: 'clock', label: 'Clock', x: 150, y: 120, width: 300, height: 160 },
      { type: 'weather', label: 'Weather', x: 490, y: 120, width: 270, height: 200 },
      { type: 'stats', label: 'System', x: 800, y: 120, width: 300, height: 170 },
      { type: 'calendar', label: 'Calendar', x: 150, y: 320, width: 300, height: 300 },
      { type: 'worldclock', label: 'World Clocks', x: 490, y: 350, width: 290, height: 210 },
      { type: 'nowplaying', label: 'Now Playing', x: 820, y: 320, width: 380, height: 200 },
      { type: 'todo', label: 'To-do', x: 1140, y: 120, width: 320, height: 360 },
    ],
  },
  {
    id: 'builtin-command',
    name: 'Command',
    description:
      'Apps, search and quick links — a launcher-style layout to move fast.',
    widgets: [
      { type: 'apps', label: 'Apps', x: 150, y: 130, width: 320, height: 320 },
      { type: 'search', label: 'Search', x: 510, y: 130, width: 380, height: 54 },
      { type: 'nowplaying', label: 'Now Playing', x: 510, y: 215, width: 380, height: 200 },
      { type: 'link', label: 'GitHub', x: 510, y: 445, width: 185, height: 52 },
      { type: 'link', label: 'YouTube', x: 705, y: 445, width: 185, height: 52 },
      { type: 'notifications', label: 'Notifications', x: 930, y: 130, width: 330, height: 360 },
      { type: 'clock', label: 'Clock', x: 1300, y: 130, width: 290, height: 150 },
    ],
  },
]

// Renders a template layout into an SVG thumbnail (used as the card image).
function thumbSvg(widgets) {
  const minX = Math.min(...widgets.map((w) => w.x))
  const minY = Math.min(...widgets.map((w) => w.y))
  const maxX = Math.max(...widgets.map((w) => w.x + w.width))
  const maxY = Math.max(...widgets.map((w) => w.y + w.height))
  const pad = 70
  const W = maxX - minX + pad * 2
  const H = maxY - minY + pad * 2
  const tiles = widgets
    .map((w) => {
      const x = w.x - minX + pad
      const y = w.y - minY + pad
      return `<rect x="${x}" y="${y}" width="${w.width}" height="${w.height}" rx="16" fill="#ffffff" stroke="#e4e4e6" stroke-width="2.5"/><text x="${x + w.width / 2}" y="${y + w.height / 2}" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="500" fill="#9a9aa0" text-anchor="middle" dominant-baseline="middle">${w.label}</text>`
    })
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fafafa"/>${tiles}</svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

const run = async () => {
  for (const t of TEMPLATES) {
    await db
      .collection('templates')
      .doc(t.id)
      .set({
        name: t.name,
        description: t.description,
        author: 'Layer',
        builtin: true,
        widgetCount: t.widgets.length,
        widgets: t.widgets,
        thumb: thumbSvg(t.widgets),
        upvotes: 0,
        downvotes: 0,
        score: 0,
        createdAt: FieldValue.serverTimestamp(),
      })
    console.log(`seeded: ${t.name}`)
  }
  console.log('done.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
