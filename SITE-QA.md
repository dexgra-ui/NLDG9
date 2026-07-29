# No Labels, Designed by God: Site Quality Assurance

## Purpose

This checklist protects the ministry experience as the site grows. The goal is not only to publish content, but to make every journey dependable, accessible, easy to navigate, and ready for families, churches, mentors, and individuals.

## Phase 1: Navigation, routes, search, and saved study state

- [x] Use one primary navigation system across standard ministry pages.
- [x] Add section navigation for New Believers, Bible Studies, Resource Center, and Games.
- [x] Add breadcrumbs for deep study and ministry pages.
- [x] Replace the duplicate `resources.html` destination with a redirect to `resource-center.html`.
- [x] Remove stale version labels from Search, Topic Explorer, and Scripture Explorer.
- [x] Add Marriage & Family to Search and My Library.
- [x] Group Search filters by useful visitor categories instead of exact internal content types.
- [x] Synchronize My Library favorites with study-page favorites.
- [x] Synchronize My Library completion counts with study-page completion state.
- [x] Prevent duplicate previous and next navigation on study pages.
- [x] Refresh the offline cache after route and library changes.

## Phase 2: Link and content-state audit

**Status: Complete**

The repository includes `scripts/audit-site.mjs` and a GitHub Actions workflow that automatically scans internal links, required routes, collection and study destinations, local assets, stale public status labels, visible version labels, legacy redirects, query-based history, Marriage & Family sequence references, and devotional IDs. A Markdown audit report is produced for every run.

The audit reviewed more than 1,100 internal references. During this phase, it found and helped correct stale public version labels, outdated Resources links, and the missing Jeopardy data file. Approved planned labels remain only on collections that are genuinely still in development.

- [x] Test every primary navigation link.
- [x] Test every footer and Site Map link.
- [x] Test every collection card and study link.
- [x] Verify every previous and next study destination.
- [x] Find and correct stale `In Development`, `Coming Soon`, and outdated version labels.
- [x] Confirm legacy routes redirect instead of creating duplicate destinations.
- [x] Confirm query-based pages preserve the correct study in saved history.
- [x] Add automated repository checks so broken internal routes are caught after future changes.
- [x] Refresh the offline cache with audited pages and Jeopardy data.

## Phase 3: Responsive visual review

**Status: In progress**

The repository now includes an automated Playwright visual audit. It opens key ministry pages at mobile, tablet, small-laptop, desktop, and 1920×1080 church-display sizes. It captures full-page screenshots, checks for horizontal document overflow and likely text clipping, and generates printable PDFs for a study, devotional, and ministry packet. Results are saved as a GitHub Actions artifact for visual inspection.

- [ ] Review at 375 px mobile width.
- [ ] Review at 768 px tablet width.
- [ ] Review at 1024 px tablet and small laptop width.
- [ ] Review at 1440 px desktop width.
- [ ] Review game presentation pages on a church display.
- [ ] Check horizontal overflow, clipped text, button wrapping, and sticky sidebars.
- [ ] Check print layouts for studies, guides, and ministry packets.
- [x] Add repeatable screenshots and print-output checks for future site changes.

## Phase 4: Accessibility review

- [ ] Complete keyboard-only navigation tests.
- [ ] Confirm visible focus styles.
- [ ] Confirm skip links reach main content.
- [ ] Review headings for a logical order.
- [ ] Confirm form fields have labels and useful instructions.
- [ ] Confirm active menu and filter states are announced properly.
- [ ] Review contrast in cards, buttons, labels, and progress indicators.
- [ ] Confirm decorative images use empty alternative text and meaningful images use descriptive text.

## Phase 5: Interactive feature review

- [ ] Test favorites from study page, Search, My Library, and My Journey.
- [ ] Test completed and incomplete study states.
- [ ] Test saved notes and exported notes.
- [ ] Test continue-reading history, including pages with query parameters.
- [ ] Test study progress after refreshing and returning later.
- [ ] Test Search, Topic Explorer, Scripture Explorer, and collection filters.
- [ ] Test New Believer completion and next-season plan.
- [ ] Test mentor session checklists and progress.
- [ ] Test game scoring, 1–8 teams, reset controls, and presentation mode.

## Phase 6: Final public-release review

- [ ] Review all page titles and descriptions.
- [ ] Confirm each major journey has a clear beginning and next step.
- [ ] Confirm theological perspective and areas of Christian difference are labeled appropriately.
- [ ] Confirm safety statements remain visible in sensitive studies and leader tools.
- [ ] Confirm no private test language or unfinished placeholder text remains.
- [ ] Complete live review in Safari, Chrome, and Edge.
- [ ] Record the final release date and site version.
