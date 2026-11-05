# Scripture or Suspicion QA

## Implementation scope
- Preserve all 80 question IDs and answer classifications.
- Add concise explanations to both General Bible question packs.
- Strengthen references for the five identified editorial review items.
- Preserve explanation metadata in the shared game-pack engine.
- Use filtered unused-question statistics.
- Never use fallback questions for an empty valid selection.
- Confirm shorter rounds rather than silently truncating them.
- Improve answer feedback and keyboard focus.

## Required verification before merge
- Run `node scripts/scripture-or-suspicion-audit.mjs`.
- Run `node scripts/game-pack-audit.mjs`.
- Test 5, 10, 15, 20 and 25-question rounds with constrained filters.
- Test no matching questions, missing packs, double-click scoring, solo and team play.
- Test keyboard and screen-reader flows, iOS Safari and desktop browsers.
- Review all 80 teaching explanations for theological and age appropriateness.
- Confirm other games using the shared engine remain functional.

## Known limitations
- No automatic Bible text verification; editorial review is required.
- Browser session resume is out of scope.
- Scripture reference display remains plain text; deep links are not yet implemented.
- Automated static checks do not replace browser QA.
