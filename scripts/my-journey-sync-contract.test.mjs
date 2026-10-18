import assert from 'node:assert/strict';
import { GENERAL_STORAGE_KEYS, PRIVATE_STORAGE_KEYS, SERIES_STORAGE_KEYS, mergeCompletedLessons, planImport } from './my-journey-sync-contract.mjs';

assert(GENERAL_STORAGE_KEYS.includes('nldg-study-state'));
assert(SERIES_STORAGE_KEYS.includes('nldg-series-james'));
assert.deepEqual(mergeCompletedLessons([1,3,3],[2,3,999],4),[1,2,3]);
assert.deepEqual(mergeCompletedLessons([],[],10),[]);
const data = new Map([
 ['nldg-study-state',JSON.stringify({identity:{completed:true}})],
 ['nldg-prayers-v1',JSON.stringify([{id:'p1',details:'private'}])],
 ['nldg-notes-v1',JSON.stringify([{id:'n1',journal:'private'}])],
 ['nldg-series-james','not-json']
]);
const storage={getItem:key=>data.has(key)?data.get(key):null};
const safe=planImport(storage);
assert(safe.records.some(r=>r.key==='nldg-study-state'));
assert(safe.records.every(r=>!PRIVATE_STORAGE_KEYS.includes(r.key)));
assert(safe.rejected.includes('nldg-series-james'));
const optedIn=planImport(storage,{includePrivate:true});
assert(optedIn.records.some(r=>r.key==='nldg-prayers-v1'));
assert(optedIn.records.some(r=>r.key==='nldg-notes-v1'));
assert.equal(optedIn.version,1);
console.log('My Journey sync contract checks passed');
