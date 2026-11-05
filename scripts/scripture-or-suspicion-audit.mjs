import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const packs=[];
const context={window:{NLDG_GAME_PACKS:{register:p=>packs.push(p),list:()=>[]},addEventListener:()=>{}},console};
vm.createContext(context);
for(const file of ['game-packs/general-bible.js','game-packs/general-bible-expanded.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
const questions=packs.flatMap(p=>p.questions.filter(q=>q.game==='scripture-or-suspicion'));
assert.equal(questions.length,80,'Expected 80 Scripture or Suspicion records');
const ids=new Set();
for(const q of questions){
 assert.ok(q.id && !ids.has(q.id),'Question IDs must be unique');ids.add(q.id);
 assert.ok(['Scripture','Suspicion'].includes(q.answer),q.id+' invalid answer');
 assert.ok(q.scripture?.trim(),q.id+' missing reference');
 assert.ok(q.explanation?.trim(),q.id+' missing explanation');
 assert.ok(q.audience?.length,q.id+' missing audience');
}
const page=fs.readFileSync('scripture-or-suspicion.html','utf8');
assert.match(page,/filteredStats/);
assert.match(page,/if\(engine\?\.list\(\)\.length\)return selected/);
assert.match(page,/id="explanation"/);
assert.match(page,/if\(answered\)return/);
console.log('PASS: 80 questions, unique IDs, references, explanations, selection guard and UI hooks');
