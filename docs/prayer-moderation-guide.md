# Prayer Center Moderation Guide

This guide governs prayer requests received through the No Labels, Designed by God Prayer Center.

## Core rule

A submitted request is **not public by default**. A request may appear on the public Prayer Wall only when the submitter explicitly selected public sharing and the request has been reviewed for privacy and safety.

## Lifecycle

Use this care flow for each request:

**New → Reviewed → Active → Prayed For → Follow-Up → Answered / Closed**

- **New:** Request arrived in the ministry prayer-care inbox.
- **Reviewed:** Visibility permission and safety/privacy have been checked.
- **Active:** Approved public request is on the Prayer Wall, or private request is actively being held in prayer.
- **Prayed For:** A ministry prayer-team member has personally prayed for the request.
- **Follow-Up:** An update, clarification, or pastoral check-in is appropriate and available.
- **Answered:** Submitter provided an answered-prayer update or asked for the request to be marked answered.
- **Closed:** Request no longer needs active handling, was withdrawn, could not be safely published, or reached the ministry's retention endpoint.

## Unprayed Requests queue

No approved request should quietly sit without ministry attention. Maintain a simple internal list of **Reviewed/Active requests that have not yet been prayed for by a designated prayer-care person**. Clear this queue before treating public reactions as evidence that a request has received care.

The public "I prayed for this" control is intentionally device-local in the static-site version. It is an encouragement to pray, not a verified global prayer count and not a substitute for the ministry prayer-care workflow.

## Public-sharing checklist

Before publishing, confirm all of the following:

1. The sender explicitly permitted public sharing.
2. The request does not include an email address, phone number, home/work/school address, account number, Social Security number, medical record, or other sensitive identifier.
3. Third parties are not unnecessarily identifiable. Remove surnames and identifying combinations of details.
4. Minors are not personally identifiable. Use broad relationship language such as "my child" or "a young person in our family" when appropriate.
5. The request does not publish an allegation or accusation against an identifiable person or organization.
6. Graphic details involving violence, abuse, sexual content, self-harm, or medical trauma are not published.
7. The request does not ask readers for money, transportation, housing, employment, legal representation, direct contact, products, or other services.
8. The request does not contain spam, harassment, threats, hate, impersonation, or attempts to move readers into private contact.
9. The public version contains only what people need in order to pray.
10. The title is brief and non-identifying.

If a request can be made safe by shortening or redacting it, do so without changing its meaning. If not, keep it off the public wall and, when appropriate, let the submitter know it can still be held privately in prayer.

## Spanish Prayer Wall translations

The English-approved public request remains the canonical moderation record. A reviewed Spanish display translation may be added under the optional `es` field in `prayer-wall-data.js` only after the English public version has already passed the checklist above.

- Translate only the already-approved public title, display name, category, request, and answered update.
- Do not add context, explanation, identifying details, medical detail, names, locations, or other information that is not present in the approved public version.
- Preserve the meaning and tone of the approved request rather than embellishing it.
- Apply the same privacy and safety review to the Spanish display text before publishing it.
- If a safe reviewed translation is not available yet, the Spanish Prayer Center may show the approved English text and clearly identify it as original English text.
- A Spanish translation never changes the submitter's original sharing permission or creates a second public request.

## Private requests

Private requests are never copied into `prayer-wall-data.js`. Keep private requests in the designated ministry prayer-care channel only. Do not forward them beyond people who genuinely need access for prayer care or safety response.

## Immediate-danger or crisis language

The Prayer Center is not an emergency or professional-care service. If a message suggests that someone may be in immediate danger, do not publish it. Prioritize an appropriate safety response using the information actually available and encourage the sender to contact local emergency services or a qualified local professional. Do not attempt to provide medical, legal, financial, or mental-health treatment through the Prayer Wall.

## Abuse, threats, or allegations

Do not publish identifying allegations, confessions describing crimes in detail, threats, doxxing, or content that could expose another person to retaliation or harassment. Preserve only what is reasonably needed for ministry handling and legal/safety obligations.

## Answered-prayer updates

An update is not automatically permission to publish. Confirm whether the submitter permits the update to be shared publicly. Apply the same privacy review to the update as to the original request.

When an approved public request is answered, set its status to `Answered`, add a privacy-reviewed `answeredUpdate`, and add `answeredAt` in `prayer-wall-data.js`. Do not reveal new identifying details in the update.

## Removal and correction

Honor reasonable requests to correct, anonymize, or remove a public prayer request. When identity needs to be verified, use the original email thread when possible. Remove public content promptly when privacy or safety concerns outweigh continued publication.

## Data minimization

Collect and keep only what is needed for prayer care, moderation, follow-up, security, or legal obligations. Do not create public archives of private submissions. Follow the published Privacy Policy for retention and deletion requests.

## Technical boundary of the current version

The website is hosted as a static site. Requests are composed in the visitor's email application and sent to `team@nolabelsdesignedbygod.org`; the site does not directly write submissions to a public database. Approved public requests are added manually to `prayer-wall-data.js` after moderation.

A future authenticated backend may provide a true global "I prayed" count and internal prayer-team dashboard. Until then, do not represent device-local prayer acknowledgements as a global count.
