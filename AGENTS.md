# Dogleg development guidance

Read README.md and PROJECT-STATUS.md before changing behavior.

- Preserve the approved country-club locker-room identity: mahogany paneling, warm cream, aged brass, serif headings, and vintage painted honours boards.
- Preserve the user's original sunset photograph and approved Sunset D logo.
- Keep the five tabs Home, Rounds, Passport, Friends, Profile and bottom Add menu. Keep mobile use easy.
- Edit src/template.html and src/features.js, then run npm run build. Root index.html is generated. All images remain embedded in the standalone build.
- Run npm test after behavior changes. For browser testing use the local HTTP server, not the user's in-app file tab. See docs/QA.md for previous verification limits.
- Preserve browser-local golf records and V7 backup compatibility. Friends stays explicitly a local demo until a backend is intentionally built.
- Never embed secrets or Supabase service-role keys in HTML. No cloud migration has been applied.
- The handicap estimate is unofficial; do not label it a WHS Handicap Index.
