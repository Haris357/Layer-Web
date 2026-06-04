import { Shell } from '../components/Shell'

const SECTIONS = [
  {
    h: 'The short version',
    p: 'Layer keeps your stuff on your device. There’s no account required, no tracking, no ads, and nothing is sold. The only things that ever leave your computer are the optional bits you choose — and we tell you exactly what those are below.',
  },
  {
    h: 'What stays on your device',
    p: 'By default everything is local: your widget layouts, notes and sticky-note text, to-do items, clipboard history, inbox, shelf files, and all settings live only in your own Layer folder on your PC. We never receive them.',
  },
  {
    h: 'What Layer accesses on your PC',
    p: 'To power its widgets, Layer reads local information — installed apps, media that’s playing, system stats, disk info, the weather location you set, and notifications. This is used only to display widgets on your screen and is never transmitted to us.',
  },
  {
    h: 'Optional Cloud Sync',
    p: 'Cloud Sync is off unless you turn it on. If you enable it, you sign in with your email via a one-time code (no password), and Layer backs up your Spaces, widget layout, sizes, colors and widget settings to Firebase under your account so they follow you across devices. Private content is deliberately excluded and never uploaded: notes, sticky-note text, to-do text, clipboard, inbox, shelf files, and local file paths stay on your device. You can turn Cloud Sync off at any time; turning it off does not delete anything stored locally.',
  },
  {
    h: 'Your email',
    p: 'We use your email in two cases only: (1) when you download Layer from this website, to send you a welcome message and count the download, and (2) if you enable Cloud Sync, to send the one-time sign-in code and tie your synced layouts to you. We don’t sell or share your email, and we don’t send marketing you didn’t ask for.',
  },
  {
    h: 'Third-party services',
    p: 'Layer talks only to the public APIs needed for the features you use: weather (Open-Meteo), currency rates (Frankfurter), the Space gallery and GitHub (for updates). Cloud Sync, when enabled, uses Google Firebase (Authentication + Firestore). Sign-in codes and the welcome email are sent through our email provider. There is no analytics or telemetry SDK in the app.',
  },
  {
    h: 'Data retention & deletion',
    p: 'Local data is yours — delete it anytime by removing widgets or uninstalling. If you used Cloud Sync and want your synced data and email removed, contact us and we’ll delete them.',
  },
  {
    h: 'Children',
    p: 'Layer is a general-purpose productivity tool and is not directed at children under 13.',
  },
  {
    h: 'Changes & contact',
    p: 'If this policy changes, we’ll update this page. Questions or deletion requests: harisimran7857@gmail.com.',
  },
]

export function Privacy() {
  return (
    <Shell>
      <div className="doc">
        <div className="label">PRIVACY</div>
        <h1 className="display sm">Privacy Policy</h1>
        <p className="lead">
          Plain and honest — your data stays yours.
        </p>
        <p
          className="note"
          style={{ marginTop: -8, marginBottom: 8 }}
        >
          Last updated: June 2026
        </p>
        <div className="sections">
          {SECTIONS.map((s) => (
            <div className="section" key={s.h}>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
