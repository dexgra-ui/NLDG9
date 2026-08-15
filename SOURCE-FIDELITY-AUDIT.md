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

## Joel — detailed result
Audited: 2026-08-15

- Sources checked: `Joel — Series Guide` and all 4 lesson documents.
- All four lesson documents contain explicit `Supporting Scriptures` sections. The website had empty `supporting` arrays, so these references were classified **MISSING SCRIPTURE** and restored.
- Restored Supporting Scriptures exactly as `Psalm 42; Lamentations 3:19–33; Romans 8:18–25`, `Exodus 34:5–7; Isaiah 58:1–12; Luke 15:11–24`, `Acts 2:14–21; Numbers 11:24–30; Galatians 3:26–29`, and `Isaiah 2:1–4; Matthew 25:31–46; Revelation 21:1–5`.
- The Main Scripture fields are preserved exactly as `Joel 1:1–20`, `Joel 2:1–27`, `Joel 2:28–32`, and `Joel 3:1–21`.
- Apart from the missing Supporting Scriptures, the existing lesson data preserved the source lesson titles, Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The second line of each lesson is the generic `Book-by-Book Bible Study`, so it is not treated as a meaningful lesson subtitle.
- No end-of-file `forEach` overwrite is present in `joel-study-data.js`.
- The existing series overview was materially incomplete: `description`, `theme`, and `background` incorrectly contained `Joel — Series Guide`, while the source Historical and Literary Setting, Central Aim, exact Lesson Map, Recommended Rhythm, Leader Commitments, Pastoral Safeguards, Christ-Centered Reading, Desired Fruit, and Interpretive Emphasis were not rendered.
- The source guide does not contain a `Study Foundation` heading, so the incorrect background block is suppressed rather than relabeled.
- `joel-study-guide.js` restores the exact source subtitle and `Series Purpose` label, renders every omitted Series Guide section under its source heading, sets the lesson label to `Purpose`, and sets the supporting-Scripture label to the source heading `Supporting Scriptures`.

## Next audit

Amos.
