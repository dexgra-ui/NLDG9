import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const packs=[];
const ctx={window:{NLDG_GAME_PACKS:{register:p=>packs.push(p)}},console};
vm.createContext(ctx);
const packFile=['game-packs','scripture-suspicion-challenge.js'].join('/');
vm.runInContext(fs.readFileSync(packFile,'utf8'),ctx);
assert.equal(packs.length,1);
const q=packs[0].questions;
assert.equal(q.length,30);
assert.equal(q.filter(x=>x.category==='Think Deeper').length,15);
assert.equal(q.filter(x=>x.category==='Dig Deeper').length,15);
assert.equal(new Set(q.map(x=>x.id)).size,30);
for(const x of q){
 assert.ok(['Scripture','Suspicion'].includes(x.answer));
 assert.ok(x.prompt&&x.scripture&&x.explanation);
 assert.ok(['medium','hard'].includes(x.difficulty));
}
const html=fs.readFileSync('scripture-or-suspicion.html','utf8');
for(const fragment of ['id="questionStyle"','id="tier"','function filters()','id="digLink"'])assert.ok(html.includes(fragment),fragment);
const index=fs.readFileSync('game-packs/index.js','utf8');
assert.ok(index.includes('scripture-suspicion-challenge'));
console.log('PASS: 30 challenge questions, levels, IDs, references, UI and index');
