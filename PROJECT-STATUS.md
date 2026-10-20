# Current state

Current release: dedicated Courses tab, compressed round-photo attachments, and intentionally implemented accepted-friends requests/feed in Supabase. This supersedes historical Friends-demo notes below. Posting is off by default; private journals remain owner-only. Mobile puts Passport inside Courses to keep five navigation controls. See docs/COURSES-PHOTOS.md for testing and size limits.

Dogleg V7 is a complete browser-local prototype. Latest approved design: welcoming country-club locker room with mahogany, brass, cream, green painted honours boards, original course sunset hero, and a generated Sunset D logo.

Implemented: Home, Rounds, centered Add, Passport, and Profile navigation; Friends combined under Profile; local profile; annual round goal; 9/18-hole entry; hole totals; draft/edit/delete/search; statistics; unofficial handicap trend; course passport; yearbook; fictional Friends list/activity/leaderboard/invites/shared plans/challenges; backup export/import; Add menu integrated into the bottom navigation bar; worldwide Photon club search; optional nearby location; local Tesseract screenshot/photo OCR with review before saving.

Published to https://github.com/jrschwab15-netizen/DogLeg with GitHub Pages enabled for main at https://jrschwab15-netizen.github.io/DogLeg/. Supabase DogLeg (ngayytqdpltqauqmtbgo) now stores authenticated user journals in public.dogleg_journals. Migration create_private_dogleg_journals is applied. Profile includes email/password accounts and private cloud saves. Owner-only RLS protects reads/inserts/updates. Revision checks prevent stale overwrites. Guest records and account caches remain separate; original records can be imported explicitly. See docs/CLOUD.md for setup, recovery, and verification limits. Do not describe the Friends demo as real multiplayer.

Verification: core Chrome desktop/mobile checks passed; live worldwide course search and simulated-coordinate nearby search passed; live OCR on a synthetic printed scorecard passed. npm test contains portable syntax and feature logic checks. Previous browser evidence is in docs/. Screenshots predate the newest header logo; the standalone build contains it. No physical-device GPS or handwriting guarantee.

Desktop/mobile UI update: desktop has a sticky search/navigation header, wide dashboard, recent-round tables, and visible tracking summaries. Mobile retains centered Add, bottom navigation, and round cards. History supports course/tees/notes search, year and 9/18-hole filters, and sorting. The annual goal and direct course/scorecard/memory actions are visible on Home. Research, sources, and validation limits are in docs/UX-RESEARCH.md.

Latest typography/account update: embedded Source Sans 3 replaces decorative UI type at the user's request. Dedicated login and account-creation screens replace the inline Profile form. Sessions persist locally and refresh automatically; account journals restore from cache before network access. Email confirmation is disabled at the user's explicit request, so signup opens the journal immediately. Supabase email return URLs point to the live website. Password-reset email UI is withheld until custom SMTP is configured. Existing account-owned RLS and V7 backups remain.

Latest clubhouse redesign: Flighty research informed a focused latest-round/draft card, season progress, earned milestones, course-passport collection, and a generated season-card PNG. Desktop exposes Friends and puts Add beside search; mobile keeps centered Add and Friends within Profile. Source Sans 3, mahogany, cream, green, brass, original photograph/logo, and painted board remain. Milestones and season summaries distinguish sample previews from real data. See docs/FLIGHTY-REVIEW.md.

Primary domain: https://doglegclub.com/. GoDaddy apex/www DNS points to GitHub Pages, the certificate is approved, and HTTPS is enforced. Supabase Site URL and allowed redirects include the primary domain; its existing API/data project is unchanged. Users log in once at the new origin and then keep their session locally. See docs/DOMAIN.md.

V6 source was unavailable. V7 was reconstructed from approved requirements and the recovered original photograph.


Latest revision: removed the brown frame in favor of a light blue-green canvas, white navigation, teal actions and clearer text contrast. Home copy is more direct. Round entry now searches Photon while typing a course name, offers prior real courses first, and fills previous tees/rating/slope for an exact saved-course match. Directory selections fill available name/holes and display location; unknown tee ratings are left empty for scorecard confirmation. Existing score/date/notes remain in the form.

Latest UI audit: a shared responsive layout now fixes intrinsic form-column sizing, compressed heading buttons, uneven card padding/stretch, content gutters, course rows, plot scaling, hidden scorecard previews and dialog widths. Six pages and round forms were measured at 320/390/768/1024/1440 px with no horizontal overflow. Logged-in Friends was inspected with local static fixtures; account forms were inspected without account changes. Courses View rounds now applies its filter. See docs/UI-AUDIT.md.

Latest experience: focused logging-first Home; Passport renamed Yardage Book with interactive course maps, Highlights and Memories. Mobile replaces Courses with Yardage Book. Real directory coordinates are saved optionally in private journals; old rounds can be placed explicitly. Navigation/dialog/map motion respects reduced-motion settings. See docs/YARDAGE-BOOK.md.

Course data: imported 10 OpenGolfAPI cards / 84 tee sets into a public-read, server-write Supabase cache. Logging now selects course + rating/tee set and fills available ratings, par, yardages and hole stroke indexes; further imports run on demand for signed-in players. Includes offline cache, snapshot validation and nine-hole safeguards. See docs/COURSE-DATA.md.

Annual Yardage Book: defaults to current-year stats with rotating referenced highlights, strokes, separate 9/18 scoring records/averages, longest/shortest saved holes, monthly drilldowns, scoring mix, in-round streaks and tracked putt/OB/water/penalty/time totals. Optional round counters preserve unknown versus zero. Includes local PNG recap and year-filtered Places/Memories. See docs/ANNUAL-YARDAGE-BOOK.md.
