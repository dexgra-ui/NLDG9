# Sprint 7.1 — Intelligent Bible Study

## Theme
Helping believers study carefully before teaching confidently.

## Delivered
- Curated Scripture and topic index
- Passage movement and historical-setting prompts
- Cross-reference explorer with verification reminders
- Interpretation and application questions
- Topic pathways for faith, grace, prayer, discipleship, justice and mercy, and hope
- Study notebooks saved on the local device
- Handoff to Ministry Tools
- Local link payload for My Journey
- Responsive phone and iPad layout
- Offline caching of the complete study workspace

## Ministry boundary
The application does not include a full licensed Bible text, live AI model, automatic original-language lexicon, authoritative interpretation, or divine guidance. Users are directed to read every passage in a trusted Bible translation, examine context, verify cross-references, pray, and seek accountable Christian leadership.

## Architecture
The study index is stored in `scripture-study-data.js`. It can later be replaced or expanded by an approved content service. Saved notebooks and handoffs currently use browser localStorage.

## Testing
1. Open `ministry-assistant.html`.
2. Explore Mark 4:35-41, Micah 6:8, and James 1:2-8.
3. Explore each topic chip.
4. Build studies in every assistant mode.
5. Save, reopen, export, and delete notebooks.
6. Send a study to Ministry Tools and link one to My Journey.
7. Test desktop, iPad, phone, reload persistence, and offline loading.