import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require=createRequire(import.meta.url);
const axeSource=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const OUTPUT=path.resolve('growing-with-jesus-audit-results');
const pages=[
  {name:'collection',url:'growing-with-jesus.html'},
  {name:'study-1',url:'growing-with-jesus-god-made-me-on-purpose.html'}
];
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
    formCount:document.querySelectorAll('form,input,textarea,select').length,
    passwordCount:document.querySelectorAll('input[type="password"]').length,
    publicInteractionCount:document.querySelectorAll('[contenteditable="true"],input[type="file"]').length
  }));
  const prefix=`${pageInfo.name} ${viewport.name}`;
  record(state.overflow<=2,`${prefix}: no horizontal overflow.`,`${prefix}: horizontal overflow is ${state.overflow}px.`);
  record(state.h1Count===1,`${prefix}: one H1 heading.`,`${prefix}: expected one H1, found ${state.h1Count}.`);
  record(Boolean(state.title),`${prefix}: document title present.`,`${prefix}: document title missing.`);
  record(state.missingAlt===0,`${prefix}: images include alt attributes.`,`${prefix}: ${state.missingAlt} image(s) missing alt attributes.`);
  record(state.formCount===0&&state.passwordCount===0&&state.publicInteractionCount===0,`${prefix}: no child data-entry or upload controls.`,`${prefix}: found child data-entry, password, or upload controls.`);

  if([375,1440].includes(viewport.width)){
    await page.addScriptTag({content:axeSource});
    const result=await page.evaluate(async()=>window.axe.run(document,{
      runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']},
      resultTypes:['violations']
    }));
    const serious=result.violations.filter(violation=>['critical','serious'].includes(violation.impact));
    serious.forEach(violation=>failures.push(`${prefix}: ${violation.id} (${violation.impact}) ${violation.help}.`));
    checks.push(`${prefix}: axe completed with ${serious.length} serious or critical violation group(s).`);
  }
}

async function contentChecks(page){
  await page.goto(`${BASE_URL}/growing-with-jesus-god-made-me-on-purpose.html`,{waitUntil:'networkidle'});
  const text=await page.locator('main').innerText();
  for(const phrase of ['Big Question','Big Truth','Open Your Bible','Talk About It','Try It This Week','Memory Verse','Prayer','Parent / Teacher Note']){
    record(text.includes(phrase),`Study 1 includes ${phrase}.`,`Study 1 is missing ${phrase}.`);
  }
  record(text.includes('does not ask children to create an account or submit personal information'),'Study 1 states its child-data boundary.','Study 1 is missing its child-data boundary.');
  record(text.includes('Do not promise secrecy you cannot keep.'),'Study 1 includes safeguarding guidance for disclosures.','Study 1 is missing safeguarding guidance for disclosures.');

  await page.goto(`${BASE_URL}/growing-with-jesus.html`,{waitUntil:'networkidle'});
  const cards=await page.locator('.gwj-study-card').count();
  const available=await page.locator('.gwj-study-card.available').count();
  record(cards===10,'Collection shows the ten-study journey.',`Collection expected 10 study cards, found ${cards}.`);
  record(available===1,'Only the reference lesson is marked available.',`Expected 1 available reference lesson, found ${available}.`);
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
        await page.screenshot({path:path.join(OUTPUT,'screenshots',`${pageInfo.name}-${viewport.name}.png`),fullPage:true});
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
    '# Growing with Jesus Quality Review','',
    `Generated: ${new Date().toISOString()}`,'',
    `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s).`,'',
    '## Failures','',
    ...(failures.length?failures.map(item=>`- ${item}`):['No Growing with Jesus failures were found.']),'',
    '## Checks completed','',
    ...checks.map(item=>`- ${item}`),''
  ].join('\n');
  await fs.writeFile(path.join(OUTPUT,'growing-with-jesus-quality-review.md'),report,'utf8');
  console.log(report);
  if(failures.length)process.exitCode=1;
}

await run();
