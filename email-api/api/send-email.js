const nodemailer = require('nodemailer')
const { welcomeEmail } = require('./_template')

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

// Vercel serverless function — POST { email } sends the welcome email.
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let email = ''
  try {
    const body =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    email = String(body.email || '').trim()
  } catch {
    email = ''
  }

  if (!validEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    return res.status(500).json({ error: 'Mail is not configured' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  try {
    await transporter.sendMail({
      from: `"Layer" <${user}>`,
      to: email,
      subject: 'Welcome to Layer',
      html: welcomeEmail(),
    })
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Could not send email' })
  }
}
