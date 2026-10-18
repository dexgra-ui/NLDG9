# My Journey account foundation (proposal only)

Status: draft PR; no production integration or deployment.

## Decision
Use optional, passwordless email sign-in links. Supabase Auth + PostgreSQL is the proposed provider, subject to configuration, security review and cost approval. Do not add credentials, keys, or hosted endpoints in this phase.

## Principles
- Bible studies and My Journey remain usable without an account.
- Existing browser data remains the source of truth until a user explicitly opts into sync.
- Never upload prayers, journal entries, profile photos or notes merely because the user signs in. Require a separate informed opt-in for private content.
- Do not expose private progress to other accounts. Enforce ownership in the database with row-level security, not only in JavaScript.
- Support export, account deletion, and explicit sign-out. Do not silently delete local progress on sign-out.
- No anonymous browser ID should be treated as an authenticated identity.
- Protect magic-link redirects with an allowlist, use HTTPS, short-lived single-use links and rate limiting. Avoid leaking auth tokens through logs or analytics.

## Inventory of existing browser data
General My Journey: nldg-profile-v2, nldg-favorites-v1, nldg-history-v1, nldg-collections-v1, nldg-completed-v1, nldg-notes-v1, nldg-prayers-v1, nldg-plans-v1, nldg-streak-v1, nldg-study-state.
Specialized series: nldg-series-after-benediction, nldg-series-preferences-idols, nldg-faith-hurting-en, nldg-faith-hurting-es.
Book-by-Book: nldg-book-<slug>, plus nldg-series-james. Faith & Truth progress and any other specialized keys require a complete inventory before migration.

## Proposed versioned cloud records
- accounts: provider-managed auth user ID, created time, preferences.
- study_progress: owner ID, canonical study/lesson ID, completion status, updated time, revision.
- bookmarks: owner ID, content ID, saved time.
- reading_plans: owner ID, plan ID, completed days, updated time, revision.
- private_entries: owner ID, entry ID, kind (journal/prayer/note), body, updated time, revision; separate opt-in.
- sync_operations: owner ID, idempotency key, source device ID, server time, result (to safely retry).

## Migration and conflicts
1. Read and validate browser records; keep an immutable local backup/export option.
2. Show a preview of imported counts and categories. Let the person select progress-only or include private content.
3. After authenticated consent, upload idempotently. Never overwrite all cloud data with a single browser snapshot.
4. Merge completed lesson sets by stable IDs; preserve the most advanced completed-day set for reading plans. Treat uncompletion as an explicit timestamped operation, not a missing ID.
5. For conflicting edits to private entries, preserve both revisions for user review. Never resolve prayer/journal conflicts by silent last-write-wins.
6. Persist an acknowledged sync cursor per account/device; retry safely after network failure.
7. Confirm second-device and offline scenarios before release.

## Rollout gates
- Provider configured outside the repository; public anon key only if RLS policies verified. Never ship service-role secrets to browsers.
- Auth redirect and email deliverability tested on preview origin.
- SQL migrations and RLS tests reviewed; users cannot read or write another user's rows.
- Cross-device, offline/retry, sign-out, account deletion, export, and accessibility tests pass.
- Existing My Journey and study-completion audits stay green.
- Explicit approval required before enabling any cloud write or merging this PR.

## Out of scope for this PR
No login UI, Supabase SDK, SQL deployment, cloud writes, account creation, or live-site changes.
