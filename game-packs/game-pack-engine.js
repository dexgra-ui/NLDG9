(()=>{
if(window.NLDG_GAME_PACKS)return;
const STORAGE='nldg-game-pack-history-v1';
const packs=new Map();
const safe=value=>String(value??'').trim();
const readHistory=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return {}}};
const writeHistory=value=>{try{localStorage.setItem(STORAGE,JSON.stringify(value))}catch{}};
const normalizeQuestion=(question,pack)=>({
 id:safe(question.id),game:safe(question.game),prompt:safe(question.prompt),answer:question.answer,
 choices:Array.isArray(question.choices)?question.choices:[],category:safe(question.category||'General Bible'),
 difficulty:safe(question.difficulty||'mixed'),audience:Array.isArray(question.audience)?question.audience:['mixed'],
 scripture:safe(question.scripture),packId:pack.id
});
const register=pack=>{
 if(!pack||!safe(pack.id)||!Array.isArray(pack.questions))throw new Error('Invalid game pack.');
 const normalized={...pack,id:safe(pack.id),name:safe(pack.name||pack.id),version:safe(pack.version||'1.0.0'),
  games:Array.isArray(pack.games)?pack.games:[],audiences:Array.isArray(pack.audiences)?pack.audiences:['mixed']};
 normalized.questions=pack.questions.map(item=>normalizeQuestion(item,normalized)).filter(item=>item.id&&item.game&&item.prompt);
 packs.set(normalized.id,normalized);return normalized;
};
const list=()=>[...packs.values()].map(pack=>({...pack,questions:undefined,count:pack.questions.length}));
const questions=filters=>{
 const selected=Array.isArray(filters?.packs)&&filters.packs.length?new Set(filters.packs):null;
 return [...packs.values()].filter(pack=>!selected||selected.has(pack.id)).flatMap(pack=>pack.questions).filter(item=>{
  if(filters?.game&&item.game!==filters.game)return false;
  if(filters?.difficulty&&filters.difficulty!=='mixed'&&item.difficulty!==filters.difficulty)return false;
  if(filters?.category&&filters.category!=='all'&&item.category!==filters.category)return false;
  if(filters?.audience&&filters.audience!=='mixed'&&!item.audience.includes(filters.audience)&&!item.audience.includes('mixed'))return false;
  return true;
 });
};
const weightedShuffle=items=>{
 const history=readHistory();
 return items.map(item=>{const state=history[`${item.packId}:${item.id}`]||{};const age=state.lastPlayed?Date.now()-state.lastPlayed:Number.MAX_SAFE_INTEGER;const penalty=(state.timesPlayed||0)*1000000;return {item,score:Math.random()*100000+Math.min(age,31536000000)-penalty}}).sort((a,b)=>b.score-a.score).map(row=>row.item);
};
const select=(filters={},count=10)=>weightedShuffle(questions(filters)).slice(0,Math.max(0,count));
const record=item=>{const history=readHistory();const key=`${item.packId}:${item.id}`;const state=history[key]||{};history[key]={timesPlayed:(state.timesPlayed||0)+1,lastPlayed:Date.now()};writeHistory(history)};
const resetHistory=packId=>{if(!packId){localStorage.removeItem(STORAGE);return}const history=readHistory();Object.keys(history).filter(key=>key.startsWith(`${packId}:`)).forEach(key=>delete history[key]);writeHistory(history)};
const stats=packId=>{const pack=packs.get(packId);if(!pack)return null;const history=readHistory();const played=pack.questions.filter(item=>history[`${packId}:${item.id}`]).length;return {total:pack.questions.length,played,unused:pack.questions.length-played}};
window.NLDG_GAME_PACKS={register,list,questions,select,record,resetHistory,stats,version:'1.0.0'};
window.dispatchEvent(new Event('nldg-game-pack-engine-ready'));
})();