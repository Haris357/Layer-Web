import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  increment,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { db } from './firebase'

export interface TplWidget {
  type: string
  label: string
  x: number
  y: number
  width: number
  height: number
}

export interface GalleryItem {
  id: string
  name: string
  description: string
  author: string
  widgetCount: number
  widgets: TplWidget[]
  thumb: string
  upvotes: number
  downvotes: number
  score: number
  builtin?: boolean
}

export type SortKey = 'new' | 'top'
export const PAGE_SIZE = 24

export interface Page {
  items: GalleryItem[]
  cursor: QueryDocumentSnapshot<DocumentData> | null
  done: boolean
}

// Fetches one page of templates; pass the previous page's cursor to continue.
export async function fetchTemplates(
  sort: SortKey,
  cursor: QueryDocumentSnapshot<DocumentData> | null,
): Promise<Page> {
  const field = sort === 'top' ? 'score' : 'createdAt'
  const col = collection(db, 'templates')
  const q = cursor
    ? query(col, orderBy(field, 'desc'), startAfter(cursor), limit(PAGE_SIZE))
    : query(col, orderBy(field, 'desc'), limit(PAGE_SIZE))
  const snap = await getDocs(q)
  const items = snap.docs.map(
    (d) => ({ id: d.id, ...(d.data() as DocumentData) }) as GalleryItem,
  )
  return {
    items,
    cursor: snap.docs[snap.docs.length - 1] ?? null,
    done: snap.size < PAGE_SIZE,
  }
}

// --- voting (browser-local tracking to avoid casual double-voting) ---
export type Vote = 1 | -1 | 0
const VKEY = 'layer-template-votes'

function readVotes(): Record<string, Vote> {
  try {
    return JSON.parse(localStorage.getItem(VKEY) || '{}')
  } catch {
    return {}
  }
}

export function getVote(id: string): Vote {
  return readVotes()[id] ?? 0
}

// Casts (or clears) a vote; returns the new local state + counter deltas.
export async function castVote(
  id: string,
  dir: 1 | -1,
): Promise<{ vote: Vote; up: number; down: number; score: number }> {
  const votes = readVotes()
  const prev = votes[id] ?? 0
  const next: Vote = prev === dir ? 0 : dir

  let up = 0
  let down = 0
  if (prev === 1) up -= 1
  if (prev === -1) down -= 1
  if (next === 1) up += 1
  if (next === -1) down += 1
  const score = up - down

  const patch: Record<string, unknown> = {}
  if (up) patch.upvotes = increment(up)
  if (down) patch.downvotes = increment(down)
  if (score) patch.score = increment(score)
  if (Object.keys(patch).length) {
    await updateDoc(doc(db, 'templates', id), patch)
  }

  votes[id] = next
  try {
    localStorage.setItem(VKEY, JSON.stringify(votes))
  } catch {
    /* ignore */
  }
  return { vote: next, up, down, score }
}

// Downloads a template as an importable .json file.
export function downloadTemplate(item: GalleryItem) {
  const payload = {
    version: 1,
    name: item.name,
    widgets: item.widgets,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${item.name.replace(/[^a-z0-9]+/gi, '-')}.json`
  a.click()
  URL.revokeObjectURL(url)
}
