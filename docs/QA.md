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
