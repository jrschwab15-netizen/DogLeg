# Desktop and mobile usability

## Research and interpretation

These sources describe useful interaction patterns. They do not establish that Amazon, or any single website, is universally the easiest to use. Recommendations below adapt those patterns to a personal golf journal.

- [Amazon keyboard shopping features](https://digprjsurvey.amazon.com/csad/help/node/TNVfdg1IAagUonImNs): Amazon documents direct shortcuts to search, home, and orders. Dogleg uses a persistent desktop round-search field and visible navigation to frequent tasks.
- [NN/g: Mobile First Is NOT Mobile Only](https://www.nngroup.com/articles/mobile-first-not-mobile-only/): desktop and mobile should use layouts suited to their available space. Dogleg uses a desktop header, wider dashboard and history tables, while mobile keeps bottom navigation, centered Add, and round cards.
- [Baymard: Primary and secondary account paths](https://baymard.com/research-articles/account-drop-down-structure): account navigation should prioritize commonly needed tasks. Dogleg keeps round history prominent, puts secondary Friends demo content under Profile, and exposes course search and scorecard entry as direct actions.
- [Strava Training Log](https://support.strava.com/en-us/articles/15402077-training-log): the training log supports reviewing and filtering activity history. Dogleg adds course/tees/notes search, year and hole-count filters, and explicit sorting.
- [NN/g: Dashboards](https://www.nngroup.com/articles/dashboards-preattentive/): dashboards should make key information easy to interpret at a glance. Dogleg puts personal metrics and recent history ahead of scenic content on desktop, labels the unofficial estimate, and shows annual goal progress using a bar and numbers.

## Implemented

Desktop (851 px and wider): sticky two-row header; full search form; labeled navigation and Add a round; wide cream workspace; recent rounds in a table; side-by-side trend and history; season goal and original sunset photograph below the primary tracking information.

Mobile (850 px and narrower): five bottom commands with centered Add; one-column content; comfortable touch controls; stacked round cards; filters in a two-column layout. Friends remains in Profile on both layouts.

Round history filters update only the results, preserving typing focus. Counts announce how many records match. Empty results suggest clearing filters; an empty journal offers round entry. Summary statistics are clearly labeled as covering all saved rounds, rather than the filtered subset. Lowest-strokes sorting explicitly notes that nine- and eighteen-hole totals are not normalized.

The mahogany, cream, brass, serif headings, approved Sunset D logo, original sunset photograph, and painted honours board remain. Data ownership, cloud persistence, and V7 backup behavior are unchanged.

## Verification

Local HTTP preview: desktop dashboard and populated table; desktop search finds two matching sample rounds from three; empty search returns zero and offers recovery; mobile navigation, round cards, filter spacing, and live search verified. Samples were confined to the local preview.

Feature tests include year/hole/search filtering, score sorting, empty results and input immutability. Existing syntax/feature tests and cloud conflict/isolation tests pass. The bundled Node runtime executes the package test commands directly because npm is unavailable.

This is a research-informed first pass, not a usability study with Dogleg users. Physical-device testing, screen-reader testing, larger datasets, and success/time measurements remain future validation.
