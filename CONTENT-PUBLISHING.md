# Ministry Content Publishing

The shared content registry is the source of truth for ministry discovery. A published entry automatically feeds global search, homepage sections, topic and Scripture browsing, related-content recommendations, and the generated complete-content section of the site map.

## Standard workflow

1. Copy `templates/content-page.template.html` and rename it for the new ministry resource.
2. Replace every `{{PLACEHOLDER}}` value and write the complete page.
3. Copy the object in `templates/content-entry.template.js` into `content-library.js`, or into the journey-specific library when the content belongs to an established journey.
4. Set `status: 'published'` only when the page is ready for visitors.
5. Run the site and accessibility audits.
6. Open the page on phone and tablet widths and verify print behavior when the resource is printable.

New content should not require manual edits to homepage sections, search, topic browsing, Scripture browsing, related-content blocks, or the complete-content site-map index.

## Source fidelity for imported studies

When a Bible study is published from a Google Drive source document, the Drive document is the authoritative content source. Website formatting may change, but the content must remain complete.

- Preserve every visible Scripture reference from the source, including main passages, supporting Scriptures, references inside teaching text, questions, notes, and series guides.
- Do not summarize, shorten, paraphrase, or "clean up" source teaching text during import unless an editorial change has been explicitly approved.
- Preserve lesson-specific Purpose, Opening, Scripture Context, Teaching Movements, Discussion Questions, Personal Examination, Weekly Practice, Leader Guidance, cautions, and Closing Prayer.
- Do not replace lesson-specific material with reusable generic text merely to fit the shared renderer.
- Preserve series-guide content as well as lesson content, including interpretive commitments, recommended rhythm, facilitator safeguards, reading guidance, closing prayer, and other source sections.
- Use an empty `supporting` array only when the source lesson genuinely contains no separate supporting-Scripture list.
- If the renderer does not yet support a source section, extend the renderer or add an optional structured field rather than dropping the section.
- Before publication, compare the website data against the authoritative source section by section and record the result in `SOURCE-FIDELITY-AUDIT.md`.

## Required metadata

Every published entry needs:

- `id`: permanent lowercase identifier using hyphens
- `type`: Study, Devotional, Article, Guide, Resource, Podcast, Game, or another existing type
- `title`: public title
- `description`: one clear sentence
- `url`: internal page URL
- `category`: primary ministry grouping
- `series`: collection or journey name when applicable
- `scripture`: array of Scripture references
- `book`: primary Bible book or `Various`
- `topics`: lowercase discovery terms
- `audience`: intended readers or ministry users
- `featured`: `true` only for intentionally featured resources
- `status`: `draft` or `published`
- `publishedAt`: `YYYY-MM-DD`
- `updatedAt`: `YYYY-MM-DD`

Studies should also include `difficulty` and `duration` in minutes.

## Publishing rules

- Keep the `id` stable after publication because favorites and saved progress may depend on it.
- Use one canonical URL for each resource.
- Do not publish duplicate entries for the same page unless they represent meaningfully different resources.
- Add accurate Scripture and topic metadata rather than broad filler terms.
- Mark unfinished pages as `draft` so they do not appear in generated discovery areas.
- External links must open safely with `target="_blank"` and `rel="noopener noreferrer"`.
- Do not place private counseling notes, names, medical details, safeguarding reports, or other sensitive personal information into public resources or browser storage.

## Offline behavior

The service worker installs the application shell and major ministry hubs. Other pages are cached after a visitor opens them. Add a new page to the core cache only when it must work offline immediately after installation without first being visited.

## Release checklist

- Page title and description are accurate.
- One visible H1 is present.
- Heading levels are in order.
- Images have meaningful alt text or an empty alt attribute when decorative.
- Links and buttons work by keyboard.
- The page has no horizontal overflow on phone or tablet.
- Search finds the new entry by title, Scripture, and topic.
- The generated site-map index includes the new entry.
- Related content is relevant.
- Imported studies have been checked against their authoritative source for complete text and Scripture references.
- Print output is checked when applicable.
- Automated audits pass before merge.
