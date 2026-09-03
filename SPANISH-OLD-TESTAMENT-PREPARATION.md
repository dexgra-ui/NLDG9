# Spanish Bible Book Conversion — Closed Project Record

## Status

**Closed: September 3, 2026**

The book-by-book Spanish conversion project is complete.

- 39 of 39 Old Testament book studies are published in Spanish.
- 27 of 27 New Testament book studies are published in Spanish.
- All 66 Bible books now have reviewed English and Spanish book-study editions.
- The public Spanish collection lives at `es/libro-por-libro.html`, organized into 39 Old Testament and 27 New Testament books.
- `es/estudios-biblicos.html` is the compact Spanish Bible Studies hub and links to the dedicated book-by-book library.
- Spanish Scripture references and quotations use Nueva Traducción Viviente (NTV) as the editorial standard.
- English remains the canonical source language unless a resource explicitly states otherwise.

This file is retained as a historical record of the conversion process and as maintenance guidance. It is no longer an active conversion queue.

## Completion milestones

The Old Testament conversion followed canonical order from Genesis through Malachi and ended with all 39 books marked `published` in `scripts/spanish-old-testament-manifest.mjs`.

The completed collection now follows the same bilingual pattern across the full Bible:

- English data: `*-study-data.js`
- English guide: `*-study-guide.js`
- English page: `*-study.html`
- Spanish data: `*-study-data-es.js`
- Spanish page: `es/*-estudio.html`
- English/Spanish route pair in `nldg-i18n.js`
- Spanish library entry in `es/libro-por-libro.html`

Key closeout pull requests:

- PR #344 completed Malachi and the 66-book Spanish collection.
- PR #345 moved the 66 Spanish book studies into the dedicated `es/libro-por-libro.html` library.
- PR #346 consolidated the publication-era Spanish book workflows into one maintained audit system and removed hidden compatibility markup from the public hub.

## Historical conversion workflow

During the conversion phase, each book was handled as a reviewed publishing unit:

1. Start from the English `*-study-data.js`, `*-study-guide.js`, and `*-study.html` files.
2. Create the Spanish data file while preserving every lesson, teaching movement, discussion question, personal examination, weekly practice, leader safeguard, and prayer.
3. Use natural ministry Spanish rather than word-for-word English phrasing while preserving theology, intent, and pastoral care.
4. Use the approved Spanish book name and route slug and declare `Nueva Traducción Viviente (NTV)` as `scriptureStandard`.
5. Create the Spanish page under `/es/` using the shared book-study renderer and Spanish adapter.
6. Confirm Spanish metadata, canonical URL, English alternate, and language switching.
7. Register the English/Spanish route pair only after the reviewed files exist.
8. Publish the book in the Spanish library only after content review.
9. Keep machine-readable publication status synchronized with actual files.
10. Run the applicable content, route, accessibility, SEO, repository, and book audits before merge.

That workflow remains the pattern to use if a future book-study edition is materially rebuilt, replaced, or republished.

## Review standard retained for maintenance

Any future edit to a Spanish book study should preserve the standards used during conversion:

- natural and conversational Spanish;
- theological meaning faithful to the English canonical source;
- Spanish Scripture references and NTV conventions;
- correct accents, punctuation, titles, and capitalization;
- no accidental English interface labels or teaching text;
- discussion questions that remain understandable when read aloud;
- full safeguards involving abuse, coercion, grief, trauma, mental health, power, money, leadership, and vulnerable people;
- Christ-centered teaching without forcing unsupported allegory onto Old Testament passages;
- matching lesson structure, teaching movements, questions, leader guidance, and prayers unless an intentional editorial revision is approved.

## Current source of truth

For the Old Testament, `scripts/spanish-old-testament-manifest.mjs` remains the machine-readable inventory of the 39 books and their English/Spanish files and routes. Every Old Testament entry is now `published`.

For the public collection, `es/libro-por-libro.html` is the authoritative Spanish book-library surface.

For bilingual route pairing, `nldg-i18n.js` remains the runtime source of truth.

## Current audit behavior

The publication-era fan-out of separate per-book GitHub Actions workflows has been retired.

The permanent workflow is:

- `.github/workflows/spanish-bible-book-audit.yml`

It runs:

- `scripts/spanish-bible-book-audit.mjs`

The consolidated runner preserves the existing book-specific audit scripts and their content, translation, route, completion, and pastoral safeguards while presenting them as one maintained Spanish Bible Book Audit in GitHub Actions.

The dedicated library audit verifies that:

- all 66 Spanish book cards are present in `es/libro-por-libro.html`;
- the collection is separated into 39 Old Testament and 27 New Testament books;
- the main Spanish Bible Studies hub links to the dedicated library;
- bilingual routing remains intact;
- the public hub does not depend on hidden publication-era compatibility content.

## Ongoing maintenance

The conversion project is closed. Future work is maintenance and new ministry publishing, not completion of a Spanish Bible-book backlog.

When a book study changes materially:

1. Update the English canonical source first unless the change is Spanish-specific editorial correction.
2. Review the corresponding Spanish edition for parity.
3. Keep route pairs and public library links intact.
4. Run the consolidated Spanish Bible Book Audit plus normal site-wide checks.
5. Do not reintroduce separate per-book workflow files or hidden compatibility content on the public Spanish hub.
