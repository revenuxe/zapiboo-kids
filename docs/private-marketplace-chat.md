# Private vehicle conversations

The header exposes Chats on desktop and mobile. A vehicle's Chat with seller action opens `/chats?listing=<id>`; after sign-in, an authenticated database function creates or resumes the unique conversation for that buyer and vehicle. Sellers see separate enquiries from different buyers. Neither participant receives the other's phone number.

## Experience

- Searchable inbox with All, Buying, Selling, Unread and Archived views.
- Selected conversation with vehicle context, sent/read indicators, message history pagination and explicit quick-reply suggestions. Suggestions fill the composer; they do not send automatically.
- Real message updates through Supabase Postgres Changes, with periodic refresh, reconnection refresh and limited retry fallback. Cached messages remain visible on refresh errors.
- Per-tab, user-scoped unsent message drafts; failed sends keep their text. A request UUID makes retries idempotent.
- Per-conversation blocking and personal archive controls. Blocking by either participant prevents both from sending. A new message restores an archived conversation to the recipient's active inbox.
- Private report submission to `vehicle_chat_reports`. Reports are available to their reporter and authorised database operators; an application moderation dashboard and automatic review are not included.

## Privacy enforcement

`vehicle_conversations` and `vehicle_chat_messages` use participant-only row-level security. Authenticated clients have SELECT access only; message creation and conversation actions require guarded RPCs with explicit `auth.uid()` checks. Direct table writes cannot bypass message validation. These follow [Supabase's RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security). Realtime subscriptions respect the same access rules; see [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes).

The old `/api/marketplace/[id]/contact` endpoint now returns 410 without a phone field. The old policy allowing signed-in buyers to select seller contacts has been replaced with owner-only access. Mobile numbers can still be collected privately for the seller account and are excluded from all conversation/inbox responses.

Contact checks run in the composer, the message API, the guarded send function, and database constraints. They cover common spaced/punctuated phone formats, full-width and supported Indic/Arabic digits, zero-width separators, English number words and mixed digits/words, email, URLs and off-platform contact handles. A database trigger also checks consecutive numeric fragments. Public listing text has equivalent checks.

These are conservative pattern checks, not a guarantee against every coded or deliberately obfuscated contact exchange. Chat attachments are intentionally unsupported. Listing-photo OCR is not implemented; listing photo guidance prohibits contact details and the report flow supports escalation. Messages are not represented as end-to-end encrypted: authorised service operators retain operational access for support and moderation.

## Abuse and consistency

- Authenticated buyers cannot start chats with themselves or with inactive/non-existent listings.
- Database-level uniqueness plus transaction locks prevent duplicate conversations from concurrent requests.
- Up to 20 new conversations per buyer per day and 30 messages per sender per minute are enforced in the guarded database functions.
- Message content is text-only, trimmed, length-limited and rendered as escaped React text.
- Participant checks protect message history, read actions, archive/block changes and reports.
- Inbox queries return up to 300 recent conversations. Older messages load in pages of 40 with a timestamp/UUID cursor.

## Verification

Nineteen browser checks cover the marketplace, seller flow, mobile Chats access, preserved sign-in destination, private APIs and contact validation. Live Supabase checks used isolated temporary accounts and records, removed afterward. They verified concurrent conversation reuse, separate buyer threads, outsider read/write denial, closed phone access, raw REST write denial, direct-RPC contact filtering, fragmented numbers, idempotent sends, block/unblock, report privacy, archive recovery, unread state, two-way browser delivery and message pagination. Desktop and 390 px mobile layouts were inspected. TypeScript and the production build passed.
