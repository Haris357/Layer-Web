import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SEEN_KEY = 'layer_seen_release'

// A small top-center toast that announces the newest Layer release and points
// to the changelog. It pulls the latest tag live from GitHub, shows once per
// version (remembered in localStorage), and quietly does nothing if GitHub
// can't be reached.
export function ReleaseToast() {
  const [tag, setTag] = useState<string | null>(null)
  const [show, setShow] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const ctrl = new AbortController()
    const timeout = window.setTimeout(() => ctrl.abort(), 8000)
    fetch(
      'https://api.github.com/repos/Haris357/Layer-releases/releases/latest',
      { signal: ctrl.signal },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { tag_name?: string }) => {
        const t = data.tag_name
        if (!t || cancelled) return
        let seen: string | null = null
        try {
          seen = localStorage.getItem(SEEN_KEY)
        } catch {
          /* storage blocked — just show it */
        }
        if (seen === t) return
        setTag(t)
        // Let the page settle before sliding it in.
        const id = window.setTimeout(() => setShow(true), 600)
        return () => window.clearTimeout(id)
      })
      .catch(() => {
        /* offline / rate-limited / blocked — no toast, no noise */
      })
      .finally(() => window.clearTimeout(timeout))
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      ctrl.abort()
    }
  }, [])

  const dismiss = () => {
    if (tag) {
      try {
        localStorage.setItem(SEEN_KEY, tag)
      } catch {
        /* ignore */
      }
    }
    setLeaving(true)
    window.setTimeout(() => setShow(false), 260)
  }

  if (!show || !tag) return null

  return (
    <div className={`rel-toast ${leaving ? 'leaving' : ''}`} role="status">
      <span className="rel-dot" />
      <span className="rel-text">
        <strong>Layer {tag}</strong> is out
      </span>
      <Link to="/changelog" className="rel-cta" onClick={dismiss}>
        release notes →
      </Link>
      <button
        type="button"
        className="rel-close"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
