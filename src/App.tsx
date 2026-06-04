import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { Demo } from './pages/Demo'
import { Spaces } from './pages/Spaces'
import { Changelog } from './pages/Changelog'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { Docs } from './pages/Docs'
import { ReleaseToast } from './components/ReleaseToast'

export default function App() {
  return (
    <>
      <ReleaseToast />
      <Routes>
        {/* The showcase is now the landing page; the email-gated download
            lives on its own page. */}
        <Route path="/" element={<Demo />} />
      <Route path="/download" element={<Home />} />
      <Route path="/spaces" element={<Spaces />} />
      {/* keep old links working */}
      <Route path="/demo" element={<Navigate to="/" replace />} />
      <Route path="/templates" element={<Navigate to="/spaces" replace />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="*" element={<Demo />} />
      </Routes>
    </>
  )
}
