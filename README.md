# FluentX — Education Services Website

Next.js 15 + TypeScript + Tailwind 4. No database, no accounts.

**Flow:** browse services/plans → free consultation form (emailed to `ADMIN_EMAIL`, reply-to = applicant) → Enroll Now → Razorpay Checkout → server-side signature verification → confirmation page + emails.

## Setup
```
npm install
cp .env.example .env.local   # fill values
npm run dev
```
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Site URL (metadata, sitemap) |
| `ADMIN_EMAIL` | Receives consultation & enrollment emails |
| `SMTP_URL` | e.g. `smtps://user:app-password@smtp.gmail.com:465` |
| `EMAIL_FROM` | Optional sender |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Server-only. Use `rzp_test_` keys in dev |

Without SMTP the consultation API returns an honest 503 (no fake success). Without Razorpay keys the order API returns 503.

## Editing content
- Services, prices, features: `src/data/services.ts` (single source; server uses it for order amounts).
- FAQs: `src/data/faqs.ts`. Brand/contact: `src/lib/brand.ts`. About copy: `src/app/about/page.tsx`.

## Payments
Order created server-side using the price from `services.ts`. After checkout, `/api/payments/verify` checks the HMAC signature, then fetches the order from Razorpay and confirms amount/service before showing success or sending emails. No card data is stored. No DB: reconciliation is via the Razorpay dashboard (order notes hold name/email/phone/service). Repeated verify calls are harmless but may re-send emails.

## Deploy (Vercel)
Import repo, set the env vars above, deploy. The in-memory rate limiter is per-instance; use Upstash/Redis for strict limits.

## Checks
`npm run typecheck`, `npm run lint`, `npm run build`.
