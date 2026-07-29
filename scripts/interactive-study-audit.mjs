import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require=createRequire(import.meta.url);
const axePath=['axe-core','axe','min','js'];
const axeSource=await fs.readFile(require.resolve(`${axePath[0]}/${axePath.slice(1).join('.')}`),'utf8');
const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const OUTPUT=path.resolve('interactive-study-audit-results');
const viewports=[
  {name:'phone-375',width:375,height:812},
  {name:'phone-430',width:430,height:932},
  {name:'tablet-768',width:768,height:1024},
  {name:'laptop-1024',width:1024,height:800},
  {name:'desktop-1440',width:1440,height:1000}
];
const failures=[];
const warnings=[];
const checks=[];

const record=(condition,success,failure)=>{
  if(condition)checks.push(success);
  else failures.push(failure);
};

async function inspect(page,viewport){
  const state=await page.evaluate(()=>{
    const visible=element=>{
      if(!element)return false;
      const style=getComputedStyle(element);
      const rect=element.getBoundingClientRect();
      return style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity)!==0&&rect.width>2&&rect.height>2;
    };
    const root=document.documentElement;
    const modeNav=document.querySelector('.assistant-mode-nav');
    const modeButtons=[...document.querySelectorAll('.assistant-mode-nav button')];
    const workspace=document.querySelector('.assistant-workspace');
    const firstPane=document.querySelector('.assistant-pane');
    return {
      overflow:Math.max(root.scrollWidth,document.body.scrollWidth)-root.clientWidth,
      h1Count:document.querySelectorAll('h1').length,
      h1Visible:visible(document.querySelector('h1')),
      boundaryVisible:visible(document.querySelector('.assistant-boundary')),
      boundaryText:document.querySelector('.assistant-boundary')?.textContent?.trim()||'',
      headerVisible:visible(document.querySelector('.site-header')),
      launcherVisible:visible(document.querySelector('.assistant-study-launcher')),
      modeCount:modeButtons.length,
      modeVisible:visible(modeNav),
      modeOverflow:getComputedStyle(modeNav).overflowX,
      modeWidth:modeNav?.getBoundingClientRect().width||0,
      maxModeHeight:Math.max(0,...modeButtons.map(button=>button.getBoundingClientRect().height)),
      maxModeWidth:Math.max(0,...modeButtons.map(button=>button.getBoundingClientRect().width)),
      workspaceColumns:workspace?getComputedStyle(workspace).gridTemplateColumns:'',
      workspaceWidth:workspace?.getBoundingClientRect().width||0,
      paneWidth:firstPane?.getBoundingClientRect().width||0,
      legacyModeNav:document.querySelectorAll('.mode-nav').length,
      legacyHero:document.querySelectorAll('main > .hero').length,
      legacyPrimary:document.querySelectorAll('main .primary, main .secondary').length
    };
  });

  record(state.overflow<=2,`${viewport.name}: no horizontal document overflow.`,`${viewport.name}: horizontal overflow is ${state.overflow}px.`);
  record(state.h1Count===1&&state.h1Visible,`${viewport.name}: one visible page heading.`,`${viewport.name}: expected one visible H1, found ${state.h1Count}.`);
  record(state.headerVisible,`${viewport.name}: standard site header is visible.`,`${viewport.name}: standard site header is missing or hidden.`);
  record(state.boundaryVisible&&state.boundaryText.includes('Study boundary'),`${viewport.name}: study boundary is visible.`,`${viewport.name}: study boundary is missing or hidden.`);
  record(state.launcherVisible,`${viewport.name}: passage launcher is visible.`,`${viewport.name}: passage launcher is missing or hidden.`);
  record(state.modeCount===7&&state.modeVisible,`${viewport.name}: all seven study modes are visible.`,`${viewport.name}: expected seven visible study modes, found ${state.modeCount}.`);
  record(state.legacyModeNav===0&&state.legacyHero===0&&state.legacyPrimary===0,`${viewport.name}: legacy collision-prone layout classes are absent.`,`${viewport.name}: legacy collision-prone layout classes remain.`);

  if(viewport.width<=430){
    record(['auto','scroll'].includes(state.modeOverflow),`${viewport.name}: mode row scrolls inside its own container.`,`${viewport.name}: mode row does not provide contained horizontal scrolling.`);
    record(state.modeWidth<=viewport.width,`${viewport.name}: mode row stays inside the viewport.`,`${viewport.name}: mode row width ${state.modeWidth}px exceeds the viewport.`);
    record(state.maxModeHeight<=70,`${viewport.name}: mode buttons remain compact.`,`${viewport.name}: a mode button is ${state.maxModeHeight}px tall.`);
    record(state.maxModeWidth<viewport.width*.8,`${viewport.name}: mode buttons do not become full-page cards.`,`${viewport.name}: a mode button is ${state.maxModeWidth}px wide.`);
    record(state.workspaceColumns.split(' ').length===1||Math.abs(state.paneWidth-state.workspaceWidth)<4,`${viewport.name}: study workspace is a single readable column.`,`${viewport.name}: study workspace did not collapse to one column.`);
  }

  if([375,1440].includes(viewport.width)){
    await page.addScriptTag({content:axeSource});
    const result=await page.evaluate(async()=>window.axe.run(document,{
      runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']},
      resultTypes:['violations']
    }));
    const serious=result.violations.filter(violation=>['critical','serious'].includes(violation.impact));
    serious.forEach(violation=>failures.push(`${viewport.name}: ${violation.id} (${violation.impact}) ${violation.help}.`));
    checks.push(`${viewport.name}: axe ${result.testEngine.version} completed with ${serious.length} serious or critical violation group(s).`);
  }
}

