# V7 verification

Tested using headless desktop Chrome on Windows at desktop (1440px) and mobile (390px) viewport widths.

Passed browser interaction checks:

- All five tabs render; none causes horizontal overflow at 390px.
- New round creation, editing, search, and page-reload persistence.
- Nine-hole score entry and automatic scorecard total.
- Sample round creation and handicap estimate generation.
- Yearbook memory creation.
- Local invitation, shared-round planning, challenge creation and progress.
- Profile editing and page-reload persistence.
- Backup JSON content generation, schema validation, and reimport without duplicate rounds.
- No JavaScript page errors during the test sequence.

Desktop and mobile screenshots were captured. Home mobile and Friends desktop were visually reviewed. Screenshots include test data added through the UI. The distributed app starts with an empty personal journal and three fictional demo friends.

The browser sandbox initially canceled file-origin downloads and blocked the preview connection. An elevated local-server run subsequently completed the full test, including download and reimport. A separate file-origin run verified the generated export Blob and import merge directly. Download behavior can depend on browser/device policy.

Not verified: physical iOS/Android devices, Safari/Firefox, screen-reader operation, V6 data compatibility (source unavailable), or a public deployment. No backend or external social communication is implemented.

## Add, club search, location, and scorecard update

- Passed JavaScript syntax checks on the generated standalone HTML.
- Passed bottom Add menu and new workflow browser checks at 390px.
- Live worldwide search returned three golf-course results for Royal County Down using Photon, and selecting a club populated round entry.
- Controlled API response confirmed course-name and nine-hole metadata transfer.
- Nearby discovery returned 12 live clubs when supplied with simulated coordinates at a public golf course. This verifies the permission-success path and nearby query without accessing the user's actual location.
- Live Tesseract OCR read a generated printed scorecard image, exposed recognized text for review, and transferred nine hole scores totaling 36 into round entry. No round was auto-saved.
- Unit checks covered explicitly labeled score rows, rejection of par rows and invalid scores, total extraction, distance calculations, unsupported/oversized uploads, and unavailable/declined location states.
- Existing core browser regression suite passed after feature integration. No JavaScript page errors were reported in the online workflow suite.
- Real device GPS accuracy, browser camera capture, handwriting recognition, arbitrary multi-player table interpretation, and completeness of the worldwide course directory are not verified. Screenshot upload is supported; the app does not directly capture another app's screen.
- Earlier Overpass global search timed out and was replaced with Photon; the shipped app uses Photon for both worldwide search and nearby discovery.

2026-10-20 account-course logo repair: all 12 test suites passed. Added geo-scoped Country Club Ohio identity, Nashawtuc provider-ID identity, own-post-only legacy identity recovery, and Friends badge render coverage. Synthetic course-hub preview supports --logos with fake scores/posts and public club coordinates, without real journal contents. Local IAB preview failed with connection timeout on port 4177; do not claim local screenshot verification for this change.


Mobile round-entry release: full-width native date field; Holes + Total strokes paired; Tees on its own row; compact viewport-bounded sheet; sticky header and Save actions. Local HTTP browser checks at 390×700 and 320×568 found no document/dialog horizontal overflow and visible Save actions. Full existing Node test chain passes. Physical iOS Safari remains unverified. This release excludes the staged membership/admin/backend changes.


Sharing preview: reviewed a fully loaded 1200×630 demo-journal screenshot (fictional account, public course map, derived scoring statistics, recent rounds and original sunset image). Verified JPEG dimensions, HTML-response metadata and build asset copying. No real account data is used. Actual iMessage display/cache behavior remains device-dependent and has not been tested by sending messages.


Messages compatibility correction: hosted release HTML reduced from 4,837,267 bytes to 3,113 bytes. Complete test chain passes, including exact bundle-content parity and standalone preservation. Local 390px hosted HTTP checks confirmed the entry/account screen, guest Home, loaded external styles/fonts, native round-entry form, no horizontal overflow and visible Save actions. No journal records were saved. Native Messages rendering is not claimed verified.

Production course-search/mobile verification (2026-10-20): Adare listing/selection and 320/390px popup sizing, centered date, fixed background, internal scrolling and page restoration passed. Wider random provider audit 14/17; production Photon fallback failed for Hirono. Adare tee data absent upstream. Full evidence and limitations: docs/COURSE-SEARCH-QA.md.

Round entry and map update (2026-10-21): only course name, date and score are required. Tee/rating/slope are optional; missing ratings are stored as null and excluded from handicap estimates. Played-course map uses fixed-size selectable dots at every zoom; heat layer/legend removed, with grouping retained for nearby/colocated courses. Full test suites and local 390px minimal-save/reopen checks pass.
Synthetic map preview confirmed zero heat layers/legends and dots at overview and close zoom. One synthetic round was saved only on the isolated local guest origin; no production journal was edited. Physical device testing remains unverified.

Map overview update (2026-10-21): opens with no selected course or info overlay. Dot/collection selection opens a dismissible course panel without forcing a zoom. Close, map-background tap, and All places clear selection; re-entering Places and account/year changes reset it. Muted cream/green Esri cartography is shown below zoom 14, satellite at 14+, with automatic return when zooming out. The shared layer switch is in atlas.js rather than the unrelated staged club-access module. Full root/release test chains pass. Synthetic 390px browser checks verified initial/reopened overview, grouped selection, close and tap-away dismissal, loaded satellite tiles, cartography restoration and zero console errors. No journal or backend changes.


Round date and unscored entry (2026-10-21): replaced the native date popup with an in-form, centered calendar with month/year navigation and keyboard date selection. Added Score not kept below Total strokes; explicit override stores null score, preserves played-round/course counts, excludes scoring/handicap statistics and remains V7-backup compatible. Unscored rounds remain private because Friends posting requires a numeric score. Local 320px browser check selected February 29, 2024 and saved/reloaded an unscored test round successfully. Regression coverage includes leap-day validity, year rollover, keyboard tab target, explicit score override, backups and handicap exclusion.


Played-course map correction (2026-10-21): Places now defaults to All years and keeps its year filter separate from annual statistics. Distinct nearby courses retain individual dots rather than merging into regional clusters; only identical coordinates share a chooser. Demo account diagnosis: six located courses across 2025/2026, but old default showed three 2026 courses as two regional dots. No account records were edited. Regression tests cover all-year defaults, independent annual year, new unscored round inclusion and nearby separate markers.


Responsive control sizing (2026-10-21): widened the Yardage Book year selector, reserved consistent select-arrow space, stacked narrow-screen headings and history filters, retained 16px mobile field text, allowed card/action headings to wrap, and stacked calendar month/year controls below 360px. Local 320px visual checks cover All years, All rounds, Lowest strokes, Profile, Friends, Courses, Add and round calendar. No record or behavior changes.


Fixed geographic dots (2026-10-21): removed collision spreading and zoom-dependent icon offsets. Every marker stays centered on its saved latitude/longitude with a constant 12px dot. Only courses with exactly identical coordinates share a chooser; geographic grouping no longer depends on zoom projection. Rendering regression checks assert unchanged coordinates and anchors at zooms 3, 8, 14 and 19.


Statistics periods (2026-10-21): renamed Your year to Statistics across Yardage Book views. Statistics and Memories offer All time alongside individual years; all-time totals, averages, best rounds, monthly drilldowns and recaps include all non-sample years. Year-specific reporting remains unchanged. Regression checks verify mixed-year totals, bests, averages and month counts.
