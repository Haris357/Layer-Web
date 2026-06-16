import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Shell } from '../components/Shell'
import { DownloadCount } from '../components/DownloadCount'
import { db, countDownloadOnce } from '../lib/firebase'
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

  const onDownload = async (arch: 'x64' | 'arm64' = 'x64') => {
    const value = email.trim()
    if (!isValidEmail(value)) {
      setMsg({ kind: 'error', text: 'Please enter a valid email address.' })
      inputRef.current?.focus()
      return
    }
    setBusy(true)
    setMsg({ kind: 'ok', text: 'checking your email…' })

    // Verify the email is real + deliverable (server does an MX lookup) and
    // send the welcome mail in the same call. A 400 means the address can't
    // receive mail — block the download. Any other outcome (success, our
    // server erroring, or being unreachable) lets the user through so our
    // downtime never blocks a legit download.
    const api = import.meta.env.VITE_EMAIL_API_URL
    if (api) {
      try {
        const res = await fetch(`${api}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: value }),
        })
        if (res.status === 400) {
          setBusy(false)
          setMsg({
            kind: 'error',
            text: "That email can’t receive mail — double-check the address.",
          })
          inputRef.current?.focus()
          return
        }
      } catch {
        /* network/our problem — let the download proceed */
      }
    }

    // Store the email keyed by the address itself, so the same person never
    // creates a duplicate doc — they stay a single entry on the list (and
    // still get every email I send). Best effort, never blocks the download.
    try {
      const id = encodeURIComponent(value.toLowerCase())
      await setDoc(doc(db, 'emails', id), {
        email: value,
        createdAt: serverTimestamp(),
        platform: 'windows',
        arch,
        source: 'website',
      })
    } catch {
      /* already on the list, or offline — either way, carry on */
    }

    // Bump the public download counter once per browser (never auto-updates,
    // never the same person twice). Best effort — fire and forget.
    void countDownloadOnce()

    // Start the installer download (native ARM64 build for ARM PCs, else x64).
    window.location.href =
      arch === 'arm64' ? LINKS.downloadArm64 : LINKS.download
    setBusy(false)
    setMsg({
      kind: 'ok',
      text:
        arch === 'arm64'
          ? 'Your ARM64 download is starting — check your inbox for a hello from us.'
          : 'Your download is starting — check your inbox for a hello from us.',
    })
  }

  return (
    <Shell>
      <div className="hero">
        <div className="label">GET LAYER</div>
        <h1 className="display">get Layer for Windows.</h1>
        <p className="lead">
          Layer is on the Microsoft Store — one click to install, automatic
          updates, and Microsoft-verified, so there are no SmartScreen or
          antivirus warnings. Prefer a plain installer? Grab it directly below.
        </p>

        <a
          className="store-btn"
          href={LINKS.store}
          target="_blank"
          rel="noreferrer"
          onClick={() => void countDownloadOnce()}
          style={{ marginTop: 26 }}
        >
          <span className="ms-logo">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="st">
            <small>Get it from</small>
            Microsoft Store
          </span>
        </a>

        <div className="dl-or">or download the installer directly</div>

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
            onClick={() => onDownload('x64')}
            disabled={busy || !valid}
          >
            {busy ? 'preparing…' : 'download'}
          </button>
        </div>

        <div className="dl-arch">
          <span>Intel/AMD (x64) by default. On a Windows ARM PC? </span>
          <button
            type="button"
            onClick={() => onDownload('arm64')}
            disabled={busy || !valid}
          >
            Get the ARM64 build
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
              : 'for Windows 10 & 11'}
          </div>
        )}

        <DownloadCount />

        <div className="note" style={{ marginTop: 8 }}>
          <Link
            to="/spaces"
            style={{ color: 'var(--muted)', fontWeight: 500 }}
          >
            browse spaces
          </Link>
          <span style={{ margin: '0 8px' }}>·</span>
          <Link to="/" style={{ color: 'var(--muted)', fontWeight: 500 }}>
            see it in motion
          </Link>
        </div>

        <div className="dl-notes">
          <div className="dl-note">
            <div className="label">WHAT TO EXPECT</div>
            <p>
              The installer is small and sets up in a few seconds — no setup
              wizard to click through. Layer launches straight onto your
              desktop, you can have it start with Windows from Settings, and it
              keeps itself up to date in the background. Everything lives in
              your own <code>%AppData%\Layer</code> folder, and it uninstalls
              cleanly whenever you want.
            </p>
          </div>

          <div className="dl-note">
            <div className="label">A NOTE ON ANTIVIRUS</div>
            <p>
              Heads up: a couple of antivirus engines may flag Layer as a
              false positive. It isn’t malware. They react to two things Layer
              genuinely does to work — a global hotkey (so quick‑capture works
              anywhere) and a transparent full‑screen desktop overlay (which is
              literally what Layer is). Microsoft Defender and roughly 68 of 70
              engines on VirusTotal pass it clean.
            </p>
            <p>
              Layer runs as a normal app — no drivers, no services, no
              system‑level changes. It only talks to the public APIs for the
              features you use (weather, currency rates, the Space gallery, and
              GitHub for updates), and it has no telemetry or tracking. The full
              detail is on the{' '}
              <a
                href={LINKS.repo}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--ink)', fontWeight: 600 }}
              >
                releases page
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Shell>
  )
}
