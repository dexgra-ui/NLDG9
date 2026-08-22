import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require=createRequire(import.meta.url);
const axePath=['axe-core','axe','min','js'];
const axeSource=await fs.readFile(require.resolve(`${axePath[0]}/${axePath.slice(1).join('.')}`),'utf8');
const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const OUTPUT=path.resolve('following-jesus-for-yourself-audit-results');
const lessons=[
  {name:'lesson-1',url:'following-jesus-for-yourself-known-by-god.html'},
  {name:'lesson-2',url:'following-jesus-for-yourself-following-jesus.html'},
  {name:'lesson-3',url:'following-jesus-for-yourself-read-scripture.html'},
  {name:'lesson-4',url:'following-jesus-for-yourself-prayer.html'},
  {name:'lesson-5',url:'following-jesus-for-yourself-questions-doubt-trust.html'},
  {name:'lesson-6',url:'following-jesus-for-yourself-friends-pressure-belonging.html'},
  {name:'lesson-7',url:'following-jesus-for-yourself-online-life-integrity.html'},
  {name:'lesson-8',url:'following-jesus-for-yourself-wise-choices-boundaries.html'},
  {name:'lesson-9',url:'following-jesus-for-yourself-when-you-mess-up.html'},
  {name:'lesson-10',url:'following-jesus-for-yourself-purpose-gifts.html'}
];
const pages=[{name:'collection',url:'following-jesus-for-yourself.html'},...lessons];
const viewports=[
  {name:'phone-375',width:375,height:812},
  {name:'tablet-768',width:768,height:1024},
  {name:'desktop-1440',width:1440,height:1000}
];
const failures=[];
const checks=[];
const record=(condition,success,failure)=>condition?checks.push(success):failures.push(failure);

async function inspect(page,pageInfo,viewport){
  const state=await page.evaluate(()=>({
    overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth,
    h1Count:document.querySelectorAll('h1').length,
    title:document.title.trim(),
    missingAlt:[...document.images].filter(image=>!image.hasAttribute('alt')).length,
    formCount:document.querySelectorAll('main form,main input,main textarea,main select').length,
    uploadCount:document.querySelectorAll('main input[type="file"],[contenteditable="true"]').length
  }));
  const prefix=`${pageInfo.name} ${viewport.name}`;
  record(state.overflow<=2,`${prefix}: no horizontal overflow.`,`${prefix}: horizontal overflow is ${state.overflow}px.`);
  record(state.h1Count===1,`${prefix}: one H1 heading.`,`${prefix}: expected one H1, found ${state.h1Count}.`);
  record(Boolean(state.title),`${prefix}: document title present.`,`${prefix}: document title missing.`);
  record(state.missingAlt===0,`${prefix}: images include alt attributes.`,`${prefix}: ${state.missingAlt} image(s) missing alt attributes.`);
  record(state.formCount===0&&state.uploadCount===0,`${prefix}: no youth data-entry or upload controls in main content.`,`${prefix}: found youth data-entry or upload controls in main content.`);

  if([375,1440].includes(viewport.width)){
    await page.addScriptTag({content:axeSource});
    const result=await page.evaluate(async()=>window.axe.run(document,{
      runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']},
      resultTypes:['violations']
    }));
    const serious=result.violations.filter(violation=>['critical','serious'].includes(violation.impact));
    serious.forEach(violation=>{
      const targets=violation.nodes.slice(0,3).flatMap(node=>node.target||[]).join(', ');
      failures.push(`${prefix}: ${violation.id} (${violation.impact}) ${violation.help}${targets?` — ${targets}`:''}.`);
    });
    checks.push(`${prefix}: axe completed with ${serious.length} serious or critical violation group(s).`);
  }
}

