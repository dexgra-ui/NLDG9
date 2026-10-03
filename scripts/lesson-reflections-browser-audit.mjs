import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const STORAGE_KEY='nldg-lesson-reflections-v1';
const failures=[];
const passes=[];
const expect=(condition,ok,bad)=>condition?passes.push(ok):failures.push(bad);
const answersOne={stoodOut:'Grace stood out to me.',question:'How can I practice this more consistently?',practice:'I will pause before responding.',prayer:'I am praying for wisdom.'};
const answersTwo={stoodOut:'Scripture shapes my response.',question:'What voice am I trusting most?',practice:'I will read before reacting.',prayer:'I am praying for discernment.'};
const spanishAnswers={stoodOut:'Me llamó la atención la fidelidad de Dios.',question:'¿Cómo respondo con más humildad?',practice:'Voy a escuchar antes de responder.',prayer:'Estoy orando por sabiduría.'};

async function waitForSaved(page,spanish=false){
  const target=spanish?'Guardado en este dispositivo.':'Saved on this device.';
  await page.waitForFunction(text=>document.querySelector('.lesson-reflections-status')?.textContent?.trim()===text,target,{timeout:10000});
}
async function fillAnswers(page,answers){
  for(const [name,value] of Object.entries(answers))await page.locator(`[data-reflection-field="${name}"]`).fill(value);
}
async function storedEntries(page){
  return page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}'),STORAGE_KEY);
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();

  let response=await page.goto(`${BASE_URL}/current-events-series.html?week=1`,{waitUntil:'networkidle',timeout:30000});
  expect(response&&response.status()<400,'Faith & Truth week 1 loads.',`Faith & Truth week 1 returned HTTP ${response?.status()??'no response'}.`);
  await page.evaluate(()=>localStorage.clear());
  await page.evaluate(()=>{
    localStorage.setItem('nldg-study-state','{"sentinel":"study-state"}');
    localStorage.setItem('nldg-journey-reflections-v1','[{"sentinel":"journal"}]');
    localStorage.setItem('nldg-teaching-notebook-faith-truth-week-1','{"sentinel":"teaching-notes"}');
  });
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('[data-lesson-reflections-panel]',{state:'visible',timeout:12000});

  const englishPanel=await page.evaluate(()=>{
    const panel=document.querySelector('[data-lesson-reflections-panel]');
    const rect=panel?.getBoundingClientRect();
    return{
      privacy:panel?.querySelector('.lesson-reflections-storage')?.textContent||'',
      includeChecked:Boolean(panel?.querySelector('[data-reflection-include]')?.checked),
      promptCount:panel?.querySelectorAll('[data-reflection-field]').length||0,
      labels:[...panel?.querySelectorAll('label > span')||[]].map(node=>node.textContent.trim()),
      statusRole:panel?.querySelector('.lesson-reflections-status')?.getAttribute('role')||'',
      live:panel?.querySelector('.lesson-reflections-status')?.getAttribute('aria-live')||'',
      withinViewport:Boolean(rect&&rect.left>=-1&&rect.right<=window.innerWidth+1),
      noPanelOverflow:Boolean(panel&&panel.scrollWidth<=panel.clientWidth+1)
    };
  });
  expect(englishPanel.promptCount===4,'All four guided prompts render.','Expected four guided prompts on Faith & Truth week 1.');
  expect(englishPanel.labels.includes('What stood out to me?')&&englishPanel.labels.includes('What am I praying about?'),'English prompt labels are correct.','English prompt labels are incomplete or incorrect.');
  expect(/stored only in this browser on this device/i.test(englishPanel.privacy)&&/do not sync across devices/i.test(englishPanel.privacy)&&/not backed up to the cloud/i.test(englishPanel.privacy),'Local-only privacy wording is explicit.','Privacy wording does not clearly state browser/device-only storage, no sync, and no cloud backup.');
  expect(!englishPanel.includeChecked,'Lesson handout reflection inclusion is off by default.','Reflection inclusion was enabled by default.');
  expect(englishPanel.statusRole==='status'&&englishPanel.live==='polite','Saved status is announced accessibly.','Saved status is missing its accessible live-region semantics.');
  expect(englishPanel.withinViewport&&englishPanel.noPanelOverflow,'Reflection panel fits a 390px phone viewport.','Reflection panel overflows the 390px phone viewport.');

  await fillAnswers(page,answersOne);
  await waitForSaved(page);
  let entries=await storedEntries(page);
  let week1=Object.values(entries).find(entry=>entry.lessonId==='week:1');
  expect(Boolean(week1),'Week 1 reflection is stored under a stable lesson identifier.','No week:1 reflection entry was stored.');
  expect(week1&&Object.entries(answersOne).every(([key,value])=>week1.answers?.[key]===value),'All four Week 1 answers autosave.','One or more Week 1 answers were not saved correctly.');
  expect(week1?.studyTitle==='Faith & Truth in Today’s World','Faith & Truth saves the public study title.','Faith & Truth saved the internal series title instead of the public study title.');
  expect(week1?.scripture?.includes('John 14:6'),'Faith & Truth reflection stores the lesson Scripture reference.','Week 1 Scripture metadata is missing or incorrect.');

  const sentinelState=await page.evaluate(()=>({
    study:localStorage.getItem('nldg-study-state'),
    journal:localStorage.getItem('nldg-journey-reflections-v1'),
    teaching:localStorage.getItem('nldg-teaching-notebook-faith-truth-week-1')
  }));
  expect(sentinelState.study==='{"sentinel":"study-state"}'&&sentinelState.journal==='[{"sentinel":"journal"}]'&&sentinelState.teaching==='{"sentinel":"teaching-notes"}','Existing study state, My Journey journal, and teaching-note storage remain untouched.','Guided reflections changed an existing storage stream.');

  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('[data-lesson-reflections-panel]',{state:'visible',timeout:12000});
  const restored=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-reflection-field]')].map(field=>[field.dataset.reflectionField,field.value])));
  expect(Object.entries(answersOne).every(([key,value])=>restored[key]===value),'All four Week 1 answers restore after reload.','Not all four Week 1 answers restored after reload.');

  const defaultAppend=await page.evaluate(()=>{
    const api=window.NLDGLessonReflections,entry=Object.values(api.readAll()).find(item=>item.lessonId==='week:1');
    const host=document.createElement('div');host.innerHTML='<article class="print-packet">Packet</article>';
    const appended=api.appendToPrint(host,entry);
    return{appended,count:host.querySelectorAll('[data-lesson-reflection-print]').length};
  });
  expect(defaultAppend.appended===false&&defaultAppend.count===0,'Participant/leader packet helper excludes reflections by default.','Reflection content entered a handout without opt-in.');

  const exportAndPrint=await page.evaluate(()=>{
    const api=window.NLDGLessonReflections,entry=api.listEntries().find(item=>item.lessonId==='week:1');
    return{entry,exportText:api.formatExport(entry),printHtml:api.printMarkup(entry)};
  });
  const englishMetadata=[exportAndPrint.entry.studyTitle,exportAndPrint.entry.lessonTitle,exportAndPrint.entry.scripture,...Object.values(answersOne)];
  expect(englishMetadata.every(value=>exportAndPrint.exportText.includes(value)),'Individual export includes study, lesson, Scripture, and all four answers.','Individual export is missing required metadata or answers.');
  expect(englishMetadata.every(value=>exportAndPrint.printHtml.includes(value)),'Individual print markup includes study, lesson, Scripture, and all four answers.','Individual print markup is missing required metadata or answers.');

  await page.locator('[data-reflection-include]').check();
  await waitForSaved(page);
  const optedInAppend=await page.evaluate(()=>{
    const api=window.NLDGLessonReflections,entry=api.listEntries().find(item=>item.lessonId==='week:1');
    const host=document.createElement('div');host.innerHTML='<article class="print-packet">Packet</article>';
    const appended=api.appendToPrint(host,entry);
    return{appended,count:host.querySelectorAll('[data-lesson-reflection-print]').length,text:host.textContent||''};
  });
  expect(optedInAppend.appended===true&&optedInAppend.count===1&&Object.values(answersOne).every(value=>optedInAppend.text.includes(value)),'Explicit handout opt-in includes the saved reflection.','Opted-in reflection did not enter the packet correctly.');

  await page.waitForSelector('.v2-view-tabs [data-view="print"]',{state:'visible',timeout:10000});
  await page.locator('.v2-view-tabs [data-view="print"]').click();
  await page.evaluate(()=>{window.__reflectionPrintCalls=0;window.print=()=>{window.__reflectionPrintCalls+=1}});
  await page.locator('[data-v2-print="participant"]').click();
  const faithTruthPrint=await page.evaluate(()=>({calls:window.__reflectionPrintCalls,count:document.querySelectorAll('#v2-print-surface [data-lesson-reflection-print]').length,text:document.querySelector('#v2-print-surface')?.textContent||''}));
  expect(faithTruthPrint.calls===1&&faithTruthPrint.count===1&&faithTruthPrint.text.includes(answersOne.stoodOut),'Faith & Truth dedicated print surface honors the explicit reflection opt-in.','Faith & Truth print surface did not include the opted-in reflection correctly.');

  response=await page.goto(`${BASE_URL}/current-events-series.html?week=2`,{waitUntil:'networkidle',timeout:30000});
  expect(response&&response.status()<400,'Faith & Truth week 2 loads.',`Faith & Truth week 2 returned HTTP ${response?.status()??'no response'}.`);
  await page.waitForSelector('[data-lesson-reflections-panel]',{state:'visible',timeout:12000});
  const week2Initial=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-reflection-field]')].map(field=>[field.dataset.reflectionField,field.value])));
  expect(Object.values(week2Initial).every(value=>value===''),'A different lesson starts with a separate reflection record.','Week 2 inherited answers from Week 1.');
  await fillAnswers(page,answersTwo);
  await waitForSaved(page);
  entries=await storedEntries(page);
  week1=Object.values(entries).find(entry=>entry.lessonId==='week:1');
  const week2=Object.values(entries).find(entry=>entry.lessonId==='week:2');
  expect(Boolean(week1&&week2&&week1.key!==week2.key),'Two lessons remain stored as separate entries.','Week 1 and Week 2 did not remain separate.');
  expect(Object.entries(answersOne).every(([key,value])=>week1.answers?.[key]===value)&&Object.entries(answersTwo).every(([key,value])=>week2.answers?.[key]===value),'Saving Week 2 does not overwrite Week 1.','Saving Week 2 changed Week 1 answers.');

  await page.goto(`${BASE_URL}/dashboard.html#lesson-reflections`,{waitUntil:'networkidle',timeout:30000});
  await page.waitForSelector('#journey-lesson-reflections-list .journey-lesson-reflection-card',{state:'visible',timeout:10000});
  const journeyState=await page.evaluate(()=>{
    const cards=[...document.querySelectorAll('.journey-lesson-reflection-card')];
    const pick=lessonId=>{
      const entry=window.NLDGLessonReflections.listEntries().find(item=>item.lessonId===lessonId);
      const card=cards.find(node=>node.dataset.reflectionKey===entry?.key);
      return{entry,cardText:card?.textContent||'',href:card?.querySelector('a')?.getAttribute('href')||'',meta:[...card?.querySelectorAll('.journey-reflection-meta span')||[]].map(node=>node.textContent.trim())};
    };
    return{count:cards.length,week1:pick('week:1'),week2:pick('week:2'),freeJournal:Boolean(document.querySelector('#reflection-form'))};
  });
  expect(journeyState.count>=2,'My Journey displays both saved lesson reflections.','My Journey did not display both saved lesson reflections.');
  for(const [name,item] of Object.entries({week1:journeyState.week1,week2:journeyState.week2})){
    expect(Boolean(item.entry&&item.cardText.includes(item.entry.studyTitle)&&item.cardText.includes(item.entry.lessonTitle)&&item.cardText.includes(item.entry.scripture)&&item.meta.length>=3&&item.meta[1]),`My Journey ${name} card shows study, lesson, Scripture, and update date.`,`My Journey ${name} card is missing required metadata.`);
    expect(item.href===item.entry.url,`My Journey ${name} link returns to the exact lesson.`,`My Journey ${name} link does not match the saved lesson URL.`);
  }
  expect(journeyState.freeJournal,'The existing free-form Reflection Journal remains present.','The existing My Journey Reflection Journal is missing.');
  await context.close();

  const esContext=await browser.newContext({viewport:{width:390,height:844}});
  const esPage=await esContext.newPage();
  response=await esPage.goto(`${BASE_URL}/es/abdias-estudio.html?lesson=1`,{waitUntil:'networkidle',timeout:30000});
  expect(response&&response.status()<400,'Spanish Book-by-Book lesson loads.',`Spanish Book-by-Book lesson returned HTTP ${response?.status()??'no response'}.`);
  await esPage.evaluate(()=>localStorage.clear());
  await esPage.reload({waitUntil:'networkidle'});
  await esPage.waitForSelector('[data-lesson-reflections-panel]',{state:'visible',timeout:12000});
  const spanishPanel=await esPage.evaluate(()=>{
    const panel=document.querySelector('[data-lesson-reflections-panel]');const rect=panel?.getBoundingClientRect();
    return{loaded:Boolean(window.NLDGLessonReflections),text:panel?.textContent||'',checked:Boolean(panel?.querySelector('[data-reflection-include]')?.checked),withinViewport:Boolean(rect&&rect.left>=-1&&rect.right<=window.innerWidth+1),noOverflow:Boolean(panel&&panel.scrollWidth<=panel.clientWidth+1)};
  });
  expect(spanishPanel.loaded&&/Lleva esto a tu semana/.test(spanishPanel.text),'Spanish pages load the shared reflection module through the Spanish asset bridge.','Spanish reflection module did not load correctly.');
  expect(/solamente en este navegador y en este dispositivo/.test(spanishPanel.text)&&/No se sincronizan entre dispositivos/.test(spanishPanel.text)&&/copia de seguridad en la nube/.test(spanishPanel.text),'Spanish privacy wording accurately explains local-only storage.','Spanish privacy wording is incomplete.');
  expect(!spanishPanel.checked,'Spanish handout reflection inclusion is off by default.','Spanish reflection inclusion was enabled by default.');
  expect(spanishPanel.withinViewport&&spanishPanel.noOverflow,'Spanish reflection panel fits a 390px phone viewport.','Spanish reflection panel overflows the 390px phone viewport.');

  await fillAnswers(esPage,spanishAnswers);
  await waitForSaved(esPage,true);
  await esPage.reload({waitUntil:'networkidle'});
  await esPage.waitForSelector('[data-lesson-reflections-panel]',{state:'visible',timeout:12000});
  const esRestored=await esPage.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-reflection-field]')].map(field=>[field.dataset.reflectionField,field.value])));
  expect(Object.entries(spanishAnswers).every(([key,value])=>esRestored[key]===value),'All four Spanish answers restore after reload.','Not all four Spanish answers restored after reload.');

  await esPage.evaluate(()=>{window.__bookPrintCalls=0;window.print=()=>{window.__bookPrintCalls+=1}});
  await esPage.locator('[data-print-mode]').first().click();
  let bookPrint=await esPage.evaluate(()=>({calls:window.__bookPrintCalls,count:document.querySelectorAll('#book-print-surface [data-lesson-reflection-print]').length}));
  expect(bookPrint.calls===1&&bookPrint.count===0,'Book-by-Book print excludes personal reflections by default.','Book-by-Book print included reflections before opt-in.');
  await esPage.locator('[data-reflection-include]').check();
  await waitForSaved(esPage,true);
  await esPage.locator('[data-print-mode]').first().click();
  bookPrint=await esPage.evaluate(()=>({calls:window.__bookPrintCalls,count:document.querySelectorAll('#book-print-surface [data-lesson-reflection-print]').length,text:document.querySelector('#book-print-surface')?.textContent||''}));
  expect(bookPrint.calls===2&&bookPrint.count>=1&&Object.values(spanishAnswers).every(value=>bookPrint.text.includes(value)),'Book-by-Book print includes Spanish reflections only after explicit opt-in.','Book-by-Book opted-in reflection print failed.');

  const spanishExport=await esPage.evaluate(()=>{
    const api=window.NLDGLessonReflections,entry=api.listEntries()[0];return{entry,text:api.formatExport(entry),html:api.printMarkup(entry)};
  });
  const spanishMetadata=[spanishExport.entry.studyTitle,spanishExport.entry.lessonTitle,spanishExport.entry.scripture,...Object.values(spanishAnswers)];
  expect(spanishMetadata.every(value=>spanishExport.text.includes(value))&&spanishExport.text.includes('¿Qué me llamó la atención?'),'Spanish export includes translated prompts, metadata, and all four answers.','Spanish export is missing translated prompts, metadata, or answers.');
  expect(spanishMetadata.every(value=>spanishExport.html.includes(value))&&spanishExport.html.includes('Lleva esto a tu semana'),'Spanish print markup includes translated framing, metadata, and all four answers.','Spanish print markup is missing translated framing, metadata, or answers.');
  await esContext.close();
}finally{
  await browser.close();
}

console.log(`# Lesson Reflections Browser Audit\n\nResult: ${failures.length?'FAILED':'PASSED'}\n\n${passes.map(item=>`PASS: ${item}`).join('\n')}${failures.length?`\n\n${failures.map(item=>`FAIL: ${item}`).join('\n')}`:''}`);
if(failures.length)process.exitCode=1;
