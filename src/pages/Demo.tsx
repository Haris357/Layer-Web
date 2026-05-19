import { useState } from 'react'
import { Shell } from '../components/Shell'

// Screenshot tile that falls back to a labelled placeholder if it can't load.
function Shot({ src, label }: { src: string; label: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return <div className="shot">{label}</div>
  return (
    <img
      className="shot"
      src={src}
      alt={`Layer — ${label}`}
      onError={() => setOk(false)}
    />
  )
}

export function Demo() {
  return (
    <Shell>
      <div className="demo">
        <div className="label">SEE IT</div>
        <h1 className="display sm">Layer, in motion.</h1>

        <div className="demo-video">
          <video
            src="/demo/walkthrough.mp4"
            poster="/demo/poster.jpg"
            controls
            playsInline
            preload="metadata"
          />
        </div>

        <div className="demo-shots">
          <Shot src="/demo/fullscreen.png" label="Fullscreen" />
          <Shot src="/demo/media.png" label="Media widget" />
          <Shot src="/demo/notes.png" label="Notes" />
        </div>
      </div>
    </Shell>
  )
}
