import fs from 'node:fs';
import vm from 'node:vm';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const prototype=read('scripture-chess-prototype.html');
const publicPage=read('scripture-chess.html');
const css=read('scripture-chess.css');
const app=read('scripture-chess.js');
const questionSource=read('scripture-chess-questions.js');
const license=read('SCRIPTURE-CHESS-THIRD-PARTY-NOTICE.md');
const play=read('play.html');
const sitemap=read('sitemap.xml');

const sandbox={window:{}};
vm.runInNewContext(questionSource,sandbox,{filename:'scripture-chess-questions.js'});
const questions=sandbox.window.SCRIPTURE_CHESS_QUESTIONS||[];
const levels=['beginner','intermediate','advanced'];
const kinds=['fact','context','meaning','bonus','big'];

assert(prototype.includes('name="robots" content="noindex,nofollow,noarchive"'),'Private prototype must remain noindex.');
assert(prototype.includes('Test Prototype')&&prototype.includes('intentionally unlinked'),'Private prototype must still identify its test state.');
assert(!play.includes('scripture-chess-prototype.html')&&!sitemap.includes('scripture-chess-prototype.html'),'Private prototype must remain outside public navigation and the sitemap.');

assert(!publicPage.includes('noindex'),'Public Wisdom & Strategy: Scripture Chess page must be indexable.');
assert(publicPage.includes('rel="canonical" href="https://nolabelsdesignedbygod.org/scripture-chess.html"'),'Public page needs the production canonical URL.');
assert(publicPage.includes('property="og:title" content="Wisdom & Strategy: Scripture Chess | No Labels, Designed by God"'),'Public Open Graph title must use the Wisdom & Strategy brand.');
assert(publicPage.includes('<title>Wisdom & Strategy: Scripture Chess | No Labels, Designed by God</title>'),'Public document title must use the Wisdom & Strategy brand.');
assert(publicPage.includes('<h1>Wisdom &amp; Strategy:<br>Scripture Chess</h1>'),'Public hero must present Wisdom & Strategy: Scripture Chess.');
assert(publicPage.includes('property="og:description"')&&publicPage.includes('property="og:url"'),'Public page needs Open Graph description and URL metadata.');
assert(publicPage.includes('Exit to Game Center')&&publicPage.includes('href="play.html"'),'Public game must return players to the Game Center.');
assert(publicPage.includes('Chess results and Scripture Points stay separate')||publicPage.includes('Chess and Scripture scoring stay separate'),'Public game must explain separate chess and Scripture scoring.');
assert(play.includes('href="scripture-chess.html"')&&play.includes('<h3>Wisdom &amp; Strategy: Scripture Chess</h3>'),'Game Center must visibly link Wisdom & Strategy: Scripture Chess.');
assert(sitemap.includes('https://nolabelsdesignedbygod.org/scripture-chess.html'),'Public Scripture Chess route must be in the sitemap.');

