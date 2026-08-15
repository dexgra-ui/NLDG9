# Bible Study Source Fidelity Audit

The Google Drive study documents are the authoritative source for imported Bible-study content. Website formatting may change, but source content must not be shortened, generalized, silently replaced, mislabeled, or omitted.

This ledger was compacted on 2026-08-15 to remove repeated audit boilerplate. Git history retains the earlier verbose entries.

## Status labels

- **PASS** — website content matches the authoritative Drive source after any restoration noted below.
- **MISSING** — a source section is absent from the website.
- **SHORTENED** — source wording was condensed or summarized.
- **GENERIC REPLACEMENT** — lesson-specific source material was replaced with reusable generic text.
- **MISSING SCRIPTURE** — a Scripture reference present in the source is absent from the website data/page.
- **MISLABELED** — source wording survives but is presented under a heading the source does not use.

## Audit ledger

### Genesis — PASS after series-guide restoration
Audited: 2026-08-15

- Sources checked: `Genesis — Series Guide` and all 8 lesson documents.
- All lesson titles, Main Scripture, Central Questions, Key Truths, purposes, openings, Scripture Context, six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayers match the Drive originals.
- The lesson sources do not contain a separate Supporting Scriptures section, so empty `supporting` arrays are source-faithful.
- Restored from the Series Guide: Recommended Rhythm, Facilitator Safeguards, How to Read Together, and Closing Prayer.

### Exodus — PASS after series-guide restoration
Audited: 2026-08-15

- Sources checked: `Exodus — Series Guide` and all 8 lesson documents.
- Lesson content matches the Drive originals across all source sections.
- No separate Supporting Scriptures section exists in the lesson sources.
- Restored from the Series Guide: Recommended Rhythm, Facilitator Safeguards, How to Read Together, and Closing Prayer.

### Leviticus — PASS after series-guide restoration
Audited: 2026-08-15

- Sources checked: `Leviticus — Series Guide` and all 8 lesson documents.
- Lesson content matches the Drive originals across all source sections.
- No separate Supporting Scriptures section exists in the lesson sources.
- Restored from the Series Guide: Recommended Rhythm, Facilitator Safeguards, How to Read Together, and Closing Prayer.

### Numbers — PASS after series-guide restoration
Audited: 2026-08-15

- Sources checked: `Numbers — Series Guide` and all 8 lesson documents.
- Lesson content matches the Drive originals across all source sections.
- No separate Supporting Scriptures section exists in the lesson sources.
- Restored from the Series Guide: Recommended Rhythm, Facilitator Safeguards, How to Read Together, and Closing Prayer.

### Deuteronomy — PASS after series-guide restoration
Audited: 2026-08-15

- Sources checked: `Deuteronomy — Series Guide` and all 8 lesson documents.
- Lesson content matches the Drive originals across all source sections.
- No separate Supporting Scriptures section exists in the lesson sources.
- Restored from the Series Guide: Recommended Rhythm, Facilitator Safeguards, How to Read Together, and Closing Prayer.

### Joshua — PASS after full series-guide restoration
Audited: 2026-08-15

- Sources checked: `Joshua — Series Guide` and all 8 lesson documents.
- Complete Main Scripture strings, including cross-book references, are preserved.
- No separate Supporting Scriptures heading exists in the lesson sources.
- Restored the full Series Guide material: Series Main Scripture, Central Question, Opening, Scripture Context, six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.

### Judges — PASS after full series-guide restoration
Audited: 2026-08-15

- Sources checked: `Judges — Series Guide` and all 8 lesson documents.
- Complete Main Scripture strings, including cross-book references, are preserved.
- No separate Supporting Scriptures heading exists in the lesson sources.
- Restored the full Series Guide material: Series Main Scripture, Central Question, Opening, Scripture Context, six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.

### Ruth — PASS after series-guide restoration and wording correction
Audited: 2026-08-15

