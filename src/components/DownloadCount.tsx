import { useEffect, useRef, useState } from 'react'
import { DownloadIcon } from './icons'

const RELEASES_API =
  'https://api.github.com/repos/Haris357/Layer-releases/releases'

// Real download total = sum of every release installer's GitHub download_count.
async function fetchDownloads(): Promise<number | null> {
  try {
    const res = await fetch(RELEASES_API)
    if (!res.ok) return null
    const releases: Array<{
      assets?: Array<{ name: string; download_count: number }>
    }> = await res.json()
    let total = 0
    for (const rel of releases) {
      for (const asset of rel.assets ?? []) {
        if (asset.name.toLowerCase().endsWith('.exe')) {
          total += asset.download_count ?? 0
        }
      }
    }
    return total
  } catch {
    return null
  }
}

export function DownloadCount() {
  const [count, setCount] = useState<number | null>(null)
  const [shown, setShown] = useState(0)
  const raf = useRef(0)

  // Fetch on mount, then refresh every 5 minutes.
  useEffect(() => {
    let alive = true
    const load = () =>
      fetchDownloads().then((n) => {
        if (alive && n !== null) setCount(n)
      })
    load()
    const id = window.setInterval(load, 5 * 60 * 1000)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  // Count up toward the latest real number whenever it changes.
  useEffect(() => {
    if (count === null) return
    const from = shown
    const to = count
    if (from === to) return
    const start = performance.now()
    const dur = 900
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(from + (to - from) * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [count]) // eslint-disable-line react-hooks/exhaustive-deps

  if (count === null) return null

  return (
    <div className="dlcount" title="Live installs from GitHub releases">
      <span className="dot" />
      <DownloadIcon size={13} />
      <span>
        <strong>{shown.toLocaleString()}</strong> downloads
      </span>
    </div>
  )
}
