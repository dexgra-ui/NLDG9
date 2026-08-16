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
| 1 Peter | PASS after authoritative first publication and source-label preservation |
| 2 Peter | PASS after authoritative first publication and source-label preservation |
| 1 John | PASS after full lesson-data, series-guide, Supporting Scriptures, and source-label restoration |

## 1 John — detailed result
Audited: 2026-08-16

- Authoritative source scope: the direct contents of Drive folder `1 John — Book-by-Book Study` (folder ID `1WSvu_eb9vtg-1jiVnTa-oiPEFPoUFx3P`) contain `00 — 1 John Series Guide` plus seven numbered week documents.
- The seven authoritative lessons are `The Word of Life`, `Walking in the Light`, `Knowing That We Know Him`, `Remaining in the Truth`, `Children of God Who Love`, `Testing the Spirits and Perfected Love`, and `Faith That Overcomes`.
- Before restoration, `first-john-study-data.js` retained the seven lesson titles and main passage ranges but **SHORTENED** the authoritative Key Truths, Lesson Purposes, Opening Discussions, Scripture Contexts, Teaching Movements, Discussion Questions, Weekly Practices, Leader Guidance, and Closing Prayers. Most weeks exposed only six rewritten discussion questions instead of all eight source questions, so source material was also **MISSING**.
- The former Supporting Scriptures were split into separate array entries, causing the shared renderer to replace the source semicolon-delimited field with presentation separators. The restored data keeps each complete `SUPPORTING SCRIPTURES` field as one source string, preserving the source punctuation and all references.
- The former landing content summarized the book background and purpose and omitted the authoritative `BOOK BACKGROUND`, `HOW TO READ 1 JOHN`, full `SERIES MAP`, `SERIES OUTCOME`, and `LEADER COMMITMENT`. Those omissions were **MISSING** relative to the Series Guide.
- The former lesson presentation used generic renderer labels such as `Lesson purpose`, `Opening`, and `Read the Word` instead of the source labels `LESSON PURPOSE`, `OPENING DISCUSSION`, and `MAIN PASSAGE`; those differences were **MISLABELED**.
- `first-john-study-data.js` now preserves every authoritative Main Passage, complete Supporting Scriptures field, Central Question, Key Truth, Lesson Purpose, Opening Discussion, Scripture Context, every full lesson-specific Teaching Movement, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer. Lesson 7 preserves all seven Teaching Movements.
- `first-john-study-guide.js` now preserves the exact series title `1 JOHN — WALKING IN LIGHT, TRUTH, AND LOVE`, `SERIES PURPOSE`, every `BOOK BACKGROUND` line, `HOW TO READ 1 JOHN`, the complete seven-lesson `SERIES MAP`, `SERIES OUTCOME`, and `LEADER COMMITMENT`.
- Lesson presentation now uses the source labels `MAIN PASSAGE`, `SUPPORTING SCRIPTURES`, `CENTRAL QUESTION`, `KEY TRUTH`, `LESSON PURPOSE`, `OPENING DISCUSSION`, `SCRIPTURE CONTEXT`, `DISCUSSION QUESTIONS`, `PERSONAL EXAMINATION`, `WEEKLY PRACTICE`, `LEADER GUIDANCE`, and `CLOSING PRAYER`. Each individual `TEACHING MOVEMENT` heading retains its complete source wording.
- `first-john-study.html` now loads the source-fidelity guide before the shared renderer. The existing seven-lesson Book-by-Book placement remains correct, so library totals stay 62 books and 429 complete lessons.

## Next audit

2 John.