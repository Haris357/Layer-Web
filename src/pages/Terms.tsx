import { Shell } from '../components/Shell'

const TERMS = [
  {
    h: 'Using Layer',
    p: 'Layer is free to install and use on computers you own. Please don’t resell or redistribute it for profit without permission.',
  },
  {
    h: 'Your privacy',
    p: 'Layer needs no account. Your canvas, notes and settings stay on your device. The website stores only the email you give us to download.',
  },
  {
    h: 'What it accesses',
    p: 'To power its widgets, Layer reads local data — installed apps, media, system stats and notifications. None of it is sent to us.',
  },
  {
    h: 'No warranty',
    p: 'Layer is provided “as is”, without warranty of any kind. You use it at your own risk, and updates fall under these same terms.',
  },
]

export function Terms() {
  return (
    <Shell>
      <div className="doc">
        <div className="label">THE FINE PRINT</div>
        <h1 className="display sm">Terms of Service</h1>
        <p className="lead">
          Short and plain — the whole point of Layer is to stay out of your way.
        </p>
        <div className="sections">
          {TERMS.map((s) => (
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
