import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LINKS } from '../lib/links'
import { GitHubIcon, LinkedInIcon, XIcon } from './icons'

// Shared page frame: top-left logo + fixed footer, content in the middle.
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      <Link to="/" className="logo">
        <img src="/layer-icon.svg" width={28} height={28} alt="" />
        <span>Layer</span>
      </Link>

      <main className="content">{children}</main>

      <footer className="footer">
        <div className="foot-left">
          <a
            href={LINKS.repo}
            target="_blank"
            rel="noreferrer"
            className="ico"
            title="Layer on GitHub"
          >
            <GitHubIcon size={17} />
          </a>
        </div>
        <div className="foot-center">
          <span className="by">
            created by{' '}
            <a href={LINKS.haris.portfolio} target="_blank" rel="noreferrer">
              Haris
            </a>
          </span>
          <span className="socials">
            <a
              href={LINKS.haris.linkedin}
              target="_blank"
              rel="noreferrer"
              className="ico"
              title="LinkedIn"
            >
              <LinkedInIcon size={15} />
            </a>
            <a
              href={LINKS.haris.github}
              target="_blank"
              rel="noreferrer"
              className="ico"
              title="GitHub"
            >
              <GitHubIcon size={15} />
            </a>
            <a
              href={LINKS.haris.twitter}
              target="_blank"
              rel="noreferrer"
              className="ico"
              title="X"
            >
              <XIcon size={14} />
            </a>
          </span>
        </div>
        <div className="foot-right">
          <Link to="/terms">Terms</Link>
          <Link to="/docs">Docs</Link>
        </div>
      </footer>
    </div>
  )
}
