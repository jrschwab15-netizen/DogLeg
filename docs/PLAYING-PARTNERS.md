# Friends and playing partners

Friends uses name search instead of friend codes. Signed-in golfers can opt into the directory from Friends → Let friends find you, optionally adding a city or club to distinguish same-name players. Existing accounts start hidden. The directory lists only display names and optional areas; emails, private journals and live location are not included. Friend requests still require acceptance before sharing or appearing as an accepted friend in the round picker.

Log/edit a round and use Who did you play with below the score. Choose an accepted friend, reuse a previous partner or add a private name for someone without Dogleg. Up to twelve partners can be kept per round. Adding a partner does not send a request or notification, publish their name, create a round in their account or share a journal. Round posts continue to use their existing explicit sharing control and do not contain partner arrays.

Friends shows all-time playing partners. Statistics shows the selected year or All time. Insights include the most common partner (ties labeled), rounds together, distinct courses, last played and your 18-hole average with each partner. Unscored rounds count as outings but not scoring averages. Nine-hole scores stay separate. Tap a partner to open the underlying rounds. Editing/removing a partner or deleting a round recalculates these insights.

Optional round.partners is an array of stable guest/user keys, display names and optional account IDs. It stays in the owner's existing private journal and V7 backups. Missing arrays in older backups remain valid. Validation bounds the array and names, rejects malformed/duplicate keys, and keeps account caches/drafts isolated. Guest identities are not merged with accounts by name alone.

Database: supabase/player-directory.sql was applied as opt_in_player_name_directory. dogleg_player_profiles has RLS; only the owner can insert/update, and other authenticated users can read opted-in profiles. dogleg_search_players is a bounded SECURITY INVOKER function. No Auth triggers, existing journals or friend relationships were modified. Membership/admin staging remains undeployed.

Verification: unit tests cover identity, statistics, backup validation, private post payloads and account-switch races. A synthetic local fixture (node scripts/partner-fixture.cjs 4198) exercises name lookup, requests, partner selection and statistics without real accounts or messages. Production checks in supabase/tests/player-directory.sql are read-only. The approval reviewer rejected inserting synthetic Auth users into production, so live multi-user write/RLS tests were not performed. Positive matching was checked against in-memory SQL values and synthetic UI clients.

The security advisor reported no issue with the new directory. It also reported existing [disabled leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection); account-wide Auth settings were left unchanged.

Round history shows partner names and supports searching rounds by partner name. Names remain private in journal history; they are not added to friend posts.
