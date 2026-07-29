import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require=createRequire(import.meta.url);
const axeSource=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const OUTPUT=path.resolve('leadership-toolkit-audit-results');
const failures=[];
const warnings=[];
const completed=[];
const browserErrors=[];
const expectedTools=['decision','covenant','accountability','conflict','development','transition'];
const viewports=[
  {name:'mobile-375',width:375,height:812},
  {name:'tablet-768',width:768,height:1024},
  {name:'laptop-1024',width:1024,height:768},
  {name:'desktop-1440',width:1440,height:1000}
];
const destination=route=>`${BASE_URL}/${route}`;
const escapeMarkdown=value=>String(value).replaceAll('|','\\|').replaceAll('\n',' ');
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
async function test(name,task){try{await task();completed.push(name)}catch(error){failures.push(`${name}: ${error.message}`)}}
async function ready(page){await page.waitForLoadState('domcontentloaded');await page.waitForLoadState('networkidle').catch(()=>{});await page.waitForTimeout(250)}
async function layout(page){return page.evaluate(()=>{const root=document.documentElement;const body=document.body;return{viewport:root.clientWidth,width:Math.max(root.scrollWidth,body?.scrollWidth||0)}})}
async function axe(page,label){
  await page.addScriptTag({content:axeSource});
  const result=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']},resultTypes:['violations']}));
  result.violations.forEach(violation=>{const targets=violation.nodes.slice(0,4).map(node=>node.target.join(' ')).join(', ');const message=`${label}: ${violation.id} (${violation.impact||'unknown'}) at ${targets}`;if(['critical','serious'].includes(violation.impact))failures.push(message);else warnings.push(message)});
  completed.push(`${label}: axe-core checked ${result.violations.length} violation group(s)`);
}
await fs.rm(OUTPUT,{recursive:true,force:true});
await fs.mkdir(OUTPUT,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
page.on('pageerror',error=>browserErrors.push(`pageerror: ${error.message}`));
page.on('console',message=>{if(message.type()==='error')browserErrors.push(`console: ${message.text()}`)});
try{
  await test('Toolkit page exposes all six workspaces',async()=>{
    const response=await page.goto(destination('leadership-toolkit.html'));
    assert(response&&response.status()<400,`Toolkit returned HTTP ${response?.status()??'no response'}`);
    await ready(page);
    assert(await page.locator('h1').count()===1,'Toolkit must have one H1');
    assert(await page.locator('.ltk-tool[data-tool]').count()===6,'Toolkit must contain six workspaces');
    const ids=await page.locator('.ltk-tool[data-tool]').evaluateAll(elements=>elements.map(element=>element.dataset.tool));
    assert(JSON.stringify(ids)===JSON.stringify(expectedTools),`Unexpected tool order: ${ids.join(', ')}`);
    assert(await page.locator('.ltk-tool-card').count()===6,'Overview must contain six tool cards');
  });

  await test('Every workspace has labeled fields and complete controls',async()=>{
    await page.goto(destination('leadership-toolkit.html'));await ready(page);
    for(const id of expectedTools){
      const tool=page.locator(`.ltk-tool[data-tool="${id}"]`);
      const fieldCount=await tool.locator('[data-field]').count();
      assert(fieldCount>=10,`${id} has only ${fieldCount} fields`);
      const unlabeled=await tool.locator('[data-field]').evaluateAll(fields=>fields.filter(field=>!field.closest('label')).map(field=>field.dataset.field));
      assert(unlabeled.length===0,`${id} has unlabeled fields: ${unlabeled.join(', ')}`);
      for(const action of ['save','complete','print','clear'])assert(await tool.locator(`[data-action="${action}"]`).count()===1,`${id} is missing ${action}`);
    }
  });

  await test('Saved values and completion progress survive reload',async()=>{
    await page.goto(destination('index.html'));await page.evaluate(()=>localStorage.clear());
    await page.goto(destination('leadership-toolkit.html'));await ready(page);
    const decision=page.locator('#decision-guide');
    await decision.locator('[data-field="decision"]').fill('Choose the next ministry leader');
    await decision.locator('[data-field="alignment"]').fill('Serve people, protect trust, and seek wise counsel.');
    await decision.locator('[data-action="save"]').click();
    await decision.locator('[data-action="complete"]').click();
    assert((await page.locator('#toolkitProgressLabel').textContent())?.includes('1 of 6'),'Progress did not update to one completed tool');
    await page.reload();await ready(page);
    assert(await page.locator('#decision-guide [data-field="decision"]').inputValue()==='Choose the next ministry leader','Saved decision did not survive reload');
    assert(await page.locator('#decision-guide').getAttribute('data-complete')==='true','Completion state did not survive reload');
    assert(await page.locator('#decision-guide [data-action="complete"]').getAttribute('aria-pressed')==='true','Completion control did not restore its pressed state');
  });

  await test('Leadership navigation and breadcrumbs connect the Toolkit',async()=>{
    await page.goto(destination('leadership-toolkit.html'));await ready(page);
    assert(await page.locator('.section-navigation a[href="leadership-toolkit.html"][aria-current="page"]').count()===1,'Toolkit section navigation is not active');
    assert(await page.locator('.breadcrumbs a[href="leadership.html"]').count()===1,'Toolkit breadcrumb does not include Leadership');
    await page.goto(destination('leadership-toolkit-packet.html'));await ready(page);
    assert(await page.locator('.breadcrumbs a[href="leadership.html"]').count()===1,'Packet breadcrumb does not include Leadership');
    assert(await page.locator('.breadcrumbs a[href="leadership-toolkit.html"]').count()===1,'Packet breadcrumb does not include Leadership Toolkit');
  });

  await test('Toolkit is discoverable from Leadership, resources, site map, and search',async()=>{
    for(const route of ['leadership.html','resource-center.html','site-map.html']){
      await page.goto(destination(route));await ready(page);
      assert(await page.locator('a[href="leadership-toolkit.html"]').count()>0,`${route} does not link to the Toolkit`);
    }
    await page.goto(destination('search.html'));await ready(page);
    await page.locator('#site-search').fill('Leadership Toolkit');await page.waitForTimeout(300);
    assert(await page.locator('a[href="leadership-toolkit.html"]').count()>0,'Search does not return the Toolkit');
  });

  await test('Printable packet contains all six tools and safety notes',async()=>{
    const response=await page.goto(destination('leadership-toolkit-packet.html'));
    assert(response&&response.status()<400,`Packet returned HTTP ${response?.status()??'no response'}`);
    await ready(page);
    assert(await page.locator('.packet-cover').count()===1,'Packet cover is missing');
    assert(await page.locator('.packet-tool').count()>=7,'Packet must include six tools and safety notes');
    const text=await page.locator('main').textContent();
    for(const title of ['Decision & Discernment Guide','Team Covenant Builder','Accountability & Safeguarding Plan','Conflict Repair Worksheet','Leader Development Plan','Leadership Transition Plan'])assert(text.includes(title),`Packet is missing ${title}`);
  });

  for(const viewport of viewports){
    for(const route of ['leadership-toolkit.html','leadership-toolkit-packet.html']){
      await test(`${route} fits ${viewport.name}`,async()=>{
        await page.setViewportSize({width:viewport.width,height:viewport.height});
        await page.goto(destination(route));await ready(page);
        const measured=await layout(page);
        assert(measured.width<=measured.viewport+2,`Document width ${measured.width}px exceeds ${measured.viewport}px viewport`);
      });
    }
  }

  await page.setViewportSize({width:1440,height:1000});
  for(const route of ['leadership-toolkit.html','leadership-toolkit-packet.html']){await page.goto(destination(route));await ready(page);await axe(page,route)}

  await test('Single-tool print produces a PDF',async()=>{
    await page.goto(destination('leadership-toolkit.html'));await ready(page);
    await page.evaluate(()=>document.body.dataset.printTool='decision');
    await page.emulateMedia({media:'print'});
    const file=path.join(OUTPUT,'leadership-tool-decision.pdf');
    await page.pdf({path:file,format:'Letter',printBackground:true,margin:{top:'.4in',right:'.4in',bottom:'.4in',left:'.4in'}});
    assert((await fs.stat(file)).size>10000,'Single-tool PDF is unexpectedly small');
    await page.emulateMedia({media:'screen'});
  });

  await test('Full printable packet produces a PDF',async()=>{
    await page.goto(destination('leadership-toolkit-packet.html'));await ready(page);
    await page.emulateMedia({media:'print'});
    const file=path.join(OUTPUT,'leadership-toolkit-packet.pdf');
    await page.pdf({path:file,format:'Letter',printBackground:true,margin:{top:'.25in',right:'.25in',bottom:'.25in',left:'.25in'}});
    assert((await fs.stat(file)).size>30000,'Packet PDF is unexpectedly small');
    await page.emulateMedia({media:'screen'});
  });
}finally{await context.close();await browser.close()}
if(browserErrors.length)browserErrors.forEach(error=>warnings.push(error));
const section=(title,items,empty)=>[`## ${title}`,'',...(items.length?items.map(item=>`- ${escapeMarkdown(item)}`):[empty]),''];
const report=['# Leadership Toolkit Quality Audit','',`Generated: ${new Date().toISOString()}`,'',`Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s) and ${warnings.length} warning(s).`,'',...section('Failures',failures,'No Leadership Toolkit failures were found.'),...section('Warnings for review',warnings,'No Leadership Toolkit warnings were found.'),...section('Checks completed',completed,'No Leadership Toolkit checks were completed.'),'## Artifacts','','- Interactive Decision Guide PDF','- Complete Leadership Toolkit Packet PDF',''].join('\n');
await fs.writeFile(path.join(OUTPUT,'leadership-toolkit-audit-report.md'),report,'utf8');
console.log(report);
if(failures.length)process.exitCode=1;
