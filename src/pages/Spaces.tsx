import { useCallback, useEffect, useRef, useState } from 'react'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import { Shell } from '../components/Shell'
import { CaretUpIcon, CaretDownIcon, DownloadIcon } from '../components/icons'
import {
  fetchTemplates,
  castVote,
  getVote,
  downloadTemplate,
  type GalleryItem,
  type SortKey,
  type Vote,
} from '../lib/gallery'

function SpaceCard({
  item,
  onOpen,
}: {
  item: GalleryItem
  onOpen: (item: GalleryItem) => void
}) {
  return (
    <button type="button" className="sg-card" onClick={() => onOpen(item)}>
      <div className="sg-shot">
        <img src={item.thumb} alt={item.name} loading="lazy" />
        <span className="sg-view">View space</span>
        <span className="sg-chip">{item.upvotes - item.downvotes}</span>
      </div>
      <div className="sg-meta">
        <div className="sg-name">
          {item.name}
          {item.builtin && <span className="sg-badge">built-in</span>}
        </div>
        <div className="sg-sub">
          by {item.author} · {item.widgetCount} widgets
        </div>
      </div>
    </button>
  )
}

function Lightbox({
  item,
  onClose,
  onVoted,
}: {
  item: GalleryItem
  onClose: () => void
  onVoted: (id: string, up: number, down: number) => void
}) {
  const [vote, setVote] = useState<Vote>(() => getVote(item.id))
  const [up, setUp] = useState(item.upvotes)
  const [down, setDown] = useState(item.downvotes)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const doVote = async (dir: 1 | -1) => {
    if (pending) return
    setPending(true)
    try {
      const r = await castVote(item.id, dir)
      setVote(r.vote)
      setUp((u) => u + r.up)
      setDown((d) => d + r.down)
      onVoted(item.id, r.up, r.down)
    } catch {
      /* ignore */
    }
    setPending(false)
  }

  return (
    <div className="sg-lb" onMouseDown={onClose}>
      <div className="sg-lb-card" onMouseDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="sg-lb-x"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="sg-lb-shot">
          <img src={item.thumb} alt={item.name} />
        </div>
        <div className="sg-lb-info">
          <div className="sg-lb-head">
            <div className="sg-lb-titles">
              <h3 className="sg-lb-name">
                {item.name}
                {item.builtin && <span className="sg-badge">built-in</span>}
              </h3>
              <div className="sg-sub">
                by {item.author} · {item.widgetCount} widgets
              </div>
            </div>
            <div
              className={`sg-vote ${vote === 1 ? 'up' : vote === -1 ? 'down' : ''}`}
            >
              <button
                type="button"
                className="sg-vbtn"
                aria-label="Upvote"
                onClick={() => doVote(1)}
              >
                <CaretUpIcon />
              </button>
              <span className="sg-score">{up - down}</span>
              <button
                type="button"
                className="sg-vbtn"
                aria-label="Downvote"
                onClick={() => doVote(-1)}
              >
                <CaretDownIcon />
              </button>
            </div>
          </div>
          {item.description && <p className="sg-lb-desc">{item.description}</p>}
          <button
            type="button"
            className="sg-get"
            onClick={() => downloadTemplate(item)}
          >
            <DownloadIcon size={14} /> Get this space
          </button>
        </div>
      </div>
    </div>
  )
}

export function Spaces() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [sort, setSort] = useState<SortKey>('new')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
  const [active, setActive] = useState<GalleryItem | null>(null)
  const cursorRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async (s: SortKey, reset: boolean) => {
    if (reset) {
      setLoading(true)
      cursorRef.current = null
    } else {
      setLoadingMore(true)
    }
    setError(false)
    try {
      const page = await fetchTemplates(s, reset ? null : cursorRef.current)
      cursorRef.current = page.cursor
      setItems((prev) => (reset ? page.items : [...prev, ...page.items]))
      setDone(page.done)
    } catch {
      setError(true)
    }
    setLoading(false)
    setLoadingMore(false)
  }, [])

  useEffect(() => {
    load(sort, true)
  }, [sort, load])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          !loadingMore &&
          !done &&
          !error
        ) {
          load(sort, false)
        }
      },
      { rootMargin: '320px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [load, sort, loading, loadingMore, done, error])

  const onVoted = (id: string, u: number, d: number) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, upvotes: it.upvotes + u, downvotes: it.downvotes + d }
          : it,
      ),
    )

  return (
    <Shell scroll>
      <div className="sg">
        <div className="sg-head">
          <div className="label">SPACE GALLERY</div>
          <h1 className="display sm">Spaces from the community.</h1>
          <p className="lead">
            Whole Layer layouts, shared by people. Open one to see it full-size,
            vote it up, and make it yours in a click.
          </p>
          <div className="sg-sort">
            <button
              type="button"
              className={sort === 'new' ? 'on' : ''}
              onClick={() => setSort('new')}
            >
              Newest
            </button>
            <button
              type="button"
              className={sort === 'top' ? 'on' : ''}
              onClick={() => setSort('top')}
            >
              Top rated
            </button>
          </div>
        </div>

        {error && items.length === 0 ? (
          <div className="sg-state">
            Couldn’t load the gallery.
            <button type="button" onClick={() => load(sort, true)}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="sg-grid">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="sg-card">
                      <div className="sg-shot skel" />
                      <div className="sg-meta">
                        <div className="skel skel-line" style={{ width: '55%' }} />
                        <div
                          className="skel skel-line"
                          style={{ width: '40%', height: 9 }}
                        />
                      </div>
                    </div>
                  ))
                : items.map((it) => (
                    <SpaceCard key={it.id} item={it} onOpen={setActive} />
                  ))}
              {loadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`more-${i}`} className="sg-card">
                    <div className="sg-shot skel" />
                    <div className="sg-meta">
                      <div className="skel skel-line" style={{ width: '55%' }} />
                    </div>
                  </div>
                ))}
            </div>

            {!loading && items.length === 0 && (
              <div className="sg-state">
                No spaces yet — be the first to publish one from the app.
              </div>
            )}
            {!loading && done && items.length > 0 && (
              <div className="sg-end">that’s everything ✦</div>
            )}
            <div ref={sentinelRef} className="sg-sentinel" />
          </>
        )}
      </div>

      {active && (
        <Lightbox
          item={active}
          onClose={() => setActive(null)}
          onVoted={onVoted}
        />
      )}
    </Shell>
  )
}
