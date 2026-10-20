# Responsive UI audit — October 20, 2026

## Findings and changes

- Mobile round entry used intrinsic date-input sizing, producing a roughly 158 px left column and 66 px right column at the narrow test size. Form tracks now use `minmax(0,1fr)` and controls can shrink within their tracks. The smallest phones use one column. At 390 px the six paired fields measured 141 px each; at 320 px all measured 224 px in a single column.
- Heading action buttons shrank into tall boxes with stacked words. Mobile headings now put actions below the text; desktop actions keep their natural width. The season-card action uses a normal horizontal button.
- Card gutters, padding, corner radii, input heights and button heights had diverged across several legacy style blocks. `src/layout.css` now owns shared layout geometry and is embedded last by the build.
- Profile cards stretched to match neighboring content. General content grids now align cards at the start. Home's paired feature cards remain aligned, with their primary actions anchored consistently.
- A single played course occupied one narrow collection column. It now uses a full-width compact row on desktop, with actions on the right. Course discovery uses aligned intro and search columns.
- Cards and dialogs lacked consistent maximum widths. Main content caps at 1200 px; dialogs cap at 640 px and remain inside small viewports with internal scrolling and a sticky dialog heading.
- Short pages removed the scrollbar and shifted all content sideways. Stable scroll gutters keep the header and content aligned across navigation.
- The trend SVG letterboxed its 300 px plot inside wide cards. It now fills the available plot area, with strokes and round point markers that do not stretch. Handicap calculations are unchanged.
- A hidden scorecard preview was overridden by `display:block`, showing a broken-image box before upload. Hidden elements now stay hidden, and disabled actions look disabled.
- Season-card preview totals now keep each number with its label. Friend connection actions wrap below long names on small screens. The signed-in avatar uses the current light palette.
- During interaction checks, Courses' “View rounds” was found to write the wrong filter variable. It now applies the actual history filter, covered by a regression check.

## Verification

The local HTTP app was checked at viewport widths 320, 390, 768, 1024 and 1440 px. Home, Rounds, Courses, Passport, signed-out Friends, and Profile had no document horizontal overflow. Round dialogs had no internal horizontal overflow; paired date/holes/tees/score/rating/slope controls measured equal widths. Both populated journal views and signed-out empty Friends were inspected.

Login, signup, Add menu, scorecard upload, memory entry, round entry with a saved photo, course history navigation and the trend chart were inspected. The scorecard preview was confirmed invisible before file selection. The account forms were inspected without entering credentials or creating accounts.

Signed-in Friends was rendered as static local fixtures containing long names, pending and accepted connections, long course names and three photos. Desktop and phone layouts were inspected without loading or posting real account data. Generate these with `npm run ui:fixtures`, then use the local server at `/__qa/friends` or `/__qa/friends-empty`. These files live under ignored `dist/` and are not part of the production app. They are visual fixtures, not a replacement for real-account behavior tests.

Build, feature tests, cloud tests and social tests passed. No database migrations or authentication settings changed in this UI audit. Physical iOS/Android devices and other browser engines were not tested in this session.
