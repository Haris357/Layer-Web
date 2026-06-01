const { getAuth, getDb } = require('./_firebase-admin')
const {
  validEmail,
  emailHash,
  uidFor,
  hashCode,
  constantTimeEqual,
  cors,
  parseBody,
} = require('./_otp')

const MAX_ATTEMPTS = 5

// POST { email, code } — verify the code and, on success, return a Firebase
// custom token the client exchanges via signInWithCustomToken.
module.exports = async (req, res) => {
  if (cors(req, res)) return
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = parseBody(req)
  const email = String(body.email || '').trim()
  const code = String(body.code || '').trim()
  if (!validEmail(email)) {
    return res.status(400).json({ error: 'invalid', reason: 'format' })
  }
  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'invalid', reason: 'code' })
  }

  let db
  let auth
  try {
    db = getDb()
    auth = getAuth()
  } catch {
    return res.status(500).json({ error: 'Sync is not configured' })
  }

  const hash = emailHash(email)
  const ref = db.collection('otps').doc(hash)

  let data
  try {
    const snap = await ref.get()
    if (!snap.exists) {
      return res.status(400).json({ error: 'invalid' })
    }
    data = snap.data() || {}
  } catch {
    return res.status(500).json({ error: 'Could not verify' })
  }

  if (!data.expiresAt || Date.now() > data.expiresAt) {
    await ref.delete().catch(() => {})
    return res.status(400).json({ error: 'expired' })
  }
  if ((data.attempts || 0) >= MAX_ATTEMPTS) {
    await ref.delete().catch(() => {})
    return res.status(429).json({ error: 'too_many_attempts' })
  }

  const expected = data.codeHash || ''
  if (!constantTimeEqual(hashCode(code, hash), expected)) {
    await ref
      .set({ attempts: (data.attempts || 0) + 1 }, { merge: true })
      .catch(() => {})
    return res.status(400).json({ error: 'invalid' })
  }

  // Success — code is single-use.
  await ref.delete().catch(() => {})

  try {
    const uid = uidFor(email)
    const token = await auth.createCustomToken(uid, { email })
    return res.status(200).json({ token, uid })
  } catch {
    return res.status(500).json({ error: 'Could not sign in' })
  }
}
