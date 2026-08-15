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

## Micah — detailed result
Audited: 2026-08-15

- Authoritative source scope: the direct contents of the Drive folder `Micah — Book-by-Book Study` (folder ID `17TumV6cXvwBS84JU9sFupNtA_YMBFX0F`): `Micah — Series Guide` plus 6 numbered lesson documents.
- A separate seven-lesson Micah set also exists in Drive outside that authoritative folder. The website had been built from that different seven-lesson set, so the existing page was classified **WRONG SOURCE SET** rather than treated as an acceptable alternate version.
- The authoritative six lessons are `When Coveting Becomes Policy`, `Leaders Who Hate Justice`, `Swords into Plowshares`, `A Purified and Faithful Remnant`, `What Does the Lord Require?`, and `Who Is a God Like You?`.
- Main Passages are preserved exactly as `Micah 1:1–2:13`, `Micah 3:1–12`, `Micah 4:1–5:5`, `Micah 5:6–15`, `Micah 6:1–16`, and `Micah 7:1–20`.
- Every authoritative lesson has an explicit `Supporting Scriptures` section, and all references are now preserved exactly in `micah-study-data.js`.
- The former seven-lesson website data also ended with a `forEach` that overwrote every lesson's Purpose, Opening, Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer with generic text. That was classified **GENERIC REPLACEMENT** and removed.
- `micah-study-data.js` has been fully replaced with the six authoritative lesson documents, preserving each lesson title, Main Passage, Supporting Scriptures, Central Question, Key Truth, Lesson Purpose, Opening Discussion, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The authoritative Series Guide contains two Series Overview paragraphs, Central Theme, seven Series Goals, exact Lesson Map, Leader Preparation, Recommended Rhythm, Key Scriptures, and Closing Prayer. `micah-study-guide.js` restores all of these under their source headings and suppresses the prior blended `Study foundation` presentation.
- Lesson presentation preserves the source headings `Lesson Purpose`, `Opening Discussion`, `Main Passage`, `Supporting Scriptures`, and `Scripture Context`.

## Next audit

Nahum.
