import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Demo } from './pages/Demo'
import { Terms } from './pages/Terms'
import { Docs } from './pages/Docs'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
