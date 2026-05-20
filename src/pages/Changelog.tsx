import { useEffect, useState } from 'react'
import { Shell } from '../components/Shell'
import { renderMarkdown } from '../lib/markdown'

interface Release {
  tag_name: string
  name: string
  published_at: string
  body: string
  html_url: string
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function Changelog() {
  const [items, setItems] = useState<Release[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(
      'https://api.github.com/repos/Haris357/Layer-releases/releases',
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Release[]) => setItems(data))
      .catch(() => setError(true))
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
            Couldn’t reach GitHub right now. Try again in a moment.
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
