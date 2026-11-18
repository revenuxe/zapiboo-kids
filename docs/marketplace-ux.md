# Zapiboo vehicle marketplace

The homepage's six vehicle cards open `/marketplace?category=…`. The marketplace is a dedicated browsing experience, with its own layout and a clear route into `/marketplace/sell`.

## Research and design decisions

- [OLX's official posting guide](https://help.olx.in/hc/en-us/articles/10877414982557-How-can-I-post-an-ad) puts category, brand, title, description, photos and location at the centre of posting. Zapiboo groups these into five short steps rather than one long form.
- [Meta's Marketplace introduction](https://about.fb.com/news/2016/10/introducing-marketplace-buy-and-sell-with-your-local-community/) describes photo-led local discovery, a detail view and direct seller conversations. Zapiboo uses a visual listing grid with price and essential specifications, then a full gallery and seller contact panel.
- [Meta's seller tools announcement](https://about.fb.com/news/2026/07/introducing-seller-app-facebook-marketplace/) emphasises easier creation and inventory management. Zapiboo offers a deterministic description starter, saved drafts, a live preview and seller status controls. The description starter is not represented as an AI service.

## Implemented experience

- Category browsing, keyword and neighbourhood search, minimum/maximum budget, brand, registration year, fuel, transmission, sorting and grid/list layouts.
- Responsive filter drawer with keyboard focus containment and Escape dismissal; no horizontal page overflow at 390 px or desktop widths.
- Five listing steps: vehicle essentials; photos, title and description; price and locality; sign-in followed by seller name, mobile and consent; review and publish.
- Photos are compressed to WebP in the browser, then decoded and re-encoded on the server with orientation corrected and metadata stripped. Category cutouts remain separate from real seller photographs.
- Drafts include the current step and compressed photos. Sign-in is embedded after price and locality. Google OAuth/email confirmation return to the saved seller-details step; email/password sign-in stays on the listing screen. Name and mobile are confirmed after authentication and saved to the signed-in account’s profile. Drafts and saved vehicles are browser-local, with storage failures surfaced to the user.
- Listing details include a photo gallery, specifications, description, seller information, save/share actions and private in-app chat for signed-in buyers.
- My listings allows marking a vehicle sold, archiving it and relisting it. Public browsing excludes sold and archived records.
- Example inventory is explicitly labelled and cannot be contacted or mistaken for an actual seller. No fabricated inventory is inserted into Supabase.

## Backend

Migration `20261118120000_vehicle_marketplace.sql` was applied to the project's linked Supabase database. It creates `vehicle_listings`, `vehicle_listing_contacts` and the `vehicle-listing-photos` storage bucket, with row-level security and owner-scoped uploads. Phone numbers are separate from public listing records. Publishing requires a validated Supabase user and explicit seller consent.

The browse endpoint currently loads up to 500 recent records, with client-side filtering and incremental display. Drafts and favourites do not sync between devices. Buyer and seller conversations use the private Chats inbox. Payments, map/radius search, subscriptions and an advanced moderation dashboard are not implemented.

## Verification

Nineteen Playwright checks cover category navigation, search/sort, saved state, mobile filters, a complete draft with WebP photo conversion, sign-in recovery, preview details, malformed inputs and write-request origin/authentication checks. Run with:

```sh
npx playwright test --config playwright.marketplace.config.ts
```

Live integration checks used temporary accounts and records, subsequently removed. Verified authenticated publication and storage upload, public visibility of active listings, private contacts for anonymous visitors, buyer phone-number access denial, cross-account update prevention, own-listing queries, and archive visibility rules. TypeScript and production build checks passed.

The revised authentication flow was also tested with a temporary real Supabase account: inline login, required mobile validation, profile persistence, review, publication with the original draft photos, and clearing the draft after success. Temporary records were removed. Email-confirmation and failed-OAuth recovery paths are covered by browser tests.

Category-specific entry points show one selected vehicle image and a Change vehicle type control; generic listing entry shows all six categories. Switching category updates the URL. Google is the first authentication option; its callback preserves both the selected category and draft. The connected project reports Google enabled and its authorization endpoint redirects to accounts.google.com. Browser tests verify OAuth handoff; interactive Google account consent is not automated.

See [Private marketplace chat](private-marketplace-chat.md) for the current chat architecture, database permissions, phone-sharing checks and verification. The private-chat migrations supersede the initial marketplace buyer-contact policy.
