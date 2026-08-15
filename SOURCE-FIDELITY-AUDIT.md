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

## Jonah — detailed result
Audited: 2026-08-15

- Sources checked: `Jonah — Series Guide` and all 4 lesson documents.
- All four lessons preserve the source lesson title, Main Passage, Supporting Scriptures, Central Question, Key Truth, Lesson Purpose, Opening Discussion, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- Main Passages are preserved exactly as `Jonah 1:1–17`, `Jonah 2:1–10`, `Jonah 3:1–10`, and `Jonah 4:1–11`.
- Every lesson contains an explicit `Supporting Scriptures` section, and all four references for each lesson are preserved in the website data.
- No end-of-file `forEach` overwrite is present in `jonah-study-data.js`.
- The existing website overview preserved the source subtitle and Central Theme, but its purpose and background compressed or blended source material. The Series Guide's two exact Series Overview paragraphs, six Series Goals, Historical Setting, exact Lesson Map, Leader Preparation, Recommended Rhythm, Key Scriptures, and Closing Prayer were not all rendered under their source headings.
- `jonah-study-guide.js` restores both exact Series Overview paragraphs, exact Central Theme, all six Series Goals, Historical Setting, exact Lesson Map, Leader Preparation, Recommended Rhythm, Key Scriptures, and Closing Prayer, while suppressing the blended `Study foundation` presentation.
- Lesson presentation now preserves the source headings `Lesson Purpose`, `Opening Discussion`, `Main Passage`, `Supporting Scriptures`, and `Scripture Context`.

## Next audit

Micah.
