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

**Status: Complete**

The Playwright visual audit opened key ministry pages at mobile, tablet, small-laptop, desktop, and 1920×1080 church-display sizes. It captured full-page screenshots, checked horizontal document overflow and likely text clipping, and generated printable PDFs for a study, devotional, and ministry packet.

The first run found that section navigation widened several Bible Study, Resource Center, New Believer, and Game Center pages on mobile and tablet. The navigation container was corrected and the audit was rerun. The final report passed with zero failures and zero clipping warnings across all tested sizes.

- [x] Review at 375 px mobile width.
- [x] Review at 768 px tablet width.
- [x] Review at 1024 px tablet and small laptop width.
- [x] Review at 1440 px desktop width.
- [x] Review game presentation pages on a 1920×1080 church display.
- [x] Check horizontal overflow, likely clipped text, button wrapping, and sticky layouts.
- [x] Generate print layouts for a study, devotional, and ministry packet.
- [x] Add repeatable screenshots and print-output checks for future site changes.

## Phase 4: Accessibility review

**Status: Complete**

The accessibility audit uses Playwright and axe-core to check key ministry pages for WCAG 2.0 and 2.1 Level A and AA issues, keyboard navigation, mobile-menu operation, focus visibility, skip links, heading structure, form labels, image alternatives, positive tabindex values, and active navigation states.

The first run found missing select labels, low-contrast buttons and helper text, unlabeled team-name inputs, heading-level gaps, and a missing wrapper heading. Those findings were corrected. The final report passed with zero failures and zero warnings across all tested pages.

- [x] Complete keyboard-only navigation tests.
- [x] Confirm visible focus styles.
- [x] Confirm skip links reach main content.
- [x] Review headings for a logical order.
- [x] Confirm form fields have accessible labels and useful instructions.
- [x] Confirm active menu and filter states are announced properly.
- [x] Review contrast in cards, buttons, labels, and progress indicators.
- [x] Confirm decorative images use empty alternative text and meaningful images use descriptive text.
- [x] Add repeatable automated WCAG and keyboard checks for future changes.

## Phase 5: Interactive feature review

**Status: Complete**

The automated interactive review now passes with zero failures. It verifies study favorites, completion, progress, notes, reload persistence, My Library and My Journey synchronization, notes export, query-based continue-reading history, Search and explorer filters, New Believer Step 10 completion, mentor-session progress, and church game controls.

Church Presentation Mode was corrected so it now opens the one-to-eight-team setup first. After the host names the teams, chooses the audience and rounds, and starts the tournament, the Game Library opens. A presentation link that already names a game also pauses for team setup before launching that game. The presentation notice no longer blocks the Start Tournament button.

- [x] Test study favorites, completion, progress, notes, and reload persistence.
- [x] Test My Library favorites and completed filters.
- [x] Test My Journey favorites and completed studies.
- [x] Test saved dashboard notes and notes export.
- [x] Test continue-reading history, including pages with query parameters.
- [x] Test Search, Topic Explorer, Scripture Explorer, and library filters.
- [x] Test New Believer Step 10 completion, notes, persistence, and next-step handoff.
- [x] Test mentor session checklists, notes, completion, and reload persistence.
- [x] Test game team setup, eight-team scoring, undo, reset, and church presentation flow.
- [x] Add repeatable automated interactive checks for future changes.

## Phase 6: Final public-release review

**Status: Next**

- [ ] Review all page titles and descriptions.
- [ ] Confirm each major journey has a clear beginning and next step.
- [ ] Confirm theological perspective and areas of Christian difference are labeled appropriately.
- [ ] Confirm safety statements remain visible in sensitive studies and leader tools.
- [ ] Confirm no private test language or unfinished placeholder text remains.
- [ ] Complete live review in Safari, Chrome, and Edge.
- [ ] Record the final release date and site version.
