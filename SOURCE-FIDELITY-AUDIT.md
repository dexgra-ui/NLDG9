# Bible Study Source Fidelity Audit

The Google Drive study documents are the authoritative source for imported Bible-study content. Website formatting may change, but source content must not be shortened, generalized, silently replaced, mislabeled, or omitted.

This ledger was re-compacted on 2026-08-15. Git history retains the earlier detailed entries.

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

## Proverbs — detailed result
Audited: 2026-08-15

- Sources checked: `Proverbs — Series Guide` and all 8 lesson documents.
- All eight lessons preserve the exact Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The complete Main Scripture fields, including cross-book references, are preserved. Examples include `Proverbs 1:1–2:22; Psalm 111:10; James 1:5`, `Proverbs 3:1–7:27; Matthew 5:27–30; Philippians 4:8–9`, and `Proverbs 8:1–9:18; 30:1–33; 31:1–9; James 3:13–18`.
- The lesson sources do not contain a separate Supporting Scriptures heading; the empty `supporting` arrays are source-faithful.
- The existing website data preserved all lesson-specific content, but the Series Guide had been flattened: its Main Scripture, Central Question, Opening, Scripture Context, six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer were not rendered.
- The website also reused the generic Scripture Context paragraph as its overview description/background even though the source does not provide that paragraph as a Study Foundation body. `proverbs-study-guide.js` now restores the source subtitle and removes that misassigned overview text.
- Restored the source Key Truth label and full Series Guide through `proverbs-study-guide.js`, and corrected lesson presentation from the generic `Lesson purpose` label to the source heading `Purpose`.

## Ecclesiastes — detailed result
Audited: 2026-08-15

- Sources checked: `Ecclesiastes — Series Guide` and all 6 lesson documents.
- All six lessons preserve the exact Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- Complete Main Scripture fields, including cross-book references, are preserved. Examples include `Ecclesiastes 1:1–2:26; Luke 12:13–21`, `Ecclesiastes 3:1–22; Psalm 31:14–15; Romans 8:18–25`, and `Ecclesiastes 11:1–12:14; Matthew 6:33–34; 1 Corinthians 15:58`.
- The lesson sources do not contain a separate Supporting Scriptures heading; all cross-book references are part of the Main Scripture field, so the empty `supporting` arrays are source-faithful.
- The existing website data preserved all lesson-specific content, but the Series Guide had been flattened: its Main Scripture, Central Question, Opening, Scripture Context, six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer were not rendered.
- The website also reused the source Scripture Context paragraph as the overview description/background even though the source provides a distinct subtitle and no standalone Study Foundation body. `ecclesiastes-study-guide.js` restores the exact subtitle and removes that misassigned overview text.
- Restored the source Key Truth, Purpose label, full Series Guide, and Closing Prayer through `ecclesiastes-study-guide.js`. The shared renderer now honors `seriesPurposeLabel`, so series guides that explicitly use `Purpose` no longer display the generic `Series purpose` label. Lesson pages also use the source heading `Purpose`.

## Song of Songs — detailed result
Audited: 2026-08-15

- Sources checked: `Song of Songs — Series Guide` and all 5 lesson documents.
- All five lessons preserve the exact Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- Complete Main Scripture fields, including cross-book references, are preserved. Examples include `Song of Songs 1:1–2:7; Genesis 1:26–31`, `Song of Songs 3:6–5:1; Genesis 2:18–25; Ephesians 5:21`, and `Song of Songs 7:1–8:14; 1 Corinthians 13:4–8; Romans 8:38–39`.
- The lesson sources do not contain a separate Supporting Scriptures heading; all cross-book references belong to the Main Scripture field, so the empty `supporting` arrays are source-faithful.
- No generic `forEach` overwrite is present in `song-of-songs-study-data.js`; lesson-specific pastoral and safeguarding content remains intact.
- The website data already preserved the lesson-specific material, but the full Series Guide was not loaded by the page. Restored its Main Scripture, Central Question, Opening, Scripture Context, six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer through `song-of-songs-study-guide.js`.
- The website had also reused the source Scripture Context paragraph as its overview description/background. The guide overlay restores the exact source subtitle, removes that misassigned overview text, and uses the source heading `Purpose` for both the series and lessons.

## Isaiah — detailed result
Audited: 2026-08-15

- Sources checked: `Isaiah — Series Guide` and all 8 lesson documents.
- All eight lessons preserve the exact Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The lesson Main Scripture fields are preserved exactly as `Isaiah 1–6`, `Isaiah 7–12`, `Isaiah 13–35`, `Isaiah 40–48`, `Isaiah 49–55`, `Isaiah 56–61`, `Isaiah 62–64`, and `Isaiah 65–66`.
- The lesson sources do not contain a separate Supporting Scriptures heading, so the empty `supporting` arrays are source-faithful.
- No generic end-of-file overwrite is present in `isaiah-study-data.js`; the lesson-specific teaching, pastoral cautions, questions, practices, and prayers remain intact.
- The existing data preserved the source Study Foundation, Series Purpose, and Interpretive Commitments wording, but the Series Guide was incomplete on the page. Its exact subtitle, `Recommended Rhythm`, `Facilitator Safeguards`, `How to Read Together`, and `Closing Prayer` were not rendered, and `Interpretive Commitments` lacked its source label.
- `isaiah-study-guide.js` restores the exact source subtitle and labels, preserves the Study Foundation paragraph and Series Purpose, restores the three omitted guide sections and Closing Prayer, and changes lesson presentation from the generic `Lesson purpose` label to the source heading `Purpose`.
- The source Lesson Map is represented by the website lesson map with the same eight lesson titles and Scripture ranges.

## Next audit

Jeremiah.
