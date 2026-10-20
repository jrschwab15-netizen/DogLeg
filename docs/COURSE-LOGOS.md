# Verified course identities

## Automatic discovery beyond the embedded catalog

The 18 manually verified identities remain preferred, but are no longer the coverage boundary. Every valid OpenGolfAPI course ID is eligible for automatic logo discovery when its badge becomes visible. Legacy named courses are first matched to a unique directory course using the existing name/location checks. Ambiguous matches remain unlinked.

`course-logo` is a read-only Supabase Edge Function. It accepts only a course UUID, fetches that course from the fixed OpenGolfAPI endpoint, and checks its listed website. It extracts structured Organization/GolfCourse logo metadata and logo-labelled images, then falls back to an explicitly labelled website icon. It never substitutes an Open Graph scenery photo as a crest. Missing websites, blocked sites and missing artwork receive distinct statuses. Generic vendor, sponsor, parked-domain and challenge content is excluded where detectable. Automated results are labelled as discovered website marks, not manually verified course-specific crests; shared municipal/resort websites may use a shared identity.

The service uses public app-key authentication and an allowed browser-origin list, with platform user-JWT verification off because guests must be able to read public course identity. It has no database client, no service-role key, no player-journal access and no writes. It rejects caller URLs, credentials, nonstandard ports, IP-literal/private hostnames, nonpublic DNS addresses and cross-site redirects. It reads bounded HTML/JSON with timeouts, deduplicates concurrent ID lookups, caches results in the function instance and limits cold discovery calls per minute. It does not bypass site challenges. A provider-listed website is a source association, not independent proof that the upstream listing is correct.

The browser processes two visible-course lookups at a time and caches bounded results under `dogleg-course-logos-v1`. It retries transient/rate-limit failures and preserves initial badges if an external image fails. Discovered marks flow through the shared badge renderer into results, course pages, history and map badges. Course pages show source/provenance, a full-size image link and a retry control. Embedded verified artwork also has a download link. No whole-page/map rerender is needed when a logo arrives.

This is on-demand course-wide lookup, not a completed worldwide bulk import. Courses without a usable directory website, unique match or accessible image still require source-data correction or a verified asset. Logos continue to belong to their respective clubs. Automatic images load from the course’s public image host; they are not embedded in the standalone build. Existing embedded artwork remains available offline.

Live checks found actual site logos for **Hillandale Golf Course (Durham, NC)** and **Mink Meadows Golf Club (Vineyard Haven, MA)** outside the original catalog. Burnham Beeches returned `website_missing`, matching its provider record. Local browser checks confirmed Hillandale’s image in search and its course header, source/full-size access, and no overflow at 390px. Twelve suites pass, including extraction, explicit icon fallback, caching, ambiguous-course rejection, API/method/origin checks and blocked private-address/redirect cases.

Technical references: https://docs.deno.com/api/deno/network/ , https://supabase.com/docs/guides/functions/auth , https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API .

## Embedded verified starter artwork

The standalone build embeds 18 verified official club/course identities. New entries in this release: Torrey Pines, Oakmont Pennsylvania, Oakmont Glendale, Harbour Town, Streamsong, Whistling Straits, TPC Sawgrass, Royal Portrush and Carnoustie. The existing Bandon course marks, Pinehurst and Royal County Down remain.

Each asset has an official page and exact asset receipt in `assets/course-logos/manifest.json`, along with explicit name aliases, location and known course IDs. Resort/club marks can identify multiple layouts at the same property; they do not imply a unique crest for every layout. Harbour Town uses the lighthouse mark published by its official shop. Streamsong uses its official compact S mark. TPC's original horizontal official image is displayed with CSS clipping to emphasize its crest at small sizes. Original assets remain unchanged.

Oakmont requires particular care: the seeded provider ID `4eb9126d-4857-4f25-87b8-47f8e15a2eac` is the Glendale, California course, not Pennsylvania. The California and Pennsylvania crests are separate entries. A generic Oakmont name without coordinates or a known provider ID now receives initials rather than a guessed crest.

Lookup prioritizes verified provider IDs, then normalized exact name aliases plus saved coordinates when present. Normalization handles case, accents, punctuation and ampersands; it does not use fuzzy substring matches. Ambiguous aliases resolve only when coordinates or IDs distinguish them. Unknown courses retain initials. This is a curated catalog, not a universal logo API; Pebble Beach assets remain excluded because their official host challenged downloads.

Assets are embedded by `scripts/build.cjs`, so rendering does not send journal/course history to external logo services. `tests/course-brands.cjs` checks real PNG/SVG files, self-contained SVG artwork, source receipts, normalization, provider IDs, geographic mismatch and the Oakmont separation. `node scripts/brand-fixture.cjs` previews public artwork only at 30px and 48px on port 4176; it does not load journals or sessions. Browser verification loaded all 36 samples successfully. All nine suites passed.
