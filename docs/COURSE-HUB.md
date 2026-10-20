# Dedicated course pages

Open **Explore course** from a saved course, **View course** from directory search, or **Explore this course** from the Yardage Book map. Mobile also has a Courses shortcut inside Profile. The Courses collection remains the parent screen.

Course pages have four sections:

- Overview: address/map, verified official website and description when available, separate nine/18-hole personal bests with tee/date references, published ranking citations and verified historic events.
- Scorecard: tee/gender selector, published rating/slope, yardage/par, hole yardages, pars and stroke indexes. Unknown values show —. The scorecard scrolls inside its panel on phones. Play this course carries the selected tee into logging.
- Clubhouse: most-rounds leaderboard, separate best nine/18 scores, and one editable 1–5-star review per golfer/course. Private rounds count for you; accepted friends contribute only explicitly posted rounds. Duplicate own posts do not count twice. Ties share a position. The leaderboard is scoped to visible content, not a global or official club ranking. Up to 500 latest matching shared posts and 500 visible reviews are loaded.
- Photos: attributed reusable online images and a separate Dogleg gallery. Your journal photos stay private; friends’ photos appear only from posts you may already read. Images can be opened individually. New photos are attached through round logging.

## Data and privacy

Published tee facts use the existing OpenGolfAPI cache/import flow; saved tee snapshots still work when the directory is unavailable. No tee or nine-hole ratings are invented. No player journals are queried for other users.

The new `dogleg_course_reviews` table has RLS, an owner/course primary key, bounded text/stars and an indexed course lookup. Only owners can write/delete; owners and accepted friends can read. There is no anonymous access and no service-role key in the client. The deployed schema is recorded in `supabase/course-reviews.sql`. Existing post/connection access policies are unchanged. New explicit round posts optionally include their course ID/location for unambiguous course association; older posts still match conservatively by name/location. Reviews require login; guest private statistics and photos remain usable.

Course IDs take priority over names. Different layouts and separate Oakmont clubs must not share statistics or history merely because their labels resemble each other. Unknown or ambiguous directory matches do not auto-select an arbitrary course.

`data/course-editorial.json` currently contains six researched profiles: Pebble Beach, Torrey Pines South, Pinehurst No. 2, Bandon Dunes, TPC Sawgrass Dye’s Valley and Whistling Straits. Two include sourced published rankings. Event information is explicitly attached to its layout, not adjacent courses. Unknown coverage is labelled as unverified; it does not imply that a course has no history or ranking.

`data/course-photos.json` currently supplies seven reusable Wikimedia photographs across four courses. Each retains its photographer, license and source page; thumbnails load from Wikimedia, without sending journal content. No random web image is guessed as a specific course. The metadata-only import script uses fixed course/file queries and filters for reusable licenses. Additional online photography/history/rankings require verified sources. Existing embedded logo identities remain available.

## Verification

All ten JavaScript suites pass. The new suite covers course identity and geographic/layout separation, nine/18 bests, duplicate own posts, tied ranks, safe outbound links, scorecard rendering and late/account-change responses. Photo/review rendering escapes names/text; URLs require HTTPS.

`supabase/tests/course_reviews.sql` passed on the live project inside a rollback transaction with three synthetic identities. It verified owner read/write/delete, accepted-friend read, denied anonymous/pending/disconnected reads, denied friend writes/deletes, denied ownership reassignment and rejected invalid star values. No test identities or reviews remain. Security advisors found no new schema issues; the pre-existing Auth leaked-password-protection warning remains (https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

Local HTTP browser checks confirmed course collection navigation, real tee data, attributed online image loading, narrow 320px scorecards with no page overflow, and guest statistics. The isolated `scripts/course-hub-fixture.cjs` used synthetic accounts/rounds/photos and disabled cloud bootstrap. It verified three private rounds versus one friend post with no duplicate own-post count, review creation, private/friend photo captions, and selected Blue tee transfer (74/140) to round entry. No real account posts/reviews were created. Physical-device touch testing remains outstanding.
