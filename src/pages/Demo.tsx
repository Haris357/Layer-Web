import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell'

interface Section {
  eyebrow: string
  title: string
  body: string
  reverse?: boolean
  media:
    | { kind: 'image'; src: string; alt: string }
    | { kind: 'video'; src: string; poster?: string; alt: string }
}

const SECTIONS: Section[] = [
  {
    eyebrow: 'A CANVAS OF WIDGETS',
    title: 'Your desktop, but useful.',
    body:
      'Drop notes, clocks, weather, system stats, calendars and more onto your desktop. Drag them anywhere, snap to a grid, lock them when you have it just right — they sit quietly behind your apps until you need them.',
    media: {
      kind: 'image',
      src: '/demo/poster.png',
      alt: 'A full Layer canvas of widgets on the desktop',
    },
  },
  {
    eyebrow: 'A REAL JOURNAL',
    title: 'Write where you work.',
    body:
      'The note widget is a full journaling app — multiple entries with history, beautiful typefaces, a focus timer with retro chimes, light and dark themes, and one-click fullscreen for distraction-free writing.',
    reverse: true,
    media: {
      kind: 'video',
      src: '/demo/noteswidget.mp4',
      poster: '/demo/notes.png',
      alt: 'The Layer note widget in motion',
    },
  },
  {
    eyebrow: 'NOW PLAYING',
    title: 'See the music without leaving your flow.',
    body:
      'A media player that listens to Windows — track, artist, live waveform visualizer, transport controls, and a volume dial all in one calm tile that follows whatever you’re playing.',
    media: {
      kind: 'image',
      src: '/demo/media.png',
      alt: 'The Layer media widget',
    },
  },
]

export function Demo() {
  return (
    <Shell scroll>
      <div className="demo2">
        <header className="demo-hero">
          <div className="label">SEE IT IN MOTION</div>
          <h1 className="display">Layer, in motion.</h1>
          <p className="lead">
            A quiet layer of widgets that lives on your desktop. Watch a
            quick walkthrough — then jump into the bits below.
          </p>
          <div className="demo-hero-video">
            <video
              src="/demo/walkthrough.mp4"
              poster="/demo/poster.png"
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </header>

        <div className="demo-sections">
          {SECTIONS.map((s) => (
            <section
              key={s.title}
              className={`demo-row ${s.reverse ? 'reverse' : ''}`}
            >
              <div className="demo-text">
                <div className="label">{s.eyebrow}</div>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </div>
              <div className="demo-media">
                {s.media.kind === 'video' ? (
                  <video
                    src={s.media.src}
                    poster={s.media.poster}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={s.media.alt}
                  />
                ) : (
                  <img
                    src={s.media.src}
                    alt={s.media.alt}
                    loading="lazy"
                  />
                )}
              </div>
            </section>
          ))}
        </div>

        <section className="demo-showcase">
          <div className="label">EVEN WHEN YOU STEP AWAY</div>
          <h2 className="display sm">A screensaver, too.</h2>
          <p className="lead">
            Leave your machine for a bit and Layer becomes a calm, full-screen
            screensaver — a big clock, the date, your local weather, and
            whatever’s playing, drifting over a soft ambient backdrop. It sets
            itself up automatically, and a tap of any key brings you back.
          </p>
          <div className="demo-shot">
            <img
              src="/screensaver.png"
              alt="The Layer screensaver — clock, date, local weather and now playing over an ambient backdrop"
              loading="lazy"
            />
          </div>
        </section>

        <div className="demo-cta">
          <h2 className="display sm">Yours in a minute.</h2>
          <p className="lead">Free, no account, Windows 10 &amp; 11.</p>
          <Link className="demo-dl" to="/?download=1">
            Download Layer
          </Link>
        </div>
      </div>
    </Shell>
  )
}
