import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const failures=[];
const passes=[];
const check=(ok,pass,fail)=>ok?passes.push(pass):failures.push(fail);
const browser=await chromium.launch({headless:true});

try{
  const desktop=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await desktop.newPage();
  let response=await page.goto(`${BASE_URL}/studies.html`,{waitUntil:'networkidle',timeout:30000});
  check(response&&response.status()<400,'Study library loads on desktop.','Study library did not load on desktop.');
  await page.waitForSelector('.study-card[data-study-id]',{state:'visible',timeout:12000});
  await page.waitForFunction(()=>document.querySelector('.study-card .study-listing-details'));
  const studyMeta=await page.evaluate(()=>{
    const cards=[...document.querySelectorAll('.study-card[data-study-id]')];
    const direct=cards.find(card=>/Audience:/.test(card.textContent||'')&&/Sessions:/.test(card.textContent||''));
    const walking=cards.find(card=>String(card.dataset.studyId||'').startsWith('walking-with-jesus-week-'));
    const allText=cards.map(card=>card.textContent||'').join('\n');
    return{directText:direct?.textContent||'',walkingText:walking?.textContent||'',allText};
  });
  check(/Audience:/.test(studyMeta.directText)&&/Sessions:/.test(studyMeta.directText)&&/Length:/.test(studyMeta.directText),'Study cards show audience, session count, and lesson length before opening.','Study cards are missing audience/session/length details.');
  check(/Est\./.test(studyMeta.allText),'Numeric lesson times are clearly labeled as estimates.','Numeric lesson times are not labeled as estimates.');
  check(!/45 minutes/.test(studyMeta.walkingText)&&/Length: not specified/.test(studyMeta.walkingText),'Missing Walking with Jesus duration is not replaced with an invented 45-minute value.','A missing duration still falls back to an invented time.');
  check(/Materials: participant \+ leader/.test(studyMeta.allText),'Direct lessons advertise participant/leader materials only through verified shared print support.','Verified participant/leader materials are not surfaced.');

  await page.evaluate(()=>{
    localStorage.setItem('nldg-study-state',JSON.stringify({secretNotes:'PRIVATE-STUDY-NOTE-SENTINEL'}));
    localStorage.setItem('nldg-lesson-reflections-v1',JSON.stringify({secretReflection:'PRIVATE-REFLECTION-SENTINEL'}));
  });
  const feedback=await page.evaluate(()=>document.querySelector('[data-page-feedback]')?.href||'');
  check(/contact\.html\?from=/.test(feedback)&&/studies\.html/.test(feedback),'Feedback link includes the originating page.','Feedback link does not preserve the originating page.');
  check(!feedback.includes('PRIVATE-STUDY-NOTE-SENTINEL')&&!feedback.includes('PRIVATE-REFLECTION-SENTINEL'),'Feedback link does not attach private notes or reflections.','Feedback link leaked private local data.');

  response=await page.goto(feedback,{waitUntil:'networkidle',timeout:30000});
  check(response&&response.status()<400,'Contextual Contact & Feedback page loads.','Contextual Contact & Feedback page did not load.');
  const feedbackMail=await page.evaluate(()=>({href:document.querySelector('#website-feedback a[href^="mailto:"]')?.href||'',text:document.querySelector('#website-feedback')?.textContent||''}));
  check(/team@nolabelsdesignedbygod\.org/.test(feedbackMail.href)&&/studies\.html/.test(decodeURIComponent(feedbackMail.href)),'Website feedback reuses the verified ministry email and includes the page URL.','Website feedback did not use the verified email/page context.');
  check(!feedbackMail.href.includes('PRIVATE-STUDY-NOTE-SENTINEL')&&!feedbackMail.href.includes('PRIVATE-REFLECTION-SENTINEL'),'Contextual feedback email excludes private local data.','Contextual feedback email leaked private data.');

  await page.goto(`${BASE_URL}/new-believers.html`,{waitUntil:'networkidle',timeout:30000});
  await page.waitForSelector('.start-here-choice-guide',{state:'visible',timeout:10000});
  const startGuide=await page.evaluate(()=>({cards:document.querySelectorAll('.start-here-choice-grid article').length,text:document.querySelector('.start-here-choice-guide')?.textContent||'',nav:Boolean([...document.querySelectorAll('a')].find(a=>a.textContent.trim()==='Start Here'))}));
  check(startGuide.cards===3&&/Devotionals/.test(startGuide.text)&&/Personal Bible study/.test(startGuide.text)&&/Group resources/.test(startGuide.text),'Start Here offers devotional, personal-study, and group-resource paths.','Start Here chooser is incomplete.');
  check(startGuide.nav,'Existing Start Here discovery link remains easy to find.','Existing Start Here navigation was lost.');

  await page.goto(`${BASE_URL}/study-identity.html`,{waitUntil:'networkidle',timeout:30000});
  await page.waitForSelector('.related-content',{state:'visible',timeout:12000});
  const related=await page.evaluate(()=>{
    const section=document.querySelector('.related-content');
    const links=[...section.querySelectorAll('a[href]')].map(a=>a.href);
    const current=location.href;
    const api=window.NLDG_LIBRARY_API;
    const currentItem=window.NLDG_LIBRARY.find(item=>item.id==='identity');
    window.NLDG_LIBRARY.push({id:'audit-draft',type:'Study',title:'AUDIT DRAFT',description:'audit',url:'draft-audit.html',topics:['identity'],status:'review'});
    window.NLDG_LIBRARY.push({id:'audit-future',type:'Study',title:'AUDIT FUTURE',description:'audit',url:'future-audit.html',topics:['identity'],status:'published',publishedAt:'2999-01-01'});
    const filtered=api.related(currentItem,20).map(item=>item.id);
    window.NLDG_LIBRARY.pop();window.NLDG_LIBRARY.pop();
    return{links,current,filtered,text:section.textContent||'',publicTitles:(window.NLDG_CONTENT||[]).map(item=>item.title)};
  });
  check(related.links.length>0&&!related.links.includes(related.current),'Related resources render and exclude the current page.','Related resources are missing or include the current page.');
  check(!related.filtered.includes('audit-draft')&&!related.filtered.includes('audit-future'),'Related-resource filtering excludes review and future releases.','Related-resource filtering exposed review/future content.');
  check(!related.publicTitles.some(title=>/Respecting Boundaries|Way, Truth, and Life/i.test(title)),'Under-review studies remain unpublished.','An under-review study appeared in public content.');
  for(const href of related.links){const result=await page.request.get(href);check(result.status()<400,`Related link resolves: ${new URL(href).pathname}${new URL(href).search}`,`Broken related link: ${href}`);}
  await desktop.close();

  const mobile=await browser.newContext({viewport:{width:390,height:844}});
  const mobilePage=await mobile.newPage();
  await mobilePage.goto(`${BASE_URL}/new-believers.html`,{waitUntil:'networkidle',timeout:30000});
  await mobilePage.waitForSelector('.start-here-choice-guide',{state:'visible',timeout:10000});
  const mobileFit=await mobilePage.evaluate(()=>{const nodes=[document.querySelector('.start-here-choice-guide'),document.querySelector('.start-here-choice-grid')].filter(Boolean);return nodes.every(node=>{const rect=node.getBoundingClientRect();return rect.left>=-1&&rect.right<=innerWidth+1&&node.scrollWidth<=node.clientWidth+1;});});
  check(mobileFit,'Start Here chooser fits a 390px phone viewport.','Start Here chooser overflows a 390px phone viewport.');

  await mobilePage.goto(`${BASE_URL}/es/empezar.html`,{waitUntil:'networkidle',timeout:30000});
  await mobilePage.waitForSelector('.start-here-choice-guide',{state:'visible',timeout:10000});
  const spanishGuide=await mobilePage.evaluate(()=>({text:document.querySelector('.start-here-choice-guide')?.textContent||'',feedback:document.querySelector('[data-page-feedback]')?.href||'',fits:document.documentElement.scrollWidth<=innerWidth+1}));
  check(/Devocionales/.test(spanishGuide.text)&&/Estudio bíblico personal/.test(spanishGuide.text)&&/Recursos para grupos/.test(spanishGuide.text),'Spanish Start Here follows the same three-path convention.','Spanish Start Here chooser is incomplete.');
  check(/es\/contacto\.html\?from=/.test(spanishGuide.feedback),'Spanish pages provide contextual feedback through the existing Spanish contact page.','Spanish contextual feedback link is missing.');
  check(spanishGuide.fits,'Spanish Start Here page fits a 390px phone viewport.','Spanish Start Here page overflows mobile.');
  await mobile.close();
}finally{await browser.close();}

console.log(`# Discovery & Feedback Browser Audit\n\nResult: ${failures.length?'FAILED':'PASSED'}\n\n${passes.map(item=>`PASS: ${item}`).join('\n')}${failures.length?`\n\n${failures.map(item=>`FAIL: ${item}`).join('\n')}`:''}`);
if(failures.length)process.exitCode=1;