assert(publicPage.includes('scripture-chess.css?v=1.1.0')&&publicPage.includes('scripture-chess-questions.js?v=1.1.0')&&publicPage.includes('scripture-chess.js?v=1.1.1'),'Public page must load the current production assets.');
assert(publicPage.includes('id="modeSelect"')&&publicPage.includes('Solo · Play the Computer')&&publicPage.includes('Two Players or Teams'),'Setup must offer both single-player and two-player modes.');
assert(publicPage.includes('id="aiDifficultySelect"')&&publicPage.includes('Easy · Relaxed')&&publicPage.includes('Medium · Tactical')&&publicPage.includes('Hard · Thinks Ahead'),'Single-player setup must expose three computer difficulty levels.');
assert(publicPage.includes('Stand Firm Scripture challenge'),'Setup must explain the computer-check learning mechanic.');
assert(app.includes("const COMPUTER_NAME='Wisdom & Strategy Computer'"),'Single-player opponent must align with the Wisdom & Strategy brand.');
assert(app.includes("https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js"),'Chess rules engine must stay pinned to version 1.4.0.');
assert(license.includes('BSD-2-Clause')&&license.includes('Copyright (c) 2025, Jeff Hlywa'),'Third-party chess engine notice must preserve BSD-2-Clause attribution.');
assert(publicPage.includes('id="chessboard"')&&publicPage.includes('role="grid"'),'Public page must expose a labeled chess board.');
assert(publicPage.includes('id="promotionDialog"')&&publicPage.includes('aria-modal="true"'),'Pawn promotion must have an accessible chooser.');
assert(app.includes("if(game.isCheckmate())return 'checkmate'")&&app.includes("if(move.promotion)return 'promotion'")&&app.includes("if(/^O-O/.test(move.san))return 'castle'")&&app.includes("if(game.isCheck())return 'check'")&&app.includes("if(move.captured)return 'capture'"),'Significant human chess events must map to Scripture challenges with checkmate priority.');
assert(app.includes("const eventKinds={capture:'fact',check:'context',castle:'meaning',promotion:'bonus',checkmate:'big',defense:'context'}"),'Chess events and Stand Firm defense must map to the intended Scripture challenge types.');
assert(app.includes("if(game.isCheck()){openChallenge('defense','w');return move;}"),'A computer check must open a Stand Firm challenge for the human player.');
assert(app.includes("function addPoint(color){if(isSinglePlayer()&&color==='b')return;"),'The computer must never earn Scripture Points in single-player mode.');
assert(app.includes("if(source==='human'&&(aiThinking||isComputerTurn()))return null;"),'A human must not be able to move the computer pieces.');
assert(app.includes("aiDifficulty==='easy'")&&app.includes("aiDifficulty==='hard'")&&app.includes('minimax('),'Computer difficulty must include relaxed, tactical, and look-ahead move selection.');
assert(app.includes("if(isSinglePlayer()&&game.turn()==='w'&&snapshots.length)previous=snapshots.pop();"),'Single-player undo must return to the human decision before the computer response.');
assert(app.includes("new URLSearchParams(location.search).has('test')")&&app.includes('window.ScriptureChessTest'),'Automated test controls must remain guarded behind the test query.');
assert(css.includes('@media(max-width:700px)')&&css.includes('@media(max-width:430px)'),'Game must include mobile layouts.');
assert(css.includes('@media(prefers-reduced-motion:reduce)'),'Game must respect reduced-motion preferences.');

assert(questions.length===30,`Expected 30 Scripture Chess questions, found ${questions.length}.`);
const ids=questions.map(item=>item.id);
assert(new Set(ids).size===ids.length,'Every Scripture Chess question ID must be unique.');
for(const level of levels){
  const levelQuestions=questions.filter(item=>item.level===level);
  assert(levelQuestions.length===10,`${level} should have 10 questions; found ${levelQuestions.length}.`);
  for(const kind of kinds){
    const subset=levelQuestions.filter(item=>item.kind===kind);
    assert(subset.length===2,`${level}/${kind} should have exactly 2 questions; found ${subset.length}.`);
  }
}
for(const question of questions){
  assert(Boolean(question.id&&question.level&&question.kind&&question.reference&&question.prompt&&question.answer&&question.explanation),`Question ${question.id||'(missing id)'} is missing required learning metadata.`);
  assert(levels.includes(question.level),`Question ${question.id} uses unsupported level ${question.level}.`);
  assert(kinds.includes(question.kind),`Question ${question.id} uses unsupported kind ${question.kind}.`);
  if(question.level==='beginner'){
    assert(Array.isArray(question.choices)&&question.choices.length===4,`Beginner question ${question.id} must have four choices.`);
    assert(question.choices.includes(question.answer),`Beginner question ${question.id} must include its correct answer among the choices.`);
  }
}

fs.mkdirSync('scripture-chess-audit-results',{recursive:true});
const report=[
  '# Wisdom & Strategy: Scripture Chess Static Audit','',
  `Generated: ${new Date().toISOString()}`,'',
  `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s).`,'',
  `Questions checked: **${questions.length}**`,'',
  'Modes: Solo vs Computer, Two Players or Teams','',
  'Computer levels: Easy, Medium, Hard','',
  'Scripture levels: Beginner, Intermediate, Advanced','',
  'Challenge types: Capture, Check, Castling, Promotion, Checkmate, Stand Firm','',
  '## Failures','',...(failures.length?failures.map(item=>`- ${item}`):['- No failures.']),'',
].join('\n');
fs.writeFileSync('scripture-chess-audit-results/static-report.md',report,'utf8');
console.log(report);
if(failures.length)process.exit(1);
