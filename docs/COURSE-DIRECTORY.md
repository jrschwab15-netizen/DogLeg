# Searchable course directory

Contains data from OpenGolfAPI (https://opengolfapi.org), derived from OpenStreetMap and public course facts. Source snapshot: https://github.com/opengolfapi/data/blob/main/opengolfapi-us.geojson.gz, retrieved 2026-10-21. Actual snapshot: 15,667 records. The compact derivative database data/course-search-index.json is published openly under ODbL 1.0: https://opendatacommons.org/licenses/odbl/1-0/ . It contains directory facts, not invented tee ratings.

The build embeds this 2.34 MB index so names, cities, states, ZIP codes and approximate spellings search the entire snapshot locally instead of a 100-result API window. Photon and OpenGolfAPI remain worldwide fallbacks. This is not a complete or independently verified worldwide database. Source metadata can be old or inaccurate.

Refresh with node scripts/update-course-index.cjs, then build/test and inspect the output before release. Build does not require network access. Verified name corrections in src/course-data.js are guarded by provider ID and coordinates. Northern Spy's current/former names and address: https://northernspygc.com/ . Its MA directory point is retained; the unrelated NH duplicate is not renamed. La Cana supplement uses the official resort and Dominican government sources recorded in QA.md. Unknown scorecard details remain optional.
