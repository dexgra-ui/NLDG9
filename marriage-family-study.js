(()=>{
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const params=new URLSearchParams(location.search);
const requested=params.get('study')||'1';
const study=/^\d+$/.test(requested)?window.NLDG_MARRIAGE_FAMILY_API.byNumber(requested):window.NLDG_MARRIAGE_FAMILY_API.bySlug(requested);
const root=document.getElementById('marriage-family-study-root');
if(!study){
 document.title='Study Not Found | Marriage & Family';
 root.innerHTML='<section class="mf-study-hero"><p class="study-label">Marriage &amp; Family</p><h1>Study not found</h1><p class="lead">Return to the Marriage &amp; Family Center and choose one of the ten available studies.</p><div class="actions"><a class="button primary" href="marriage-family.html">Open the Journey</a></div></section>';
 return;
}
document.body.dataset.studyPage=study.id;
document.body.dataset.studyTitle=study.title;
document.title=`${study.title} | Marriage & Family`;
const sectionHtml=study.sections.map(section=>`<section class="mf-block"><h2>${escapeHtml(section.title)}</h2>${section.paragraphs.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('');
const reflectionHtml=study.reflection.map(prompt=>`<label>${escapeHtml(prompt)}<textarea rows="3"></textarea></label>`).join('');
const practicesHtml=study.practices.map(item=>`<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>`).join('');
const prayerHtml=study.prayer.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('');
const previous=study.previous?window.NLDG_MARRIAGE_FAMILY_API.bySlug(study.previous):null;
const next=study.next?window.NLDG_MARRIAGE_FAMILY_API.bySlug(study.next):null;
root.innerHTML=`
<section class="mf-study-hero page-hero"><p class="study-label">Marriage &amp; Family • Study ${study.number} of 10</p><h1>${escapeHtml(study.title)}</h1><p class="lead">${escapeHtml(study.lead)}</p><div class="mf-study-meta"><span>📖 ${escapeHtml(study.primary)}</span><span>Supporting: ${escapeHtml(study.supporting)}</span><span>45–60 minutes</span><span>${escapeHtml(study.theme)}</span></div><div class="actions"><a class="button primary" href="marriage-family-study.html?study=${study.number}" aria-current="page">English</a><a class="button secondary" href="matrimonio-familia.html?study=${study.number}">Español</a></div></section>
<div class="mf-study-layout"><article class="mf-study-content">
<section class="mf-block mf-highlight"><h2>Central biblical truth</h2><p><strong>${escapeHtml(study.central)}</strong></p></section>
<section class="mf-block"><h2>Study introduction</h2>${study.intro.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</section>
<section class="mf-block"><h2>Scripture focus</h2><p>Read <strong>${escapeHtml(study.primary)}</strong>. Then consider the supporting passages: <strong>${escapeHtml(study.supporting)}</strong>.</p><p>Notice what the text reveals about God, human dignity, responsibility, love, truth, grace, and faithful action.</p></section>
${sectionHtml}
<section class="mf-block"><h2>Conversation questions</h2><ol>${study.questions.map(question=>`<li>${escapeHtml(question)}</li>`).join('')}</ol></section>
<section class="mf-block"><h2>Pause and consider</h2><div class="mf-reflection-fields">${reflectionHtml}</div></section>
<section class="mf-block"><h2>Live it this week</h2>${practicesHtml}</section>
<section class="mf-block mf-prayer"><h2>Prayer</h2>${prayerHtml}</section>
<section class="mf-block"><h2>Leader and mentor notes</h2><h3>Main objective</h3><p>${escapeHtml(study.leaderObjective)}</p><h3>Important caution</h3><p>${escapeHtml(study.caution)}</p><h3>Avoid</h3><ul>${study.avoid.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h3>Suggested closing question</h3><p><strong>What is one faithful, safe, and practical response you can take from this study?</strong></p></section>
${study.number===10?'<section class="mf-block mf-highlight"><h2>Journey completion</h2><p>You have completed the ten-study Marriage &amp; Family journey. This is a foundation for continued growth, not a declaration that every relationship or household challenge is finished.</p><p>Continue in Scripture, prayer, healthy church community, honest conversation, wise boundaries, practical service, and qualified support where needed.</p><div class="actions"><a class="button primary" href="marriage-family.html">Review the Complete Journey</a><a class="button secondary" href="studies.html">Explore More Bible Studies</a></div></section>':''}
<div class="lesson-actions mf-actions">${previous?`<a class="button secondary" href="marriage-family-study.html?study=${previous.number}">← Study ${previous.number}</a>`:'<a class="button secondary" href="marriage-family.html">← Journey Home</a>'}<button class="button secondary" type="button" onclick="window.print()">Print Study</button>${next?`<a class="button primary" href="marriage-family-study.html?study=${next.number}">Next Study →</a>`:'<a class="button primary" href="marriage-family.html">Marriage &amp; Family Center</a>'}</div>
</article><aside class="mf-study-side"><div class="mf-side-card"><strong>Study purpose</strong><p>${escapeHtml(study.central)}</p></div><div class="mf-side-card"><strong>Use this study for</strong><ul><li>Personal reflection</li><li>Couples or households</li><li>Small groups</li><li>Mentoring and ministry</li></ul></div><div class="mf-side-card"><strong>Grace and safety</strong><p>Grace never requires hiding abuse, ignoring danger, silencing children, or avoiding qualified help.</p></div><div class="mf-side-card"><strong>${next?'Next in the journey':'Continue growing'}</strong><p>${next?`Study ${next.number}: ${escapeHtml(next.title)}`:'Remain connected to Scripture, church community, wise support, and practical service.'}</p></div></aside></div>`;
})();