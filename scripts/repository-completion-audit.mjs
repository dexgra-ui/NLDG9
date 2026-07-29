import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require=createRequire(import.meta.url);
const axeModulePath=['axe-core','axe','min','js'];
const axeSource=await fs.readFile(require.resolve(`${axeModulePath[0]}/${axeModulePath.slice(1).join('.')}`),'utf8');
const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const OUTPUT=path.resolve('repository-completion-audit-results');

const pages=[
  ['home','index.html'],
  ['new-believers','new-believers.html'],
  ['studies','studies.html'],
  ['men-of-faith','men-of-faith.html'],
  ['women-of-faith','women-of-faith.html'],
  ['marriage-family','marriage-family.html'],
  ['marriage-family-study','marriage-family-study.html?study=1'],
  ['difficult-questions','difficult-questions.html'],
  ['difficult-questions-study','difficult-questions-study.html?study=1'],
  ['leadership','leadership.html'],
  ['leadership-study','leadership-study.html?study=1'],
  ['leadership-toolkit','leadership-toolkit.html'],
  ['leadership-toolkit-packet','leadership-toolkit-packet.html'],
  ['devotionals','devotionals.html'],
  ['articles','articles.html'],
  ['resource-center','resource-center.html'],
  ['search','search.html'],
  ['site-map','site-map.html'],
  ['dashboard','dashboard.html'],
  ['ministry-tools','ministry-tools.html'],
  ['game-center','play.html']
];

const failures=[];
const warnings=[];
const checks=[];

const read=file=>fs.readFile(path.resolve(file),'utf8');
const record=(condition,success,failure)=>{
  if(condition)checks.push(success);
  else failures.push(failure);
};

async function staticChecks(){
  const [readme,index,siteMap,siteMapScript,serviceWorker,publishing,entryTemplate,pageTemplate]=await Promise.all([
    read('README.md'),read('index.html'),read('site-map.html'),read('site-map.js'),read('sw.js'),read('CONTENT-PUBLISHING.md'),read('templates/content-entry.template.js'),read('templates/content-page.template.html')
  ]);

  record(readme.includes('Version 1.0.0'),'README identifies Version 1.0.0.','README does not identify Version 1.0.0.');
  record(!index.includes('signup-form')&&!index.includes('Email signup will be connected'),'Homepage contains no placeholder signup form.','Homepage still contains a placeholder signup experience.');
  record(index.includes('substack.com/@nolabelsdesignedbygod')&&index.includes('facebook.com/NoLabelsDesignedbyGod'),'Homepage links to the live Substack and Facebook channels.','Homepage is missing one or both live ministry channels.');
  record(siteMap.includes('site-map-content-index')&&siteMap.includes('site-map.js'),'Site map contains its generated registry index.','Site map is not connected to the generated registry index.');
  record(siteMapScript.includes('window.NLDG_CONTENT')&&siteMapScript.includes('status!==\'draft\''),'Site-map generator reads published shared-library entries.','Site-map generator is not using the published shared library correctly.');
  record(serviceWorker.includes("nldg-v10-0-0-ministry-platform")&&serviceWorker.includes("'site-map.js'"),'Version 1.0 offline shell includes the generated site map.','Service worker version or generated site-map cache entry is missing.');
  record(publishing.includes('source of truth')&&publishing.includes('Required metadata'),'Publishing guide documents the one-registry workflow.','Publishing guide is incomplete.');
  record(entryTemplate.includes("status: 'draft'")&&entryTemplate.includes('publishedAt'),'Registry template includes safe draft status and publishing metadata.','Registry template is missing required publishing safeguards.');
  record(pageTemplate.includes('{{PAGE TITLE}}')&&pageTemplate.includes('id="main-content"'),'Content page template contains semantic structure and placeholders.','Content page template is incomplete.');
}

async function auditPage(page,name,url,width){
  const response=await page.goto(`${BASE_URL}/${url}`,{waitUntil:'domcontentloaded',timeout:30000});
  if(!response||response.status()>=400){
    failures.push(`${name} at ${width}px returned HTTP ${response?.status()??'no response'}.`);
    return;
  }
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(200);

  const layout=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    h1:document.querySelectorAll('h1').length,
    title:document.title.trim(),
    imagesMissingAlt:[...document.images].filter(image=>!image.hasAttribute('alt')).length
  }));

  if(layout.overflow>2)failures.push(`${name} has ${layout.overflow}px horizontal overflow at ${width}px.`);
  if(layout.h1!==1)failures.push(`${name} has ${layout.h1} H1 headings at ${width}px.`);
  if(!layout.title)failures.push(`${name} has no document title.`);
  if(layout.imagesMissingAlt)failures.push(`${name} has ${layout.imagesMissingAlt} image(s) without alt attributes.`);

  if(width===1440){
    await page.addScriptTag({content:axeSource});
    const result=await page.evaluate(async()=>window.axe.run(document,{
      runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']},
      resultTypes:['violations']
    }));
    result.violations
      .filter(violation=>['critical','serious'].includes(violation.impact))
      .forEach(violation=>failures.push(`${name}: ${violation.id} (${violation.impact}) ${violation.help}.`));
  }

  checks.push(`${name} passed structure and ${width}px layout checks.`);
}

async function browserChecks(){
  const browser=await chromium.launch({headless:true});
  try{
    for(const width of [375,768,1440]){
      const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1});
      const page=await context.newPage();
      for(const [name,url] of pages){
        try{await auditPage(page,name,url,width);}
        catch(error){failures.push(`${name} at ${width}px: ${error.message}`);}
      }
      await context.close();
    }

    const context=await browser.newContext({viewport:{width:1280,height:900}});
    const page=await context.newPage();

    await page.goto(`${BASE_URL}/site-map.html`,{waitUntil:'domcontentloaded'});
    await page.waitForLoadState('networkidle').catch(()=>{});
    await page.waitForTimeout(300);
    const generatedLinks=await page.locator('#site-map-content-index a').count();
    record(generatedLinks>=20,`Generated site-map index rendered ${generatedLinks} registry links.`,`Generated site-map index rendered only ${generatedLinks} registry links.`);

    await page.goto(`${BASE_URL}/search.html`,{waitUntil:'domcontentloaded'});
    await page.waitForLoadState('networkidle').catch(()=>{});
    const search=page.locator('#site-search');
    if(await search.count()){
      await search.fill('Leadership Toolkit');
      await page.waitForTimeout(150);
      const found=await page.locator('#search-results').innerText().catch(()=> '');
      record(found.includes('Leadership Toolkit'),'Global search finds the Leadership Toolkit.','Global search did not find the Leadership Toolkit.');
    }else failures.push('Search page is missing #site-search.');

    await context.close();
  }finally{
    await browser.close();
  }
}

function section(title,items,empty){
  return [`## ${title}`,'',...(items.length?items.map(item=>`- ${item}`):[empty]),''];
}

async function writeReport(){
  await fs.rm(OUTPUT,{recursive:true,force:true});
  await fs.mkdir(OUTPUT,{recursive:true});
  const report=[
    '# Repository Completion Review','',
    `Generated: ${new Date().toISOString()}`,'',
    `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s) and ${warnings.length} warning(s).`,'',
    ...section('Failures',failures,'No repository completion failures were found.'),
    ...section('Warnings',warnings,'No repository completion warnings were found.'),
    ...section('Checks completed',checks,'No checks were completed.')
  ].join('\n');
  await fs.writeFile(path.join(OUTPUT,'repository-completion-review.md'),report,'utf8');
  console.log(report);
}

await staticChecks();
await browserChecks();
await writeReport();
if(failures.length)process.exitCode=1;
