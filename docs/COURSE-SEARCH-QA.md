
# Course search and mobile release verification — 2026-10-20

Production release starts at 85bac16; follow-up removes a slow fallback's ability to keep Search disabled or overwrite successful results. Separate production checkout excludes all staged membership/admin changes.

## Passed
- Live signed-in round search found both Adare Manor Hotel & Golf Resort Ireland and Adare Manor Golf Club. Resort selection loads provider details, with unavailable tee data clearly identified. No journal/draft/post saved.
- Production mobile viewports 390×700 and 320×568: native date text centered, date widths 306px and 236px; no page/dialog horizontal overflow; Save round and Save draft visible.
- Internal form scrolling reached 465px while dialog remained at y=8 and underlying body remained fixed at top=-53px. Closing restored page scroll to 53px. Date editing worked at 320px.
- Find a course returned both Adare choices; follow-up regression verifies fast results unlock Search while the slower directory remains pending.
- Browser searches passed for Valderrama, Cape Kidnappers, Sentosa, Rosanna, Le Golf National, Hillandale and Mink Meadows. First displayed results took approximately 1.4–2.9 seconds in this run. Mink Meadows exposed three tee sets; unavailable rating remained blank.
- Complete production test chain passes, plus concurrency, search-button readiness, distinct-course identity and dialog scroll regressions.

## Coverage limits
Seeded random public-provider audit: Adare plus 16 of a 20-course international pool, 14/17 found in the expected geographic area. Correct-area checks reject arbitrary fuzzy matches in other countries. Raw report: course-search-coverage-20261020.json. Reproduce with node scripts/check-course-coverage.cjs (network required). Total milliseconds include an optional detail request; they are not search-only latency.

Misses: Royal Dornoch, Delhi Golf Club, Kigali Golf. Kigali encountered a provider timeout. Hirono's Japanese listings appeared in direct API checks but failed twice through the production browser because the Photon request was unavailable. Direct provider success does not prove browser reliability.

Adare's upstream resort record has zero tee sets/holes; location loading is verified, automatic Adare ratings/scorecard loading is not available. Public providers do not offer verified universal tee/scorecard coverage. This sample is not a load or capacity test and does not establish mass-launch readiness. Physical iOS Safari/Android keyboard behavior was not exercised; these are responsive browser checks.

No backend migration, account permissions, journal records or friend posts changed.
