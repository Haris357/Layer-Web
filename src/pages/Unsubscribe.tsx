import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { setEmailUnsubscribed } from '../lib/firebase'

type Status = 'loading' | 'form' | 'done' | 'resubscribed'

// Link-style button matching the site's "did you mean" affordance on /download.
const linkBtn: React.CSSProperties = {
  color: 'var(--ink)',
  fontWeight: 600,
  textDecoration: 'underline',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  font: 'inherit',
}

export function Unsubscribe() {
  const [params] = useSearchParams()
  const queryEmail = (params.get('e') || '').trim()
  const [email, setEmail] = useState(queryEmail)
  // With an ?e= link we unsubscribe immediately; otherwise show a small form.
  const [status, setStatus] = useState<Status>(queryEmail ? 'loading' : 'form')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!queryEmail) return
    let cancelled = false
    // A missing entry / offline error is fine — they end up unsubscribed either
    // way, and we never reveal whether an address was on the list.
    setEmailUnsubscribed(queryEmail, true)
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setStatus('done')
      })
    return () => {
      cancelled = true
    }
  }, [queryEmail])

  const target = (queryEmail || email).trim()

  const submit = async () => {
    if (!email.includes('@')) return
    setBusy(true)
    await setEmailUnsubscribed(email.trim(), true).catch(() => {})
    setBusy(false)
    setStatus('done')
  }

  const resubscribe = async () => {
    if (!target) return
    setBusy(true)
    await setEmailUnsubscribed(target, false).catch(() => {})
    setBusy(false)
    setStatus('resubscribed')
  }

  return (
    <Shell>
      <div className="hero">
        <div className="label">EMAIL PREFERENCES</div>

        {status === 'loading' && (
          <>
            <h1 className="display sm">Unsubscribing…</h1>
            <p className="lead">One moment.</p>
          </>
        )}

        {status === 'form' && (
          <>
            <h1 className="display sm">Unsubscribe from Layer emails.</h1>
            <p className="lead">
              Enter your email and we’ll stop sending you release updates.
            </p>
            <div className="signup">
              <input
                type="email"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !busy) submit()
                }}
              />
              <button
                type="button"
                onClick={submit}
                disabled={busy || !email.includes('@')}
              >
                {busy ? '…' : 'unsubscribe'}
              </button>
            </div>
          </>
        )}

        {status === 'done' && (
          <>
            <h1 className="display sm">You’re unsubscribed.</h1>
            <p className="lead">
              {target ? (
                <>
                  We won’t email <strong>{target}</strong> about Layer updates
                  anymore.
                </>
              ) : (
                <>You won’t get Layer release emails anymore.</>
              )}{' '}
              Changed your mind?
            </p>
            <div className="note" style={{ marginTop: 16 }}>
              <button
                type="button"
                onClick={resubscribe}
                disabled={busy}
                style={linkBtn}
              >
                {busy ? '…' : 'Resubscribe'}
              </button>
            </div>
          </>
        )}

        {status === 'resubscribed' && (
          <>
            <h1 className="display sm">You’re back on the list.</h1>
            <p className="lead">
              You’ll get future Layer release updates again.
            </p>
          </>
        )}
      </div>
    </Shell>
  )
}
