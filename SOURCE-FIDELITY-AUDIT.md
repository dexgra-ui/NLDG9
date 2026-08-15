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

## Amos — detailed result
Audited: 2026-08-15

- Sources checked: `Amos — Series Guide` and all 7 lesson documents.
- All seven lessons preserve the source lesson title, Main Passage, Supporting Scriptures, Central Question, Key Truth, Lesson Purpose, Opening Discussion, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- Main Passages are preserved exactly as `Amos 1–2`, `Amos 3`, `Amos 4`, `Amos 5`, `Amos 6`, `Amos 7`, and `Amos 8–9`.
- Every lesson contains an explicit `Supporting Scriptures` section, and all four references for each lesson are preserved in the website data.
- No end-of-file `forEach` overwrite is present in `amos-study-data.js`.
- The existing Series Guide presentation was incomplete: the source's second Series Overview paragraph, exact Central Theme, seven Series Goals, exact Lesson Map, Leader Preparation, Key Scriptures, and Closing Prayer were not all rendered, and the website's existing purpose/theme/background wording was partly shortened or generalized.
- `amos-study-guide.js` restores the exact subtitle, both Series Overview paragraphs, exact Central Theme, all seven Series Goals, exact Lesson Map, Leader Preparation, Key Scriptures, and Closing Prayer.
- The shared renderer now supports source-specific `Opening Discussion`, `Main Passage`, and `Scripture Context` labels plus multi-paragraph Series Overview content. Amos uses these options while existing studies keep their prior defaults.
- Lesson presentation now preserves the source headings `Lesson Purpose`, `Opening Discussion`, `Main Passage`, `Supporting Scriptures`, and `Scripture Context` instead of generic renderer labels.

## Next audit

Obadiah.
