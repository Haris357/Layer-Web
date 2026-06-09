// One-off broadcast: emails the "Layer is now on the Microsoft Store"
// announcement to every address in the Firestore `emails` collection.
//
// Run from the email-api/ folder with the same env vars the deployed function
// uses (SMTP_USER, SMTP_PASS, FIREBASE_SERVICE_ACCOUNT):
//
//   # DRY RUN — prints recipient count + a sample, sends nothing:
//   node broadcast.cjs
//
//   # actually send:
//   node broadcast.cjs --send
//
// Always dry-run first. Gmail free accounts cap at ~500 recipients/day; if you
// have more, send in batches across days (failed sends are logged, not fatal).
const nodemailer = require('nodemailer')
const { getDb } = require('./api/_firebase-admin')
const { storeAnnouncementEmail } = require('./api/_template')

const SUBJECT = 'Layer is now on the Microsoft Store'
const SEND = process.argv.includes('--send')
const DELAY_MS = 1200 // gentle pacing — stays within limits, avoids spam flags

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const db = getDb()
  const snap = await db.collection('emails').get()
  const seen = new Set()
  const recipients = []
  snap.forEach((d) => {
    const raw = String(d.get('email') || '').trim()
    const key = raw.toLowerCase()
    if (raw && !seen.has(key)) {
      seen.add(key)
      recipients.push(raw)
    }
  })
  console.log(`Found ${recipients.length} unique subscriber(s).`)

  if (!SEND) {
    console.log('\nDRY RUN — nothing sent. Re-run with `--send` to send for real.')
    console.log('Sample:', recipients.slice(0, 5))
    return
  }

  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) throw new Error('SMTP_USER / SMTP_PASS are not set')

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
  const html = storeAnnouncementEmail()

  let ok = 0
  let fail = 0
  for (let i = 0; i < recipients.length; i++) {
    const to = recipients[i]
    try {
      await transporter.sendMail({
        from: `"Layer" <${user}>`,
        to,
        subject: SUBJECT,
        html,
      })
      ok++
      console.log(`[${i + 1}/${recipients.length}] sent → ${to}`)
    } catch (e) {
      fail++
      console.warn(`[${i + 1}/${recipients.length}] FAILED → ${to}: ${e.message}`)
    }
    if (i < recipients.length - 1) await sleep(DELAY_MS)
  }
  console.log(`\nDone. ${ok} sent, ${fail} failed.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
