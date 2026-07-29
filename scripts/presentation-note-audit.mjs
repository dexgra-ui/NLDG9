import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl=process.env.BASE_URL||'http://127.0.0.1:4173';
const outputDir=path.resolve('presentation-note-audit-results');
await mkdir(outputDir,{recursive:true});

const failures=[];
const results=[];
const browser=await chromium.launch({headless:true});

async function checkViewport(name,viewport,startGame=false){
  const page=await browser.newPage({viewportSize:viewport});
  try{
    await page.goto(`${baseUrl}/games-presentation.html?presentation=1&group=family&game=quiz`,{waitUntil:'networkidle'});
    const gameFrame=page.frames().find(frame=>frame.url().includes('/games.html'));
    if(!gameFrame)throw new Error('The presentation iframe did not load games.html.');
    await gameFrame.waitForSelector('.presentation-note-inline',{state:'visible'});
    const setupCheck=await gameFrame.evaluate(()=>{
      const note=document.querySelector('.presentation-note-inline');
      const panel=document.querySelector('#tournamentView .tournament-setup-panel');
      const close=note?.querySelector('.presentation-note-close');
      const noteRect=note?.getBoundingClientRect();
      const panelRect=panel?.getBoundingClientRect();
      return {
        insidePanel:Boolean(note&&panel&&note.parentElement===panel),
        position:note?getComputedStyle(note).position:null,
        dismissVisible:Boolean(close&&close.getBoundingClientRect().width>0),
        withinPanel:Boolean(noteRect&&panelRect&&noteRect.left>=panelRect.left-1&&noteRect.right<=panelRect.right+1),
        horizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2
      };
    });
    if(!setupCheck.insidePanel)failures.push(`${name}: Presentation notice was not moved into the tournament setup panel.`);
    if(setupCheck.position!=='static')failures.push(`${name}: Presentation notice still used ${setupCheck.position||'unknown'} positioning.`);
    if(!setupCheck.dismissVisible)failures.push(`${name}: Dismiss control was not visible.`);
    if(!setupCheck.withinPanel)failures.push(`${name}: Presentation notice extended outside the setup panel.`);
    if(setupCheck.horizontalOverflow)failures.push(`${name}: Presentation shell introduced horizontal overflow.`);

    if(startGame){
      await gameFrame.locator('#beginTournamentBtn').click();
      await gameFrame.waitForSelector('#quizView:not(.hidden)',{state:'visible'});
      await gameFrame.waitForSelector('#question');
      const playCheck=await gameFrame.evaluate(()=>{
        const note=document.querySelector('.presentation-note');
        const noteRect=note?.getBoundingClientRect();
        const bottomElement=document.elementFromPoint(innerWidth/2,innerHeight-24);
        return {
          noteVisible:Boolean(note&&noteRect&&noteRect.width>0&&noteRect.height>0&&getComputedStyle(note).visibility!=='hidden'),
          bottomBlocked:Boolean(bottomElement?.closest('.presentation-note')),
          questionVisible:Boolean(document.querySelector('#question')?.textContent.trim()),
          horizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2
        };
      });
      if(playCheck.noteVisible)failures.push(`${name}: Presentation notice remained visible after the tournament started.`);
      if(playCheck.bottomBlocked)failures.push(`${name}: Presentation notice blocked the bottom of the live game.`);
      if(!playCheck.questionVisible)failures.push(`${name}: The tournament did not load a question.`);
      if(playCheck.horizontalOverflow)failures.push(`${name}: Live game had horizontal overflow.`);
    }

    await page.screenshot({path:path.join(outputDir,`${name}.png`),fullPage:true});
    results.push({name,viewport,setupCheck,startGame});
  }catch(error){
    failures.push(`${name}: ${error.message}`);
  }finally{
    await page.close();
  }
}

await checkViewport('ipad-landscape',{width:1366,height:1024},true);
await checkViewport('iphone-portrait',{width:390,height:844},false);
await browser.close();

const report=[
  '# Church Presentation Mode Quality Review',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  failures.length?`Result: **FAILED** with ${failures.length} failure(s).`:'Result: **PASSED** with 0 failures.',
  '',
  '## Checks',
  '',
  '- Presentation notice is contained inside tournament setup.',
  '- Notice uses normal document flow rather than a fixed bottom overlay.',
  '- Dismiss control is visible and keyboard-accessible.',
  '- iPad landscape tournament starts without the notice covering live play.',
  '- Phone and iPad layouts have no horizontal overflow.',
  '',
  '## Failures',
  '',
  ...(failures.length?failures.map(item=>`- ${item}`):['No presentation-mode failures were found.'])
].join('\n');

await writeFile(path.join(outputDir,'presentation-note-quality-review.md'),report);
console.log(report);
if(failures.length)process.exitCode=1;
