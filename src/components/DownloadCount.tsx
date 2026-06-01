import { useEffect, useRef, useState } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { DownloadIcon } from './icons'
import { downloadsDoc } from '../lib/firebase'

// Compact, capped formatting: 1000 → 1k, 1500 → 1.5k, 1_200_000 → 1.2m.
// Under 1000 stays exact.
function compact(n: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
    .format(n)
    .toLowerCase()
}

export function DownloadCount() {
  const [count, setCount] = useState<number | null>(null)
  const [shown, setShown] = useState(0)
  const raf = useRef(0)

  // Live subscription to the shared counter — counts genuine first-time
  // downloads only (not auto-updates or repeat downloads), so it updates the
  // instant anyone grabs Layer.
  useEffect(() => {
    const unsub = onSnapshot(
      downloadsDoc,
      (snap) => {
        const n = snap.data()?.count
        if (typeof n === 'number') setCount(n)
      },
      () => {},
    )
    return unsub
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
        <strong>{compact(shown)}</strong> downloads
      </span>
    </div>
  )
}
