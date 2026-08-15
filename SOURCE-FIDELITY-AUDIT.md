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

## Zechariah — detailed result
Audited: 2026-08-15

- Authoritative source scope: the direct contents of Drive folder `Zechariah` (folder ID `1iS_8aTAxxKNohLTJWX4lbqd8pJQl65hb`): `Zechariah — Series Guide` plus 8 numbered lesson documents.
- The eight authoritative lessons are `Return to Me and I Will Return to You`, `Night Visions and God’s Restoring Presence`, `Joshua Cleansed and the Coming Branch`, `Not by Might, but by My Spirit`, `True Fasting, Justice, and the Nations`, `The Humble King and the Pierced One`, `The Shepherd, the Flock, and Rejected Leadership`, and `The Day of the Lord and Living Waters`.
- Main Scriptures are preserved exactly as `Zechariah 1`, `Zechariah 1–6`, `Zechariah 3`, `Zechariah 4`, `Zechariah 7–8`, `Zechariah 9; 12`, `Zechariah 10–13`, and `Zechariah 14`.
- The authoritative lesson documents contain no separate `Supporting Scriptures` section. `supporting: []` is therefore source-faithful and no cross-reference section is invented.
- The former website used a generated summary set that shortened or changed source material throughout. Lesson 5’s Central Question and Key Truth, Lessons 6–8’s Central Questions and Key Truths, multiple movement headings, and many movement bodies did not match the authoritative documents. These were classified **SHORTENED** or **GENERIC REPLACEMENT** and restored to the Drive wording.
- The former generated lesson map also replaced every source Purpose, Opening, Scripture Context, Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer with shorter reusable text. The new data still uses shared helpers where the Drive source itself repeats exact wording, but each helper now reproduces the authoritative text without loss.
- Source-specific Teaching Movement bodies are preserved where the Drive documents depart from the repeated pattern, including `Not by Might`, `Old and Young in Safe Streets`, `The One They Pierced`, and `A Severe Apocalyptic Battle`.
- `zechariah-study-data.js` now preserves every lesson title, exact Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- Each lesson source includes a `Study Foundation` heading with no standalone prose beneath it before `Main Scripture`; the page now preserves that heading without inventing foundation text. Lesson presentation also preserves the source labels `Central Question`, `Key Truth`, `Purpose`, `Opening`, `Main Scripture`, `Scripture Context`, `Teaching Movements`, `Discussion Questions`, `Personal Examination`, `Weekly Practice`, `Leader Guidance`, and `Closing Prayer`.
- The former website did not load a Series Guide. `zechariah-study-guide.js` now restores the exact subtitle `Return, Cleansing, Spirit-Empowered Work, the Humble King, and Final Hope`, Study Foundation, Series Purpose, Interpretive Commitments, exact Lesson Map, Recommended Rhythm, Facilitator Safeguards, How to Read Together, and Closing Prayer.
- The Series Guide’s Lesson 1 map title is `Return to Me — Zechariah 1`, while the authoritative Lesson 1 document title is `Return to Me and I Will Return to You`. Both source forms are preserved in their respective locations rather than silently reconciled.

## Next audit

Malachi.
