# FluentX — Education Services Website

Next.js 15 + TypeScript + Tailwind 4 + PostgreSQL + Prisma + Google authentication.

## Existing public flow

Browse services/plans → free consultation form → Enroll Now → Google sign-in if needed → Razorpay Checkout → server-side payment verification → database enrollment → confirmation emails.

## Authentication and dashboard

- Google is the only normal-user authentication method.
- A user account is created automatically on first Google sign-in.
- `/dashboard` is protected server-side.
- The dashboard reads enrolled courses and available/recommended courses from PostgreSQL.
- `/enroll/[slug]` is protected server-side.
- A successful, verified Razorpay payment creates the PostgreSQL enrollment.
- Protected enrollment records are tied to the authenticated user on the server; browser-supplied user IDs are never trusted.

## Setup

```bash
npm install
```

Create `.env.local` from `.env.example` and set:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Site URL (metadata, sitemap) |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Long random secret used by Auth.js |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `ADMIN_EMAIL` | Receives consultation + enrollment emails |
| `SMTP_URL` | SMTP connection URL |
| `EMAIL_FROM` | Optional sender |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay server configuration |

For Google OAuth, add this authorized redirect URI in Google Cloud for local development:

`http://localhost:3000/api/auth/callback/google`

For production, add the equivalent callback URL for the deployed domain.

## Database

After setting `DATABASE_URL`:

```bash
npm run db:generate
npm run db:migrate -- --name add_auth_courses
npm run db:seed
```

The seed creates the existing FluentX services as PostgreSQL course records. Existing public service content remains the source for the public pages; the database is used for accounts, courses and enrollments.

Never run `prisma migrate reset` on a database containing real data.

## Development

```bash
npm run dev
```

## Checks

```bash
npm run typecheck
npm run build
```
