# Verified course identities

The standalone build embeds 18 verified official club/course identities. New entries in this release: Torrey Pines, Oakmont Pennsylvania, Oakmont Glendale, Harbour Town, Streamsong, Whistling Straits, TPC Sawgrass, Royal Portrush and Carnoustie. The existing Bandon course marks, Pinehurst and Royal County Down remain.

Each asset has an official page and exact asset receipt in `assets/course-logos/manifest.json`, along with explicit name aliases, location and known course IDs. Resort/club marks can identify multiple layouts at the same property; they do not imply a unique crest for every layout. Harbour Town uses the lighthouse mark published by its official shop. Streamsong uses its official compact S mark. TPC's original horizontal official image is displayed with CSS clipping to emphasize its crest at small sizes. Original assets remain unchanged.

Oakmont requires particular care: the seeded provider ID `4eb9126d-4857-4f25-87b8-47f8e15a2eac` is the Glendale, California course, not Pennsylvania. The California and Pennsylvania crests are separate entries. A generic Oakmont name without coordinates or a known provider ID now receives initials rather than a guessed crest.

Lookup prioritizes verified provider IDs, then normalized exact name aliases plus saved coordinates when present. Normalization handles case, accents, punctuation and ampersands; it does not use fuzzy substring matches. Ambiguous aliases resolve only when coordinates or IDs distinguish them. Unknown courses retain initials. This is a curated catalog, not a universal logo API; Pebble Beach assets remain excluded because their official host challenged downloads.

Assets are embedded by `scripts/build.cjs`, so rendering does not send journal/course history to external logo services. `tests/course-brands.cjs` checks real PNG/SVG files, self-contained SVG artwork, source receipts, normalization, provider IDs, geographic mismatch and the Oakmont separation. `node scripts/brand-fixture.cjs` previews public artwork only at 30px and 48px on port 4176; it does not load journals or sessions. Browser verification loaded all 36 samples successfully. All nine suites passed.
