# Layer — email function

A single Vercel serverless function that sends the Layer welcome email with
nodemailer. The website (on Firebase Hosting) calls `POST /api/send-email`.

## Deploy

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the
   `Layer-Web` repo.
2. Set **Root Directory** to `email-api` (so Vercel deploys only this folder).
3. Framework preset: **Other**. No build command needed.
4. Add two **Environment Variables**:
   - `SMTP_USER` — your Gmail address
   - `SMTP_PASS` — a Gmail **App Password** (Google Account → Security →
     2-Step Verification → App passwords). Not your normal password.
5. Deploy. Copy the resulting URL (e.g. `https://layer-email.vercel.app`).
6. Put that URL in the website's `.env.production` as `VITE_EMAIL_API_URL`
   and redeploy the site.
