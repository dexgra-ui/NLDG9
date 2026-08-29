# No Labels, Designed by God

Production website and installable ministry platform for No Labels, Designed by God.

## Current release

**Version 1.1.1 — Ministry Platform Maintenance Release**

This maintenance release captures the expanded study collections, complete Book-by-Book Bible Study library, Biblical Maps & Geography reference system, Complete Biblical People & Genealogy Reference, Bible Tic-Tac-Toe improvements, linked Scripture references, podcast correction, accessibility fixes, repository cleanup, and stronger quality automation now serving the ministry platform.

## Ministry journeys

- New Believers discipleship path and mentor resources
- Men of Faith ten-study journey
- Women of Faith ten-study journey
- Marriage & Family ten-study journey
- Difficult Questions ten-study journey
- Leadership ten-study journey
- Leadership Toolkit and printable ministry packet
- Faith & Truth in Today’s World current-events study series
- Faith That Works study through James
- After the Benediction discipleship series
- When Preferences Become Idols study series
- Walking with Jesus chronological Gospel journey
- Book-by-Book Bible Studies across all 66 books with 447 complete lessons

## Biblical reference resources

- Biblical Maps & Geography hub with 11 interactive, accuracy-conscious teaching maps
- Automatic geography links inside the 66-book study library
- Complete Biblical People & Genealogy Reference spanning Genesis through Revelation
- Genealogy of Jesus reference comparing Matthew 1 and Luke 3
- Explicit labels for debated locations, reconstructed routes, approximate borders, textual variants, probable identities, and other areas of uncertainty

## Ministry platform

- Shared searchable content library
- Browse by topic and Scripture
- Related-content recommendations
- Saved favorites, progress, notes, and continue-reading state on the visitor’s device
- My Journey dashboard and personal library
- Resource Center, teaching tools, biblical reference resources, devotionals, articles, podcast, and ministry news centers
- Installable progressive web app with offline caching
- Responsive layouts for phone, tablet, laptop, and desktop
- Automated site, accessibility, SEO/social, responsive, repository-completion, Leadership, and Toolkit quality audits

## No Labels Games

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

`games.html` is a native, self-contained production file. Production visitors do not depend on another repository or a runtime GitHub fetch to launch the games.

## Publishing ministry content

The shared content registry is the source of truth for search, homepage discovery, topic and Scripture browsing, related content, and the generated site-map index. See `CONTENT-PUBLISHING.md` for the publishing workflow and templates.

New content normally requires:

1. Create the content page from the template.
2. Add one metadata entry to the shared content registry or the appropriate journey library.
3. Run the repository audits.

The service worker caches the application shell at installation and stores newly visited resources for later offline use. New ministry pages do not need to be manually added to the core cache unless they must be available immediately after installation without first being opened.

## Quality checks

Before merging a release:

1. Run the Site Quality Audit.
2. Run the Accessibility Audit.
3. Run the SEO/social and Repository Completion audits.
4. Run any journey-specific audit affected by the change.
5. Open the homepage, search, Resource Center, site map, and changed ministry pages.
6. Test portrait and landscape layouts on phone and tablet.
7. Launch all six games and verify scoring, navigation, standings, presentation mode, and replay.
8. Confirm there are no placeholder forms, broken links, missing metadata, or unfinished public messages.

Audit reports and screenshots are retained as downloadable GitHub Actions artifacts instead of being committed back into the production branch.

## Deployment

The site is deployed through GitHub Pages from `main`.

## Repository roles

- `NLDG9`: production website, ministry platform, and deployed game engine
- `NLDG9-Sprint-2`: historical development and source archive for the Sprint 2 game engine