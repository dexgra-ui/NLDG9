import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE='http://127.0.0.1:4173';
const failures=[];
const checks=[];
const fail=message=>failures.push(message);
const requireTrue=(condition,message)=>{if(!condition)throw new Error(message)};
async function run(name,fn){try{await fn();checks.push(name);console.log(`PASS: ${name}`);}catch(error){fail(`${name}: ${error.message}`);console.error(`FAIL: ${name}: ${error.message}`);}}

const packageName=['chess','js'].join('.');
const packageSpec=['chess','js@1.4.0'].join('.');
const enginePath=['node_modules',packageName,'dist','esm',packageName].join('/');
const engineUrl=['https://cdn.jsdelivr.net/npm',packageSpec,'dist','esm',packageName].join('/');
const engineBody=await fs.readFile(enginePath,'utf8');
await fs.mkdir('scripture-chess-audit-results',{recursive:true});

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900}});
await context.route(engineUrl,route=>route.fulfill({status:200,contentType:'application/javascript; charset=utf-8',body:engineBody}));
const page=await context.newPage();
const consoleErrors=[];
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
page.on('pageerror',error=>consoleErrors.push(error.message));

async function openGame(){
  await page.goto(`${BASE}/scripture-chess.html?test=1`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Boolean(window.ScriptureChessTest),null,{timeout:15000});
}
async function state(){return page.evaluate(()=>window.ScriptureChessTest.state());}
async function start(level='intermediate'){return page.evaluate(value=>window.ScriptureChessTest.start(value),level);}
async function setPosition(fen){const ok=await page.evaluate(value=>window.ScriptureChessTest.setPosition(value),fen);requireTrue(ok,`Could not load test FEN: ${fen}`);}
async function move(from,to,promotion){return page.evaluate(([a,b,p])=>window.ScriptureChessTest.move(a,b,p),[from,to,promotion||null]);}
async function resolveChallenge(award=false){
  await page.click('#revealAnswerBtn');
  await page.waitForSelector('#answerPanel:not(.hidden)');
  await page.click(award?'#awardPointBtn':'#noPointBtn');
  await page.click('#continueBtn');
}

await openGame();

await run('Public page loads the pinned chess engine and production metadata',async()=>{
  const info=await page.evaluate(()=>({
    version:window.ScriptureChessTest.engineVersion,
    url:window.ScriptureChessTest.engineUrl,
    robots:document.querySelector('meta[name="robots"]')?.content||'',
    canonical:document.querySelector('link[rel="canonical"]')?.href||'',
    title:document.title,
    prototype:Boolean(document.querySelector('.prototype-badge'))
  }));
  requireTrue(info.version==='1.4.0','Unexpected chess engine version.');
  requireTrue(info.url.includes('@1.4.0'),'Chess engine URL is not version-pinned.');
  requireTrue(!info.robots.includes('noindex'),'Public game is still marked noindex.');
  requireTrue(info.canonical.endsWith('/scripture-chess.html'),'Public canonical URL is missing.');
  requireTrue(info.title.startsWith('Scripture Chess'),'Public title is incorrect.');
  requireTrue(info.prototype===false,'Prototype badge is visible on the public page.');
});

await run('Initial position, legal move, illegal move, and undo follow real chess rules',async()=>{
  await start('intermediate');
  let current=await state();
  requireTrue(current.pieceCount===32,`Expected 32 pieces, found ${current.pieceCount}.`);
  const before=current.fen;
  requireTrue(await move('e2','e5')===false,'Illegal e2-e5 move was accepted.');
  requireTrue((await state()).fen===before,'Illegal move changed the board.');
  requireTrue(await move('e2','e4')===true,'Legal e2-e4 move was rejected.');
  current=await state();
  requireTrue(current.moves.at(-1)==='e4','Legal move was not recorded as e4.');
  await page.evaluate(()=>window.ScriptureChessTest.undo());
  current=await state();
  requireTrue(current.moves.length===0,'Undo did not remove the move.');
  requireTrue(current.pieceCount===32,'Undo did not restore the starting board.');
});

await run('Capture opens a Scripture challenge and scoring stays separate from chess',async()=>{
  await setPosition('7k/8/8/3p4/4P3/8/8/K7 w - - 0 1');
  requireTrue(await move('e4','d5')===true,'Capture failed.');
  let current=await state();
  requireTrue(current.challenge?.event==='capture','Capture challenge did not open.');
  requireTrue(current.scores.w===0,'Scripture score changed before scoring.');
  requireTrue((await page.textContent('#challengeReference')).trim().length>0,'Challenge has no Scripture reference.');
  await page.screenshot({path:'scripture-chess-audit-results/scripture-chess-challenge-preview.png',fullPage:true});
  await resolveChallenge(true);
  current=await state();
  requireTrue(current.scores.w===1,'Scripture Point was not recorded.');
  requireTrue(current.pieceCount===3,'Chess capture was altered by Scripture scoring.');
});

