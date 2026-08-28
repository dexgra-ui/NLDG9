(()=>{
  const e=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const list=items=>`<ul>${(items||[]).map(x=>`<li>${e(x)}</li>`).join('')}</ul>`;
  const p=new URLSearchParams(location.search);
  const key=p.get('week')||'1';
  const lesson=/^\d+$/.test(key)?NLDG_WALKING_WITH_JESUS_API.byNumber(key):NLDG_WALKING_WITH_JESUS_API.bySlug(key);
  const root=document.getElementById('walking-with-jesus-root');
  if(!lesson){root.innerHTML='<section class="wj-hero"><h1>Lesson not found</h1><a class="button primary" href="walking-with-jesus.html">Return to the collection</a></section>';return;}
  document.body.dataset.studyPage=`walking-with-jesus-week-${lesson.number}`;
  document.body.dataset.studyTitle=lesson.title;
  document.title=`${lesson.title} | Walking with Jesus`;
  const previous=NLDG_WALKING_WITH_JESUS_API.byNumber(lesson.number-1),next=NLDG_WALKING_WITH_JESUS_API.byNumber(lesson.number+1);
  const supporting=lesson.supporting?.length?`<p><strong>Supporting Scripture:</strong> ${lesson.supporting.map(e).join(' · ')}</p>`:'';
  const context=lesson.context?.length?`<section class="wj-block"><p class="kicker">Context in plain English</p><h2>See the passage in its larger story</h2>${lesson.context.map(x=>`<p>${e(x)}</p>`).join('')}</section>`:'';
  const jesus=lesson.jesusConnection?`<section class="wj-block wj-highlight"><p class="kicker">Jesus connection</p><h2>Keep the center of the lesson clear</h2><p>${e(lesson.jesusConnection)}</p></section>`:'';
  const distinctions=lesson.distinctions?.length?`<section class="wj-block"><p class="kicker">Don’t confuse these</p><h2>Helpful distinctions</h2>${list(lesson.distinctions)}</section>`:'';
  const leader=lesson.leaderNote?`<details class="wj-block"><summary><strong>Leader depth note</strong></summary><p>${e(lesson.leaderNote)}</p></details>`:'';
  root.innerHTML=`
<section class="wj-hero"><p class="kicker">Walking with Jesus • Week ${lesson.number} of 21</p><h1>${e(lesson.title)}</h1><p class="lead">${e(lesson.bigQuestion)}</p><div class="wj-meta"><span>📖 ${e(lesson.scripture)}</span><span>Study at your own pace</span></div></section>
<div class="wj-layout"><article class="wj-study-content">
<section class="wj-block wj-highlight"><h2>Begin with Scripture</h2><p>Read <strong>${e(lesson.scripture)}</strong> before watching any scene. Ask: What does this text reveal about Jesus?</p>${supporting}<p>${e(lesson.focus)}</p></section>
${context}
<section class="wj-block"><h2>Suggested lesson flow</h2><ol class="wj-timeline"><li><strong>Welcome and connect</strong></li><li><strong>Read and observe Scripture</strong></li><li><strong>Explore the biblical teaching</strong></li><li><strong>Introduce, watch, and check the visual</strong></li><li><strong>Discuss and apply</strong></li><li><strong>Reflect, pray, and choose a next step</strong></li></ol><p>Use the entire flow or select the sections that serve your setting. Individuals and groups may move at their own pace.</p></section>
<section class="wj-block"><h2>Core truths</h2>${list(lesson.truths)}</section>
${jesus}${distinctions}
<section class="wj-block wj-scene"><p class="kicker">Optional visual discussion aid</p><h2>${e(lesson.episode)}</h2><p>${e(lesson.scene.summary)}</p><dl><dt>Start cue</dt><dd>${e(lesson.scene.start)}</dd><dt>Stop cue</dt><dd>${e(lesson.scene.stop)}</dd><dt>Estimated clip</dt><dd>${e(lesson.scene.length)}</dd><dt>Biblical connection</dt><dd>${e(lesson.scene.biblical)}</dd><dt>Creative elements</dt><dd>${e(lesson.scene.creative)}</dd><dt>Scripture check</dt><dd>${e(lesson.scene.check)}</dd></dl></section>
${leader}
<section class="wj-block"><h2>Discuss</h2><ol>${lesson.questions.map(x=>`<li>${e(x)}</li>`).join('')}</ol></section>
<section class="wj-block wj-highlight"><h2>Live it this week</h2><p><strong>${e(lesson.application)}</strong></p><p>Memory verse: <strong>${e(lesson.memory)}</strong></p></section>
<section class="wj-block wj-prayer"><h2>Prayer</h2><p>${e(lesson.prayer)}</p></section>
<p class="wj-rights"><em>The Chosen</em> is an optional discussion aid, not a replacement for Scripture. No video is hosted here. All program rights belong to their respective owners; this study is not affiliated with or endorsed by the production.</p><div class="wj-actions">${previous?`<a class="button secondary" href="walking-with-jesus-study.html?week=${previous.number}">← Week ${previous.number}</a>`:'<a class="button secondary" href="walking-with-jesus.html">← Collection</a>'}<button class="button secondary" onclick="print()">Print Lesson</button>${next?`<a class="button primary" href="walking-with-jesus-study.html?week=${next.number}">Week ${next.number} →</a>`:'<a class="button primary" href="walking-with-jesus.html">Collection Home</a>'}</div></article>
<aside class="wj-side"><div><strong>Big question</strong><p>${e(lesson.bigQuestion)}</p></div><div><strong>Important order</strong><ol><li>Read the Bible.</li><li>Watch the selected scene.</li><li>Compare the scene with the text.</li></ol></div><div><strong>Memory verse</strong><p>${e(lesson.memory)}</p></div></aside></div>`;
})();
