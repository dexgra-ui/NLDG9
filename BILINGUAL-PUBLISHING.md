# NLDG Bilingual Publishing Guide

## Purpose

No Labels, Designed by God™ uses English as the canonical source language and Spanish as the first translated language under `/es/`.

The goal is not automatic translation. The goal is a maintainable publishing system where framework pages and ministry resources can have deliberate, reviewed English and Spanish counterparts.

## Core rules

1. English remains the canonical source unless a page explicitly says otherwise.
2. Spanish routes live under `/es/`.
3. Published ministry content is translated and reviewed intentionally. Do not blindly machine-translate studies, devotionals, articles, newsletters, or lesson resources.
4. When an equivalent Spanish page exists, the English | Español selector should keep the visitor on the equivalent page.
5. When no Spanish version exists, the selector routes to `/es/proximamente.html` with a safe link back to the English source.
6. Preserve NLDG branding, Scripture-link behavior, legal notices, accessibility, responsive layout, and content structure.
7. The public ministry name remains `No Labels, Designed by God™` in both languages.

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

## Publishing a new bilingual resource

1. Publish or confirm the English canonical resource.
2. Create the reviewed Spanish counterpart under `/es/`.
3. Preserve the same major teaching structure and Scripture references.
4. Add the pair to `nldg-i18n.js`.
5. Add the Spanish resource to the appropriate Spanish hub page.
6. Confirm the English | Español selector moves both directions correctly.
7. Confirm fallback behavior for neighboring untranslated pages.
8. Run the bilingual route audit and Site Quality Audit.
9. Test phone, tablet portrait, tablet landscape, laptop, and desktop.

## Current published pairs

Framework pairs include Home, About, Bible Studies, Devotionals, Articles, Resource Center, Newsletter, Walking With Jesus, Contact, Privacy, Terms, Disclaimer, and Copyright/Trademark.

Current paired ministry resources include:

- New Believer / `Biblia para principiantes`
- Scripture-context study / `Cómo estudiar la Biblia`
- Grace for This Season / `Gracia para esta etapa`
- Faith in the Storm / `Fe en la tormenta`
- Grace & Accountability / `Gracia y responsabilidad`
- Peacemakers / `Pacificadores en un mundo dividido`

The Spanish article `Un cristiano guiado por el Gran Mandamiento` remains a Spanish resource without an exact English page pair until a canonical English counterpart is identified or published.

## Translation status language

Use clear statuses when useful:

- Published
- In review
- Translation in preparation / Traducción en preparación
- Spanish version coming soon / Versión en español próximamente

Do not label an unreviewed automatic translation as published.

## Maintenance

`nldg-i18n.js` is the runtime source of truth for route pairing. `scripts/bilingual-route-audit.mjs` verifies that registered English and Spanish files exist and that Spanish targets use the `/es/` route structure.
