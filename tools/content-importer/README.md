# Ministry Content Importer

This tool converts exported Google Drive lesson documents into structured content for No Labels, Designed by God.

## What it does

- Reads a JSON export containing Google Doc text and metadata.
- Classifies each item as Sunday School, Bible study, Wednesday study, devotional, or article.
- Extracts Scripture references and discussion questions.
- Builds reusable lesson sections.
- Preserves the Google Drive file ID, source link, and modified time.
- Writes one generated JavaScript content bundle.

## Run it

```bash
node tools/content-importer/import-content.mjs \
  tools/content-importer/drive-export.json \
  content-import.generated.js
```

Use `drive-export.example.json` as the input format.

## Publishing safety

Imported items default to `draft`. This keeps newly imported material off the public site until it has been reviewed. Stable IDs are generated from titles, while the original Drive file ID is retained for future update matching.

## Planned Drive workflow

1. Scan the connected ministry folder and its subfolders.
2. Export each Google Doc as text plus metadata.
3. Run this importer.
4. Review classifications and lesson formatting.
5. Publish approved items into the appropriate website library.

Google Drive remains the editable source of truth. The website receives a structured, searchable copy for fast public display.