async function testInteraction(page){
  await page.locator('#studySearch').fill('Mark 4:35-41');
  await page.locator('#exploreStudy').click();
  record((await page.locator('#passageTitle').innerText()).includes('Mark 4:35-41'),'Curated passage opens from the launcher.','Curated passage did not open from the launcher.');

  await page.locator('[data-mode="sermon"]').click();
  record((await page.locator('#modeIntro').innerText()).includes('Sermon Preparation'),'Sermon preparation mode opens.','Sermon preparation mode did not open.');

  await page.locator('[data-mode="bible"]').click();
  await page.locator('#studyNotes').fill('Mobile persistence check');
  await page.waitForTimeout(600);
  await page.reload({waitUntil:'networkidle'});
  record((await page.locator('#studyNotes').inputValue())==='Mobile persistence check','Study notes persist after reload on the device.','Study notes did not persist after reload.');
}

async function run(){
  await fs.rm(OUTPUT,{recursive:true,force:true});
  await fs.mkdir(OUTPUT,{recursive:true});
  const browser=await chromium.launch({headless:true});
  try{
    for(const viewport of viewports){
      const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
      const page=await context.newPage();
      const response=await page.goto(`${BASE_URL}/ministry-assistant.html`,{waitUntil:'domcontentloaded',timeout:30000});
      if(!response||response.status()>=400){
        failures.push(`${viewport.name}: returned HTTP ${response?.status()??'no response'}.`);
        await context.close();
        continue;
      }
      await page.waitForLoadState('networkidle').catch(()=>{});
      await page.waitForTimeout(250);
      await inspect(page,viewport);
      if(viewport.width===375)await testInteraction(page);
      const directory=path.join(OUTPUT,'screenshots');
      await fs.mkdir(directory,{recursive:true});
      await page.screenshot({path:path.join(directory,`${viewport.name}.${['p','n','g'].join('')}`),fullPage:true});
      await context.close();
    }
  }finally{
    await browser.close();
  }

  const section=(title,items,empty)=>[`## ${title}`,'',...(items.length?items.map(item=>`- ${item}`):[empty]),''];
  const report=[
    '# Interactive Bible Study Quality Review','',
    `Generated: ${new Date().toISOString()}`,'',
    `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s) and ${warnings.length} warning(s).`,'',
    ...section('Failures',failures,'No Interactive Bible Study failures were found.'),
    ...section('Warnings',warnings,'No Interactive Bible Study warnings were found.'),
    ...section('Checks completed',checks,'No checks were completed.')
  ].join('\n');
  await fs.writeFile(path.join(OUTPUT,'interactive-study-quality-review.md'),report,'utf8');
  console.log(report);
  if(failures.length)process.exitCode=1;
}

await run();
