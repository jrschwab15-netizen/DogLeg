# Administration

Independent admin access is active at https://doglegclub.com/admin/. Sign in using the specifically authorized owner account, then privately choose and confirm a 6–12 digit PIN on first access. Never send PINs in chat. A lost PIN requires trusted operator assistance.

Only server-owned dogleg_private.admin_accounts roles authorize access. No role is inferred from names, email patterns or editable metadata. PIN hashes and audit events are private with RLS and no client table grants. Public RPC wrappers use SECURITY INVOKER and authenticated-only grants; privileged helpers have an empty search path. Unlock is limited to five attempts per 15 minutes and ten-minute tokens, checked on every operation. Lock clears the server token; hiding the page locks the UI. Account changes clear dashboard data and pending responses are ignored.

The dashboard shows account emails, creation dates in its response, saved-round totals and administrator status. It allows explicit confirmed administrator grants/revocations and refuses self-revocation. It does not expose journal round details, collect visitor traffic, enable membership/paywall restrictions, disable accounts or delete records. The staged club-access.sql and club-update.js remain separate and must not be deployed as part of admin activation.

Schema source: supabase/admin-access.sql; applied migration independent_pin_protected_admin. Existing auth users were not rewritten. The owner role was assigned to the exact account email confirmed in this chat after signup. PIN enrollment remains for the owner to complete privately.

Verification: full Node test chain, admin race/PIN-confirmation/escape/lock tests, production ordinary-account RPC denials and owner role/PIN-required checks passed. SQL checks confirm anonymous RPC denial, private table RLS/no member table grants, empty search paths and no membership schema. Mobile local synthetic fixture verifies unlock, account listing, role confirmation and lock without production account changes. Production PIN enrollment/unlock is intentionally left to the owner.

Security advisor: the private RLS tables intentionally have no client policies (default deny). The existing Auth leaked-password-protection warning is unrelated; see https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .
