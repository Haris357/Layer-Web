import { useCallback, useEffect, useRef, useState } from 'react'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import { Shell } from '../components/Shell'
import {
  CaretUpIcon,
  CaretDownIcon,
  DownloadIcon,
} from '../components/icons'
import {
  fetchTemplates,
  castVote,
  getVote,
  downloadTemplate,
  type GalleryItem,
  type SortKey,
  type Vote,
} from '../lib/gallery'

function SkeletonCard() {
  return (
    <div className="gx-card">
      <div className="gx-thumb skel" />
      <div className="gx-body">
        <div className="skel skel-line" style={{ width: '52%' }} />
        <div className="skel skel-line" style={{ width: '88%', height: 9 }} />
        <div className="skel skel-line" style={{ width: '66%', height: 9 }} />
      </div>
    </div>
  )
}

function Card({ item }: { item: GalleryItem }) {
  const [vote, setVote] = useState<Vote>(() => getVote(item.id))
  const [up, setUp] = useState(item.upvotes)
  const [down, setDown] = useState(item.downvotes)
  const [pending, setPending] = useState(false)

  const doVote = async (dir: 1 | -1) => {
    if (pending) return
    setPending(true)
    try {
      const r = await castVote(item.id, dir)
      setVote(r.vote)
      setUp((u) => u + r.up)
      setDown((d) => d + r.down)
    } catch {
      /* ignore */
    }
    setPending(false)
  }

  return (
    <div className="gx-card">
      <div className="gx-thumb">
        <img src={item.thumb} alt={item.name} loading="lazy" />
      </div>
      <div className="gx-body">
        <div className="gx-title">
          <span className="gx-name">{item.name}</span>
          {item.builtin && <span className="gx-badge">built-in</span>}
        </div>
        <div className="gx-author">
          by {item.author} · {item.widgetCount} widgets
        </div>
        <p className="gx-desc">{item.description}</p>
      </div>
      <div className="gx-foot">
        <div
          className={`gx-vote ${vote === 1 ? 'up' : vote === -1 ? 'down' : ''}`}
        >
          <button
            type="button"
            className="gx-vbtn"
            aria-label="Upvote"
            onClick={() => doVote(1)}
          >
            <CaretUpIcon />
          </button>
          <span className="gx-score">{up - down}</span>
          <button
            type="button"
            className="gx-vbtn"
            aria-label="Downvote"
            onClick={() => doVote(-1)}
          >
            <CaretDownIcon />
          </button>
        </div>
        <button
          type="button"
          className="gx-dl"
          onClick={() => downloadTemplate(item)}
        >
          <DownloadIcon size={13} /> Get
        </button>
      </div>
    </div>
  )
}

export function Templates() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [sort, setSort] = useState<SortKey>('new')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
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

  return (
    <Shell scroll>
      <div className="gx">
        <div className="gx-head">
          <div className="label">GALLERY</div>
          <h1 className="display sm">The template gallery.</h1>
          <p className="lead">
            Real layouts from the Layer community — find one you like, vote it
            up, make it yours.
          </p>
          <div className="gx-sort">
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
          <div className="gx-state">
            Couldn’t load the gallery.
            <button type="button" onClick={() => load(sort, true)}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="gx-grid">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : items.map((it) => <Card key={it.id} item={it} />)}
              {loadingMore &&
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={`more-${i}`} />
                ))}
            </div>

            {!loading && items.length === 0 && (
              <div className="gx-state">
                No templates yet — be the first to publish one from the app.
              </div>
            )}
            {!loading && done && items.length > 0 && (
              <div className="gx-end">that’s everything ✦</div>
            )}
            <div ref={sentinelRef} className="gx-sentinel" />
          </>
        )}
      </div>
    </Shell>
  )
}
