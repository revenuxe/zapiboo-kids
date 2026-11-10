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
- Actual customer order tracking and an opening-soon notice at the end of the paused pickup flow.

All temporary test users, the request and the photo were removed. No email or WhatsApp was sent. Credentials were neither written to files nor printed.

## Launch boundary

The site is prepared for a coming-soon release. Bookings remain paused intentionally. The final public scheduling/submission path with bookings enabled has not been browser-tested against production operations. Production-domain Google OAuth, confirmation emails, hosting configuration and monitoring still need verification on the deployed domain. Existing tests do not establish that those external systems are ready.

Automated notifications, category editing/CMS, revenue tracking, staff assignment and dispatch scheduling are not implemented. Staff can manually review requests, update statuses and contact sellers; the UI does not claim those additional capabilities.
