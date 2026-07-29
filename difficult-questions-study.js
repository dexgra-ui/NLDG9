(()=>{
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const params=new URLSearchParams(location.search);
const requested=params.get('study')||'1';
const study=/^\d+$/.test(requested)?window.NLDG_DIFFICULT_QUESTIONS_API.byNumber(requested):window.NLDG_DIFFICULT_QUESTIONS_API.bySlug(requested);
const root=document.getElementById('difficult-questions-study-root');
if(!study){
 document.title='Study Not Found | Difficult Questions';
 root.innerHTML='<section class="dq-study-hero"><p class="study-label">Difficult Questions</p><h1>Study not found</h1><p class="lead">Return to the Difficult Questions Center and choose one of the ten available studies.</p><div class="actions"><a class="button primary" href="difficult-questions.html">Open the Journey</a></div></section>';
 return;
}
document.body.dataset.studyPage=study.id;
document.body.dataset.studyTitle=study.title;
document.title=`${study.title} | Difficult Questions`;
const sectionHtml=study.sections.map(section=>`<section class="dq-block"><h2>${escapeHtml(section.title)}</h2>${section.paragraphs.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('');
const reflectionHtml=study.reflection.map(prompt=>`<label>${escapeHtml(prompt)}<textarea rows="3"></textarea></label>`).join('');
const practicesHtml=study.practices.map(item=>`<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>`).join('');
const prayerHtml=study.prayer.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('');
const previous=study.previous?window.NLDG_DIFFICULT_QUESTIONS_API.bySlug(study.previous):null;
const next=study.next?window.NLDG_DIFFICULT_QUESTIONS_API.bySlug(study.next):null;
const relatedHtml=study.related?`<section class="dq-block dq-highlight"><h2>Continue the conversation</h2><p>${escapeHtml(study.related.text)}</p><a class="button secondary" href="${escapeHtml(study.related.url)}">${escapeHtml(study.related.title)} →</a></section>`:'';
root.innerHTML=`
<section class="dq-study-hero page-hero"><p class="study-label">Difficult Questions • Study ${study.number} of 10</p><h1>${escapeHtml(study.title)}</h1><p class="lead">${escapeHtml(study.lead)}</p><div class="dq-study-meta"><span>📖 ${escapeHtml(study.primary)}</span><span>Supporting: ${escapeHtml(study.supporting)}</span><span>45–60 minutes</span><span>${escapeHtml(study.theme)}</span></div></section>
<div class="dq-study-layout"><article class="dq-study-content">
<section class="dq-block dq-highlight"><h2>Central biblical truth</h2><p><strong>${escapeHtml(study.central)}</strong></p></section>
<section class="dq-block"><h2>Study introduction</h2>${study.intro.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</section>
<section class="dq-block"><h2>Scripture focus</h2><p>Read <strong>${escapeHtml(study.primary)}</strong>. Then consider the supporting passages: <strong>${escapeHtml(study.supporting)}</strong>.</p><p>Notice what the text reveals about God, Jesus, human dignity, truth, grace, responsibility, hope, and faithful action.</p></section>
${sectionHtml}
<section class="dq-block dq-difference"><h2>Where Christians differ</h2><p>${escapeHtml(study.difference)}</p></section>
<section class="dq-block"><h2>Conversation questions</h2><ol>${study.questions.map(question=>`<li>${escapeHtml(question)}</li>`).join('')}</ol></section>
<section class="dq-block"><h2>Pause and consider</h2><div class="dq-reflection-fields">${reflectionHtml}</div></section>
<section class="dq-block"><h2>Live it this week</h2>${practicesHtml}</section>
${relatedHtml}
<section class="dq-block dq-prayer"><h2>Prayer</h2>${prayerHtml}</section>
<section class="dq-block dq-care-note"><h2>Leader and mentor notes</h2><h3>Main objective</h3><p>${escapeHtml(study.leaderObjective)}</p><h3>Care note</h3><p>${escapeHtml(study.caution)}</p><h3>Avoid</h3><ul>${study.avoid.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h3>Suggested closing question</h3><p><strong>What is one honest and faithful next step you can take from this study?</strong></p></section>
${study.number===10?'<section class="dq-block dq-highlight"><h2>Journey completion</h2><p>You have completed the ten-study Difficult Questions journey. Completion does not mean every mystery is solved. It means you have practiced bringing questions to Scripture, Jesus, wise community, prayer, humility, and faithful action.</p><p>Continue learning, remain open to correction, and keep following Christ with conviction and grace.</p><div class="actions"><a class="button primary" href="difficult-questions.html">Review the Complete Journey</a><a class="button secondary" href="studies.html">Explore More Bible Studies</a></div></section>':''}
<div class="lesson-actions dq-actions">${previous?`<a class="button secondary" href="difficult-questions-study.html?study=${previous.number}">← Study ${previous.number}</a>`:'<a class="button secondary" href="difficult-questions.html">← Journey Home</a>'}<button class="button secondary" type="button" onclick="window.print()">Print Study</button>${next?`<a class="button primary" href="difficult-questions-study.html?study=${next.number}">Next Study →</a>`:'<a class="button primary" href="difficult-questions.html">Difficult Questions Center</a>'}</div>
</article><aside class="dq-study-side"><div class="dq-side-card"><strong>Study purpose</strong><p>${escapeHtml(study.central)}</p></div><div class="dq-side-card"><strong>Use this study for</strong><ul><li>Personal reflection</li><li>One-to-one conversation</li><li>Small groups and classes</li><li>Mentoring and outreach</li></ul></div><div class="dq-side-card"><strong>Conversation posture</strong><p>Listen carefully, avoid pressure, state limits honestly, and keep Jesus at the center.</p></div><div class="dq-side-card"><strong>${next?'Next in the journey':'Continue growing'}</strong><p>${next?`Study ${next.number}: ${escapeHtml(next.title)}`:'Remain connected to Scripture, prayer, Christian community, and continued learning.'}</p></div></aside></div>`;
})();