async function contentChecks(page){
  const required=['Big Question','Big Truth','Open Your Bible','Think It Through','Talk About It','Preteen Track','Teen Deeper Dive','Try It This Week','Memory Verse','Prayer','Leader / Parent Note'];
  for(const lessonInfo of lessons){
    await page.goto(`${BASE_URL}/${lessonInfo.url}`,{waitUntil:'networkidle'});
    const lesson=(await page.locator('main').innerText()).toLowerCase();
    for(const phrase of required){
      record(lesson.includes(phrase.toLowerCase()),`${lessonInfo.name} includes ${phrase}.`,`${lessonInfo.name} is missing ${phrase}.`);
    }
    const hasPassBoundary=lesson.includes('pass on')||lesson.includes('you may pass')||lesson.includes('or pass')||lesson.includes('do not have to')||lesson.includes('no forced disclosure')||lesson.includes('does not require private disclosure');
    record(hasPassBoundary,`${lessonInfo.name} permits non-disclosure or passing on personal questions.`,`${lessonInfo.name} is missing a non-disclosure/pass boundary.`);
    record(lesson.includes('safeguarding procedures'),`${lessonInfo.name} includes safeguarding guidance.`,`${lessonInfo.name} is missing safeguarding guidance.`);
    record(lesson.includes('do not promise secrecy'),`${lessonInfo.name} states the secrecy boundary.`,`${lessonInfo.name} is missing the secrecy boundary.`);
    const hasDataBoundary=lesson.includes('personal information')||lesson.includes('does not ask young people to submit')||lesson.includes('does not collect');
    record(hasDataBoundary,`${lessonInfo.name} states a youth-data boundary.`,`${lessonInfo.name} is missing a youth-data boundary.`);
  }

  await page.goto(`${BASE_URL}/following-jesus-for-yourself.html`,{waitUntil:'networkidle'});
  const cards=await page.locator('.fyj-study-card').count();
  const available=await page.locator('.fyj-study-card.available').count();
  const planned=await page.locator('.fyj-study-card.planned').count();
  const links=await page.locator('.fyj-study-card a[href^="following-jesus-for-yourself-"]').count();
  const collection=(await page.locator('main').innerText()).toLowerCase();
  record(cards===10,'Collection shows the ten-lesson journey.',`Collection expected 10 lesson cards, found ${cards}.`);
  record(available===10,'All ten youth lessons are marked available.',`Expected 10 available lessons, found ${available}.`);
  record(planned===0,'No youth lessons remain marked planned.',`Expected 0 planned lessons, found ${planned}.`);
  record(links===10,'All ten collection cards link to lesson pages.',`Expected 10 lesson links, found ${links}.`);
  record(collection.includes('preteen track')&&collection.includes('teen deeper dive'),'Collection explains both age lanes.','Collection is missing one or both age lanes.');
  record(collection.includes('non-denominational')&&collection.includes('jesus-centered'),'Collection states the Jesus-centered, non-denominational posture.','Collection is missing the ministry posture statement.');
  record(collection.includes('forced disclosure')&&collection.includes('safeguarding procedures'),'Collection states youth safety boundaries.','Collection is missing youth safety boundaries.');
}

async function run(){
  await fs.rm(OUTPUT,{recursive:true,force:true});
  await fs.mkdir(path.join(OUTPUT,'screenshots'),{recursive:true});
  const browser=await chromium.launch({headless:true});
  try{
    for(const viewport of viewports){
      for(const pageInfo of pages){
        const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
        const page=await context.newPage();
        const response=await page.goto(`${BASE_URL}/${pageInfo.url}`,{waitUntil:'domcontentloaded',timeout:30000});
        if(!response||response.status()>=400){
          failures.push(`${pageInfo.name} ${viewport.name}: returned HTTP ${response?.status()??'no response'}.`);
          await context.close();
          continue;
        }
        await page.waitForLoadState('networkidle').catch(()=>{});
        await inspect(page,pageInfo,viewport);
        if(pageInfo.name==='collection'||viewport.width===375){
          await page.screenshot({path:path.join(OUTPUT,'screenshots',`${pageInfo.name}-${viewport.name}.png`),fullPage:true});
        }
        await context.close();
      }
    }
    const context=await browser.newContext({viewport:{width:1280,height:900}});
    await contentChecks(await context.newPage());
    await context.close();
  }finally{
    await browser.close();
  }

  const report=[
    '# Following Jesus for Yourself Quality Review','',
    `Generated: ${new Date().toISOString()}`,'',
    `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s).`,'',
    '## Failures','',
    ...(failures.length?failures.map(item=>`- ${item}`):['No Following Jesus for Yourself failures were found.']),'',
    '## Checks completed','',
    ...checks.map(item=>`- ${item}`),''
  ].join('\n');
  await fs.writeFile(path.join(OUTPUT,'following-jesus-for-yourself-quality-review.md'),report,'utf8');
  console.log(report);
  if(failures.length)process.exitCode=1;
}

await run();
