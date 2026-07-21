# NLDG Version 0.9.0 Native Sprint 2

This creates one replacement `games.html`. It does not require `sprint2.js`.

## Easiest method on iPad or computer

1. Open `build-v0.9.0.html` in a browser.
2. Select the current `games.html` from the GitHub repository.
3. Press **Build games-v0.9.0.html**.
4. Rename the created file to `games.html`.
5. Replace the repository's existing `games.html`.

## Command-line method

Place the current `games.html` beside `build_native_v0_9.py`, then run:

`python build_native_v0_9.py games.html games-v0.9.0.html`

Rename the result to `games.html` and upload it.

## Sprint 2 features embedded natively

- Next Team host control
- Automatic or manual team rotation
- Live rankings
- Jeopardy advancement
- Tournament summary
- Round history
- N shortcut for Next Team
- Shift+R shortcut for Tournament Summary

The builder removes an earlier `<script src="sprint2.js"></script>` line automatically if present.
