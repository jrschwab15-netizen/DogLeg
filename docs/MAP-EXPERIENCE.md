# Map-led Yardage Book

Places is now the opening view of Yardage Book. Your year and Memories remain one tap away and all three views retain the selected season. The map has a larger full-width stage, an expandable view, a compact header and a horizontal course collection.

Individual courses use 48px golf-flag markers rather than numbered pins. The selected course is gold with a persistent dark-green, high-contrast name label; other labels are hidden to avoid collisions. There are no native hover titles or hover-only details. Tap/click a flag or course card to select it, move the camera and open its round count, recorded best scores, most recent score/date, attached photo when available, View rounds and Log here actions. Camera and panel transitions respect reduced motion.

Previous, Next place and Surprise me explore mapped courses only, including in expanded view. Nearby marker groups display an explicit course count and zoom to the group. Courses sharing a location, or groups still overlapping at close zoom, open a named course picker. The underlying saved coordinates are not moved or invented. Screen-space grouping is recalculated as the map zooms.

Unplaced courses remain in the collection with a Place on map action. Initial selection prefers a located course so the first detail panel matches the map. An account/year change resets that selection; an unplaced course can still be selected explicitly. A year with no located courses opens a navigable world map with no fabricated flags, plus the saved course list or a first-round prompt.

Expanded view supports Escape, keyboard focus wrapping and accessible controls. Closing it or opening round history restores page scrolling. Map labels escape course names; late map-library loads are guarded against view/account changes. Tile errors retain the course collection and retry path. No new backend, credentials, location permission, paid tile subscription or user-record migration was added.

Mapping remains Leaflet 1.9.4 with ordinary OpenStreetMap tile requests and visible attribution. No bulk tile fetching, offline downloads, imaginary travel routes or shot distances. References: https://leafletjs.com/reference.html and https://operations.osmfoundation.org/policies/tiles/ .

Verification: all existing tests plus tests/atlas.cjs pass. Map tests cover grouping and zoom separation, colocated courses, missing locations, navigation, year/account isolation, label escaping and stale async loads. Local browser checks used existing guest-only QA rounds at 127.0.0.1:4173 and an isolated synthetic fixture on port 4174. The fixture used its own journal key and disabled account bootstrap; no real journal or Supabase record was changed. Browser checks covered marker contrast, persistent selected names, next-course camera changes, expanded desktop/mobile view, colocated-course picker, correct history filter and restoration of body scrolling. Verified 320/390px mobile sizing and real map-tile loading. Physical-device touch testing remains outstanding.

On phones, overview browsing buttons sit below the map so they cannot obscure course labels. Expanded view preserves the geographic centre as the map resizes and keeps its controls inside the map.
