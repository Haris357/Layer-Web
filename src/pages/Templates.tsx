import { Shell } from '../components/Shell'
import { TemplatePreview } from '../components/TemplatePreview'
import { TEMPLATES } from '../lib/templates'

export function Templates() {
  return (
    <Shell>
      <div className="gallery">
        <div className="label">TEMPLATES</div>
        <h1 className="display sm">Start from a layout.</h1>
        <p className="lead">
          Every copy of Layer ships with these arrangements — pick one,
          then make it yours.
        </p>

        <div className="tpl-grid">
          {TEMPLATES.map((t) => (
            <div className="tpl-card" key={t.id}>
              <TemplatePreview widgets={t.widgets} />
              <div className="tpl-meta">
                <div className="tpl-name">
                  {t.name}
                  <span>{t.widgets.length} widgets</span>
                </div>
                <div className="tpl-desc">{t.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
