# Spanish Old Testament Conversion Plan

## Current position

- All 39 English Old Testament book studies are the canonical source.
- Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther, Job, Psalms, Proverbs, Ecclesiastes, Song of Songs, Isaiah, Jeremiah, and Lamentations are published in Spanish.
- The remaining 14 books are mapped and ready for book-by-book conversion.
- Spanish Scripture references and quotations use Nueva Traducción Viviente (NTV) as the editorial standard.
- Nothing is added to the public Spanish library or language switcher until the Spanish study is complete and reviewed.

The machine-readable source of truth is `scripts/spanish-old-testament-manifest.mjs`. It defines every English source file, planned Spanish data file, planned Spanish page, Spanish book name, route slug, and publication status.

## Conversion order

Work in canonical order unless a ministry need changes the priority:

1. Law: Genesis through Deuteronomy
2. History: Joshua through Esther
3. Wisdom and poetry: Job through Song of Songs
4. Major Prophets: Isaiah through Daniel
5. Minor Prophets: Hosea through Malachi

## One-book workflow

For each book:

1. Start from the English `*-study-data.js`, `*-study-guide.js`, and `*-study.html` files named in the manifest.
2. Create the Spanish data file named in the manifest. Preserve every lesson, teaching movement, question, personal examination, weekly practice, leader safeguard, and prayer.
3. Use natural ministry Spanish rather than word-for-word English phrasing. Keep the theology, intent, and level of pastoral care unchanged.
4. Use the exact Spanish book name and route slug in the manifest. Declare `Nueva Traducción Viviente (NTV)` as `scriptureStandard`.
5. Create the Spanish page under `/es/` using the shared `book-study-series.js` renderer and `book-study-series-es.js` adapter.
6. Confirm the page has Spanish language metadata, its English alternate link, its Spanish canonical URL, and the shared language selector.
7. Add the English/Spanish pair to `nldg-i18n.js` only after both files exist.
8. Add the Spanish card to `es/estudios-biblicos.html` only after content review.
9. Change that book's manifest status from `prepared` to `published` in the same pull request.
10. Run the Old Testament preparation audit, bilingual route audit, accessibility audit, and repository completion audit.

## Review checklist

The Spanish-speaking reviewer should confirm:

- the language sounds natural and conversational;
- theological meaning matches the English source;
- Scripture references use Spanish book names and NTV conventions;
- titles, accents, punctuation, and capitalization are correct;
- no English interface labels or teaching text remain;
- discussion questions are understandable when read aloud;
- warnings about abuse, coercion, grief, trauma, mental health, power, and vulnerable people retain their full meaning;
- the study remains centered on Jesus without forcing Old Testament passages into unsupported allegory;
- lesson counts, teaching movements, questions, leader guidance, and prayers match the English structure.

## File pattern

Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther, Job, Psalms, Proverbs, Ecclesiastes, Song of Songs, Isaiah, Jeremiah, and Lamentations now demonstrate the completed conversion pattern:

- English data: `*-study-data.js`
- English guide: `*-study-guide.js`
- English page: `*-study.html`
- Spanish data: `*-study-data-es.js`
- Spanish page: `es/*-estudio.html`
- English/Spanish route pair in `nldg-i18n.js`

Every remaining book follows this same pattern through Malachi.

## Audit behavior

`scripts/spanish-old-testament-prep-audit.mjs` verifies:

- the manifest contains exactly 39 unique Old Testament books;
- all English source data, guide, and page files exist;
- published and prepared statuses stay synchronized with actual Spanish files;
- prepared books do not create dead public links before translation;
- once Spanish files appear, their lesson structure matches English;
- NTV, metadata, shared rendering, route registration, and Spanish library placement are present;
- public routing and actual files stay synchronized.

Book-specific audits add pastoral safeguards for difficult texts as each study is converted. The workflow `.github/workflows/spanish-old-testament-prep-audit.yml` runs the shared protection on pull requests and on the main branch.