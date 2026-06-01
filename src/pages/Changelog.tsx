import { useEffect, useState } from 'react'
import { Shell } from '../components/Shell'
import { renderMarkdown } from '../lib/markdown'
import { LINKS } from '../lib/links'

interface Release {
  tag_name: string
  name: string
  published_at: string
  body: string
  html_url: string
}

const API = 'https://api.github.com/repos/Haris357/Layer-releases/releases'
const CACHE_KEY = 'layer_releases_cache'

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function readCache(): Release[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as Release[]) : null
  } catch {
    return null
  }
}

export function Changelog() {
  // Seed from the last good fetch so the page has something instantly, even
  // if GitHub is slow or unreachable this time.
  const [items, setItems] = useState<Release[] | null>(() => readCache())
  const [error, setError] = useState(false)

  useEffect(() => {
    // Bail out of a hung request instead of spinning forever.
    const ctrl = new AbortController()
    const timeout = window.setTimeout(() => ctrl.abort(), 8000)

    fetch(API, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Release[]) => {
        setItems(data)
        setError(false)
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data))
        } catch {
          /* storage full / blocked — fine, just won't cache */
        }
      })
      .catch(() => {
        // Couldn't refresh. If we have nothing cached to show, flag the error.
        setItems((cur) => {
          if (!cur) setError(true)
          return cur
        })
      })
      .finally(() => window.clearTimeout(timeout))

    return () => {
      window.clearTimeout(timeout)
      ctrl.abort()
    }
  }, [])

  return (
    <Shell scroll>
      <div className="ch">
        <div className="ch-head">
          <div className="label">CHANGELOG</div>
          <h1 className="display sm">What’s changed.</h1>
          <p className="lead">
            Every Layer release, newest first — pulled live from GitHub.
          </p>
        </div>

        {items === null && !error && (
          <div className="ch-state">Loading releases…</div>
        )}

        {error && (
          <div className="ch-state">
            <p>Couldn’t reach GitHub right now.</p>
            <p style={{ marginTop: 10 }}>
              You can view every release directly on{' '}
              <a href={LINKS.releasesPage} target="_blank" rel="noreferrer">
                GitHub
              </a>
              .
            </p>
          </div>
        )}

        {items && items.length === 0 && (
          <div className="ch-state">No releases yet.</div>
        )}

        {items && items.length > 0 && (
          <div className="ch-list">
            {items.map((r) => (
              <article key={r.tag_name} className="ch-card">
                <header className="ch-meta">
                  <span className="ch-version">{r.tag_name}</span>
                  <span className="ch-date">
                    {formatDate(r.published_at)}
                  </span>
                </header>
                {r.name && r.name !== r.tag_name && (
                  <h2 className="ch-name">{r.name}</h2>
                )}
                <div
                  className="ch-body"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(r.body || ''),
                  }}
                />
                <a
                  className="ch-source"
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  view on GitHub →
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </Shell>
  )
}
