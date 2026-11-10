# Kids-item selling flow

The catalogue in src/lib/selling-categories.ts drives the selling pages and booking categories. It includes toys, books, clothing, baby gear, cycles and kids electronics.

## Booking

1. Choose category. Category links can hand off through /pickup?category=toys (or another supported ID).
2. Select condition; optional Anything else notes and photo.
3. Sign in or create an account, preserving the draft across OAuth.
4. Add address and optional map location.
5. Choose a preferred collection date and slot, then submit.

The existing servicesPaused switch is preserved. While paused, the flow reaches an opening-soon notice after sign-in and does not create a pickup or collect a schedule. Drafts use zapiboo-kids-pickup-draft-v4 so old vehicle drafts cannot populate the new fields.

## Storage compatibility

Existing Supabase lead ownership, RLS and upload logic remain in use. No database migration is required. sellingItemPayload maps category to the existing vehicle_type text column, category and condition to the generic items array. Optional item notes use message. Vehicle names, foreign keys, registration and manufacture year remain null. Customer orders and admin display category, condition, optional notes and photos. Admin metrics and seller pickup counts exclude legacy vehicle and repair records. Existing records are retained.

## Supabase connection

The checkout is linked to Zapiboo Kids (wizweflimtblfiiqspgh). Run npm run supabase:login, then npm run supabase:connect to refresh public application credentials locally. The setup command verifies auth and the booking schema before updating ignored .env.local. CLI access tokens and service-role keys are not stored in the website. Restart Next.js after changing environment variables.

Admin access is verified on the server and checked against user_roles; the existing database policies remain in force. Dashboard panels show retry controls for database failures. The pickup-photo storage migration is installed on the linked project.

Old vehicle and repair routes redirect to relevant selling pages. The sitemap lists only current kids-item pages.

## New pickup image

Built-in imagegen was used. Final asset: src/assets/kids-doorstep-pickup.webp, width 960px, WebP quality 80.

Prompt: Photorealistic editorial lifestyle image for a pre-loved kids item selling service in Bangalore. At a clean welcoming apartment doorway, a friendly Indian pickup team member in a plain navy polo accepts a neat open cardboard box containing colorful wooden toys, children's picture books and a folded yellow child's sweatshirt from an Indian parent. A compact baby stroller stands nearby. Warm natural daylight, trustworthy friendly atmosphere, navy blue and soft mint accents, realistic hands and objects, portrait 4:5 composition. No garbage, no waste bags, no weighing scale, no vehicles, no text, no logos. Focus on careful handover of clean reusable children's items.
