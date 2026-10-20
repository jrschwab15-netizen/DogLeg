# Current state

Dogleg V7 is a complete browser-local prototype. Latest approved design: welcoming country-club locker room with mahogany, brass, cream, green painted honours boards, original course sunset hero, and a generated Sunset D logo.

Implemented: five tabs; local profile; annual round goal; 9/18-hole entry; hole totals; draft/edit/delete/search; statistics; unofficial handicap trend; course passport; yearbook; fictional Friends list/activity/leaderboard/invites/shared plans/challenges; backup export/import; floating bottom Add menu; worldwide Photon club search; optional nearby location; local Tesseract screenshot/photo OCR with review before saving.

Published to https://github.com/jrschwab15-netizen/DogLeg with GitHub Pages enabled for main at https://jrschwab15-netizen.github.io/DogLeg/. The existing Supabase DogLeg project (ngayytqdpltqauqmtbgo) has no public tables and is not connected to the app. Supabase does not provide static frontend hosting through its hosted Edge Functions; accounts and cloud persistence remain a separate implementation phase. No database migration has been applied. Do not describe the Friends demo as real multiplayer.

Verification: core Chrome desktop/mobile checks passed; live worldwide course search and simulated-coordinate nearby search passed; live OCR on a synthetic printed scorecard passed. npm test contains portable syntax and feature logic checks. Previous browser evidence is in docs/. Screenshots predate the newest header logo; the standalone build contains it. No physical-device GPS or handwriting guarantee.

V6 source was unavailable. V7 was reconstructed from approved requirements and the recovered original photograph.

