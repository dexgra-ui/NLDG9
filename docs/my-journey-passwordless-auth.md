# NLDG My Journey: passwordless email authentication (development PR)

## Status
Not deployed. No authentication UI or Supabase SDK is loaded by the live site. This PR provides a tested, client-injected auth adapter for future integration. No browser progress or private content is uploaded.

## Supabase project
Development project: `hdzogotikjhrowkepvye` in US East. Site origin: `https://nolabelsdesignedbygod.org`.

## Required manual Supabase Auth configuration
1. Confirm Site URL is `https://nolabelsdesignedbygod.org`.
2. Add the **exact** redirect URL `https://nolabelsdesignedbygod.org/journey-auth.html` in Authentication > URL Configuration **only after the callback page is implemented and safely hosted**. Do not use broad wildcard redirects.
3. Confirm email provider and Magic Link email template. Do not change template to OTP unless deliberately changing the sign-in experience.
4. Test email deliverability and provider rate limits before inviting real users. Built-in email delivery may be limited; configure an appropriate SMTP provider before launch.
5. Only put the project's publishable key in the browser. Never expose secret/service-role credentials.

## Implementation stages
- Add a dedicated, accessible sign-in UI and callback page with the version-pinned Supabase JavaScript SDK.
- Verify the callback exchanges/handles the auth session, clears token-bearing URL fragments, and only redirects to an approved local page.
- Show sign-in status, errors, email-sent confirmation, and explicit sign-out.
- Continue allowing anonymous Bible studies and local-only My Journey.
- Add real two-account RLS tests for SELECT/INSERT/UPDATE/DELETE across all five tables.
- After separate opt-in, build migration preview and progress-only sync. Private prayers, notes, and journals require an additional explicit opt-in.

## Verification
Run `node scripts/my-journey-auth.test.mjs`. No Supabase network calls are performed by this test.

## Rollout restriction
Do not merge, deploy, enable login links, or import local records until reviewed and authorized.
