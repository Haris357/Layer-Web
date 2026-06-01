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
    admin.initializeApp({
      credential: admin.cert(JSON.parse(raw)),
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
