const nodemailer = require('nodemailer')
const { otpEmail } = require('./_template')
const { getDb } = require('./_firebase-admin')
const {
  validEmail,
  deliverable,
  emailHash,
  genCode,
  hashCode,
  cors,
  parseBody,
} = require('./_otp')

const TEN_MIN = 10 * 60 * 1000
const HOUR = 60 * 60 * 1000
const COOLDOWN = 60 * 1000
const MAX_PER_HOUR = 5

// POST { email } — generate a 6-digit code, store its hash, and email it.
module.exports = async (req, res) => {
  if (cors(req, res)) return
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = String(parseBody(req).email || '').trim()
  if (!validEmail(email)) {
    return res.status(400).json({ error: 'invalid', reason: 'format' })
  }
  if (!(await deliverable(email))) {
    return res.status(400).json({ error: 'invalid', reason: 'undeliverable' })
  }

  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    return res.status(500).json({ error: 'Mail is not configured' })
  }

  let db
  try {
    db = getDb()
  } catch {
    return res.status(500).json({ error: 'Sync is not configured' })
  }

  const hash = emailHash(email)
  const ref = db.collection('otps').doc(hash)
  const now = Date.now()

  // Rate limit: per-hour cap + a short cooldown between sends.
  try {
    const snap = await ref.get()
    if (snap.exists) {
      const d = snap.data() || {}
      const windowStart = d.windowStart || 0
      const sendCount = d.sendCount || 0
      if (now - windowStart < HOUR && sendCount >= MAX_PER_HOUR) {
        return res.status(429).json({ error: 'rate_limited' })
      }
      if (d.lastSentAt && now - d.lastSentAt < COOLDOWN) {
        return res.status(429).json({ error: 'cooldown' })
      }
    }
  } catch {
    /* if the read fails, fall through and still try to send */
  }

  const code = genCode()
  const codeHash = hashCode(code, hash)

  try {
    const snap = await ref.get()
    const d = snap.exists ? snap.data() || {} : {}
    const freshWindow = !d.windowStart || now - d.windowStart >= HOUR
    await ref.set(
      {
        codeHash,
        expiresAt: now + TEN_MIN,
        attempts: 0,
        lastSentAt: now,
        windowStart: freshWindow ? now : d.windowStart,
        sendCount: freshWindow ? 1 : (d.sendCount || 0) + 1,
        updatedAt: now,
      },
      { merge: true },
    )
  } catch {
    return res.status(500).json({ error: 'Could not start sign-in' })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })
    await transporter.sendMail({
      from: `"Layer" <${user}>`,
      to: email,
      subject: `${code} is your Layer sign-in code`,
      html: otpEmail(code),
    })
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Could not send email' })
  }
}
