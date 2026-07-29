(()=>{
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const params=new URLSearchParams(location.search);
const requested=params.get('study')||'1';
const study=/^\d+$/.test(requested)?window.NLDG_LEADERSHIP_API.byNumber(requested):window.NLDG_LEADERSHIP_API.bySlug(requested);
const root=document.getElementById('leadership-study-root');
if(!study){
 document.title='Study Not Found | Leadership';
 root.innerHTML='<section class="ld-study-hero"><p class="study-label">Leadership</p><h1>Study not found</h1><p class="lead">Return to the Leadership Center and choose one of the ten available studies.</p><div class="actions"><a class="button primary" href="leadership.html">Open the Journey</a></div></section>';
 return;
}
document.body.dataset.studyPage=study.id;
document.body.dataset.studyTitle=study.title;
document.title=`${study.title} | Leadership`;
const sectionHtml=study.sections.map(section=>`<section class="ld-block"><h2>${escapeHtml(section.title)}</h2>${section.paragraphs.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('');
const reflectionHtml=study.reflection.map(prompt=>`<label>${escapeHtml(prompt)}<textarea rows="3"></textarea></label>`).join('');
const practicesHtml=study.practices.map(item=>`<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>`).join('');
const prayerHtml=study.prayer.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('');
const previous=study.previous?window.NLDG_LEADERSHIP_API.bySlug(study.previous):null;
const next=study.next?window.NLDG_LEADERSHIP_API.bySlug(study.next):null;
root.innerHTML=`
<section class="ld-study-hero page-hero"><p class="study-label">Leadership • Study ${study.number} of 10</p><h1>${escapeHtml(study.title)}</h1><p class="lead">${escapeHtml(study.lead)}</p><div class="ld-study-meta"><span>📖 ${escapeHtml(study.primary)}</span><span>Supporting: ${escapeHtml(study.supporting)}</span><span>45–60 minutes</span><span>${escapeHtml(study.theme)}</span></div></section>
<div class="ld-study-layout"><article class="ld-study-content">
<section class="ld-block ld-highlight"><h2>Central biblical truth</h2><p><strong>${escapeHtml(study.central)}</strong></p></section>
<section class="ld-block"><h2>Study introduction</h2>${study.intro.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</section>
<section class="ld-block"><h2>Scripture focus</h2><p>Read <strong>${escapeHtml(study.primary)}</strong>. Then consider the supporting passages: <strong>${escapeHtml(study.supporting)}</strong>.</p><p>Notice what the text reveals about Jesus, character, authority, service, responsibility, accountability, wisdom, and the good of people.</p></section>
${sectionHtml}
<section class="ld-block"><h2>Conversation questions</h2><ol>${study.questions.map(question=>`<li>${escapeHtml(question)}</li>`).join('')}</ol></section>
<section class="ld-block"><h2>Pause and consider</h2><div class="ld-reflection-fields">${reflectionHtml}</div></section>
<section class="ld-block"><h2>Lead faithfully this week</h2>${practicesHtml}</section>
<section class="ld-block ld-prayer"><h2>Prayer</h2>${prayerHtml}</section>
<section class="ld-block ld-warning"><h2>Leader and mentor notes</h2><h3>Main objective</h3><p>${escapeHtml(study.leaderObjective)}</p><h3>Safeguard</h3><p>${escapeHtml(study.caution)}</p><h3>Avoid</h3><ul>${study.avoid.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h3>Suggested closing question</h3><p><strong>What is one Christlike and accountable next step you can take from this study?</strong></p></section>
${study.number===10?'<section class="ld-block ld-highlight"><h2>Journey completion</h2><p>You have completed the ten-study Leadership journey. Completion is not a claim of mastery. It is a commitment to keep leading under Christ through character, service, Scripture, accountability, healthy limits, and the development of others.</p><p>Remain teachable, welcome correction, strengthen safeguards, and prepare others to serve faithfully.</p><div class="actions"><a class="button primary" href="leadership.html">Review the Complete Journey</a><a class="button secondary" href="studies.html">Explore More Bible Studies</a></div></section>':''}
<div class="lesson-actions ld-actions">${previous?`<a class="button secondary" href="leadership-study.html?study=${previous.number}">← Study ${previous.number}</a>`:'<a class="button secondary" href="leadership.html">← Journey Home</a>'}<button class="button secondary" type="button" onclick="window.print()">Print Study</button>${next?`<a class="button primary" href="leadership-study.html?study=${next.number}">Next Study →</a>`:'<a class="button primary" href="leadership.html">Leadership Center</a>'}</div>
</article><aside class="ld-study-side"><div class="ld-side-card"><strong>Study purpose</strong><p>${escapeHtml(study.central)}</p></div><div class="ld-side-card"><strong>Use this study for</strong><ul><li>Personal formation</li><li>Leadership teams</li><li>Mentoring and coaching</li><li>Classes and retreats</li></ul></div><div class="ld-side-card"><strong>Leadership posture</strong><p>Remain under Christ, welcome truth, protect people, share responsibility, and refuse secrecy or domination.</p></div><div class="ld-side-card"><strong>${next?'Next in the journey':'Continue growing'}</strong><p>${next?`Study ${next.number}: ${escapeHtml(next.title)}`:'Continue in Scripture, accountability, healthy community, and the development of others.'}</p></div></aside></div>`;
})();
