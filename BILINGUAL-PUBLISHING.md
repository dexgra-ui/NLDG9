# NLDG Bilingual Publishing Guide

## Purpose

No Labels, Designed by God™ uses English as the canonical source language and Spanish as the first translated language under `/es/`.

The goal is not automatic publication of machine translation. The goal is a maintainable publishing system where framework pages and ministry resources have deliberate, reviewed English and Spanish counterparts. For new Bible studies, bilingual creation is the default workflow: the Spanish counterpart is built as part of the same study project rather than left for a future backlog.

## Current status

The foundational Spanish publishing phase is complete as of September 3, 2026.

- The bilingual framework is established across the site.
- The Spanish Start Here and Walking With Jesus pathways are published.
- All 66 Bible book studies are published in Spanish.
- The 66-book Spanish collection is organized at `es/libro-por-libro.html` with 39 Old Testament and 27 New Testament books.
- `es/estudios-biblicos.html` is the compact Spanish Bible Studies hub.
- The publication-era book workflow fan-out has been replaced by one consolidated Spanish Bible Book Audit.

There is no remaining book-by-book Spanish conversion backlog. Future bilingual work is normal content publishing and selective expansion into devotionals, articles, newsletters, games, and other ministry resources.

## Core rules

1. English remains the canonical source unless a page explicitly says otherwise.
2. Spanish routes live under `/es/`.
3. Every new Bible study is bilingual by default. Build the Spanish counterpart in the same project once the English source structure is stable; do not defer it into a translation backlog unless an explicit exception is approved.
4. Published ministry content is translated and reviewed intentionally. Do not blindly machine-translate studies, devotionals, articles, newsletters, or lesson resources.
5. A Spanish Bible study is not published merely because a draft translation exists. It must preserve the English teaching intent and structure, use the NTV editorial standard where Scripture text is quoted, pass the relevant audits, and complete the normal review step.
6. When an equivalent Spanish page exists, the English | Español selector should keep the visitor on the equivalent page.
7. When no Spanish version exists, the selector routes to `/es/proximamente.html` with a safe link back to the English source.
8. Preserve NLDG branding, Scripture-link behavior, legal notices, accessibility, responsive layout, and content structure.
9. The public ministry name remains `No Labels, Designed by God™` in both languages.

## Route registry

The runtime route registry lives in `nldg-i18n.js` in the `pairs` object.

Example:

```js
'study-storm.html':'es/fe-en-la-tormenta.html'
```

Add a route pair only after both files exist and the Spanish version has been reviewed.

## Spanish page requirements

Every Spanish page should:

- use `<html lang="es">`;
- live under `/es/`;
- identify the English page as canonical when it is a translation;
- include or receive English/Spanish alternate-language links;
- use Spanish interface text;
- preserve the official NLDG name and branding;
- clearly identify Bible translations when quoted;
- avoid changing the meaning, teaching intent, or Scripture references of the English source without editorial review.

## Scripture translation

The primary Spanish Bible translation for NLDG is Nueva Traducción Viviente (NTV). If another translation is used for comparison or study, identify it clearly.

Do not assume an English quotation can be translated freely and still carry the original publisher permissions. Prefer references or properly licensed Spanish Bible text.

## Default workflow for every new Bible study

A new Bible-study project is considered bilingual work from the beginning.

1. Build and approve the English canonical study structure and source content.
2. In the same project, create the Spanish counterpart under `/es/` rather than placing it on a future translation list.
3. Preserve every lesson, Scripture reference, teaching movement, discussion question, personal examination, weekly practice, leader safeguard, caution, prayer, and other source section unless an editorial change is explicitly approved.
4. Use natural ministry Spanish while preserving theological meaning and pastoral safeguards. Use Nueva Traducción Viviente (NTV) as the Spanish Scripture standard where Scripture text is quoted.
5. Add the English/Spanish route pair only after both files exist and the Spanish version has completed review.
6. Surface the Spanish study in the appropriate Spanish hub or library when it is ready for visitors.
7. Run bilingual-route, Site Quality, accessibility, SEO/repository checks, and any study-specific or Spanish-study audit that applies.
8. Verify the English | Español selector in both directions and test phone, tablet, laptop, and desktop layouts.
9. Treat the study project as complete when the English edition is ready and the Spanish edition is also ready for reviewed publication.