- Sources checked: `Ruth — Series Guide` and all 5 lesson documents.
- Ruth explicitly includes Supporting Scriptures in every lesson; all of those references are preserved.
- Corrected the dropped opening word `To` in each Lesson Purpose so the source wording is exact.
- Restored Series Overview, Central Theme, six Series Goals, Leader Preparation, Recommended Rhythm, Key Scriptures, and Closing Prayer.

### 1 Samuel — PASS after full series-guide restoration
Audited: 2026-08-15

- Sources checked: `1 Samuel — Series Guide` and all 8 lesson documents.
- Complete Main Scripture strings, including all cross-book references, are preserved.
- No separate Supporting Scriptures heading exists in the lesson sources.
- Restored the full Series Guide material: Series Main Scripture, Central Question, Opening, Scripture Context, six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.

### 2 Samuel — PASS after full series-guide restoration
Audited: 2026-08-15

- Sources checked: `2 Samuel — Series Guide` and all 8 lesson documents.
- Complete Main Scripture strings, including all cross-book references, are preserved.
- No separate Supporting Scriptures heading exists in the lesson sources.
- Restored the full Series Guide material: Series Main Scripture, Central Question, Opening, Scripture Context, six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.

### 1 Kings — PASS after full series-guide restoration
Audited: 2026-08-15

- Sources checked: `1 Kings — Series Guide` and all 8 lesson documents.
- Complete Main Scripture strings, including all cross-book references, are preserved.
- No separate Supporting Scriptures heading exists in the lesson sources.
- Restored the full Series Guide material: Series Main Scripture, Central Question, Opening, Scripture Context, six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.

### 2 Kings — PASS after series-guide restoration
Audited: 2026-08-15

- Sources checked: `2 Kings — Series Guide` and all 8 lesson documents.
- All lesson fields match the Drive originals. These lessons use one Main Scripture range per lesson and do not contain a separate Supporting Scriptures section.
- Restored the explicit Interpretive Commitments label, Recommended Rhythm, Facilitator Safeguards, How to Use Scripture References, and Closing Prayer.

### 1 Chronicles — PASS after series-guide restoration and subtitle-label correction
Audited: 2026-08-15

- Sources checked: `1 Chronicles — Series Guide` and all 8 lesson documents.
- All eight lessons preserve the source title, unlabeled subtitle, complete Main Scripture field with cross-book references, Central Question, Key Truth, Opening, Scripture Context, all five Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The lesson sources do not contain a separate Supporting Scriptures section.
- The source does not contain a `Purpose` heading in these lessons. The website had mapped each unlabeled subtitle into `goal` and displayed it as `Lesson purpose`. The shared renderer now supports `lessonSubtitleMode`, preserving these lines as subtitles rather than inventing a source heading.
- The Series Guide Study Foundation was restored to its full wording. Central Question, Key Truth, Recommended Rhythm, the Interpretive Commitments label, and Closing Prayer are also restored through `first-chronicles-study-guide.js`.

### 2 Chronicles — PASS after series-guide restoration and subtitle-label correction
Audited: 2026-08-15

- Sources checked: `2 Chronicles — Series Guide` and all 8 lesson documents.
- All eight lessons preserve the source title, unlabeled subtitle, complete Main Scripture field with cross-book references, Central Question, Key Truth, Opening, Scripture Context, all five Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- Examples of preserved Main Scripture fields include `2 Chronicles 1–7; John 2:18–22`, `2 Chronicles 17–20; James 1:5`, and `2 Chronicles 33–36; Luke 15:17–24`.
- The lesson sources do not contain a separate Supporting Scriptures section.
- As with 1 Chronicles, the source does not contain a `Purpose` heading. `lessonSubtitleMode` now preserves each second-line description as an unlabeled subtitle instead of presenting it as `Lesson purpose`.
- The website already preserved the exact Study Foundation, Series Purpose, Interpretive Commitments text, and lesson map. Restored the explicit Interpretive Commitments label, Central Question, Key Truth, Recommended Rhythm, and Closing Prayer through `second-chronicles-study-guide.js`.

## Next audit

Ezra.
