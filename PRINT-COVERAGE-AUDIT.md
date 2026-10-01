# Study Print Coverage Audit

This audit documents the print frameworks covered by the sitewide print-coverage bridge.

## Existing systems left unchanged

- Book-by-Book Bible Study uses `book-study-series.js` with Participant Handout, Leader Guide, and Print Both.
- Study pages with the full shared `.page-hero` experience continue to use the existing Unified Print Center.

## Coverage bridge

`study-print-coverage.js` activates only when a lesson has `data-study-page` but does not qualify for the full shared study experience. It supplies:

- Participant Handout
- Leader Guide
- Print Both
- direct, user-gesture `window.print()` invocation for mobile Safari compatibility
- a persistent hidden print packet so an early iOS `afterprint` event cannot blank the preview
- participant writing lines
- participant removal of leader/adult notes and detailed teaching movements where the custom layout exposes them
- leader output that preserves the complete lesson and opens leader-detail sections

## Representative coverage checked in CI

- Walking with Jesus
- Growing with Jesus
- Following Jesus for Yourself
- Preparing to Walk with Jesus
- The Cross and the Empty Tomb
- Spanish Walking with Jesus
- Book-by-Book non-regression

The browser audit is `scripts/study-print-coverage-audit.mjs` and runs through `.github/workflows/study-print-coverage-audit.yml`.
