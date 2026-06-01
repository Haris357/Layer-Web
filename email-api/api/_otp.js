// Shared helpers for the OTP sign-in flow. Files prefixed with "_" are not
// routed by Vercel.
const crypto = require('crypto')
const dns = require('dns').promises

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

function validEmail(e) {
  return (
    typeof e === 'string' &&
    e.length >= 6 &&
    e.length <= 254 &&
    EMAIL_RE.test(e) &&
    /^[a-zA-Z]{2,}$/.test(e.slice(e.lastIndexOf('.') + 1))
  )
}

// Confirms the domain can actually receive mail — MX records (or an A/AAAA
// fallback). Catches valid-looking-but-fake domains like x.xx.
async function deliverable(email) {
  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase()
  try {
    const mx = await dns.resolveMx(domain)
    if (Array.isArray(mx) && mx.some((r) => r.exchange)) return true
  } catch {
    /* fall through to A-record check */
  }
  try {
    const a = await dns.resolve(domain)
    return Array.isArray(a) && a.length > 0
  } catch {
    return false
  }
}

const norm = (email) => String(email || '').trim().toLowerCase()

function emailHash(email) {
  return crypto.createHash('sha256').update(norm(email)).digest('hex')
}

// Deterministic Firebase uid for an email. The email isn't a secret — proof of
// control (the OTP delivered to the inbox) is what gates access. Same inbox
// always maps to the same users/{uid} tree, which is what enables sync.
function uidFor(email) {
  return 'email_' + emailHash(email).slice(0, 40)
}

function genCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
}

// Store only a salted hash of the code, never the code itself.
function hashCode(code, emailHash) {
  const pepper = process.env.OTP_PEPPER || ''
  return crypto
    .createHash('sha256')
    .update(`${code}:${emailHash}:${pepper}`)
    .digest('hex')
}

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

// CORS headers mirroring send-email.js. Returns true if the request was an
// OPTIONS preflight (already answered) so the caller can return early.
function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return true
  }
  return false
}

function parseBody(req) {
  try {
    return typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body || {}
  } catch {
    return {}
  }
}

module.exports = {
  validEmail,
  deliverable,
  emailHash,
  uidFor,
  genCode,
  hashCode,
  constantTimeEqual,
  cors,
  parseBody,
}
