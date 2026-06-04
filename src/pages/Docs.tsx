import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { LINKS } from '../lib/links'

const BASICS = [
  {
    h: 'Install',
    p: 'Download Layer-Setup.exe and run it — no setup wizard to click through. Layer installs to your user folder and opens straight onto your desktop. You can turn on "Launch on startup" in Settings.',
  },
  {
    h: 'Summon & edit',
    p: 'Move your mouse to the pill at the top-centre of the screen, or press Ctrl + Shift + Space, to open the dock and enter edit mode. Press it again to tuck everything back behind your apps.',
  },
  {
    h: 'Add widgets',
    p: 'Open the dock and click any widget icon to drop it on the canvas. Some widgets (like the Clock) open a small menu to pick a style first.',
  },
  {
    h: 'Arrange',
    p: 'Drag a widget by its handle, resize from the corners, and right-click for options. Widgets snap to a grid and to each other; lock them when the layout is just right.',
  },
  {
    h: 'Make it yours',
    p: 'Right-click any widget for its Color menu — pick an accent (preset swatches or a custom colour) and an Auto / Light / Dark look. Match the global accent to your wallpaper in Settings → Appearance.',
  },
  {
    h: 'Spaces',
    p: 'Spaces are separate layouts you can switch between — one for work, one for focus, and so on. Cycle them with Ctrl + Shift + E or the top-left hot corner, and manage them from the Spaces panel.',
  },
  {
    h: 'Cloud Sync (optional)',
    p: 'In Settings → Cloud Sync, opt in and sign in with a one-time email code to back up your layouts across PCs. Your private content (notes, sticky text, clipboard, shelf) always stays on your device.',
  },
  {
    h: 'Updates',
    p: 'The direct download updates itself in the background and lets you relaunch when you’re ready. The Microsoft Store version updates through the Store.',
  },
]

const SHORTCUTS = [
  { label: 'Open / close the dock', keys: 'Ctrl + Shift + Space' },
  { label: 'Quick capture a note', keys: 'Ctrl + Shift + N' },
  { label: 'Cycle Spaces', keys: 'Ctrl + Shift + E' },
  { label: 'Peek at the desktop (hold)', keys: 'Ctrl + Shift + `' },
  { label: 'Preview the screensaver', keys: 'Ctrl + Shift + S' },
]

export function Docs() {
  return (
    <Shell>
      <div className="doc">
        <div className="label">GETTING STARTED</div>
        <h1 className="display sm">Docs</h1>
        <p className="lead">
          Everything you need to get Layer onto your desktop and make it yours.
        </p>

        <div className="sections">
          {BASICS.map((s) => (
            <div className="section" key={s.h}>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>

        <div className="doc-group-title">Keyboard shortcuts</div>
        <div className="shortcuts">
          {SHORTCUTS.map((s) => (
            <div className="shortcut-row" key={s.label}>
              <span>{s.label}</span>
              <kbd>{s.keys}</kbd>
            </div>
          ))}
        </div>
        <p className="doc-note">
          The summon shortcut is configurable in Settings → Shortcuts.
        </p>

        <div className="doc-group-title">Need help?</div>
        <div className="shortcuts">
          <div className="shortcut-row">
            <span>Report a bug or request a feature</span>
            <a href={LINKS.repo} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
          <div className="shortcut-row">
            <span>How your data is handled</span>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>

        <div className="doc-cta">
          <Link className="demo-dl" to="/download">
            Download Layer
          </Link>
        </div>
      </div>
    </Shell>
  )
}
