# Interactive Feature Audit

Generated: 2026-07-29T13:25:42.219Z

Result: **FAILED** with 3 failure(s).

## Failures

- Study favorite, completion, notes, progress, and reload persistence: Completed study did not store 100% progress.
- My Journey displays study-page favorites and completion: My Journey did not display the study-page favorite.
- Church game supports eight teams, scoring, undo, reset, and presentation layout: page.click: Timeout 30000ms exceeded. Call log:   - waiting for locator('#openTournamentBtn')     - locator resolved to <button class="menu-card" id="openTournamentBtn">…</button>   - attempting click action     2 × waiting for element to be visible, enabled and stable       - element is not visible     - retrying click action     - waiting 20ms     2 × waiting for element to be visible, enabled and stable       - element is not visible     - retrying click action       - waiting 100ms     58 × waiting for element to be visible, enabled and stable        - element is not visible      - retrying click action        - waiting 500ms 

## Checks completed

- My Library favorite and completed filters synchronize with study state
- Dashboard notes save and export
- Continue-reading history preserves query-based study URLs
- Site Search and content-type filters
- My Library search and collection filters
- Topic Explorer selection updates results
- Scripture Explorer selection updates results
- New Believer Step 10 completion, notes, persistence, and next steps
- Mentor Session 1 checklist, completion, notes, and persistence
