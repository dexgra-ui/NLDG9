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

## Jeremiah — detailed result
Audited: 2026-08-15

- Sources checked: `Jeremiah — Series Guide` and all 8 lesson documents.
- All eight lessons preserve the source Main Scripture, Central Question, Key Truth, Purpose, Opening, Scripture Context, all six Teaching Movements, eight Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, and Closing Prayer.
- The Main Scripture fields are preserved exactly as `Jeremiah 1`, `Jeremiah 2–6`, `Jeremiah 7–10`, `Jeremiah 14; 23; 27–28`, `Jeremiah 18–20; 26`, `Jeremiah 29`, `Jeremiah 30–33`, and `Jeremiah 36–45; 52`.
- The lesson sources do not contain a separate Supporting Scriptures heading, so the empty `supporting` arrays are source-faithful.
- Several lesson Teaching Movement bodies intentionally use repeated generic wording in the authoritative Drive source. The website preserves that wording exactly; it is not a website-side generic replacement and must not be silently rewritten during this fidelity audit.
- No end-of-file `forEach` overwrite is present in `jeremiah-study-data.js`.
- The existing website data preserved the Study Foundation, Series Purpose, Interpretive Commitments, lesson map, and lesson-specific material, but the page did not render the Series Guide's exact subtitle, `Recommended Rhythm`, `Facilitator Safeguards`, `How to Read Together`, or `Closing Prayer`, and the Interpretive Commitments wording lacked its source label.
- `jeremiah-study-guide.js` restores the exact source subtitle and labels, preserves the Study Foundation and Series Purpose, restores the omitted guide sections and Closing Prayer, and changes lesson presentation from the generic `Lesson purpose` label to the source heading `Purpose`.

## Next audit

Lamentations.
