# Bible Game Pack Authoring

Game packs register themselves through `window.NLDG_GAME_PACKS.register()`.

## Required pack fields

- `id`: permanent lowercase identifier
- `name`: public pack name
- `version`: semantic version
- `games`: supported game identifiers
- `audiences`: supported audiences
- `questions`: array of normalized content records

## Required question fields

- `id`: unique within the pack and never reused
- `game`: `scripture-or-suspicion`, `jeopardy`, `wheel`, or `survey`
- `prompt`: public question, clue, statement, or puzzle
- `answer`: string, array, or game-specific answer payload

## Recommended fields

- `category`
- `difficulty`: `easy`, `medium`, `hard`, or `mixed`
- `audience`: array containing `kids`, `teens`, `adults`, `family`, or `mixed`
- `scripture`: supporting biblical reference

## Selection behavior

The shared engine combines enabled packs, filters by game and audience, gives priority to unused and less-played questions, and records play history only in the current browser. A pack’s history can be reset without affecting other packs.

## Publishing rule

Every question must have a stable ID, a verifiable answer, appropriate audience metadata, and a Scripture reference whenever the answer depends on a specific biblical statement.