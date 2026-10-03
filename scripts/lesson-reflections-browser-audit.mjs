import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const STORAGE_KEY='nldg-lesson-reflections-v1';
const failures=[];
const passes=[];
const check=(ok,pass,fail)=>ok?passes.push(pass):failures.push(fail);
const english1={stoodOut:'Grace stood out to me.',question:'How can I practice this more consistently?',practice:'I will pause before responding.',prayer:'I am praying for wisdom.'};
const english2={stoodOut:'Scripture shapes my response.',question:'What voice am I trusting most?',practice:'I will read before reacting.',prayer:'I am praying for discernment.'};
const spanish={stoodOut:'Me llamó la atención la fidelidad de Dios.',question:'¿Cómo respondo con más humildad?',practice:'Voy a escuchar antes de responder.',prayer:'Estoy orando por sabiduría.'};

async function waitPanel(page){await page.waitForSelector('[data-lesson-reflections-panel]',{state:'visible',timeout:12000});}
async function waitSaved(page,text){await page.waitForFunction(value=>document.querySelector('.lesson-reflections-status')?.textContent?.trim()===value,text,{timeout:10000});}
async function fill(page,answers){for(const [name,value] of Object.entries(answers))await page.locator(`[data-reflection-field="${name}"]`).fill(value);}
async function storage(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}'),STORAGE_KEY);}
const allMatch=(source,expected)=>Object.entries(expected).every(([key,value])=>source?.[key]===value);

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  let response=await page.goto(`${BASE_URL}/current-events-series.html?week=1`,{waitUntil:'networkidle',timeout:30000});
  check(response&&response.status()<400,'Faith & Truth week 1 loads.','Faith & Truth week 1 did not load.');
  await page.evaluate(()=>{
    localStorage.clear();
    localStorage.setItem('nldg-study-state','{"sentinel":"study-state"}');
    localStorage.setItem('nldg-journey-reflections-v1','[{"sentinel":"journal"}]');
    localStorage.setItem('nldg-teaching-notebook-faith-truth-week-1','{"sentinel":"teaching-notes"}');
  });
  await page.reload({waitUntil:'networkidle'});await waitPanel(page);

  const panel=await page.evaluate(()=>{
    const el=document.querySelector('[data-lesson-reflections-panel]');const rect=el?.getBoundingClientRect();
    return{count:el?.querySelectorAll('[data-reflection-field]').length||0,text:el?.textContent||'',checked:Boolean(el?.querySelector('[data-reflection-include]')?.checked),role:el?.querySelector('.lesson-reflections-status')?.getAttribute('role'),live:el?.querySelector('.lesson-reflections-status')?.getAttribute('aria-live'),fits:Boolean(rect&&rect.left>=-1&&rect.right<=window.innerWidth+1&&el.scrollWidth<=el.clientWidth+1)};
  });
  check(panel.count===4&&panel.text.includes('What stood out to me?')&&panel.text.includes('What am I praying about?'),'All four English prompts render.','English prompt set is incomplete.');
  check(/stored only in this browser on this device/i.test(panel.text)&&/do not sync across devices/i.test(panel.text)&&/not backed up to the cloud/i.test(panel.text),'English local-storage privacy wording is explicit.','English privacy wording is incomplete.');
  check(!panel.checked,'Handout reflection inclusion is off by default.','Handout reflection inclusion is enabled by default.');
  check(panel.role==='status'&&panel.live==='polite','Saved status has accessible live-region semantics.','Saved status live-region semantics are missing.');
  check(panel.fits,'Reflection panel fits a 390px phone viewport.','Reflection panel overflows a 390px phone viewport.');

  await fill(page,english1);await waitSaved(page,'Saved on this device.');
  let entries=await storage(page);let week1=Object.values(entries).find(entry=>entry.lessonId==='week:1');
  check(Boolean(week1)&&allMatch(week1.answers,english1),'Week 1 stores all four answers under its own lesson ID.','Week 1 answers were not saved correctly.');
  check(week1?.studyTitle==='Faith & Truth in Today’s World'&&week1?.scripture?.includes('John 14:6'),'Faith & Truth stores public study title and Scripture metadata.','Faith & Truth metadata is incorrect.');
  const sentinels=await page.evaluate(()=>[localStorage.getItem('nldg-study-state'),localStorage.getItem('nldg-journey-reflections-v1'),localStorage.getItem('nldg-teaching-notebook-faith-truth-week-1')]);
  check(JSON.stringify(sentinels)===JSON.stringify(['{"sentinel":"study-state"}','[{"sentinel":"journal"}]','{"sentinel":"teaching-notes"}']),'Existing study, journal, and teaching-note storage remains untouched.','An existing storage stream changed.');

  await page.reload({waitUntil:'networkidle'});await waitPanel(page);
  const restored=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-reflection-field]')].map(field=>[field.dataset.reflectionField,field.value])));
  check(allMatch(restored,english1),'All four Week 1 answers restore after reload.','Week 1 did not restore all four answers.');

  const defaultPrint=await page.evaluate(()=>{const api=window.NLDGLessonReflections,entry=api.listEntries().find(item=>item.lessonId==='week:1'),host=document.createElement('div');host.innerHTML='<article class="print-packet">Packet</article>';return{added:api.appendToPrint(host,entry),count:host.querySelectorAll('[data-lesson-reflection-print]').length};});
  check(!defaultPrint.added&&defaultPrint.count===0,'Participant/leader packet helper excludes reflections by default.','Reflection entered a handout without opt-in.');

  const output=await page.evaluate(()=>{const api=window.NLDGLessonReflections,entry=api.listEntries().find(item=>item.lessonId==='week:1');return{entry,text:api.formatExport(entry),html:api.printMarkup(entry)};});
  const required=[output.entry.studyTitle,output.entry.lessonTitle,output.entry.scripture,...Object.values(english1)];
  check(required.every(value=>output.text.includes(value)),'Individual export includes study, lesson, Scripture, and all four answers.','Individual export is missing required content.');
  check(required.every(value=>output.html.includes(value)),'Individual print includes study, lesson, Scripture, and all four answers.','Individual print is missing required content.');

  await page.locator('[data-reflection-include]').check();await waitSaved(page,'Saved on this device.');
  const opted=await page.evaluate(()=>{const api=window.NLDGLessonReflections,entry=api.listEntries().find(item=>item.lessonId==='week:1'),host=document.createElement('div');host.innerHTML='<article class="print-packet">Packet</article>';const added=api.appendToPrint(host,entry);return{added,count:host.querySelectorAll('[data-lesson-reflection-print]').length,text:host.textContent||''};});
  check(opted.added&&opted.count===1&&Object.values(english1).every(value=>opted.text.includes(value)),'Explicit handout opt-in includes the reflection.','Opted-in reflection was not added correctly.');

  await page.waitForSelector('.v2-view-tabs [data-view="print"]',{state:'visible',timeout:10000});
  await page.locator('.v2-view-tabs [data-view="print"]').click();
  await page.evaluate(()=>{window.__reflectionPrintCalls=0;window.print=()=>window.__reflectionPrintCalls++});
  await page.locator('[data-v2-print="participant"]').click();
  const faithPrint=await page.evaluate(()=>({calls:window.__reflectionPrintCalls,count:document.querySelectorAll('#v2-print-surface [data-lesson-reflection-print]').length,text:document.querySelector('#v2-print-surface')?.textContent||''}));
  check(faithPrint.calls===1&&faithPrint.count===1&&faithPrint.text.includes(english1.stoodOut),'Faith & Truth dedicated print surface honors the opt-in.','Faith & Truth print surface did not include the opted-in reflection.');

  response=await page.goto(`${BASE_URL}/current-events-series.html?week=2`,{waitUntil:'networkidle',timeout:30000});await waitPanel(page);
  check(response&&response.status()<400,'Faith & Truth week 2 loads.','Faith & Truth week 2 did not load.');
  const initial2=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-reflection-field]')].map(field=>[field.dataset.reflectionField,field.value])));
  check(Object.values(initial2).every(value=>value===''),'Week 2 begins with a separate reflection record.','Week 2 inherited Week 1 answers.');
  await fill(page,english2);await waitSaved(page,'Saved on this device.');
  entries=await storage(page);week1=Object.values(entries).find(entry=>entry.lessonId==='week:1');const week2=Object.values(entries).find(entry=>entry.lessonId==='week:2');
  check(Boolean(week1&&week2&&week1.key!==week2.key)&&allMatch(week1.answers,english1)&&allMatch(week2.answers,english2),'Two lessons remain separate without overwriting each other.','Lesson-specific storage separation failed.');

  await page.goto(`${BASE_URL}/dashboard.html#lesson-reflections`,{waitUntil:'networkidle',timeout:30000});
  await page.waitForSelector('.journey-lesson-reflection-card',{state:'visible',timeout:10000});
  const journey=await page.evaluate(()=>{const api=window.NLDGLessonReflections,cards=[...document.querySelectorAll('.journey-lesson-reflection-card')];return{freeJournal:Boolean(document.querySelector('#reflection-form')),items:['week:1','week:2'].map(id=>{const entry=api.listEntries().find(item=>item.lessonId===id),card=cards.find(node=>node.dataset.reflectionKey===entry?.key);return{entry,text:card?.textContent||'',href:card?.querySelector('a')?.getAttribute('href')||'',meta:[...card?.querySelectorAll('.journey-reflection-meta span')||[]].map(node=>node.textContent.trim())}})};});
  check(journey.freeJournal,'Existing free-form Reflection Journal remains present.','Existing free-form Reflection Journal is missing.');
  for(const item of journey.items){check(Boolean(item.entry&&item.text.includes(item.entry.studyTitle)&&item.text.includes(item.entry.lessonTitle)&&item.text.includes(item.entry.scripture)&&item.meta.length>=3&&item.meta[1]),'My Journey card includes study, lesson, Scripture, and date.','My Journey card is missing required metadata.');check(item.href===item.entry.url,'My Journey link returns to the exact saved lesson.','My Journey lesson link is incorrect.');}
  await context.close();

  const esContext=await browser.newContext({viewport:{width:390,height:844}});const esPage=await esContext.newPage();
  response=await esPage.goto(`${BASE_URL}/es/abdias-estudio.html?lesson=1`,{waitUntil:'networkidle',timeout:30000});
  check(response&&response.status()<400,'Spanish Book-by-Book lesson loads.','Spanish Book-by-Book lesson did not load.');
  await esPage.evaluate(()=>localStorage.clear());await esPage.reload({waitUntil:'networkidle'});await waitPanel(esPage);
  const esPanel=await esPage.evaluate(()=>{const el=document.querySelector('[data-lesson-reflections-panel]'),rect=el?.getBoundingClientRect();return{loaded:Boolean(window.NLDGLessonReflections),text:el?.textContent||'',checked:Boolean(el?.querySelector('[data-reflection-include]')?.checked),fits:Boolean(rect&&rect.left>=-1&&rect.right<=window.innerWidth+1&&el.scrollWidth<=el.clientWidth+1)};});
  check(esPanel.loaded&&esPanel.text.includes('Lleva esto a tu semana'),'Spanish pages load the shared reflection module.','Spanish reflection module did not load.');
  check(/solamente en este navegador y en este dispositivo/.test(esPanel.text)&&/No se sincronizan entre dispositivos/.test(esPanel.text)&&/copia de seguridad en la nube/.test(esPanel.text),'Spanish local-storage privacy wording is explicit.','Spanish privacy wording is incomplete.');
  check(!esPanel.checked&&esPanel.fits,'Spanish reflection panel is private by default and fits mobile.','Spanish default privacy or mobile layout failed.');

  await fill(esPage,spanish);await waitSaved(esPage,'Guardado en este dispositivo.');await esPage.reload({waitUntil:'networkidle'});await waitPanel(esPage);
  const esRestored=await esPage.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-reflection-field]')].map(field=>[field.dataset.reflectionField,field.value])));
  check(allMatch(esRestored,spanish),'All four Spanish answers restore after reload.','Spanish answers did not all restore.');

  await esPage.evaluate(()=>{window.__bookPrintCalls=0;window.print=()=>window.__bookPrintCalls++;document.querySelector('[data-print-mode]')?.click()});
  let bookPrint=await esPage.evaluate(()=>({calls:window.__bookPrintCalls,count:document.querySelectorAll('#book-print-surface [data-lesson-reflection-print]').length}));
  check(bookPrint.calls===1&&bookPrint.count===0,'Book-by-Book print excludes reflections by default.','Book-by-Book print included reflections without opt-in.');
  await esPage.locator('[data-reflection-include]').check();await waitSaved(esPage,'Guardado en este dispositivo.');
  await esPage.evaluate(()=>document.querySelector('[data-print-mode]')?.click());
  bookPrint=await esPage.evaluate(()=>({calls:window.__bookPrintCalls,count:document.querySelectorAll('#book-print-surface [data-lesson-reflection-print]').length,text:document.querySelector('#book-print-surface')?.textContent||''}));
  check(bookPrint.calls===2&&bookPrint.count>=1&&Object.values(spanish).every(value=>bookPrint.text.includes(value)),'Book-by-Book print includes Spanish reflections only after opt-in.','Book-by-Book opted-in reflection print failed.');
  const esOutput=await esPage.evaluate(()=>{const api=window.NLDGLessonReflections,entry=api.listEntries()[0];return{entry,text:api.formatExport(entry),html:api.printMarkup(entry)};});
  const esRequired=[esOutput.entry.studyTitle,esOutput.entry.lessonTitle,esOutput.entry.scripture,...Object.values(spanish)];
  check(esRequired.every(value=>esOutput.text.includes(value))&&esOutput.text.includes('¿Qué me llamó la atención?'),'Spanish export includes translated prompts, metadata, and all answers.','Spanish export is incomplete.');
  check(esRequired.every(value=>esOutput.html.includes(value))&&esOutput.html.includes('Lleva esto a tu semana'),'Spanish print includes translated framing, metadata, and all answers.','Spanish print output is incomplete.');
  await esContext.close();
}finally{await browser.close();}

console.log(`# Lesson Reflections Browser Audit\n\nResult: ${failures.length?'FAILED':'PASSED'}\n\n${passes.map(item=>`PASS: ${item}`).join('\n')}${failures.length?`\n\n${failures.map(item=>`FAIL: ${item}`).join('\n')}`:''}`);
if(failures.length)process.exitCode=1;
