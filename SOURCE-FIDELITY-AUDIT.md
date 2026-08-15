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

## Malachi — detailed result
Audited: 2026-08-15

- Authoritative source scope: the direct contents of Drive folder `Malachi` (folder ID `1IWDRv7X6a04cVMy3sBy7UQrhrMGV2oih`): `Malachi — Series Guide` plus 5 numbered lesson documents.
- The five authoritative lessons are `I Have Loved You`, `Honor God in Worship`, `Faithfulness in Covenant Relationships`, `The Lord You Seek Will Come`, and `Remember and Prepare the Way`.
- Main Scriptures are preserved exactly as `Malachi 1:1–5`, `Malachi 1:6–2:9`, `Malachi 2:10–16`, `Malachi 2:17–3:12`, and `Malachi 3:13–4:6`.
- Every lesson has an explicit `Supporting Scriptures` section with three references. The former website set `supporting: []` for every lesson, so all fifteen supporting references were classified **MISSING SCRIPTURE** and restored.
- The former generated lesson data preserved the lesson titles, Main Scriptures, Central Questions, Key Truths, Opening text, Discussion Questions, Personal Examination, and Weekly Practice, but shortened the source Purpose by dropping its opening `To` and replaced every lesson-specific Scripture Context with a generic summary. These were classified **SHORTENED** and **GENERIC REPLACEMENT** and restored exactly.
- Every source Teaching Movement heading was present, but the website generated one reusable body sentence for all movements instead of the lesson-specific source bodies. Those bodies were classified **GENERIC REPLACEMENT** and restored verbatim from Drive.
- The former Leader Guidance and Closing Prayer were generalized or altered from the source. The exact repeated source guidance and prayer are now restored without added language.
- `malachi-study-data.js` now preserves every lesson title, Main Scripture, Supporting Scriptures, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The former overview blended and compressed the Series Guide and did not load a source guide file. `malachi-study-guide.js` now restores the exact subtitle `Covenant Love, Faithful Worship, Justice, and Renewal`, Series Purpose, Historical and Literary Setting, Central Aim, exact Lesson Map, Recommended Rhythm, Leader Commitments, Pastoral Safeguards, Christ-Centered Reading, and Desired Fruit.
- Lesson presentation now preserves the source headings `Central Question`, `Key Truth`, `Purpose`, `Opening`, `Main Scripture`, `Supporting Scriptures`, `Scripture Context`, `Teaching Movements`, `Discussion Questions`, `Personal Examination`, `Weekly Practice`, `Leader Guidance`, and `Closing Prayer`.

## Next audit

Matthew.
