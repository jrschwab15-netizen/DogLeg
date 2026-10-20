# Dogleg — Codex project

The full current Dogleg V7 project, ready for continued development in Codex. This directory is self-contained; it does not depend on the original chat's temporary files.

## Work locally

Use Node.js 20 or newer. No npm installation is needed.

```sh
npm run build
npm test
npm start
```

Open http://127.0.0.1:4173 after starting the server. Or open index.html directly for the offline journal. Club search and OCR downloads need internet; location depends on browser permission and secure-context support.

## Files

- src/template.html — application layout, styling, local data, and core flows.
- src/features.js — Add menu, club search, nearby location, scorecard OCR.
- assets/ — original sunset photograph and approved logo.
- scripts/ — portable build and preview server.
- tests/features.cjs — syntax and feature logic checks.
- index.html — generated standalone application.
- dist/index.html — generated static hosting build.
- docs/ — feature documentation, prior QA results, and screenshots.
- PROJECT-STATUS.md — completed work, limitations, and pending cloud integration.
- AGENTS.md — design and implementation context for Codex.

## Continue in Codex

Add/open this folder as a local project in Codex. Ask it to read AGENTS.md and PROJECT-STATUS.md, then continue the next change. This chat has not been moved to a saved project automatically.

## Deployment status

Published repository: https://github.com/jrschwab15-netizen/DogLeg. Live website: https://jrschwab15-netizen.github.io/DogLeg/. GitHub Pages serves the root index.html from main. Run the build and checks before pushing updates. Supabase DogLeg (ngayytqdpltqauqmtbgo) stores private authenticated journals. Open Profile to create an account, confirm your email, and sign in. Import the original browser journal or a V7 backup to move existing records into your account. Changes save automatically with conflict protection. Friends remains a demo. See docs/CLOUD.md for details.

