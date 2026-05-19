import { useState } from 'react'
import { Shell } from '../components/Shell'

// Screenshot tile that falls back to a labelled placeholder until a real
// image is dropped into /public/demo.
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
  const [videoOk, setVideoOk] = useState(true)

  return (
    <Shell>
      <div className="demo">
        <div className="label">SEE IT</div>
        <h1 className="display sm">Layer, in motion.</h1>

        <div className="demo-video">
          {videoOk ? (
            <video
              src="/demo/walkthrough.mp4"
              poster="/demo/poster.png"
              controls
              playsInline
              onError={() => setVideoOk(false)}
            />
          ) : (
            <div className="demo-placeholder">
              <img src="/layer-icon.svg" width={40} height={40} alt="" />
              <span>Walkthrough video coming soon</span>
            </div>
          )}
        </div>

        <div className="demo-shots">
          <Shot src="/demo/shot-1.png" label="Canvas" />
          <Shot src="/demo/shot-2.png" label="Widgets" />
          <Shot src="/demo/shot-3.png" label="Journal" />
        </div>
      </div>
    </Shell>
  )
}
