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

## Galatians — detailed result
Audited: 2026-08-15

- Authoritative source scope: the direct contents of Drive folder `Galatians — Book-by-Book Study` (folder ID `1XQ26FRBIexXnM0YKRs0nLx_2a6WkLMUp`): `Galatians — Series Guide` plus 8 numbered lesson documents.
- The eight authoritative lessons are `No Other Gospel`, `The Gospel Received and Recognized`, `Justified by Faith in Christ`, `Promise, Law, and One Family`, `Heirs, Not Slaves`, `Called to Freedom Through Love`, `Walk by the Spirit`, and `Restore, Bear, Sow, and Boast in the Cross`.
- Galatians was present in Drive but had no corresponding website study page, data file, guide file, or Book-by-Book card. The book-level website content was therefore **MISSING** before this authoritative first publication rather than a lossy prior publication.
- Every authoritative lesson preserves its `MAIN PASSAGE` and complete `SUPPORTING SCRIPTURES` field. The supporting references remain grouped exactly as the source field rather than being silently reduced or replaced.
- `galatians-study-data.js` preserves every lesson title, Main Passage, Supporting Scriptures, Central Question, Key Truth, Lesson Purpose, Opening Discussion, Scripture Context, all six Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- Lesson presentation preserves the source labels `CENTRAL QUESTION`, `KEY TRUTH`, `LESSON PURPOSE`, `OPENING DISCUSSION`, `MAIN PASSAGE`, `SUPPORTING SCRIPTURES`, `SCRIPTURE CONTEXT`, `DISCUSSION QUESTIONS`, `PERSONAL EXAMINATION`, `WEEKLY PRACTICE`, `LEADER GUIDANCE`, and `CLOSING PRAYER`; each teaching heading retains its source `TEACHING MOVEMENT` wording.
- `galatians-study-guide.js` preserves the exact Series Guide subtitle, both `SERIES OVERVIEW` paragraphs, `CENTRAL THEME`, all seven `SERIES GOALS`, the complete eight-entry `LESSON MAP`, both `LEADER PREPARATION` paragraphs, `RECOMMENDED RHYTHM`, all `KEY SCRIPTURES`, and the `CLOSING PRAYER`. No series-level question, generic lesson framework, or other missing source section was invented.
- `galatians-study.html` publishes the series through the shared book-study renderer, and `book-by-book.html` now links Galatians directly after 2 Corinthians.
- With Galatians added, the Book-by-Book library total is now 51 books and 361 complete lessons.

## Next audit

Ephesians.