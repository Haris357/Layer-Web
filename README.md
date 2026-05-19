# Layer — website

The marketing site for **Layer**, a quiet layer of widgets on your desktop.
Built with React + Vite, hosted on Firebase Hosting.

- `/` — landing page with email-gated download
- `/demo` — walkthrough video + screenshots
- `/terms` — Terms of Service
- `/docs` — getting started

Emails are stored in Firestore; a welcome email is sent by a Vercel
serverless function (see `email-api/`).

## Develop

```bash
npm install
npm run dev
```

## Pieces & deployment

| Piece              | Where                | How                                   |
| ------------------ | -------------------- | ------------------------------------- |
| Website            | Firebase Hosting     | GitHub Action on push to `main`       |
| Email function     | Vercel               | see `email-api/README.md`             |
| Email storage      | Firestore (`emails`) | `firestore.rules`                     |

### One-time setup

All build-time config is stored as **GitHub Actions repo secrets** (Settings
→ Secrets and variables → Actions), never committed:

- `FIREBASE_SERVICE_ACCOUNT` — service account JSON for Hosting deploys
- `VITE_FIREBASE_*` — the seven Firebase web config values
- `VITE_EMAIL_API_URL` — the deployed Vercel email function URL

Then:

1. **Firestore** — enable Firestore in the Firebase Console, then deploy the
   rules: `npx firebase deploy --only firestore:rules`.
2. **Email function** — deploy `email-api/` to Vercel (see its README) and
   update the `VITE_EMAIL_API_URL` secret with its URL.

For local development, copy `.env.example` to `.env` and fill it in.
