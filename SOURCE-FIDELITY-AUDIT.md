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

## Habakkuk — detailed result
Audited: 2026-08-15

- Authoritative source scope: the direct contents of Drive folder `Habakkuk — Book-by-Book Study` (folder ID `1DS2hicxX9l2BJsWmTPX975AbjSpJV3a6`): `Habakkuk — Series Guide` plus 4 numbered lesson documents.
- The four authoritative lessons are `How Long Must I Call for Help?`, `Waiting for the Vision`, `Woe to the Proud and Violent`, and `Yet I Will Rejoice`.
- Main Passages are preserved exactly as `Habakkuk 1:1–11`, `Habakkuk 1:12–2:5`, `Habakkuk 2:6–20`, and `Habakkuk 3:1–19`.
- Every lesson has an explicit `Supporting Scriptures` section, and all four references for each lesson were already present and remain preserved.
- The former website retained the lesson titles, Main Passages, Supporting Scriptures, Central Questions, Key Truths, Purposes, Opening Discussions, eight Discussion Questions, and Closing Prayers, but shortened multiple Scripture Contexts, Teaching Movement bodies, Personal Examinations, Weekly Practices, and Leader Guidance sections. These were classified **SHORTENED** and restored verbatim from Drive.
- No end-of-file generic `forEach` overwrite was present in `habakkuk-study-data.js`; the lossiness was embedded directly in shortened lesson fields rather than applied afterward.
- `habakkuk-study-data.js` now preserves every lesson title, Main Passage, Supporting Scriptures, Central Question, Key Truth, Lesson Purpose, Opening Discussion, Scripture Context, all six full Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The former overview preserved the source subtitle, Central Theme, and a shortened Historical Setting, but compressed the Series Overview and Series Goals and omitted the exact Historical Setting, Lesson Map, Leader Preparation, Recommended Rhythm, Key Scriptures, and Closing Prayer as source-labeled sections.
- `habakkuk-study-guide.js` restores both exact Series Overview paragraphs, Central Theme, all six Series Goals, Historical Setting, exact Lesson Map, Leader Preparation, Recommended Rhythm, Key Scriptures, and Closing Prayer.
- Lesson presentation now preserves the source headings `Lesson Purpose`, `Opening Discussion`, `Main Passage`, `Supporting Scriptures`, and `Scripture Context`.

## Next audit

Zephaniah.
