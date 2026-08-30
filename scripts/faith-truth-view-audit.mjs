import { promises as fs } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const out=path.resolve('faith-truth-view-audit-results');
const sizes=[
 {name:'mobile-375',width:375,height:812},
 {name:'tablet-portrait-768',width:768,height:1024},
 {name:'small-laptop-1024',width:1024,height:768},
 {name:'tablet-landscape-1180',width:1180,height:820},
 {name:'desktop-1440',width:1440,height:1000}
];
const views=['participant','leader','teaching','print'];
const failures=[];
const report=[];
await fs.rm(out,{recursive:true,force:true});await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const size of sizes){
  const context=await browser.newContext({viewport:{width:size.width,height:size.height},deviceScaleFactor:1});
  for(const view of views){
   const page=await context.newPage();
   const response=await page.goto(`${base}/current-events-series.html?week=1`,{waitUntil:'domcontentloaded',timeout:30000});
   if(!response||response.status()>=400){failures.push(`${size.name}/${view}: HTTP ${response?.status()}`);await page.close();continue;}
   await page.waitForSelector('.v2-view-switcher-shell [data-view]',{state:'visible',timeout:10000});
   await page.locator(`.v2-view-switcher-shell [data-view="${view}"]`).click();
   await page.waitForTimeout(150);
   await page.evaluate(()=>window.scrollTo(0,0));
   const metrics=await page.evaluate(expected=>{
    const visible=e=>Boolean(e)&&!e.hidden&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden';
    const insideHorizontalScroller=el=>{for(let parent=el?.parentElement;parent;parent=parent.parentElement){const style=getComputedStyle(parent);if(['auto','scroll'].includes(style.overflowX))return true;}return false;};
    const root=document.documentElement;
    const groups=[...document.querySelectorAll('[role="tablist"]')].filter(g=>g.querySelector('[data-view="participant"]')&&g.querySelector('[data-view="leader"]'));
    const tabs=[...document.querySelectorAll('.v2-view-switcher-shell [data-view]')];
    const active=tabs.filter(b=>b.getAttribute('aria-selected')==='true').map(b=>b.dataset.view);
    const panels={participant:document.querySelector('.v2-participant-guide'),leader:document.querySelector('.v2-leader-guide'),teaching:document.querySelector('.v2-teaching-view'),print:document.querySelector('.v2-print-view')};
    const visibleViews=Object.entries(panels).filter(([,p])=>visible(p)).map(([k])=>k);
    const sidebar=visible(document.querySelector('.lesson-sidebar'));
    const layout=document.querySelector('.lesson-layout')?.getBoundingClientRect();
    const article=document.querySelector('.series-lesson')?.getBoundingClientRect();
    const rows=[...new Set(tabs.map(b=>Math.round(b.getBoundingClientRect().top)))].length;
    const buttonMin=tabs.length?Math.min(...tabs.map(b=>b.getBoundingClientRect().height)):0;
    const outside=[...document.querySelectorAll('body *')].filter(el=>{const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||el.closest('[hidden],[aria-hidden="true"]')||insideHorizontalScroller(el))return false;const r=el.getBoundingClientRect();return r.width>2&&r.height>2&&!['auto','scroll'].includes(s.overflowX)&&(r.right>root.clientWidth+3||r.left<-3)}).slice(0,6).map(el=>({tag:el.tagName,className:typeof el.className==='string'?el.className.slice(0,70):'',text:(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,80)}));
    return {expected,viewport:root.clientWidth,documentWidth:Math.max(root.scrollWidth,document.body.scrollWidth),groups:groups.length,labels:tabs.map(b=>(b.textContent||'').trim()),active,visibleViews,sidebar,rows,buttonMin,fullWidth:document.querySelector('.lesson-layout')?.classList.contains('v2-full-width-view')||false,articleFill:layout&&article?article.width/layout.width:0,outside};
   },view);
   const expectedRows=size.width<=1024?2:1;
   const expectedSidebar=view==='participant'&&size.width>880;
   const expectedLabels=['Participant Guide','Expanded Leader Guide','Teaching Guide','Print'];
   if(metrics.groups!==1)failures.push(`${size.name}/${view}: ${metrics.groups} view tablists`);
   if(JSON.stringify(metrics.labels)!==JSON.stringify(expectedLabels))failures.push(`${size.name}/${view}: labels ${JSON.stringify(metrics.labels)}`);
   if(metrics.active.length!==1||metrics.active[0]!==view)failures.push(`${size.name}/${view}: active ${JSON.stringify(metrics.active)}`);
   if(metrics.visibleViews.length!==1||metrics.visibleViews[0]!==view)failures.push(`${size.name}/${view}: visible panels ${JSON.stringify(metrics.visibleViews)}`);
   if(metrics.rows!==expectedRows)failures.push(`${size.name}/${view}: ${metrics.rows} switcher rows, expected ${expectedRows}`);
   if(metrics.buttonMin<44)failures.push(`${size.name}/${view}: ${Math.round(metrics.buttonMin)}px minimum button height`);
   if(metrics.sidebar!==expectedSidebar)failures.push(`${size.name}/${view}: sidebar ${metrics.sidebar}, expected ${expectedSidebar}`);
   if(view!=='participant'&&(!metrics.fullWidth||metrics.articleFill<.94))failures.push(`${size.name}/${view}: nonparticipant full width ${metrics.fullWidth}, fill ${metrics.articleFill.toFixed(2)}`);
   if(metrics.documentWidth>metrics.viewport+2||metrics.outside.length)failures.push(`${size.name}/${view}: overflow ${JSON.stringify(metrics.outside)}`);
   report.push({size:size.name,width:size.width,height:size.height,view,...metrics});
   const dir=path.join(out,size.name);await fs.mkdir(dir,{recursive:true});
   await page.screenshot({path:path.join(dir,`${view}.png`),fullPage:true});
   await page.close();
  }
  await context.close();
 }
}finally{await browser.close();}
await fs.writeFile(path.join(out,'metrics.json'),JSON.stringify(report,null,2));
await fs.writeFile(path.join(out,'report.txt'),failures.length?`FAILED\n${failures.join('\n')}`:`PASSED\n20 Faith & Truth view/layout combinations passed.`);
console.log(failures.length?`FAILED\n${failures.join('\n')}`:'PASSED\n20 Faith & Truth view/layout combinations passed.');
if(failures.length)process.exitCode=1;
