import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Shell } from '../components/Shell'
import { DownloadCount } from '../components/DownloadCount'
import { db } from '../lib/firebase'
import { LINKS } from '../lib/links'
import { isValidEmail, suggestEmail } from '../lib/email'

type Msg = { kind: 'error' | 'ok'; text: string }

export function Home() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<Msg | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchParams] = useSearchParams()

  // If we arrive from /demo's download button (?download=1), focus the
  // email input + hint the user that an email is required.
  useEffect(() => {
    if (searchParams.get('download') === '1') {
      const id = window.setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 80)
      setMsg({
        kind: 'ok',
        text: 'Drop your email below to get Layer.',
      })
      return () => window.clearTimeout(id)
    }
  }, [searchParams])

  const valid = isValidEmail(email)
  const suggestion = valid ? null : suggestEmail(email)

  const onDownload = async () => {
    const value = email.trim()
    if (!isValidEmail(value)) {
      setMsg({ kind: 'error', text: 'Please enter a valid email address.' })
      inputRef.current?.focus()
      return
    }
    setBusy(true)
    setMsg(null)

    // Store the email — best effort, never blocks the download.
    try {
      await addDoc(collection(db, 'emails'), {
        email: value,
        createdAt: serverTimestamp(),
        platform: 'windows',
        source: 'website',
      })
    } catch {
      /* ignore */
    }

    // Fire off the welcome email without waiting on it.
    const api = import.meta.env.VITE_EMAIL_API_URL
    if (api) {
      fetch(`${api}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      }).catch(() => {})
    }

    // Start the installer download.
    window.location.href = LINKS.download
    setBusy(false)
    setMsg({
      kind: 'ok',
      text: 'Your download is starting — check your inbox for a hello from us.',
    })
  }

  return (
    <Shell>
      <div className="hero">
        <div className="label">MEET LAYER</div>
        <h1 className="display">widgets that live on your desktop.</h1>
        <p className="lead">
          Layer drops notes, clocks, weather and dozens of widgets right onto
          your desktop — sitting quietly behind your apps until you need them.
          Summon it with a hotkey, arrange your canvas, make it yours.
        </p>

        <div className="signup">
          <input
            ref={inputRef}
            type="email"
            placeholder="enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !busy) onDownload()
            }}
          />
          <button
            type="button"
            onClick={onDownload}
            disabled={busy || !valid}
          >
            {busy ? 'preparing…' : 'download'}
          </button>
        </div>

        {suggestion ? (
          <div className="note">
            did you mean{' '}
            <button
              type="button"
              onClick={() => setEmail(suggestion)}
              style={{
                color: 'var(--ink)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              {suggestion}
            </button>
            ?
          </div>
        ) : (
          <div className={`note ${msg?.kind ?? ''}`}>
            {msg
              ? msg.text
              : 'for Windows 10 & 11 · free · no account needed'}
          </div>
        )}

        <DownloadCount />

        <div className="note" style={{ marginTop: 8 }}>
          <Link
            to="/templates"
            style={{ color: 'var(--muted)', fontWeight: 500 }}
          >
            browse templates
          </Link>
          <span style={{ margin: '0 8px' }}>·</span>
          <Link to="/demo" style={{ color: 'var(--muted)', fontWeight: 500 }}>
            watch a quick demo
          </Link>
        </div>
      </div>
    </Shell>
  )
}
