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

  // Actually try to initialize the Admin SDK so we see the real failure
  // reason (Admin error messages are generic — they don't leak the key).
  let adminInit = false
  let adminError = null
  try {
    require('./_firebase-admin').getAuth()
    adminInit = true
  } catch (e) {
    adminError = String((e && e.message) || e).slice(0, 200)
  }

  res.status(200).json({
    build: 'diag-2',
    hasServiceAccount: !!raw,
    rawLength: raw.length,
    startsWithBrace: trimmed.startsWith('{'),
    base64Decoded,
    parses,
    projectId,
    hasPrivateKey,
    privateKeyLooksValid,
    hasPepper: !!process.env.OTP_PEPPER,
    adminInit,
    adminError,
  })
}
