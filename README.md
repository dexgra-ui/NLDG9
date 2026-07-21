# No Labels, Designed by God

Production website for the No Labels, Designed by God family ministry.

## Current release

**Version 0.9.1 — Sprint 2 Production Stabilization**

This release makes `NLDG9` the single production repository. The approved Bible game engine is stored directly in this repository instead of being fetched and rewritten in each visitor's browser.

## Ministry sections

- Home
- Bible Studies
- Devotionals
- Articles and Reflections
- Resources
- Podcast Center
- Ministry News
- Search
- Our Ministry
- Bible Game Center

## Game Center

The production game engine supports:

- Scripture or Suspicion
- Who Am I?
- Finish the Verse
- Bible Jeopardy
- Numbered Memory Match
- Lightning Round
- Preschool, Kids, Teens, Adults, and Family libraries
- 1–8 teams
- Next, Previous, and Skip Team controls
- Custom scoring and Undo Score
- Live rankings and final standings
- Tournament rounds and replay
- Presentation mode and keyboard controls

## Production architecture

`games.html` is a native, self-contained production file with its game data and engine embedded. It must not load the game source from GitHub at runtime.

The workflow at `.github/workflows/vendor-production-game.yml` copies the approved native engine from the Sprint 2 development repository into this production branch and verifies that the copied file is not a remote loader.

## Deployment

The site is deployed through GitHub Pages from the production repository.

Before merging a release:

1. Open the homepage and every navigation link.
2. Launch all six games.
3. Test direct game links and presentation mode.
4. Test 1, 2, 4, and 8 teams.
5. Verify Next, Previous, Skip, Undo, rankings, final standings, and replay.
6. Test portrait and landscape layouts on iPad and phone.
7. Confirm the footer and Game Center show Version 0.9.1.

## Repository roles

- `NLDG9`: production website and deployed game
- `NLDG9-Sprint-2`: development and source archive for the Sprint 2 game engine

Production visitors should never depend on the development repository being available at runtime.
