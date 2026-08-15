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

## Zephaniah — detailed result
Audited: 2026-08-15

- Authoritative source scope: the direct contents of Drive folder `Zephaniah` (folder ID `1L-z3kXh933o1UXAyJMID2s9uAQz3xUsb`): `Zephaniah — Series Guide` plus 4 numbered lesson documents.
- The four authoritative lessons are `The Day of the Lord Draws Near`, `Seek the Lord, Seek Righteousness, Seek Humility`, `Woe to the Oppressive City`, and `The Lord Rejoices Over You`.
- Main Scriptures are preserved exactly as `Zephaniah 1:1–18`, `Zephaniah 2:1–15`, `Zephaniah 3:1–8`, and `Zephaniah 3:9–20`.
- Every lesson has an explicit `Supporting Scriptures` section, and all three references for each lesson were already present and remain preserved.
- The former website shortened several source fields directly in the data: Lesson 1 omitted `before or amid reforms` from Scripture Context and shortened the `Wealth cannot rescue` teaching body; Lesson 2 replaced the named nations with `surrounding nations` and shortened the final Teaching Movement; Lessons 3 and 4 slightly shortened their Scripture Contexts. These were classified **SHORTENED** and restored verbatim from Drive.
- The former `zephaniah-study-data.js` ended with a generic `forEach`. Its Purpose, Opening, Discussion Questions, Weekly Practice, and Closing Prayer happened to reproduce the repeated source text exactly, but its Personal Examination and Leader Guidance did not. The overwrite was therefore classified **GENERIC REPLACEMENT** and removed; the repeated source wording is now stored explicitly and exactly.
- `zephaniah-study-data.js` now preserves every lesson title, Main Scripture, Supporting Scriptures, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The former overview blended or compressed the Series Guide and did not load a source guide file. `zephaniah-study-guide.js` now restores the exact subtitle `Judgment, Humility, Justice, and Rejoicing Love`, Series Purpose, Historical and Literary Setting, Central Aim, exact Lesson Map, Recommended Rhythm, Leader Commitments, Pastoral Safeguards, Christ-Centered Reading, Desired Fruit, and Interpretive Emphasis.
- Lesson presentation now preserves the source headings `Purpose`, `Opening`, `Main Scripture`, `Supporting Scriptures`, and `Scripture Context`.

## Next audit

Haggai.
