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

## Daniel — detailed result
Audited: 2026-08-15

- Sources checked: `Daniel — Series Guide` and all 8 lesson documents.
- All eight lessons preserve the source title, Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The Main Scripture fields are preserved exactly as `Daniel 1:1–21; Jeremiah 29:4–7; Romans 12:1–2`, `Daniel 2:1–49; Psalm 2:1–12; James 1:5`, `Daniel 3:1–30; Exodus 20:1–6; Acts 5:27–32`, `Daniel 4:1–37; Proverbs 16:18; Luke 18:9–14`, `Daniel 5:1–31; Isaiah 47:7–11; Galatians 6:7–8`, `Daniel 6:1–28; Psalm 55:16–18; 1 Timothy 2:1–4`, `Daniel 7:1–28; Psalm 110:1–7; Mark 14:61–64`, and `Daniel 8:1–12:13; Matthew 24:15–31; Revelation 12:7–12`.
- The lesson sources do not contain a separate Supporting Scriptures heading; all cross-book references are part of Main Scripture, so the empty `supporting` arrays are source-faithful.
- The second line of each lesson is the generic `Daniel, Lesson X`, so there is no meaningful source subtitle to restore on lesson pages.
- No end-of-file `forEach` overwrite is present in `daniel-study-data.js`.
- The existing website lesson data is source-faithful, but the Series Guide was incomplete and partly mislabeled: the source subtitle was absent, the overview theme did not use the exact source Key Truth, the `background` reused the `Two Literary Worlds` Teaching Movement under the `Study foundation` label, and the source Main Scripture, Central Question, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer were not rendered as the full Series Guide.
- The source `Study Foundation` heading leads directly into `Main Scripture` and has no standalone prose beneath it, so `daniel-study-guide.js` suppresses the incorrect background block rather than inventing or relabeling content.
- `daniel-study-guide.js` restores the exact source subtitle, Key Truth, Purpose label, Main Scripture, Central Question, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer, and changes lesson presentation from the generic `Lesson purpose` label to the source heading `Purpose`.

## Next audit

Hosea.
