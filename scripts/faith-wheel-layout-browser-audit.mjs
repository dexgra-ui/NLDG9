import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const OUTPUT=path.resolve('responsive-audit-results','faith-wheel-layout');
const failures=[];
const checks=[];

await fs.mkdir(OUTPUT,{recursive:true});
const browser=await chromium.launch({headless:true});

try{
  for(const viewport of [{name:'tablet-landscape',width:1024,height:768},{name:'tablet-portrait',width:768,height:1024}]){
    const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const response=await page.goto(`${BASE_URL}/faith-wheel.html`,{waitUntil:'networkidle',timeout:30000});
    if(!response||response.status()>=400){
      failures.push(`${viewport.name}: Faith Wheel returned HTTP ${response?.status()??'no response'}.`);
      await context.close();
      continue;
    }
    await page.locator('#start').click();
    await page.waitForSelector('#gameView:not(.hidden) .puzzle-word');
    await page.waitForTimeout(200);

    const layout=await page.evaluate(()=>{
      const puzzle=document.getElementById('puzzle');
      const puzzleRect=puzzle.getBoundingClientRect();
      const words=[...puzzle.querySelectorAll('.puzzle-word')];
      const wordData=words.map(word=>{
        const rect=word.getBoundingClientRect();
        const tileTops=[...word.querySelectorAll('.tile')].map(tile=>Math.round(tile.getBoundingClientRect().top));
        return {
          text:word.textContent,
          left:rect.left,
          right:rect.right,
          top:Math.round(rect.top),
          tileTopCount:new Set(tileTops).size,
          tileCount:tileTops.length
        };
      });
      const rows=new Map();
      for(const word of wordData){
        const row=rows.get(word.top)||[];
        row.push(word);
        rows.set(word.top,row);
      }
      const rowData=[...rows.values()].map(row=>{
        const left=Math.min(...row.map(word=>word.left));
        const right=Math.max(...row.map(word=>word.right));
        const rowCenter=(left+right)/2;
        const puzzleCenter=(puzzleRect.left+puzzleRect.right)/2;
        return {left,right,offset:Math.abs(rowCenter-puzzleCenter)};
      });
      return {
        wordCount:words.length,
        hasLegacySpaces:Boolean(puzzle.querySelector('.tile.space')),
        wordData,
        rowData,
        puzzleLeft:puzzleRect.left,
        puzzleRight:puzzleRect.right,
        documentWidth:document.documentElement.scrollWidth,
        viewportWidth:document.documentElement.clientWidth
      };
    });

    if(layout.wordCount<2)failures.push(`${viewport.name}: expected a multi-word Faith Wheel puzzle.`);
    if(layout.hasLegacySpaces)failures.push(`${viewport.name}: legacy character-level space tiles are still present.`);
    for(const word of layout.wordData){
      if(word.tileCount<1)failures.push(`${viewport.name}: a puzzle word rendered without letter tiles.`);
      if(word.tileTopCount!==1)failures.push(`${viewport.name}: word "${word.text}" split across rows.`);
      if(word.left<layout.puzzleLeft-2||word.right>layout.puzzleRight+2)failures.push(`${viewport.name}: word "${word.text}" extends outside the puzzle area.`);
    }
    for(const row of layout.rowData){
      if(row.offset>24)failures.push(`${viewport.name}: a wrapped puzzle row is ${Math.round(row.offset)}px off center.`);
    }
    if(layout.documentWidth>layout.viewportWidth+2)failures.push(`${viewport.name}: page has horizontal overflow (${layout.documentWidth}px > ${layout.viewportWidth}px).`);
    if(errors.length)failures.push(`${viewport.name}: page errors: ${errors.join(' | ')}`);

    checks.push(`${viewport.name}: ${layout.wordCount} words across ${layout.rowData.length} centered row(s), with no word split across rows.`);
    await page.screenshot({path:path.join(OUTPUT,`${viewport.name}.png`),fullPage:true});
    await context.close();
  }
}finally{
  await browser.close();
}

const report=[
  '# Faith Wheel Word Layout Audit','',
  `Generated: ${new Date().toISOString()}`,'',
  `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s).`,'',
  '## Checks','',...(checks.length?checks.map(item=>`- ${item}`):['- No checks completed.']),'',
  '## Failures','',...(failures.length?failures.map(item=>`- ${item}`):['- No failures.']),'',
].join('\n');
await fs.writeFile(path.join(OUTPUT,'report.md'),report,'utf8');
console.log(report);
if(failures.length)process.exit(1);
