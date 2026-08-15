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
| Matthew | PASS after Scripture-field, full lesson-data, series-guide, and source-label restoration |
| Mark | PASS after Scripture-field, full lesson-data, series-guide, and source-label restoration |
| Luke | PASS after Scripture-field, full lesson-data, series-guide, and source-label restoration |

## Luke — detailed result
Audited: 2026-08-15

- Authoritative source scope: the direct contents of Drive folder `Luke` (folder ID `1MvinZ0xwA6nDehlwSLMZpEAtp5cd367-`): `Luke — Series Guide` plus 8 numbered lesson documents.
- The eight authoritative lessons are `Good News for the Humble`, `Jesus Announces the Kingdom`, `Learning the Way of Discipleship`, `Loving God, Neighbor, and Enemy`, `Money, Mercy, and Watchful Faithfulness`, `The King Who Seeks the Lost`, `Faithful Witness in Jerusalem`, and `The Cross, the Table, and the Risen Lord`.
- Each authoritative lesson uses one `Main Scripture` field containing three references. The former website kept only the leading Luke range and omitted the two additional references in every lesson. Sixteen references were therefore classified **MISSING SCRIPTURE** and restored inside the Main Scripture field rather than being relabeled as Supporting Scriptures.
- The authoritative lesson documents contain no separate `Supporting Scriptures` heading. `supporting: []` remains source-faithful.
- The former generated data preserved lesson titles, Central Questions, Key Truths, and Teaching Movement headings, but replaced every source Purpose, Opening, Scripture Context, Teaching Movement body, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer with shorter or generalized text. Several Discussion Questions were shortened as well. These were classified **SHORTENED** or **GENERIC REPLACEMENT** and restored exactly from Drive.
- The corrected `luke-study-data.js` uses shared constants only where the Drive source itself repeats exact wording; its `forEach` assigns those exact source sections and does not replace lesson-specific material with generic substitutes.
- `luke-study-data.js` now preserves every lesson title, complete Main Scripture field, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- Each lesson source includes a `Study Foundation` heading with no standalone prose beneath it before `Main Scripture`; the page now preserves that heading without inventing foundation text. Lesson presentation also preserves the source labels `Central Question`, `Key Truth`, `Purpose`, `Opening`, `Main Scripture`, `Scripture Context`, `Teaching Movements`, `Discussion Questions`, `Personal Examination`, `Weekly Practice`, `Leader Guidance`, and `Closing Prayer`.
- The former website did not load a Series Guide. `luke-study-guide.js` now restores the exact source subtitle, Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, six Teaching Movements including `Pastoral Safeguards`, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The Series Guide itself contains no Lesson Map, Recommended Rhythm, or separate Supporting Scriptures section, so none was invented.

## Next audit

John.
