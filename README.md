# Zapiboo Kids

Next.js 16 App Router website for selling pre-loved kids toys, books, clothing, baby gear, cycles and electronics in Bangalore. Includes category and area guides, a saved pickup flow, customer orders and an admin operations dashboard.

## Run locally

Use Node.js 22 or 24. Install with `npm ci`. Copy `.env.example` to ignored `.env.local` and set the Supabase public URL and publishable/anon key. Never expose service-role keys to the browser.

The existing linked project can also be configured with `npm run supabase:login` and `npm run supabase:connect`. Run `npm run dev`; restart after changing environment variables.

## Database and launch state

Apply the migrations in `supabase/migrations` before running the current admin UI. Migration `20261110120000_secure_kids_pickup_operations.sql` separates private operational notes, secures pickup photo storage, enables admin seller-profile reads and restricts customer cancellation writes. It was applied and verified against the linked Zapiboo Kids project on 10 November 2026.

Pickup requests are open (`servicesPaused = false` in `src/lib/launch-status.ts`). Customers can submit their item details, address and preferred slot. Phone and WhatsApp support use +91 9886579923. Staff confirm availability and update request statuses; WhatsApp links open a chat with a prefilled message rather than sending automated notifications.

## Validation

- `npm run typecheck`
- `npm run test:unit`
- `npm run build`
- `npm run test:e2e` (requires Chromium: `npx playwright install chromium`)

Browser tests run an isolated production server on port 3100. They cover public rendering, redirects, metadata, category/area content, mobile navigation and draft behavior. They do not use production credentials.

For an explicit live integration test, run `node scripts/verify-live-operations.mjs --run-live-check` with a logged-in Supabase CLI available. The script reads privileged credentials only into memory, creates temporary test users and a pickup, checks database isolation and authenticated admin/customer UI, then removes its test resources. Set `SUPABASE_CLI_PATH` when the CLI is not in the Windows npm cache. Set `OPERATIONS_TEST_ORIGIN` to the running local site if it is not `http://localhost:3000`. This intentionally makes temporary writes to the linked project; do not run it as a routine public CI job.

## Deploy

Use the Next.js framework preset, `npm ci`, `npm run build` and `npm start`. Do not configure a static output directory. Set the public Supabase variables from `.env.example` in the hosting environment. Configure `https://www.zapiboo.com/auth/callback` and the correct preview callback URLs in Supabase Auth; verify Google OAuth and confirmation-email delivery on the actual deployed domain before opening pickups.

`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is optional for HTML-tag Search Console verification. Submit the canonical sitemap after deploying. See `docs/seo-content-and-measurement.md` for the measurement plan and `docs/operations-launch-check.md` for verified operations and remaining launch checks.

Category content is managed in `src/lib/selling-categories.ts` and `src/lib/seller-guides.ts`; area facts are in `src/lib/seo.ts` and `src/lib/bangalore-data.ts`. The Categories dashboard tab is a catalog preview, not a CMS.
