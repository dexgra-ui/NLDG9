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

## Nahum — detailed result
Audited: 2026-08-15

- Authoritative source scope: the direct contents of Drive folder `Nahum` (folder ID `15BlwBB0o_QxncKPLRd5nQAsOSgd-FYsr`): `Nahum — Series Guide` plus 4 numbered lesson documents.
- The four authoritative lessons are `The Lord Is Good and Just`, `The Fall of Violent Power`, `Woe to the City of Blood`, and `Justice Without Revenge`.
- Every lesson uses a single `Main Scripture` field that includes the Nahum passage plus its cross-book references. The source does not contain a separate `Supporting Scriptures` heading. The former website split those references into a separate supporting field; this was **MISLABELED** and no longer matched the source organization. Main Scripture is now preserved exactly as `Nahum 1:1–8; Exodus 34:6–7; Psalm 46:1–3`, `Nahum 1:9–2:13; Isaiah 10:5–19; Psalm 20:7`, `Nahum 3:1–7; Habakkuk 2:6–17; Luke 4:18–19`, and `Nahum 3:8–19; Romans 12:17–21; Revelation 19:1–6`, with `supporting: []` because the source has no separate supporting section.
- The former website retained the lesson titles, Central Questions, Key Truths, and Purposes, but shortened every Teaching Movement body. Those sections were classified **SHORTENED** and have been restored verbatim from Drive.
- The former `nahum-study-data.js` ended with a `forEach` that replaced the source Opening, Scripture Context, Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer with shorter reusable text. This was classified **GENERIC REPLACEMENT**. The overwrite has been removed; the repeated text now used in the data is the exact repeated wording found in all four authoritative lesson documents.
- `nahum-study-data.js` now preserves every lesson title, exact Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six full Teaching Movements, all eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The former overview preserved the source subtitle, Key Truth, and Purpose but mislabeled the `Historical Setting` teaching paragraph as `Study foundation` and omitted most of the full Series Guide. `nahum-study-guide.js` now restores the exact Main Scripture, Central Question, Opening, Scripture Context, all six Series Guide Teaching Movements (`Historical Setting`, `Theological Center`, `Pastoral Posture`, `Lesson Map`, `Leader Safeguards`, `Desired Formation`), eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The shared renderer now supports opt-in source-specific labels for both full Series Guides and individual lessons while leaving existing studies on their previous defaults. Nahum uses these options to preserve `Study Foundation`, `Main Scripture`, `Central Question`, `Key Truth`, `Purpose`, `Opening`, `Scripture Context`, `Teaching Movements`, `Discussion Questions`, `Personal Examination`, `Weekly Practice`, `Leader Guidance`, and `Closing Prayer`, and suppresses non-source helper titles for examination and weekly practice.

## Next audit

Habakkuk.
