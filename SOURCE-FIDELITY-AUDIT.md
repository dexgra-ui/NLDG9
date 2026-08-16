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

## Philippians — detailed result
Audited: 2026-08-16

- Authoritative source scope: the direct contents of Drive folder `Philippians — Book-by-Book Study` (folder ID `1dVrQ0T2TJErSv4Ibw3BPaBUVlRqvt3Od`): `00 — Philippians Series Guide` plus 6 numbered lesson documents.
- The six authoritative lessons are `Partners in the Gospel`, `Christ Magnified in Every Circumstance`, `The Mind of Christ`, `Knowing Christ Above Everything`, `Pressing Forward Together`, and `The Secret of Contentment`.
- Philippians already existed on the website with the correct six-lesson structure and the correct Main Passage and Supporting Scripture references, but the lesson content was materially **SHORTENED**. Openings, Scripture Contexts, Teaching Movements, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayers were condensed, and each source set of eight Discussion Questions had been reduced to six.
- Teaching headings had also been shortened from their source `TEACHING MOVEMENT n — ...` wording, and lesson fields were displayed under generic renderer labels rather than the exact source labels, creating **MISLABELED** presentation even where the underlying idea survived.
- The authoritative Series Guide was entirely **MISSING** from the website: there was no `philippians-study-guide.js`, so `SERIES PURPOSE`, `BOOK BACKGROUND`, `HOW TO USE THE SERIES`, the complete descriptive `SERIES MAP`, `SERIES OUTCOME`, and `LEADER COMMITMENT` were not published.
- `philippians-study-data.js` now preserves every lesson title, Main Passage, complete Supporting Scriptures field, Central Question, Key Truth, Lesson Purpose, Opening Discussion, Scripture Context, all six full Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer using the authoritative wording.
- Lesson presentation now preserves the source labels `CENTRAL QUESTION`, `KEY TRUTH`, `LESSON PURPOSE`, `OPENING DISCUSSION`, `MAIN PASSAGE`, `SUPPORTING SCRIPTURES`, `SCRIPTURE CONTEXT`, `DISCUSSION QUESTIONS`, `PERSONAL EXAMINATION`, `WEEKLY PRACTICE`, `LEADER GUIDANCE`, and `CLOSING PRAYER`; each teaching heading retains its full source `TEACHING MOVEMENT` wording.
- New `philippians-study-guide.js` preserves the exact `SERIES PURPOSE`, all `BOOK BACKGROUND` lines, `HOW TO USE THE SERIES`, the complete six-lesson descriptive `SERIES MAP`, `SERIES OUTCOME`, and `LEADER COMMITMENT`. No extra source section was invented.
- `philippians-study.html` now loads the authoritative guide before the shared book-study renderer. Because Philippians was already counted in the library, totals remain 52 books and 370 complete lessons.

## Next audit

Colossians.