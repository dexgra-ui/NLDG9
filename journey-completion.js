(function(){
  const series=window.NLDG_CURRENT_EVENTS_SERIES;
  if(!series?.lessons?.length)return;
  const key=`nldg-series-${series.id}`;
  let state={completed:[]};
  try{state=JSON.parse(localStorage.getItem(key)||'{"completed":[]}')}catch{}
  const available=series.lessons.filter(item=>item.status==='complete');
  const completed=new Set(state.completed||[]);
  const finished=available.length===series.lessons.length&&available.every(item=>completed.has(item.week));
  if(finished){
    try{
      localStorage.setItem('nldg-achievement-faith-truth-graduate',JSON.stringify({earned:true,earnedAt:Date.now(),title:'Faith & Truth Graduate'}));
    }catch{}
  }
  const view=document.getElementById('series-view');
  if(!view||new URLSearchParams(location.search).has('week'))return;
  const panel=document.createElement('section');
  panel.className=`journey-completion ${finished?'is-earned':'is-locked'}`;
  panel.innerHTML=finished?`<div class="completion-seal" aria-hidden="true">✓</div><div><p class="kicker">Journey complete</p><h2>Congratulations! You completed Faith &amp; Truth in Today’s World.</h2><p>You finished all 42 lessons and earned the <strong>Faith &amp; Truth Graduate</strong> achievement. Keep standing in truth, grace, and hope.</p><div class="completion-actions"><button class="button primary" id="print-certificate" type="button">Print Certificate</button><a class="button secondary" href="studies.html">Choose Another Journey</a></div></div><article class="completion-certificate" id="completion-certificate"><small>Certificate of Completion</small><h3>Faith &amp; Truth in Today’s World</h3><p>This certifies the completion of the 42-week discipleship journey from No Labels, Designed by God.</p><strong>Faith &amp; Truth Graduate</strong><span>${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span></article>`:`<div class="completion-seal" aria-hidden="true">42</div><div><p class="kicker">Complete journey available</p><h2>All 42 lessons are ready.</h2><p>This flagship discipleship journey is now fully published. Complete each lesson to unlock the Faith &amp; Truth Graduate achievement and printable certificate.</p></div>`;
  view.prepend(panel);
  document.getElementById('print-certificate')?.addEventListener('click',()=>window.print());
})();