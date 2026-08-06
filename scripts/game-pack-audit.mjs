import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const directory=path.join(root,'game-packs');
const errors=[];
const warnings=[];
const registered=[];
const engineFile=['game-pack-engine','.js'].join('');
const indexFile=['index','.js'].join('');
const context={window:{NLDG_GAME_PACKS:{register:pack=>registered.push(pack),list:()=>[]}},Event:class Event{},console};
context.window.addEventListener=()=>{};
context.window.dispatchEvent=()=>{};
vm.createContext(context);

for(const name of fs.readdirSync(directory).filter(name=>name.endsWith('.js')&&![engineFile,indexFile].includes(name))){
 try{vm.runInContext(fs.readFileSync(path.join(directory,name),'utf8'),context,{filename:name})}catch(error){errors.push(`${name}: could not load (${error.message})`)}
}

const packIds=new Set();
const questionIds=new Set();
const allowedGames=new Set(['scripture-or-suspicion','jeopardy','wheel','survey','family-feud','finish-the-verse','who-am-i','memory-match','lightning-round']);
const allowedAudiences=new Set(['preschool','kids','teens','adults','family','mixed']);
const allowedDifficulty=new Set(['easy','medium','hard','mixed']);

for(const pack of registered){
 if(!pack?.id)errors.push('A pack is missing its id.');
 else if(packIds.has(pack.id))errors.push(`Duplicate pack id: ${pack.id}`);
 else packIds.add(pack.id);
 if(!pack?.name)errors.push(`${pack?.id||'Unknown pack'}: missing name.`);
 if(!Array.isArray(pack?.questions)||!pack.questions.length)errors.push(`${pack?.id||'Unknown pack'}: has no questions.`);
 const localIds=new Set();
 for(const question of pack.questions||[]){
  const label=`${pack.id}:${question.id||'missing-id'}`;
  if(!question.id)errors.push(`${pack.id}: question missing id.`);
  else if(localIds.has(question.id))errors.push(`${pack.id}: duplicate question id ${question.id}.`);
  else localIds.add(question.id);
  const globalId=`${pack.id}:${question.id}`;
  if(questionIds.has(globalId))errors.push(`Duplicate global question id: ${globalId}`);else questionIds.add(globalId);
  if(!allowedGames.has(question.game))errors.push(`${label}: unsupported game ${question.game}.`);
  if(!String(question.prompt||'').trim())errors.push(`${label}: missing prompt.`);
  if(question.answer===undefined||question.answer===null||question.answer==='')errors.push(`${label}: missing answer.`);
  if(!allowedDifficulty.has(question.difficulty||'mixed'))errors.push(`${label}: unsupported difficulty ${question.difficulty}.`);
  for(const audience of question.audience||['mixed'])if(!allowedAudiences.has(audience))errors.push(`${label}: unsupported audience ${audience}.`);
  if(question.game==='scripture-or-suspicion'&&!['Scripture','Suspicion'].includes(question.answer))errors.push(`${label}: answer must be Scripture or Suspicion.`);
  if(question.game==='survey'&&!Array.isArray(question.answer))errors.push(`${label}: survey answer must be an array.`);
  if(!question.scripture&&question.answer==='Scripture')warnings.push(`${label}: Scripture statement has no reference.`);
 }
}

const indexSource=fs.readFileSync(path.join(directory,indexFile),'utf8');
for(const packId of packIds)if(!indexSource.includes(`id:'${packId}'`)&&!indexSource.includes(`id:"${packId}"`))errors.push(`${packId}: absent from the pack index.`);

const integrations=[
 {name:'Scripture or Suspicion',file:'scripture-or-suspicion.html',checks:[['engine script',/game-packs\/game-pack-engine\.js/],['pack index or pack script',/game-packs\/(?:index|general-bible)\.js/],['question selection',/NLDG_GAME_PACKS(?:\?\.)?\.select|NLDG_GAME_PACKS\?\.select|engine\?\.select/],['play-history recording',/NLDG_GAME_PACKS\?\.record|NLDG_GAME_PACKS\.record/]]},
 {name:'Bible Jeopardy',file:'bible-jeopardy.html',checks:[['engine script',/game-packs\/game-pack-engine\.js/],['pack index',/game-packs\/index\.js/],['Jeopardy filter',/game:'jeopardy'/],['question selection',/\.select\(/],['play-history recording',/\.record\(/],['pack selector',/id="pack"/],['difficulty selector',/id="difficulty"/],['Scripture reference display',/id="reference"/]]}
];
for(const integration of integrations){
 const source=fs.readFileSync(path.join(root,integration.file),'utf8');
 for(const [label,pattern] of integration.checks)if(!pattern.test(source))errors.push(`${integration.name} integration missing ${label}.`);
}

const jeopardyCount=registered.flatMap(pack=>pack.questions||[]).filter(question=>question.game==='jeopardy').length;
if(jeopardyCount<25)errors.push(`Bible Jeopardy needs at least 25 pack clues; found ${jeopardyCount}.`);

const report=['# Game Pack Audit','',`Packs: **${registered.length}**`,`Questions: **${[...questionIds].length}**`,`Jeopardy clues: **${jeopardyCount}**`,`Errors: **${errors.length}**`,`Warnings: **${warnings.length}**`,'','## Errors','',...(errors.length?errors.map(item=>`- ${item}`):['- None']),'','## Warnings','',...(warnings.length?warnings.map(item=>`- ${item}`):['- None'])].join('\n');
fs.writeFileSync(path.join(root,'GAME-PACK-AUDIT.md'),report+'\n');
console.log(report);
if(errors.length)process.exit(1);
