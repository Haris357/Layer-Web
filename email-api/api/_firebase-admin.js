// Lazy Firebase Admin singleton. Initialized once per warm serverless
// instance from the FIREBASE_SERVICE_ACCOUNT env var (server-only — never
// shipped to clients). The Admin SDK bypasses Firestore security rules, which
// is why the otps/** collection can be locked to clients yet written here.
const admin = require('firebase-admin')

let initialized = false

function ensure() {
  if (initialized) return
  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT
    if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set')
    // Accept either the raw JSON or a base64-encoded blob. Base64 is the
    // recommended form for env UIs (one line, no quotes/newlines to mangle).
    let json = raw.trim()
    if (!json.startsWith('{')) {
      json = Buffer.from(json, 'base64').toString('utf8')
    }
    const cred = JSON.parse(json)
    // When the JSON is pasted into an env UI the private key's line breaks
    // often arrive as the literal two-character sequence "\n" instead of real
    // newlines, which makes the PEM invalid. Normalize them back.
    if (typeof cred.private_key === 'string') {
      cred.private_key = cred.private_key.replace(/\\n/g, '\n')
    }
    admin.initializeApp({
      credential: admin.cert(cred),
    })
  }
  initialized = true
}

function getAuth() {
  ensure()
  return admin.auth()
}

function getDb() {
  ensure()
  return admin.firestore()
}

module.exports = { admin, getAuth, getDb }
