import type { TplWidget } from '../lib/templates'

// Renders a template's real widget layout, scaled to fit a 16:9 frame.
export function TemplatePreview({ widgets }: { widgets: TplWidget[] }) {
  const minX = Math.min(...widgets.map((w) => w.x))
  const minY = Math.min(...widgets.map((w) => w.y))
  const maxX = Math.max(...widgets.map((w) => w.x + w.width))
  const maxY = Math.max(...widgets.map((w) => w.y + w.height))
  const bw = maxX - minX
  const bh = maxY - minY
  const fitWide = bw / bh > 16 / 9

  return (
    <div className="tpl-canvas">
      <div
        className="tpl-frame"
        style={{
          aspectRatio: `${bw} / ${bh}`,
          ...(fitWide ? { width: '100%' } : { height: '100%' }),
        }}
      >
        {widgets.map((w, i) => (
          <div
            key={i}
            className="tpl-widget"
            style={{
              left: `${((w.x - minX) / bw) * 100}%`,
              top: `${((w.y - minY) / bh) * 100}%`,
              width: `${(w.width / bw) * 100}%`,
              height: `${(w.height / bh) * 100}%`,
            }}
          >
            <span>{w.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
