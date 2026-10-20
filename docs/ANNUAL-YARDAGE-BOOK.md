# Annual Yardage Book: research and implementation

Yardage Book now opens on Your year, with the current calendar year selected. Years include the current year plus years with real rounds or memories. Places and Memories use that same year. Sample rounds are excluded from the recap. Home, navigation, original photograph/logo, course imports, private journals and accepted-friends posting are preserved.

## Research findings

Golfshot's 2025 recap focuses on the individual golfer: most-played courses, best 18-hole round, time spent, trends and standout moments. Its useful product lesson is a personal story with specific moments behind the numbers, rather than global community totals. Source: https://golfshot.com/blog/golfshot-2025-year-in-review .

Arccos Career Highlights uses tappable achievements and rotating records. It keeps best 9- and 18-hole scores separate, and distinguishes shot-distance records from course lengths. Its streaks and personal bests informed the rotating highlight, source-round drilldowns and par-or-better streak. Source: https://support.arccosgolf.com/hc/en-us/articles/50224946818708-What-Are-Career-Highlights .

Shot Scope explicitly records lost-ball, drop and penalty events. A score alone does not tell us whether a ball was out of bounds or in water. Dogleg therefore asks for optional counts; it does not infer them from strokes or notes. Source: https://support.shotscope.com/hc/en-us/articles/115005609005-How-do-I-record-penalties-when-I-m-playing .

## What is implemented

- Total recorded strokes, rounds, holes, playing days and courses for the selected calendar year.
- Separate 18-hole and nine-hole scoring averages and best rounds, with source-round links.
- Longest and shortest recorded hole, with course, hole number, tees, date and saved yardage; tap to open its round. Coverage states how many played holes have saved yardages. These are hole lengths, not drives or putts.
- Rotating personal highlight with a short transition; monthly activity bars open that month's rounds. Mobile targets stay usable rather than squeezing 12 tiny buttons into one row.
- Eagles-or-better, birdies, pars, bogeys and double-bogeys-or-worse, computed only from holes with both an entered score and saved par.
- Best consecutive run at par or better within one round. Missing scores/pars or gaps in hole positions break a run. Back-nine metadata aligns to scores entered for holes 10–18.
- Recorded putts, OB balls, water balls, penalty strokes and hours played, each with coverage and drilldown to source rounds.
- Most-played course by visit count. This is not a subjective favourite-course rating.
- A selected-year recap with a downloadable 1080×1350 PNG. It is generated on the device, with coverage and course-data attribution; nothing is posted automatically.

Optional round fields: balls out of bounds, balls into water, penalty strokes and minutes played. Blank means unknown; zero means explicitly none. Penalties must already be included in the user's total strokes and are never added again. Existing rounds can be edited to fill gaps. New optional `extras` fields are bounded integers and validated in V7 backups. Existing journals/backups without extras remain valid. No database schema or RLS changes were needed; the existing private journal stores them. Existing friend-post payloads do not expose the new extras.

## Useful future additions requiring more data

Longest drive and longest made putt need a measured distance and hole reference; course yardages cannot substitute. Fairway/green percentages need hit/miss tracking with valid denominators. Chip-ins, sand saves, three-putt avoidance and up-and-down percentages require hole/shot detail. Strokes gained requires shot locations and a legitimate benchmark. These are promising later features, not statistics Dogleg currently invents or displays.

## Verification

All existing feature, cloud, social, journey, course-data and importer checks pass alongside annual-stat tests. Annual tests cover calendar-year/sample exclusion, total strokes without double-counting penalties, separate round lengths, back-nine hole references, missing metadata, birdies, in-round streaks, explicit zero versus unknown, tracked-round coverage and V7 validation.

Local browser: reviewed desktop and 320/390px mobile. Verified no horizontal overflow, usable month buttons, highlight rotation, longest-hole source/reference, October round drilldown, optional counter save/reopen and unchanged total strokes after entering penalties. Used only an existing guest-only QA round at localhost; no production journal or friends post was changed. Generated PNG preview loaded at 1080px wide. Reduced-motion preferences are respected by section/highlight transitions. Physical-device testing remains outstanding.
