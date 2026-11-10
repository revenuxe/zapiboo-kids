# Operations launch verification - 10 November 2026

## Completed

- Applied `20261110120000_secure_kids_pickup_operations.sql` to the linked Zapiboo Kids project `wizweflimtblfiiqspgh`.
- Moved existing non-query operational notes to `admin_lead_notes`, protected by admin-only RLS. Original contact enquiries remain separate from private admin annotations.
- Admin status and private-note saves use one transactional RPC. Missing requests and invalid statuses produce errors.
- Customer order reads explicitly select customer-facing fields. Customer cancellation must actually return the updated row before the UI reports success.
- Guarded customer insert ownership and initial status; cancellation cannot change other request fields. Removed customer request deletion policy.
- Made the pickup photo bucket private. New uploads store object paths; admin access uses expiring signed URLs. Legacy URLs for the same pickup bucket are resolved into signed URLs. Compressed image data already stored on protected requests remains supported.
- Enabled admin reads of seller profiles.
- Refreshed admin styling, metrics, navigation and catalog preview. Added a dashboard refresh action and website links.
- Pickup confirmation now retains the generated pickup reference instead of always clearing it.

## Live checks passed

The opt-in script `scripts/verify-live-operations.mjs` used three temporary accounts (two sellers and one admin), one temporary request and one photo. It verified:

- Real password authentication and owner-assigned request insertion, initial status and pickup reference.
- Other-seller isolation and admin-only note visibility/mutation.
- Rejection of cancellation with extra changed fields; success of ordinary customer cancellation.
- Admin access to seller profiles.
- A private storage bucket, blocked public photo URL, blocked other-seller signing, and working admin signed photo access.
- Actual authenticated admin UI at mobile and desktop sizes; request details, private-photo rendering and saving private notes through the UI.
- Actual customer order tracking and full live pickup submission through address, scheduling and confirmation, with a saved pickup reference and working call/WhatsApp links.

All temporary test users, the request and the photo were removed. No email or WhatsApp was sent. Credentials were neither written to files nor printed.

## Launch boundary

Pickup requests and contact support are open at the owner's instruction (`servicesPaused = false`). The complete authenticated address, scheduling, submission, confirmation and customer-tracking workflow was verified using temporary records against the live Supabase project and the production preview. Phone and WhatsApp links use +91 9886579923; the confirmation chat includes the generated request reference. Production-domain Google OAuth, confirmation-email delivery and hosting monitoring remain external deployment checks, separate from the verified password-authenticated flow.

Automated notifications, category editing/CMS, revenue tracking, staff assignment and dispatch scheduling are not implemented. Staff can manually review requests, update statuses and contact sellers; the UI does not claim those additional capabilities.
## Final connection and branding check

The connected CLI project and local public application configuration match. A read-only remote database audit confirmed the admin-notes RLS/policy, customer-write guard, admin seller-profile policy, transactional update function and private photo bucket. The migration dry run reported no unapplied migrations.

The supplied Zapiboo favicon family is installed for browser tabs, Apple home screens and Android app icons. Metadata and the web manifest use content-versioned URLs to avoid retaining old cached icons. The legacy favicon PNG also uses the supplied artwork. The pickup loading boundary now provides a useful no-JavaScript fallback.

Final validation: production build, all 50 Playwright browser tests and all nine unit tests passed. The provided ICO and installed favicon have identical SHA-256 hashes. Environment credentials remain ignored by Git.

## Service opening

Removed the public closed-service state, enabled pickup requests and contact enquiries, and added direct call/WhatsApp links to the homepage, contact page, footer and pickup confirmation. WhatsApp opens a prefilled chat; no automated message is sent. The contact form accepts enquiries without a phone number. The production build, all 50 browser tests and all nine unit tests passed, alongside the real authenticated live workflow verification. Temporary accounts, photos and requests were removed.
