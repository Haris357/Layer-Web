import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { Demo } from './pages/Demo'
import { Spaces } from './pages/Spaces'
import { Changelog } from './pages/Changelog'
import { Terms } from './pages/Terms'
import { Docs } from './pages/Docs'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/spaces" element={<Spaces />} />
      {/* keep old links working */}
      <Route path="/templates" element={<Navigate to="/spaces" replace />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
