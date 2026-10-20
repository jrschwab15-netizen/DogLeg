# Flighty review and Dogleg redesign

## What works

[Apple's Flighty design review](https://developer.apple.com/news/?id=970ncww4) describes a clear hierarchy around the information needed now, familiar real-world visual conventions, and personal history that remains enjoyable after a trip. The lesson for Dogleg is to make the latest round and next action immediately recognizable, then reward exploration of the season.

[Flighty's own product presentation](https://flighty.com/) shows a companion and a personal log, including Friends and Passport. Its immediate utility gives people a reason to open it; the retrospective collection gives them a reason to return. This is a design interpretation, not evidence that copying its visuals guarantees engagement.

## What was weak in Dogleg

The earlier dashboard gave many similar cream panels similar weight. A table appeared before a memorable personal recap. The warm club identity was present, but there was little feedback or reward for adding another round. Desktop also mixed Add, an action, into destination navigation.

## Changes

- A clear last-round scorecard, or a resume-draft/first-round action.
- A season panel with actual counts, best 18-hole score, and goal progress.
- Five earned milestones with explanations and feedback when a real round unlocks one. Sample records preview achievements but do not trigger real unlocks; nine-hole scores cannot earn Under 90.
- A lifetime course-passport cover and links from stamps to matching round history.
- A season-card PNG generated from the journal, with an inline preview and download.
- Desktop Friends is directly exposed. Add sits beside search. Mobile retains centered Add and Friends within Profile.
- Softer green surfaces, deliberate contrast, fewer competing borders, and small interactions that respect reduced-motion preferences. Mahogany framing, the original sunset, approved logo, and painted honours board remain.

## Validation

Build and feature/cloud tests pass. New tests cover season aggregation, course uniqueness, year boundaries, sample isolation, milestone transitions and navigation state. Local HTTP browser checks cover populated desktop/mobile views, desktop Add, Friends, course-to-history navigation, and season-card PNG generation. The generated card was visually inspected. Native download completion can depend on the browser; an inline PNG preview remains available.

This is a substantial design pass, not a usability study. Engagement and enjoyment need feedback from people using Dogleg with their own rounds.
