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

## Obadiah — detailed result
Audited: 2026-08-15

- Sources checked: `Obadiah — Series Guide` and all 3 lesson documents.
- All three lessons preserve the source lesson title, Main Scripture, Supporting Scriptures, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- Main Scripture is preserved exactly as `Obadiah 1–9`, `Obadiah 10–14`, and `Obadiah 15–21`.
- Every lesson contains an explicit `Supporting Scriptures` section, preserved exactly as `Proverbs 16:18–19; Jeremiah 49:7–16; James 4:6–10`, `Genesis 4:8–10; Luke 10:25–37; James 4:17`, and `Psalm 22:27–28; Matthew 25:31–46; Revelation 11:15`.
- The second line of each lesson is the generic `Book-by-Book Bible Study`, so it is not treated as a meaningful lesson subtitle.
- No end-of-file `forEach` overwrite is present in `obadiah-study-data.js`.
- The existing website overview was partly generalized and merged source sections together: the source subtitle, exact Series Purpose, Historical and Literary Setting, Central Aim, exact Lesson Map, Recommended Rhythm, Leader Commitments, Pastoral Safeguards, Christ-Centered Reading, Desired Fruit, and Interpretive Emphasis were not all rendered under their source headings.
- `obadiah-study-guide.js` restores the exact subtitle and Series Purpose, suppresses the incorrectly merged `Study foundation` presentation, and renders every remaining Series Guide section under its source heading.
- Lesson presentation now preserves the source headings `Purpose`, `Opening`, `Main Scripture`, `Supporting Scriptures`, and `Scripture Context`.

## Next audit

Jonah.
