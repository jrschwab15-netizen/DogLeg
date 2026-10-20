# Supabase journals

The website stays on GitHub Pages. Supabase project DogLeg (ngayytqdpltqauqmtbgo) houses authenticated users' journals in public.dogleg_journals. The applied migration is create_private_dogleg_journals; supabase/schema.sql is its source snapshot.

## Getting started

1. Open Profile and create an email/password account.
2. Confirm the email and return to Dogleg to sign in. Email delivery depends on the project's Supabase mail configuration; custom SMTP is needed for unrestricted public delivery. The confirmation email may redirect to the project's default URL; return to the live Dogleg website after confirming.
3. Choose Import this browser’s original journal to copy missing local rounds and memories into your account. Existing cloud records and profile take precedence. Update your player profile separately. Your original guest journal stays intact.
4. Records from a standalone file or another browser need Export backup there, then Import V7 backup on the live site after signing in. Different origins cannot read each other's local storage.

## Saves and recovery

Signed-in edits are cached by account and automatically saved to Supabase after 600 ms. The footer and Profile show save status. Keep the page open until Saved to Supabase appears. Save now retries failed saves. Another device can load the latest journal through Profile.

Each update checks the previous revision atomically. A stale device cannot overwrite a newer cloud revision. If a conflict appears, export a V7 backup before loading the latest cloud journal, then import the backup to merge missing records. Records with matching IDs keep the cloud version. Unsaved local edits/deletions to an existing ID need manual reconciliation from the exported backup. The pre-reload device snapshot is also retained in the account's local-storage key with :before-reload appended.

Signed-out edits remain local. Signing out restores the guest journal; account caches remain available on the device. Use trusted devices and sign out when finished. This implementation does not add multiplayer Friends.

## Security

Only the public publishable key is shipped. Auth is handled by pinned supabase-js 2.118.0 loaded from jsDelivr. The browser SDK stores and refreshes the account session. No service-role key is embedded.

The journal is one JSON document per auth user, preserving V7 export compatibility. Authenticated users may select/insert/update only their own row; anon has no privileges. Both update USING and WITH CHECK enforce ownership. No SECURITY DEFINER function or public view is used. The primary key indexes user ownership. Journal payloads are limited to 10 MB at the database layer and validated in the client before loading/saving.

## Verification

- Existing feature/syntax tests and tests/cloud.cjs pass. Cloud tests cover ownership/revision filters, conflict and offline preservation, cache isolation, merge precedence, and an in-flight save after account change.
- Live database tests ran in rolled-back transactions: own read/write succeeds; other-user access, ownership reassignment, and stale writes fail. Test users and records were not retained.
- Supabase security advisors returned no findings.
- Local HTTP preview verified the Profile account controls and preserved navigation/design. Supabase reports email auth and signup enabled, confirmation required; pinned SDK responds successfully.
- Real inbox delivery and a user's confirmed-account browser session require the user's own account and were not exercised by the agent.

The bundled runtime has Node but no npm executable. Validation ran the exact build/test commands from package.json directly with Node.
