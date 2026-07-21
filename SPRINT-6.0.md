# Sprint 6.0 — Growing Together

## Theme
Community and discipleship groups centered on mutual encouragement, Scripture, prayer, mentoring, and family formation.

## Delivered
- My Groups dashboard and local group creation
- Small-group types and privacy settings
- Mentoring relationships and assigned next steps
- Walk With Me shared discipleship journeys
- Family Hub with household members and shared plans
- Shared reading plans with daily completion
- Group prayer wall and answered-prayer tracking
- Scripture-centered discussion board with leader pin and lock controls
- Leader dashboard with follow-up and meeting summaries
- Expanded community growth view for Scripture, prayer, discipleship, service, and community
- Offline local persistence
- Backend-ready data model for future real accounts, invitations, members, messaging, notifications, classrooms, and multi-device sync

## Architecture boundary
The current GitHub Pages application has no protected backend. Sprint 6.0 therefore provides a functional local-device community preview and data model. It does not claim that invitations reach other people, that members are authenticated, or that group data syncs across devices. Real multi-user community features require secure authentication, authorization, database storage, moderation, privacy controls, and notification services.