If ministry timing requires the English edition to publish before the Spanish review is complete, that is an explicit exception, not the default. The Spanish counterpart should still remain part of the same active project until it is reviewed and published.

## Publishing a new bilingual resource

For resources other than Bible studies, use this general workflow:

1. Publish or confirm the English canonical resource.
2. Create the reviewed Spanish counterpart under `/es/` when bilingual publication is part of the project.
3. Preserve the same major teaching structure and Scripture references unless an editorial revision is intentionally approved.
4. Add the pair to `nldg-i18n.js`.
5. Add the Spanish resource to the appropriate Spanish hub page.
6. Confirm the English | Español selector moves both directions correctly.
7. Confirm fallback behavior for neighboring untranslated pages.
8. Run the bilingual route audit, Site Quality Audit, and any content-specific audit.
9. Test phone, tablet portrait, tablet landscape, laptop, and desktop.

## Bible book-study collection

The Bible book-study conversion project is complete.

- English book studies remain the canonical source editions.
- Spanish book studies use NTV as the editorial Scripture standard.
- `es/libro-por-libro.html` is the public Spanish book-study library.
- `scripts/spanish-old-testament-manifest.mjs` remains the machine-readable Old Testament inventory; all 39 entries are published.
- `nldg-i18n.js` protects English/Spanish route pairing.
- `.github/workflows/spanish-bible-book-audit.yml` runs the consolidated book audit through `scripts/spanish-bible-book-audit.mjs`.

The older per-book GitHub Actions workflows were publication scaffolding and have been retired. Their underlying audit logic and safeguards remain available through the consolidated runner.

See `SPANISH-OLD-TESTAMENT-PREPARATION.md` for the closed conversion record and maintenance guidance.

## Current published foundation

The bilingual platform includes paired framework pages such as Home, About, Bible Studies, Devotionals, Articles, Resource Center, Newsletter, Walking With Jesus, Contact, Privacy, Terms, Disclaimer, and Copyright/Trademark.

The Spanish ministry foundation also includes:

- a complete New Believer / Start Here pathway;
- Preparándonos para Caminar con Jesús;
- the complete 21-lesson Caminando con Jesús journey;
- all 66 book-by-book Bible studies;
- reviewed independent Spanish studies and guides surfaced from the Spanish Bible Studies hub.

The Spanish article `Un cristiano guiado por el Gran Mandamiento` may remain a Spanish-only resource until an exact English canonical counterpart is identified or published.

## Future Spanish expansion

With the foundational conversion phase closed, new Spanish work should follow ministry value rather than a backlog-driven rollout. New Bible studies are the exception to selective expansion: they are bilingual by default under the workflow above.

### Evergreen devotionals

Select strong, broadly useful devotionals from the English library. Favor resources that introduce NLDG's Christ-centered voice and do not depend heavily on time-sensitive context.

### Evergreen articles

Translate and review articles individually. Where a Spanish-only article exists, identify or create an appropriate English canonical counterpart when useful rather than forcing a false pair.

### Beyond the Label newsletter

Translate complete editions intentionally. Do not automatically translate the archive. Establish reviewed bilingual patterns for headings, links, Scripture references, and calls to action.

### Prayer Center and interactive tools

Translate interface text only after the underlying English experience is stable. Preserve privacy and safety language exactly in meaning. Do not expose partially translated workflows that could confuse visitors about privacy, submission, or data handling.

### Games and larger interactive experiences

Treat each game or interactive experience as its own localization project. Framework support for Spanish does not require automatic translation of every content pack.

## Translation status language

Use clear statuses when useful:

- Published
- In review
- Translation in preparation / Traducción en preparación
- Spanish version coming soon / Versión en español próximamente

Do not label an unreviewed automatic translation as published.

## Maintenance

`nldg-i18n.js` is the runtime source of truth for route pairing. `scripts/bilingual-route-audit.mjs` verifies that registered English and Spanish files exist and that Spanish targets use the `/es/` route structure.

For the 66-book Spanish collection, use the consolidated Spanish Bible Book Audit rather than creating new per-book workflow files. Keep the visible Spanish hub and dedicated book library free to evolve without reintroducing hidden compatibility content solely to satisfy historical checks.
