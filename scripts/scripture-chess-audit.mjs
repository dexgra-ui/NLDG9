import fs from 'node:fs';
import vm from 'node:vm';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const html=read('scripture-chess-prototype.html');
const css=read('scripture-chess.css');
const app=read('scripture-chess.js');
const questionSource=read('scripture-chess-questions.js');
const license=read('SCRIPTURE-CHESS-THIRD-PARTY-NOTICE.md');
const publicFiles=['games.html','play.html','sitemap.xml','content-library.js'];
const publicText=publicFiles.map(file=>`${file}\n${read(file)}`).join('\n');

const sandbox={window:{}};
vm.runInNewContext(questionSource,sandbox,{filename:'scripture-chess-questions.js'});
const questions=sandbox.window.SCRIPTURE_CHESS_QUESTIONS||[];
const levels=['beginner','intermediate','advanced'];
const kinds=['fact','context','meaning','bonus','big'];

assert(html.includes('name="robots" content="noindex,nofollow,noarchive"'),'Prototype must remain noindex until production approval.');
assert(html.includes('Test Prototype')&&html.includes('intentionally unlinked'),'Prototype page must clearly identify its non-production state.');
assert(!publicText.includes('scripture-chess-prototype.html'),'Prototype must not be linked from games, play, sitemap, or content library before approval.');
assert(app.includes("https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js"),'Chess rules engine must be pinned to chess.js 1.4.0 for deterministic testing.');
assert(license.includes('BSD-2-Clause')&&license.includes('Copyright (c) 2025, Jeff Hlywa'),'Third-party chess engine notice must preserve the BSD-2-Clause license attribution.');
assert(html.includes('Chess and Scripture scoring stay separate')||html.includes('Chess points and Scripture Points stay separate'),'Prototype must state that Scripture scoring does not alter chess results.');
assert(html.includes('id="chessboard"')&&html.includes('role="grid"'),'Prototype must expose a labeled chess board.');
assert(html.includes('id="promotionDialog"')&&html.includes('aria-modal="true"'),'Pawn promotion must have an accessible chooser.');
assert(app.includes("if(game.isCheckmate())return 'checkmate'")&&app.includes("if(move.promotion)return 'promotion'")&&app.includes("if(/^O-O/.test(move.san))return 'castle'")&&app.includes("if(game.isCheck())return 'check'")&&app.includes("if(move.captured)return 'capture'"),'Significant chess events must map to Scripture challenges with checkmate priority.');
assert(app.includes("const eventKinds={capture:'fact',check:'context',castle:'meaning',promotion:'bonus',checkmate:'big'}"),'Each chess event must map to the intended Scripture learning challenge.');
assert(app.includes("new URLSearchParams(location.search).has('test')")&&app.includes('window.ScriptureChessTest'),'Test-only control hook must be guarded behind ?test=1.');
assert(css.includes('@media(max-width:700px)')&&css.includes('@media(max-width:430px)'),'Prototype must include mobile layouts.');
assert(css.includes('@media(prefers-reduced-motion:reduce)'),'Prototype must respect reduced-motion preferences.');

assert(questions.length===30,`Expected 30 prototype Scripture questions, found ${questions.length}.`);
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

if(failures.length){
 console.error(`Scripture Chess static audit FAILED with ${failures.length} problem(s):`);
 failures.forEach(item=>console.error(`- ${item}`));
 process.exit(1);
}
console.log(`Scripture Chess static audit PASSED: ${questions.length} questions, 3 levels, 5 chess-event challenge types, prototype remains unlinked.`);
