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

## Hosea — detailed result
Audited: 2026-08-15

- Sources checked: `Hosea — Series Guide` and all 8 lesson documents.
- All eight lessons preserve the source lesson title, Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The Main Scripture fields are preserved exactly as `Hosea 1`, `Hosea 2`, `Hosea 3`, `Hosea 4`, `Hosea 5; 7–8`, `Hosea 6`, `Hosea 11`, and `Hosea 14`.
- The lesson sources do not contain a separate Supporting Scriptures heading, so the empty `supporting` arrays are source-faithful.
- The second line of each lesson is a generic `Hosea ... • Book-by-Book Bible Study` line, so it is not treated as a meaningful lesson subtitle.
- No end-of-file `forEach` overwrite is present in `hosea-study-data.js`.
- Repeated generic Teaching Movement bodies in several lessons are present in the authoritative Drive documents themselves. The website preserves those source bodies rather than replacing them. Lesson-specific exceptions such as `Gomer Is More Than a Symbol`, `Violent Language Requires Care`, `Do Not Blame Women Alone`, and `Politics Cannot Save the Soul` are also preserved.
- The Series Guide and Lesson 4 source use different titles for the same lesson: the guide map says `Lack of Knowledge and Failed Leadership — Hosea 4`, while the lesson document is titled `Hosea 4 — My People Are Destroyed for Lack of Knowledge`. Both are preserved: the exact source Series Guide map is restored, while the lesson page keeps the lesson document title.
- The existing website data already preserved the source Study Foundation, Series Purpose, and Interpretive Commitments wording, but the source subtitle and labels were incomplete and the Series Guide's exact Lesson Map, Recommended Rhythm, Facilitator Safeguards, How to Read Together, and Closing Prayer were not rendered.
- `hosea-study-guide.js` restores the exact source subtitle, `Interpretive Commitments` and `Series Purpose` labels, exact source Lesson Map, Recommended Rhythm, Facilitator Safeguards, How to Read Together, and Closing Prayer, and changes lesson presentation from the generic `Lesson purpose` label to the source heading `Purpose`.

## Next audit

Joel.
