# Sprint 7.0 — Ministry Assistant

## Theme
Helping Leaders Prepare

## Purpose
Provide Scripture-centered preparation workflows for Bible study, sermons, lessons, small groups, discipleship, and content discovery while clearly separating biblical text from generated or template-based suggestions.

## Included
- Ministry Assistant home and seven work modes
- Bible study observation and interpretation workflow
- Sermon preparation framework
- Lesson preparation framework
- Small group guide generator
- Grace-centered discipleship coaching path
- No Labels content discovery prompts
- Local saved sessions
- Session export
- Ministry Tools handoff
- Integrity checklist
- Responsive and offline-ready experience

## Safety and ministry boundaries
- The current experience uses deterministic local templates, not a live AI model.
- It does not quote a Bible translation automatically or claim that suggestions are Scripture.
- It does not claim divine revelation, pastoral authority, theological certainty, or professional counseling.
- Users are repeatedly directed to read Scripture in context, pray, verify interpretations, and seek trusted Christian leadership.
- Spiritual growth is encouraged without scores, competition, or claims about a person's holiness.

## Architecture boundary
A future live assistant requires a secure server-side AI gateway, approved biblical and theological sources, citation retrieval, moderation, privacy controls, user authentication, rate limits, cost controls, evaluation, and pastoral safety escalation. API keys must never be placed in the static GitHub Pages client.

## Testing focus
1. Open `ministry-assistant.html` on desktop, phone, and iPad widths.
2. Switch through all seven modes.
3. Build responses for multiple audiences and depth settings.
4. Save, reopen, and delete sessions.
5. Export a response as text.
6. Send an outline to Ministry Tools and confirm the handoff is stored.
7. Reload and confirm saved sessions remain on the same device.
8. Confirm the workspace loads after caching when offline.
