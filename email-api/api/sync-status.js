const { cors } = require('./_otp')

// Diagnostic only — reports whether the sync env vars are present and parseable
// WITHOUT revealing any secret content (project_id is public; the private key
// is never returned, only a boolean). Safe to call publicly.
module.exports = async (req, res) => {
  if (cors(req, res)) return

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || ''
  const trimmed = raw.trim()
  let json = trimmed
  let base64Decoded = false
  if (trimmed && !trimmed.startsWith('{')) {
    try {
      json = Buffer.from(trimmed, 'base64').toString('utf8')
      base64Decoded = true
    } catch {
      /* leave as-is */
    }
  }

  let parses = false
  let projectId = null
  let hasPrivateKey = false
  let privateKeyLooksValid = false
  try {
    const o = JSON.parse(json)
    parses = true
    projectId = o.project_id || null
    hasPrivateKey = typeof o.private_key === 'string' && o.private_key.length > 0
    privateKeyLooksValid =
      hasPrivateKey &&
      o.private_key.includes('BEGIN PRIVATE KEY') &&
      o.private_key.includes('END PRIVATE KEY')
  } catch {
    /* parses stays false */
  }

  res.status(200).json({
    hasServiceAccount: !!raw,
    rawLength: raw.length,
    startsWithBrace: trimmed.startsWith('{'),
    base64Decoded,
    parses,
    projectId,
    hasPrivateKey,
    privateKeyLooksValid,
    hasPepper: !!process.env.OTP_PEPPER,
  })
}
