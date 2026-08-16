import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE='http://127.0.0.1:4173';
const failures=[];
const checks=[];
const run=async(name,fn)=>{try{await fn();checks.push(name);console.log(`PASS: ${name}`);}catch(error){failures.push(`${name}: ${error.message}`);console.error(`FAIL: ${name}: ${error.message}`);}};
const requireTrue=(condition,message)=>{if(!condition)throw new Error(message)};

const packageName=['chess','js'].join('.');
const enginePath=['node_modules',packageName,'dist','esm',packageName].join('/');
const engineBody=await fs.readFile(enginePath,'utf8');
const engineUrl='https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900}});
await context.route(engineUrl,route=>route.fulfill({status:200,contentType:'application/javascript; charset=utf-8',body:engineBody}));
const page=await context.newPage();

async function openGame(){
  await page.goto(`${BASE}/scripture-chess.html?test=1`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Boolean(window.ScriptureChessTest));
}
async function startSolo(level){return page.evaluate(value=>window.ScriptureChessTest.startSolo(value,'medium'),level);}
async function startTwo(level){return page.evaluate(value=>window.ScriptureChessTest.start(value),level);}
async function setCapture(){
  const ok=await page.evaluate(()=>window.ScriptureChessTest.setPosition('7k/8/8/3p4/4P3/8/8/K7 w - - 0 1'));
  requireTrue(ok,'Could not set capture position.');
  const moved=await page.evaluate(()=>window.ScriptureChessTest.move('e4','d5'));
  requireTrue(moved,'Could not trigger capture challenge.');
  await page.waitForSelector('#challengePanel:not(.hidden)');
}

await openGame();

await run('Solo Intermediate offers optional choices without replacing the open-response path',async()=>{
  await startSolo('intermediate');
  await setCapture();
  await page.waitForSelector('#giveChoicesBtn:not(.hidden)');
  requireTrue(await page.locator('#revealAnswerBtn').isVisible(),'Reveal Suggested Answer should remain available before asking for choices.');
  requireTrue((await page.textContent('#giveChoicesBtn')).trim()==='Give Me Choices','Give Me Choices label is missing.');
});

await run('Give Me Choices reveals four options and a correct choice scores automatically',async()=>{
  await page.click('#giveChoicesBtn');
  requireTrue(await page.locator('#choiceList .choice').count()===4,'Expected four optional choices.');
  const correct=page.locator('#choiceList .choice[data-assist-correct="true"]');
  requireTrue(await correct.count()===1,'Expected exactly one correct assisted choice.');
  await correct.click();
  await page.waitForSelector('#answerPanel:not(.hidden)');
  const state=await page.evaluate(()=>window.ScriptureChessTest.state());
  requireTrue(state.scores.w===1,'Correct assisted choice did not award a Scripture Point.');
  requireTrue(await page.locator('#continueBtn').isVisible(),'Continue Game should appear after assisted scoring.');
  requireTrue(!(await page.locator('#giveChoicesBtn').isVisible()),'Give Me Choices should hide after assistance is used.');
});

await run('Solo Advanced also supports optional choices and a wrong choice does not score',async()=>{
  await page.click('#continueBtn');
  await startSolo('advanced');
  await setCapture();
  await page.waitForSelector('#giveChoicesBtn:not(.hidden)');
  await page.click('#giveChoicesBtn');
  const wrong=page.locator('#choiceList .choice[data-assist-correct="false"]').first();
  await wrong.click();
  await page.waitForSelector('#answerPanel:not(.hidden)');
  const state=await page.evaluate(()=>window.ScriptureChessTest.state());
  requireTrue(state.scores.w===0,'Wrong assisted choice incorrectly awarded a Scripture Point.');
});

await run('Two-player Intermediate keeps the original open-response host flow',async()=>{
  await page.click('#continueBtn');
  await startTwo('intermediate');
  await setCapture();
  await page.waitForTimeout(50);
  requireTrue(!(await page.locator('#giveChoicesBtn').isVisible()),'Give Me Choices should stay hidden in two-player mode.');
  requireTrue(await page.locator('#revealAnswerBtn').isVisible(),'Two-player open-response reveal flow should remain available.');
});

await context.close();
await browser.close();
await fs.mkdir('scripture-chess-audit-results',{recursive:true});
const report=[
  '# Wisdom & Strategy: Optional Choice Help Browser Audit','',
  `Generated: ${new Date().toISOString()}`,'',
  `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s).`,'',
  '## Checks completed','',...(checks.length?checks.map(item=>`- ${item}`):['- None']),'',
  '## Failures','',...(failures.length?failures.map(item=>`- ${item}`):['- No failures.']),'',
].join('\n');
await fs.writeFile('scripture-chess-audit-results/assist-browser-report.md',report,'utf8');
console.log(report);
if(failures.length)process.exit(1);
