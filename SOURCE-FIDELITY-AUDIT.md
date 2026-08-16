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

## 2 Corinthians — detailed result
Audited: 2026-08-15

- Authoritative source scope: the direct contents of Drive folder `2 Corinthians` (folder ID `1SmrUWYEgf9BbNBDTb7yOYIU_wFCtHpSi`): `2 Corinthians — Series Guide` plus 6 numbered lesson documents.
- The six authoritative lessons are `Comforted to Comfort Others`, `Treasure in Jars of Clay`, `The Ministry of Reconciliation`, `Holiness, Grief, and Restored Trust`, `The Grace of Generosity`, and `Power Made Perfect in Weakness`.
- 2 Corinthians was present in Drive but had no corresponding website study page, data file, guide file, or Book-by-Book card. The book-level website content was therefore **MISSING** before this authoritative first publication rather than a lossy prior publication.
- Every authoritative lesson uses one `Main Scripture` field containing three references. All references are preserved inside that field. The lesson documents contain no separate `Supporting Scriptures` heading, so `supporting: []` is source-faithful.
- `second-corinthians-study-data.js` now preserves every lesson title, complete Main Scripture field, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer. Shared constants are used only where the Drive source itself repeats exact wording.
- Each lesson source includes a `Study Foundation` heading with no standalone prose beneath it before `Main Scripture`; the page preserves that heading without inventing foundation text. Lesson presentation preserves the source labels `Central Question`, `Key Truth`, `Purpose`, `Opening`, `Main Scripture`, `Scripture Context`, `Teaching Movements`, `Discussion Questions`, `Personal Examination`, `Weekly Practice`, `Leader Guidance`, and `Closing Prayer`.
- `second-corinthians-study-guide.js` restores the exact Series Guide subtitle, Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements including `Weakness and Power`, `Integrity and Accountability`, `Reconciliation and Boundaries`, and `Generosity Without Pressure`, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer. The Series Guide itself contains no Lesson Map, Recommended Rhythm, or separate Supporting Scriptures section, so none was invented.
- `second-corinthians-study.html` publishes the series through the shared book-study renderer, and `book-by-book.html` now links 2 Corinthians directly after 1 Corinthians.
- With 2 Corinthians added, the Book-by-Book library total is now 50 books and 353 complete lessons.

## Next audit

Galatians.
