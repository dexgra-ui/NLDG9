import fs from 'node:fs';
import vm from 'node:vm';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const html=read('scripture-chess.html');
const questionSource=read('scripture-chess-questions.js');
const assistSource=read('scripture-chess-assist-choices.js');
const assistApp=read('scripture-chess-assist.js');

const sandbox={window:{}};
vm.runInNewContext(questionSource,sandbox,{filename:'scripture-chess-questions.js'});
vm.runInNewContext(assistSource,sandbox,{filename:'scripture-chess-assist-choices.js'});
const questions=sandbox.window.SCRIPTURE_CHESS_QUESTIONS||[];
const assist=sandbox.window.SCRIPTURE_CHESS_ASSIST_CHOICES||{};
const supported=questions.filter(item=>item.level==='intermediate'||item.level==='advanced');

assert(html.includes('scripture-chess-assist-choices.js?v=1.0.0'),'Public game must load optional choice-help data.');
assert(html.includes('scripture-chess-assist.js?v=1.0.0'),'Public game must load the Give Me Choices helper.');
assert(Object.keys(assist).length===20,`Expected 20 assisted intermediate/advanced questions, found ${Object.keys(assist).length}.`);
assert(supported.length===20,`Expected 20 intermediate/advanced questions, found ${supported.length}.`);
for(const question of supported){
  const item=assist[question.id];
  assert(Boolean(item),`Missing choice help for ${question.id}.`);
  if(!item)continue;
  assert(Array.isArray(item.choices)&&item.choices.length===4,`${question.id} must have four optional choices.`);
  assert(item.choices.includes(item.answer),`${question.id} must include its correct optional answer.`);
  assert(new Set(item.choices).size===4,`${question.id} optional choices must be unique.`);
}
for(const id of Object.keys(assist)){
  assert(!id.startsWith('beg-'),`Beginner question ${id} should use its native multiple-choice flow, not optional choice help.`);
  assert(questions.some(item=>item.id===id),`Choice-help entry ${id} does not match a Scripture Chess question.`);
}
assert(assistApp.includes("button.textContent='Give Me Choices'"),'Choice helper must expose a Give Me Choices button.');
assert(assistApp.includes("function isSoloGame(){return !computerRole.classList.contains('hidden');}"),'Choice helper must derive solo mode from the active game state.');
assert(assistApp.includes("isSoloGame()&&level.value!=='beginner'"),'Choice helper must stay limited to solo Intermediate/Advanced play.');
assert(assistApp.includes("data-assist-correct"),'Choice helper must mark the correct assisted option for deterministic scoring.');
assert(assistApp.includes('reveal.click()')&&assistApp.includes('award.click()')&&assistApp.includes('noPoint.click()'),'Choice helper must reuse the existing reveal and Scripture scoring flow.');

fs.mkdirSync('scripture-chess-audit-results',{recursive:true});
const report=[
  '# Wisdom & Strategy: Optional Choice Help Audit','',
  `Generated: ${new Date().toISOString()}`,'',
  `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s).`,'',
  `Intermediate/Advanced questions checked: **${supported.length}**`,'',
  '## Failures','',...(failures.length?failures.map(item=>`- ${item}`):['- No failures.']),'',
].join('\n');
fs.writeFileSync('scripture-chess-audit-results/assist-static-report.md',report,'utf8');
console.log(report);
if(failures.length)process.exit(1);
