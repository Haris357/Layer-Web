import { Shell } from '../components/Shell'

const DOCS = [
  {
    h: '1 · Install',
    p: 'Run the installer, accept the terms, and Layer sets itself up — it even launches automatically when Windows starts.',
  },
  {
    h: '2 · Summon it',
    p: 'Press Ctrl + Shift + Space to bring Layer forward and edit. Press it again to tuck it back behind your apps.',
  },
  {
    h: '3 · Add widgets',
    p: 'Open the island menu at the top of your screen, or press Ctrl + K, to drop in notes, clocks, weather, stats and more.',
  },
  {
    h: '4 · Arrange',
    p: 'Drag widgets by their handle, resize from the corners, right-click for options. They snap to a grid and to each other.',
  },
  {
    h: 'Updates',
    p: 'Layer checks for new versions from Settings and updates itself in place — you never need to reinstall.',
  },
  {
    h: 'Need help?',
    p: 'The project lives on GitHub for issues and the latest builds — the link sits at the bottom of every page.',
  },
]

export function Docs() {
  return (
    <Shell>
      <div className="doc">
        <div className="label">GETTING STARTED</div>
        <h1 className="display sm">Docs</h1>
        <p className="lead">
          Everything you need to get Layer onto your desktop and arranged.
        </p>
        <div className="sections">
          {DOCS.map((s) => (
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
