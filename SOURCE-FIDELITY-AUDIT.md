# Bible Study Source Fidelity Audit

The Google Drive study documents are the authoritative source for imported Bible-study content. Website formatting may change, but source content must not be shortened, generalized, silently replaced, mislabeled, or omitted.

This ledger was re-compacted on 2026-08-15. Git history retains the earlier detailed entries; the current file keeps the complete status ledger and the latest detailed audit.

## Status labels

- **PASS** — website content matches the authoritative Drive source after any restoration noted below.
- **MISSING** — a source section is absent from the website.
- **SHORTENED** — source wording was condensed or summarized.
- **GENERIC REPLACEMENT** — lesson-specific source material was replaced with reusable generic text.
- **MISSING SCRIPTURE** — a Scripture reference present in the source is absent from the website data/page.
- **MISLABELED** — source wording survives but is presented under a heading the source does not use.
- **WRONG SOURCE SET** — website content came from a different Drive draft/set than the authoritative book-by-book folder.

## Completed audit ledger

| Book | Status |
|---|---|
| Genesis | PASS after series-guide restoration |
| Exodus | PASS after series-guide restoration |
| Leviticus | PASS after series-guide restoration |
| Numbers | PASS after series-guide restoration |
| Deuteronomy | PASS after series-guide restoration |
| Joshua | PASS after full series-guide restoration |
| Judges | PASS after full series-guide restoration |
| Ruth | PASS after series-guide restoration and wording correction |
| 1 Samuel | PASS after full series-guide restoration |
| 2 Samuel | PASS after full series-guide restoration |
| 1 Kings | PASS after full series-guide restoration |
| 2 Kings | PASS after series-guide restoration |
| 1 Chronicles | PASS after series-guide restoration and subtitle-label correction |
| 2 Chronicles | PASS after series-guide restoration and subtitle-label correction |
| Ezra | PASS after full series-guide restoration and label correction |
| Nehemiah | PASS after series-guide restoration and label correction |
| Esther | PASS after series-guide restoration |
| Job | PASS after series-guide restoration and label correction |
| Psalms | PASS after series-guide restoration and label correction |
| Proverbs | PASS after full series-guide restoration and label correction |
| Ecclesiastes | PASS after full series-guide restoration and label correction |
| Song of Songs | PASS after full series-guide restoration and label correction |
| Isaiah | PASS after series-guide restoration and label correction |
| Jeremiah | PASS after series-guide restoration and label correction |
| Lamentations | PASS after series-guide restoration and label correction |
| Ezekiel | PASS after series-guide restoration and label correction |
| Daniel | PASS after full series-guide restoration and label correction |
| Hosea | PASS after series-guide restoration and label correction |
| Joel | PASS after supporting-Scripture and series-guide restoration |
| Amos | PASS after series-guide restoration and source-label correction |
| Obadiah | PASS after series-guide restoration and source-label correction |
| Jonah | PASS after series-guide restoration and source-label correction |
| Micah | PASS after authoritative-set, lesson-data, and series-guide restoration |
| Nahum | PASS after full lesson-data, series-guide, Scripture-field, and source-label restoration |
| Habakkuk | PASS after full lesson-data, series-guide, and source-label restoration |
| Zephaniah | PASS after full lesson-data, series-guide, and source-label restoration |
| Haggai | PASS after full lesson-data, series-guide, and source-label restoration |
| Zechariah | PASS after full lesson-data, series-guide, and source-label restoration |
| Malachi | PASS after supporting-Scripture, full lesson-data, series-guide, and source-label restoration |
| Matthew | PASS after Scripture-field, full lesson-data, series-guide, and source-label restoration |
| Mark | PASS after Scripture-field, full lesson-data, series-guide, and source-label restoration |
| Luke | PASS after Scripture-field, full lesson-data, series-guide, and source-label restoration |
| John | PASS after Scripture-field, full lesson-data, series-guide, and source-label restoration |
| Acts | PASS after authoritative first publication and source-label preservation |
| Romans | PASS after authoritative first publication and source-label preservation |
| 1 Corinthians | PASS after authoritative first publication and source-label preservation |
| 2 Corinthians | PASS after authoritative first publication and source-label preservation |
| Galatians | PASS after authoritative first publication and source-label preservation |
| Ephesians | PASS after authoritative first publication and source-label preservation |
| Philippians | PASS after full lesson-data, series-guide, and source-label restoration |
| Colossians | PASS after authoritative first publication and source-label preservation |
| 1 Thessalonians | PASS after authoritative first publication and source-label preservation |
| 2 Thessalonians | PASS after authoritative first publication and source-label preservation |
| 1 Timothy | PASS after authoritative first publication and source-label preservation |
| 2 Timothy | PASS after authoritative first publication and source-label preservation |
| Titus | PASS after authoritative first publication and source-label preservation |
| Philemon | PASS after authoritative first publication and source-label preservation |
| Hebrews | PASS after authoritative first publication and source-label preservation |
| James | PASS after full Leader Guide wording, structure, and source-label restoration |

## James — detailed result
Audited: 2026-08-16

- Authoritative folder scope: the direct contents of Drive folder `James` (folder ID `1C82HYKy_KxHautpcILS8JDhXVkJZLKDx`) contain four documents: `James`, `James 2`, `James 3`, and `James in Math`.
- The website series `Faith That Works` corresponds directly to the `James` document (document ID `1Yy9jQQxBUFwHTGjEtL2wgp8bpCzIRvrmzNEB1dQgF_I`), which identifies itself as `Faith That Works` and `Leader Guide (10-Week Small Group Series)` and contains the complete ten-week series. The other three folder documents are supplemental James material rather than additional weeks in that ten-week Leader Guide: `James 2` is a chapter-2 deep study, `James 3` is a chapter-3 deep walk-through, and `James in Math` is a topical equation-style reference table.
- Before restoration, the site preserved the ten week titles and Scripture ranges but **SHORTENED** the source Goals, replaced the source `Teaching Notes` with rewritten summary points, replaced the source week-specific `Discussion` / `Discussion Questions` with rewritten questions, omitted or generalized source `Leader Tips`, and converted the source `Prayer Focus` into invented `Closing Prayer` text. Those differences were **SHORTENED**, **GENERIC REPLACEMENT**, **MISSING**, and **MISLABELED** relative to the authoritative Leader Guide.
- The former series landing also substituted editorial copy for the exact `Series Purpose` and omitted the source `Recommended Session Length`, `Suggested Flow Each Week`, and `Leader Preparation Checklist (Weekly)`.
- `james-series-data.js` now preserves the exact Leader Guide title, subtitle, Series Purpose, Recommended Session Length, all five Suggested Flow items, all five Leader Preparation Checklist items, all ten week titles and Scripture texts, every full Goal, all three Teaching Notes per week, each source Discussion / Discussion Questions item, every Leader Tip, and each Prayer Focus.
- `james-series.js` now renders those source fields under their actual labels instead of presenting rewritten summaries or invented Closing Prayers. Progress tracking and week navigation remain presentation/functionality only and do not replace source material.
- The ten authoritative weeks remain `Faith in the Fire`, `Asking for Wisdom`, `Winning the Battle Within`, `Doers of the Word`, `The Sin of Favoritism`, `Faith That Moves`, `Words Matter`, `Wisdom From Above`, `Surrendered Living`, and `Prayer & Perseverance`.
- The Book-by-Book lesson count remains unchanged because the authoritative Leader Guide is already a ten-week series. Library totals remain 60 books and 416 complete lessons.

## Next audit

1 Peter.