await run('Beginner mode uses four choices and automatic scoring',async()=>{
  await start('beginner');
  await setPosition('7k/8/8/3p4/4P3/8/8/K7 w - - 0 1');
  await move('e4','d5');
  requireTrue(await page.locator('#choiceList .choice').count()===4,'Beginner challenge did not show four choices.');
  await page.click('#choiceList .choice[data-correct="true"]');
  requireTrue((await state()).scores.w===1,'Correct beginner answer did not score.');
  await page.click('#continueBtn');
});

await run('Check opens the context challenge',async()=>{
  await start('intermediate');
  await setPosition('7k/8/8/8/8/8/8/R6K w - - 0 1');
  requireTrue(await move('a1','a8')===true,'Checking move failed.');
  const current=await state();
  requireTrue(current.isCheck===true,'Position is not reported as check.');
  requireTrue(current.challenge?.event==='check','Check challenge did not open.');
  await resolveChallenge(false);
});

await run('Castling remains legal and opens the meaning challenge',async()=>{
  await start('intermediate');
  await setPosition('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  requireTrue(await move('e1','g1')===true,'Kingside castling failed.');
  const current=await state();
  requireTrue(current.moves.at(-1)==='O-O','Castling notation was not preserved.');
  requireTrue(current.challenge?.event==='castle','Castling challenge did not open.');
  await resolveChallenge(false);
});

await run('Pawn promotion uses the chooser and opens the bonus challenge',async()=>{
  await start('intermediate');
  await setPosition('7k/P7/8/8/8/8/8/7K w - - 0 1');
  await page.click('[data-square="a7"]');
  await page.click('[data-square="a8"]');
  requireTrue(!await page.locator('#promotionDialog').evaluate(el=>el.classList.contains('hidden')),'Promotion chooser did not open.');
  await page.click('[data-promotion="q"]');
  const current=await state();
  requireTrue(current.challenge?.event==='promotion','Promotion challenge did not open.');
  requireTrue(current.moves.at(-1).toLowerCase().includes('=q'),'Queen promotion is missing from notation.');
  await resolveChallenge(false);
});

await run('Checkmate opens the final Big Question before the result',async()=>{
  await start('intermediate');
  requireTrue(await move('f2','f3'),'f2-f3 failed.');
  requireTrue(await move('e7','e5'),'e7-e5 failed.');
  requireTrue(await move('g2','g4'),'g2-g4 failed.');
  requireTrue(await move('d8','h4'),'d8-h4 failed.');
  let current=await state();
  requireTrue(current.isCheckmate===true,'Fool’s Mate was not detected.');
  requireTrue(current.challenge?.event==='checkmate','Final Big Question did not open.');
  requireTrue(current.completeVisible===false,'Result appeared before the final challenge.');
  await resolveChallenge(true);
  current=await state();
  requireTrue(current.completeVisible===true,'Result did not appear after the final challenge.');
  requireTrue(current.scores.b===1,'Final Scripture Point was not awarded.');
});

await run('Rematch resets chess and Scripture Points',async()=>{
  await page.click('#rematchBtn');
  const current=await state();
  requireTrue(current.pieceCount===32,'Rematch did not restore the board.');
  requireTrue(current.scores.w===0&&current.scores.b===0,'Rematch did not reset Scripture Points.');
  requireTrue(current.moves.length===0,'Rematch did not clear move history.');
});

await run('Chess board works with keyboard activation',async()=>{
  await start('intermediate');
  await page.locator('[data-square="e2"]').focus();
  await page.keyboard.press('Enter');
  requireTrue(await page.locator('[data-square="e2"]').evaluate(el=>el.classList.contains('selected')),'Enter did not select e2.');
  await page.locator('[data-square="e4"]').focus();
  await page.keyboard.press('Enter');
  requireTrue((await state()).moves.at(-1)==='e4','Keyboard move e2-e4 failed.');
});

await run('Desktop and mobile layouts stay within the viewport',async()=>{
  await page.setViewportSize({width:1280,height:900});
  await openGame();
  await start('intermediate');
  await page.screenshot({path:'scripture-chess-audit-results/scripture-chess-preview.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await openGame();
  await start('intermediate');
  const dimensions=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth,boardWidth:document.querySelector('#chessboard').getBoundingClientRect().width}));
  requireTrue(dimensions.scrollWidth<=dimensions.innerWidth+2,`Horizontal overflow: ${dimensions.scrollWidth}px > ${dimensions.innerWidth}px.`);
  requireTrue(dimensions.boardWidth<=dimensions.innerWidth,'Chess board exceeds mobile viewport.');
});

await run('Public game produces no browser console or page errors',async()=>{
  requireTrue(consoleErrors.length===0,consoleErrors.join(' | ')||'Unexpected browser error.');
});

await context.close();
await browser.close();

const report=[
  '# Scripture Chess Browser Audit','',
  `Generated: ${new Date().toISOString()}`,'',
  `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s).`,'',
  '## Checks completed','',...(checks.length?checks.map(item=>`- ${item}`):['- None']),'',
  '## Failures','',...(failures.length?failures.map(item=>`- ${item}`):['- No failures.']),'',
].join('\n');
await fs.writeFile('scripture-chess-audit-results/browser-report.md',report,'utf8');
console.log(report);
if(failures.length)process.exit(1);
