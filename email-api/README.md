# Layer — email + cloud-sync function

Vercel serverless functions:

- `POST /api/send-email` — the welcome email (called by the website).
- `POST /api/send-otp` — emails a 6-digit Cloud Sync sign-in code.
- `POST /api/verify-otp` — verifies the code and returns a Firebase **custom
  token** the desktop app exchanges via `signInWithCustomToken`.

OTP codes are stored (hashed) in Firestore `otps/{sha256(email)}` and are
single-use, expire in 10 minutes, capped at 5 attempts, and rate-limited
(≤5/hour, 60s cooldown). The Admin SDK runs server-side only.

## Broadcast an announcement

`broadcast.cjs` emails the Store-availability announcement
(`storeAnnouncementEmail` in `_template.js`) to every address in the Firestore
`emails` collection. Run it locally with the same env vars the deployed function
uses:

```bash
cd email-api
# DRY RUN first — prints recipient count + a sample, sends nothing:
node broadcast.cjs
# then send for real:
node broadcast.cjs --send
```

Set `SMTP_USER`, `SMTP_PASS`, and `FIREBASE_SERVICE_ACCOUNT` in your shell
(same values as Vercel). Gmail free accounts cap at ~500 recipients/day — if the
list is larger, send in batches across days (per-recipient failures are logged,
not fatal).

## Deploy

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the
   `Layer-Web` repo.
2. Set **Root Directory** to `email-api` (so Vercel deploys only this folder).
3. Framework preset: **Other**. No build command needed (`npm install` pulls
   `nodemailer` + `firebase-admin`).
4. Add **Environment Variables**:
   - `SMTP_USER` — your Gmail address
   - `SMTP_PASS` — a Gmail **App Password** (Google Account → Security →
     2-Step Verification → App passwords). Not your normal password.
   - `FIREBASE_SERVICE_ACCOUNT` — the full service-account JSON, on one line
     (Firebase Console → Project settings → **Service accounts** → *Generate
     new private key*). Server-only; never shipped to clients.
   - `OTP_PEPPER` — any long random secret string (used to salt code hashes).
5. Deploy. Copy the resulting URL (e.g. `https://layer-web-eta.vercel.app`).
6. Put that URL in the website's `.env.production` as `VITE_EMAIL_API_URL`
   (the desktop app falls back to it automatically).

## Firestore rules

Deploy the updated `../firestore.rules` (adds `users/{uid}` owner-only access
and locks `otps/**` to the server) — from `layer-web`:

```bash
firebase deploy --only firestore:rules
```
