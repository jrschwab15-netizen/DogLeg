# Supabase journals

The website stays on GitHub Pages. Supabase project DogLeg (ngayytqdpltqauqmtbgo) houses authenticated users' journals in public.dogleg_journals. The applied migration is create_private_dogleg_journals; supabase/schema.sql is its source snapshot.

## Getting started

1. Use the dedicated Create account screen to choose your name, email, and password. Email confirmation is disabled at the user's explicit request; successful signup opens the journal immediately.
2. Returning users use the Log in screen. Sessions persist in browser local storage under dogleg-auth-v1 and refresh automatically. Account caches are restored before connecting to Supabase. No plaintext passwords are saved. Browser data deletion, logout, or server revocation can require another login.
3. Choose Import this browser’s original journal to copy missing local rounds and memories into your account. Existing cloud records and profile take precedence. Update your player profile separately. Your original guest journal stays intact.
4. Records from a standalone file or another browser need Export backup there, then Import V7 backup on the live site after signing in. Different origins cannot read each other's local storage.

## Saves and recovery

Signed-in edits are cached by account and automatically saved to Supabase after 600 ms. The footer and Profile show save status. Keep the page open until Saved to Supabase appears. Save now retries failed saves. Another device can load the latest journal through Profile.

Each update checks the previous revision atomically. A stale device cannot overwrite a newer cloud revision. If a conflict appears, export a V7 backup before loading the latest cloud journal, then import the backup to merge missing records. Records with matching IDs keep the cloud version. Unsaved local edits/deletions to an existing ID need manual reconciliation from the exported backup. The pre-reload device snapshot is also retained in the account's local-storage key with :before-reload appended.

Signed-out edits remain local. Continue without an account preserves the browser journal and remembers local mode. Log out returns to the login screen; account caches remain available on the device. Use trusted devices and log out when finished. This implementation does not add multiplayer Friends.

The Supabase Site URL and allowed redirect URL are now https://jrschwab15-netizen.github.io/DogLeg/. Custom SMTP remains unconfigured. Signup does not send confirmation email. Password-recovery handling is present for future email-service configuration, but the login screen does not offer email resets while there is no public sender configured.

## Security

Only the public publishable key is shipped. Auth is handled by pinned supabase-js 2.118.0 loaded from jsDelivr. The browser SDK stores and refreshes the account session. No service-role key is embedded.

The journal is one JSON document per auth user, preserving V7 export compatibility. Authenticated users may select/insert/update only their own row; anon has no privileges. Both update USING and WITH CHECK enforce ownership. No SECURITY DEFINER function or public view is used. The primary key indexes user ownership. Journal payloads are limited to 10 MB at the database layer and validated in the client before loading/saving.

## Verification

- Existing feature/syntax tests and tests/cloud.cjs pass. Cloud tests cover ownership/revision filters, conflict and offline preservation, cache isolation, merge precedence, and an in-flight save after account change.
- Live database tests ran in rolled-back transactions: own read/write succeeds; other-user access, ownership reassignment, and stale writes fail. Test users and records were not retained.
- Supabase security advisors returned no findings.
- Local HTTP preview verified the Profile account controls and preserved navigation/design. Initial verification reported confirmation required; the latest account-screen update below supersedes that setting. The pinned SDK responds successfully.
- Real inbox delivery and a user's confirmed-account browser session require the user's own account and were not exercised by the agent.

## Account screens and typography update

The interface now embeds licensed Source Sans 3 regular/semibold/bold fonts. UI headings, body text, forms, tables, and numbers use that family; the original wordmark and painted board retain their branding. Fonts work in the standalone build without external font requests.

Tests additionally cover cached-session startup, refresh configuration, offline restoration, and explicit logout. A temporary live Supabase account passed immediate signup without email, password login, session refresh, and private journal write/read. The test session was signed out, and the temporary account/journal were removed. Browser QA covers login/signup screens, guest navigation, and guest restoration after reload. Actual account authentication was verified through the same pinned Supabase SDK; no user's password was entered by the agent.

The bundled runtime has Node but no npm executable. Validation ran the exact build/test commands from package.json directly with Node.
