import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell'

const TERMS = [
  {
    h: 'Acceptance',
    p: 'By downloading, installing or using Layer ("the app"), you agree to these Terms. If you don’t agree, please don’t use the app.',
  },
  {
    h: 'License',
    p: 'Layer is free to download and use for personal and commercial purposes on devices you own or control. You’re granted a non-exclusive, revocable licence to use it. Please don’t resell it, charge others for it, or redistribute modified copies without permission.',
  },
  {
    h: 'Acceptable use',
    p: 'Don’t use Layer to break the law, or attempt to disrupt, reverse-engineer for malicious purposes, or abuse the services it connects to (such as the weather, currency, gallery or sync APIs).',
  },
  {
    h: 'Your content',
    p: 'Anything you create in Layer — notes, layouts, settings — is yours. It stays on your device unless you choose to use optional features like the Space gallery or Cloud Sync. If you publish a layout to the gallery, you confirm you have the right to share it.',
  },
  {
    h: 'Cloud Sync',
    p: 'Cloud Sync is optional and off by default. If you enable it, you’re responsible for the email account you sign in with. We may suspend sync access for abuse or to protect the service. See the Privacy Policy for exactly what is and isn’t synced.',
  },
  {
    h: 'Third-party services',
    p: 'Some widgets rely on third-party services (e.g. Open-Meteo, Frankfurter, GitHub, Google Firebase). Those services have their own terms, and we’re not responsible for their content or availability.',
  },
  {
    h: 'Updates',
    p: 'Layer may update itself to add features or fix issues (or update through the Microsoft Store). These Terms apply to updated versions too.',
  },
  {
    h: 'No warranty',
    p: 'Layer is provided “as is”, without warranties of any kind, express or implied, including fitness for a particular purpose. You use it at your own risk.',
  },
  {
    h: 'Limitation of liability',
    p: 'To the maximum extent permitted by law, the developer is not liable for any indirect, incidental or consequential damages, or data loss, arising from your use of Layer.',
  },
  {
    h: 'Changes & termination',
    p: 'These Terms may be updated from time to time; continued use means you accept the changes. You may stop using Layer and uninstall it at any time.',
  },
  {
    h: 'Contact',
    p: 'Questions about these Terms? Email harisimran7857@gmail.com.',
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
        <p className="doc-note">Last updated: June 2026</p>
        <div className="sections">
          {TERMS.map((s) => (
            <div className="section" key={s.h}>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
        <p className="doc-note" style={{ marginTop: 28 }}>
          See also our{' '}
          <Link to="/privacy" style={{ color: 'var(--muted)', fontWeight: 600 }}>
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </Shell>
  )
}
