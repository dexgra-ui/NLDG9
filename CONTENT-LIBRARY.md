# Ministry Content Library

`content-library.js` is the central source of truth for public ministry content.

## Supported content types

- Study
- Devotional
- Article
- Resource
- Podcast
- News

## Core fields

Every item should include:

- `id`: unique lowercase slug
- `type`: supported content type
- `title`
- `description`
- `url`
- `topics`: searchable keywords
- `status`: `draft`, `review`, `published`, or `archived`

## Study fields

Studies may also include:

- `category`
- `series`
- `scripture`
- `book`
- `audience`
- `difficulty`
- `duration`
- `featured`
- `publishedAt`
- `updatedAt`

## Compatibility

The library automatically creates:

- `window.NLDG_STUDIES`
- `window.NLDG_CONTENT`
- `window.NLDG_LIBRARY_API`

`study-data.js` remains as a compatibility loader for older pages while pages are migrated to `content-library.js`.

## Publishing workflow

Sprint 4.3 publish packages should contribute a normalized library entry matching this schema. Public pages should read from this library rather than maintaining separate handwritten indexes.
