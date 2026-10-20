# Current state

Dogleg V7 is a complete browser-local prototype. Latest approved design: welcoming country-club locker room with mahogany, brass, cream, green painted honours boards, original course sunset hero, and a generated Sunset D logo.

Implemented: five tabs; local profile; annual round goal; 9/18-hole entry; hole totals; draft/edit/delete/search; statistics; unofficial handicap trend; course passport; yearbook; fictional Friends list/activity/leaderboard/invites/shared plans/challenges; backup export/import; Add menu integrated into the bottom navigation bar; worldwide Photon club search; optional nearby location; local Tesseract screenshot/photo OCR with review before saving.

Published to https://github.com/jrschwab15-netizen/DogLeg with GitHub Pages enabled for main at https://jrschwab15-netizen.github.io/DogLeg/. Supabase DogLeg (ngayytqdpltqauqmtbgo) now stores authenticated user journals in public.dogleg_journals. Migration create_private_dogleg_journals is applied. Profile includes email/password accounts and private cloud saves. Owner-only RLS protects reads/inserts/updates. Revision checks prevent stale overwrites. Guest records and account caches remain separate; original records can be imported explicitly. See docs/CLOUD.md for setup, recovery, and verification limits. Do not describe the Friends demo as real multiplayer.

Verification: core Chrome desktop/mobile checks passed; live worldwide course search and simulated-coordinate nearby search passed; live OCR on a synthetic printed scorecard passed. npm test contains portable syntax and feature logic checks. Previous browser evidence is in docs/. Screenshots predate the newest header logo; the standalone build contains it. No physical-device GPS or handwriting guarantee.

V6 source was unavailable. V7 was reconstructed from approved requirements and the recovered original photograph.

