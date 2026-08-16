import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE='http://127.0.0.1:4173';
const failures=[];
const checks=[];
const fail=message=>failures.push(message);
const requireTrue=(condition,message)=>{if(!condition)throw new Error(message)};
async function run(name,fn){try{await fn();checks.push(name);console.log(`PASS: ${name}`);}catch(error){fail(`${name}: ${error.message}`);console.error(`FAIL: ${name}: ${error.message}`);}}

const packageName=['chess','js'].join('.');
const enginePath=['node_modules',packageName,'dist','esm',packageName].join('/');
const engineBody=await fs.readFile(enginePath,'utf8');
await fs.mkdir('scripture-chess-audit-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900}});
await context.route('https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js',route=>route.fulfill({status:200,contentType:'application/javascript; charset=utf-8',body:engineBody}));
const page=await context.newPage();
const consoleErrors=[];
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
page.on('pageerror',error=>consoleErrors.push(error.message));

async function openPrototype(){
 await page.goto(`${BASE}/scripture-chess-prototype.html?test=1`,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>Boolean(window.ScriptureChessTest),null,{timeout:15000});
}
async function state(){return page.evaluate(()=>window.ScriptureChessTest.state());}
async function testStart(level='intermediate'){return page.evaluate(value=>window.ScriptureChessTest.start(value),level);}
async function setPosition(fen){const ok=await page.evaluate(value=>window.ScriptureChessTest.setPosition(value),fen);requireTrue(ok,`Could not load test FEN: ${fen}`);}
async function testMove(from,to,promotion){return page.evaluate(([a,b,p])=>window.ScriptureChessTest.move(a,b,p),[from,to,promotion||null]);}
async function resolveLeaderChallenge(award=false){
 await page.click('#revealAnswerBtn');
 await page.waitForSelector('#answerPanel:not(.hidden)');
 await page.click(award?'#awardPointBtn':'#noPointBtn');
 await page.click('#continueBtn');
}

await openPrototype();
await testStart('intermediate');
await page.setViewportSize({width:1440,height:1000});
await page.screenshot({path:'scripture-chess-audit-results/scripture-chess-preview.png',fullPage:true});

await run('Prototype is isolated and test hook loads with pinned chess engine',async()=>{
 const info=await page.evaluate(()=>({version:window.ScriptureChessTest.engineVersion,url:window.ScriptureChessTest.engineUrl,robots:document.querySelector('meta[name="robots"]')?.content,badge:document.querySelector('.prototype-badge')?.textContent.trim()}));
 requireTrue(info.version==='1.4.0','Unexpected chess.js version.');
 requireTrue(info.url.includes('chess.js@1.4.0'),'Chess engine URL is not version-pinned.');
 requireTrue(info.robots==='noindex,nofollow,noarchive','Prototype is not protected from indexing.');
 requireTrue(info.badge==='Test Prototype','Prototype badge is missing.');
});

await run('Initial position, legal move, illegal move, and undo behave like real chess',async()=>{
 await testStart('intermediate');
 let current=await state();
 requireTrue(current.pieceCount===32,`Expected 32 pieces, found ${current.pieceCount}.`);
 const before=current.fen;
 requireTrue(await testMove('e2','e5')===false,'Illegal e2-e5 move was accepted.');
 current=await state();
 requireTrue(current.fen===before,'Illegal move changed the board.');
 requireTrue(await testMove('e2','e4')===true,'Legal e2-e4 move was rejected.');
 current=await state();
 requireTrue(current.moves.at(-1)==='e4','Legal move was not recorded as e4.');
 await page.evaluate(()=>window.ScriptureChessTest.undo());
 current=await state();
 requireTrue(current.moves.length===0,'Undo did not remove the move from the visible history.');
 requireTrue(current.fen.startsWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'),'Undo did not restore the starting board.');
});

await run('Capture opens a Scripture challenge and leader scoring is separate from chess',async()=>{
 await setPosition('7k/8/8/3p4/4P3/8/8/K7 w - - 0 1');
 requireTrue(await testMove('e4','d5')===true,'Capture move failed.');
 let current=await state();
 requireTrue(current.challenge?.event==='capture','Capture did not open a capture challenge.');
 requireTrue(current.scores.w===0,'Scripture score changed before the answer was scored.');
 requireTrue((await page.textContent('#challengeReference')).trim().length>0,'Challenge has no Scripture reference.');
 await page.screenshot({path:'scripture-chess-audit-results/scripture-chess-challenge-preview.png',fullPage:true});
 await resolveLeaderChallenge(true);
 current=await state();
 requireTrue(current.scores.w===1,'Awarded Scripture Point was not recorded for White.');
 requireTrue(current.challenge===null,'Challenge did not close after continuing.');
 requireTrue(current.pieceCount===3,'Chess capture did not remain on the board after Scripture scoring.');
});

await run('Beginner multiple-choice challenge scores only after answering',async()=>{
 await testStart('beginner');
 await setPosition('7k/8/8/3p4/4P3/8/8/K7 w - - 0 1');
 await testMove('e4','d5');
 requireTrue(await page.locator('#choiceList .choice').count()===4,'Beginner challenge did not show four choices.');
 requireTrue((await state()).scores.w===0,'Beginner score changed before a choice was selected.');
 await page.click('#choiceList .choice[data-correct="true"]');
 requireTrue((await state()).scores.w===1,'Correct beginner answer did not award one Scripture Point.');
 await page.click('#continueBtn');
});

await run('Check opens the harder context challenge',async()=>{
 await testStart('intermediate');
 await setPosition('7k/8/8/8/8/8/8/R6K w - - 0 1');
 requireTrue(await testMove('a1','a8')===true,'Checking rook move failed.');
 const current=await state();
 requireTrue(current.isCheck===true,'Position is not reported as check.');
 requireTrue(current.challenge?.event==='check','Check did not open a check challenge.');
 await resolveLeaderChallenge(false);
});

await run('Castling remains a legal chess move and opens a meaning challenge',async()=>{
 await testStart('intermediate');
 await setPosition('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
 requireTrue(await testMove('e1','g1')===true,'Kingside castling failed.');
 const current=await state();
 requireTrue(current.moves.at(-1)==='O-O','Castling notation was not preserved.');
 requireTrue(current.challenge?.event==='castle','Castling did not open a castling challenge.');
 await resolveLeaderChallenge(false);
});

await run('Pawn promotion uses the on-screen chooser and opens a bonus challenge',async()=>{
 await testStart('intermediate');
 await setPosition('7k/P7/8/8/8/8/8/7K w - - 0 1');
 await page.click('[data-square="a7"]');
 await page.click('[data-square="a8"]');
 requireTrue(!await page.locator('#promotionDialog').evaluate(el=>el.classList.contains('hidden')),'Promotion chooser did not open.');
 await page.click('[data-promotion="q"]');
 const current=await state();
 requireTrue(current.challenge?.event==='promotion','Promotion did not open the bonus challenge.');
 requireTrue(current.moves.at(-1).toLowerCase().includes('=q'),'Promoted queen is not reflected in move notation.');
 await resolveLeaderChallenge(false);
});

await run('Checkmate opens the final Big Question before showing the result',async()=>{
 await testStart('intermediate');
 requireTrue(await testMove('f2','f3'),'f2-f3 failed.');
 requireTrue(await testMove('e7','e5'),'e7-e5 failed.');
 requireTrue(await testMove('g2','g4'),'g2-g4 failed.');
 requireTrue(await testMove('d8','h4'),'d8-h4 checkmate move failed.');
 let current=await state();
 requireTrue(current.isCheckmate===true,'Fool’s Mate was not detected as checkmate.');
 requireTrue(current.challenge?.event==='checkmate','Checkmate did not open the Big Question.');
 requireTrue(current.completeVisible===false,'Result screen appeared before final Scripture challenge was completed.');
 await resolveLeaderChallenge(true);
 current=await state();
 requireTrue(current.completeVisible===true,'Result screen did not appear after final challenge.');
 requireTrue(current.scores.b===1,'Final Scripture Point was not awarded to the player who delivered checkmate.');
});

await run('Rematch resets board and Scripture Points independently',async()=>{
 await page.click('#rematchBtn');
 const current=await state();
 requireTrue(current.pieceCount===32,'Rematch did not restore 32 chess pieces.');
 requireTrue(current.scores.w===0&&current.scores.b===0,'Rematch did not reset Scripture Points.');
 requireTrue(current.moves.length===0,'Rematch did not clear move history.');
});

await run('Chess squares work with keyboard activation',async()=>{
 await testStart('intermediate');
 await page.locator('[data-square="e2"]').focus();
 await page.keyboard.press('Enter');
 requireTrue(await page.locator('[data-square="e2"]').evaluate(el=>el.classList.contains('selected')),'Enter did not select the e2 pawn.');
 await page.locator('[data-square="e4"]').focus();
 await page.keyboard.press('Enter');
 const current=await state();
 requireTrue(current.moves.at(-1)==='e4','Keyboard activation did not complete e2-e4.');
});

await run('Mobile layout does not overflow horizontally',async()=>{
 await page.setViewportSize({width:390,height:844});
 await openPrototype();
 await testStart('intermediate');
 const dimensions=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth,boardWidth:document.querySelector('#chessboard').getBoundingClientRect().width}));
 requireTrue(dimensions.scrollWidth<=dimensions.innerWidth+2,`Horizontal overflow detected: ${dimensions.scrollWidth}px > ${dimensions.innerWidth}px.`);
 requireTrue(dimensions.boardWidth<=dimensions.innerWidth,`Chess board exceeds mobile viewport: ${dimensions.boardWidth}px.`);
});

await run('Prototype produces no browser console or page errors',async()=>{
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
