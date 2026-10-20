# Dogleg V7

A mobile-first, browser-local golf journal with Home, Rounds, Passport, Friends, and Profile.

## Open

Open `index.html` in a current Chrome, Edge, Firefox, or Safari browser. The core journal and the user's original sunset photograph are embedded in this one file and work offline. The optional club search and scorecard reader require internet. No installation, account, API key, or backend is required.

For GitHub Pages, commit this folder and select the branch root as your Pages source. `index.html` is ready to serve. This package does not publish anything automatically.

## Features

- Bottom Add button opens round entry, worldwide club search, scorecard screenshot/photo analysis, and yearbook memories.
- Worldwide club search uses Photon/OpenStreetMap, with on-demand searches, short-lived in-memory caching, and rate limiting. Results can populate a new round. Listings are not a complete commercial course database, and tee ratings/slopes must be verified manually.
- Near me requests location only when tapped. Coordinates are rounded to two decimal places before sending to Photon to find courses within 30 km; results are distance-sorted. Location is not saved or included in backups. Browser permission and a supported secure context are required; HTTPS hosting is recommended for reliable mobile location. Permission denial leaves worldwide name search available.
- Scorecard reading accepts PNG, JPEG, and WebP screenshots/photos up to 15 MB. Tesseract.js 6.0.1 and English language data load on demand from external CDNs. Image recognition runs on the device. No scorecard image is uploaded, retained in the journal, or included in backups. Recognized text can be retained as round notes after you review and save the round. A clearly labeled score row may be suggested; ambiguous table columns and handwriting need manual correction. This is printed-text OCR, not a general-purpose AI image analyst. Course names, date, tees, rating, slope, totals, and player rows require review. Nothing is saved automatically.

- Round entry for 9 or 18 holes, optional hole-by-hole automatic total, putts, tees, rating, slope, notes, drafts, editing, and deletion.
- Round search, 18-hole scoring average and personal best, putt average, and handicap estimate trend.
- Automatic course passport and an editable yearbook with year filtering and print support.
- Friends list, recent activity, sample leaderboard, local shared-round plans, manually tracked challenges, and placeholder invitations. All Friends features are explicitly a local demo. Nothing is sent to another person.
- Local profile, annual round goal, browser persistence, and V7 JSON backup export/import. Import merges IDs without overwriting existing records or the profile. Invalid backups are rejected.
- Optional labeled sample rounds under Profile. A new installation starts with no user rounds or memories.

## Data and limitations

Browser storage belongs to the browser and origin. Moving or renaming a local HTML file, changing browser, clearing site data, or switching from local files to hosting may make previous data unavailable. Export backups before moving the app. Private browsing and some device policies can prevent persistence. Keep regular exports.

The handicap calculation is an **unofficial practice estimate**, not a WHS Handicap Index. It averages the lowest 40% (rounded down, minimum one) of score differentials among the last 20 eligible 18-hole rounds, starting at three rounds. Differential = (score − course rating) × 113 / slope. It excludes 9-hole rounds and does not apply WHS adjustments, PCC, net double-bogey caps, or exceptional-score reductions.

V6 source files were unavailable in this session. This is a fresh V7 implementation from the approved requirements, preserving the recovered original photograph; V6 data migration cannot be guaranteed. Import accepts the documented V7 backup format only.

The photograph is supplied by the user and remains subject to the owner's rights. Review permission before publishing it in a public repository.

## Verification

See `QA.md`. The screenshots use sample rounds and test entries; these are not embedded as user history in the delivered HTML.

## External services

Club search: [Photon documentation](https://github.com/komoot/photon/blob/master/docs/api-v1.md), [public-service limits](https://github.com/komoot/photon#demo-server), and [OpenStreetMap attribution](https://www.openstreetmap.org/copyright). The public search service can throttle requests or be unavailable; manual entry remains available. Use a managed or self-hosted search service before scaling this to many users.

Scorecard OCR: [Tesseract.js](https://github.com/naptha/tesseract.js). Engine/language downloads are external requests even though image recognition is local. Offline OCR is not bundled.
