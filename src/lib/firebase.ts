import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  increment,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Shared, public download counter doc.
export const downloadsDoc = doc(db, 'stats', 'downloads')

// Count one genuine download per browser. The localStorage flag stops the
// same person inflating the number by downloading again, and since this only
// runs on the website, auto-updates never touch it. Best effort — never
// blocks or throws into the download flow.
const DOWNLOAD_FLAG = 'layer:counted-download'
export async function countDownloadOnce(): Promise<void> {
  try {
    if (localStorage.getItem(DOWNLOAD_FLAG)) return
    localStorage.setItem(DOWNLOAD_FLAG, '1')
    await setDoc(downloadsDoc, { count: increment(1) }, { merge: true })
  } catch {
    /* ignore — a missed count must never break the download */
  }
}

// Flip the unsubscribe flag on someone's download-list entry. The doc id is
// the encoded lowercased email (same key the signup uses), so the unsubscribe
// link can address it directly. updateDoc only touches an EXISTING entry — if
// the address was never on the list it throws, which the caller treats as a
// no-op success (we never reveal who is or isn't on the list).
export async function setEmailUnsubscribed(
  email: string,
  unsubscribed: boolean,
): Promise<void> {
  const id = encodeURIComponent(email.trim().toLowerCase())
  await updateDoc(doc(db, 'emails', id), {
    unsubscribed,
    unsubscribedAt: serverTimestamp(),
  })
}

// Analytics only loads in browsers that support it; never block on it.
isSupported()
  .then((ok) => {
    if (ok) getAnalytics(app)
  })
  .catch(() => {})
