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

## 2 Peter — detailed result
Audited: 2026-08-16

- Authoritative source scope: the direct contents of Drive folder `2 Peter` (folder ID `1p0D9y8hmbT8WcrBYrvHzbsHoKxRS4RuK`) contain `2 Peter — Series Guide` plus five numbered lesson documents.
- The five authoritative lessons are `Everything Needed for a Godly Life`, `Eyewitnesses and the Prophetic Word`, `Recognizing Destructive Teachers`, `The Lord Is Patient`, and `Grow in Grace and Knowledge`.
- 2 Peter had no corresponding website study page, data file, guide file, or Book-by-Book card. The book-level website content was therefore **MISSING** before this authoritative first publication rather than a shortened, generic, mislabeled, or wrong-source publication.
- Every authoritative lesson preserves its `Main Scripture` and complete `Supporting Scriptures` field. Supporting references remain grouped exactly as the source field, including semicolon punctuation, rather than being silently reduced or reformatted.
- `second-peter-study-data.js` preserves every lesson title, Main Scripture, Supporting Scriptures, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six lesson-specific Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer. Shared constants are used only where the Drive wording repeats exactly across all five lessons.
- Lesson presentation preserves the exact source labels `Main Scripture`, `Supporting Scriptures`, `Central Question`, `Key Truth`, `Purpose`, `Opening`, `Scripture Context`, `Teaching Movements`, `Discussion Questions`, `Personal Examination`, `Weekly Practice`, `Leader Guidance`, and `Closing Prayer`; each Teaching Movement heading retains its exact source wording.
- `second-peter-study-guide.js` preserves the exact Series Guide subtitle `Growth, Truth, Discernment, and Faithful Hope` and sections `Series Purpose`, `Historical and Literary Setting`, `Central Aim`, `Lesson Map`, `Recommended Rhythm`, `Leader Commitments`, `Pastoral Safeguards`, `Christ-Centered Reading`, and `Desired Fruit`. The source contains no series-level closing prayer, so none was invented.
- `second-peter-study.html` publishes the series through the shared book-study renderer, and `book-by-book.html` now links 2 Peter directly after 1 Peter and before 1 John.
- With 2 Peter added, the Book-by-Book library total is now 62 books and 429 complete lessons.

## Next audit

1 John.