import fs from 'node:fs';
import vm from 'node:vm';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const html=read('scripture-chess.html');
const questionSource=read('scripture-chess-questions.js');
const varietySource=read('scripture-chess-question-variety.js');

const sandbox={window:{}};
vm.runInNewContext(questionSource,sandbox,{filename:'scripture-chess-questions.js'});
const originals=(sandbox.window.SCRIPTURE_CHESS_QUESTIONS||[]).map(item=>({...item,choices:item.choices?[...item.choices]:undefined}));
vm.runInNewContext(varietySource,sandbox,{filename:'scripture-chess-question-variety.js'});
const expanded=sandbox.window.SCRIPTURE_CHESS_QUESTIONS||[];
const rotatingKinds=['fact','context','meaning','bonus'];
const levels=['beginner','intermediate','advanced'];

assert(originals.length===30,`Expected 30 authored questions, found ${originals.length}.`);
assert(expanded.length===102,`Expected 102 runtime question entries after rotation expansion, found ${expanded.length}.`);
assert(html.includes('scripture-chess-question-variety.js?v=1.0.0'),'Scripture Chess must load the question-variety helper.');
const order=[
  html.indexOf('scripture-chess-questions.js?v=1.1.0'),
  html.indexOf('scripture-chess-question-variety.js?v=1.0.0'),
  html.indexOf('scripture-chess-assist-choices.js?v=1.0.0'),
  html.indexOf('scripture-chess.js?v=1.1.1')
];
assert(order.every(value=>value>=0)&&order.every((value,index)=>index===0||value>order[index-1]),'Question variety must load after authored questions and before assistance/game logic.');

for(const level of levels){
  const authored=originals.filter(item=>item.level===level);
  const authoredStandard=authored.filter(item=>item.kind!=='big');
  const authoredBig=authored.filter(item=>item.kind==='big');
  assert(authoredStandard.length===8,`${level} should have eight standard authored questions.`);
  assert(authoredBig.length===2,`${level} should have two Big Questions.`);

  for(const kind of rotatingKinds){
    const pool=expanded.filter(item=>item.level===level&&item.kind===kind);
    assert(pool.length===8,`${level}/${kind} should rotate through eight questions before repeating.`);
    assert(new Set(pool.map(item=>item.id)).size===8,`${level}/${kind} contains duplicate question IDs.`);
    const expectedIds=[...authoredStandard.map(item=>item.id)].sort().join(',');
    const actualIds=[...pool.map(item=>item.id)].sort().join(',');
    assert(actualIds===expectedIds,`${level}/${kind} does not contain the full eight-question standard rotation.`);
  }

  const bigPool=expanded.filter(item=>item.level===level&&item.kind==='big');
  assert(bigPool.length===2,`${level} Big Question pool should remain two dedicated finale questions.`);
  assert(new Set(bigPool.map(item=>item.id)).size===2,`${level} Big Question pool contains duplicate IDs.`);
}

const originalById=new Map(originals.map(item=>[item.id,item]));
for(const runtime of expanded){
  const original=originalById.get(runtime.id);
  assert(Boolean(original),`Runtime question ${runtime.id} has no authored source.`);
  if(!original)continue;
  for(const field of ['level','reference','prompt','answer','explanation']){
    assert(runtime[field]===original[field],`${runtime.id} changed authored ${field} wording.`);
  }
  if(original.choices){
    assert(JSON.stringify(runtime.choices)===JSON.stringify(original.choices),`${runtime.id} changed authored answer choices.`);
  }
}

fs.mkdirSync('scripture-chess-audit-results',{recursive:true});
const report=[
  '# Wisdom & Strategy: Scripture Chess Question Variety Audit','',
  `Generated: ${new Date().toISOString()}`,'',
  `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s).`,'',
  'Rotation behavior: **8 standard questions per Scripture level before a standard question can repeat**.','',
  'Dedicated finale behavior: **2 Big Questions remain reserved for checkmate**.','',
  '## Failures','',...(failures.length?failures.map(item=>`- ${item}`):['- No failures.']),'',
].join('\n');
fs.writeFileSync('scripture-chess-audit-results/question-variety-report.md',report,'utf8');
console.log(report);
if(failures.length)process.exit(1);
