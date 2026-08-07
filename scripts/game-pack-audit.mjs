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
 {name:'Bible Jeopardy',file:'bible-jeopardy.html',checks:[['engine script',/game-packs\/game-pack-engine\.js/],['pack index',/game-packs\/index\.js/],['Jeopardy filter',/game:'jeopardy'/],['question selection',/\.select\(/],['play-history recording',/\.record\(/],['pack selector',/id="pack"/],['difficulty selector',/id="difficulty"/],['Scripture reference display',/id="reference"/]]},
 {name:'Faith Wheel',file:'faith-wheel.html',checks:[['Faith Wheel title',/<title>Faith Wheel/],['engine script',/game-packs\/game-pack-engine\.js/],['pack index',/game-packs\/index\.js/],['wheel filter',/game:'wheel'/],['puzzle selection',/\.select\(/],['play-history recording',/\.record\(/],['pack selector',/id="pack"/],['difficulty selector',/id="difficulty"/],['round control',/id="roundCount"/],['Scripture reference display',/id="reference"/],['teaching moment',/id="teaching"/] ]}
];
for(const integration of integrations){
 const filePath=path.join(root,integration.file);
 if(!fs.existsSync(filePath)){errors.push(`${integration.name} page is missing.`);continue;}
 const source=fs.readFileSync(filePath,'utf8');
 for(const [label,pattern] of integration.checks)if(!pattern.test(source))errors.push(`${integration.name} integration missing ${label}.`);
}

const gameCenterSource=fs.readFileSync(path.join(root,'play.html'),'utf8');
const faithWheelLinks=[...gameCenterSource.matchAll(/<a\b[^>]*data-game=["']faith-wheel\.html["'][^>]*>/g)].map(match=>match[0]);
if(faithWheelLinks.length<2)errors.push('Game Center must expose Faith Wheel in Quick Launch and the game card.');
for(const link of faithWheelLinks){
 if(!/href=["']faith-wheel\.html(?:\?[^"']*)?["']/.test(link))errors.push('Faith Wheel must launch its dedicated setup directly instead of the generic tournament wrapper.');
}
if(!/link\.dataset\.game===['"]faith-wheel\.html['"]\?`faith-wheel\.html\?group=/.test(gameCenterSource))errors.push('Audience-filtered Game Center launches must preserve the direct Faith Wheel route.');
for(const wrapperFile of ['multi-team-game-v095.html','multi-team-game-v094.html']){
 const wrapperSource=fs.readFileSync(path.join(root,wrapperFile),'utf8');
 if(!/faith-wheel\.html/.test(wrapperSource)||!/location\.replace\([\s\S]*?faith-wheel\.html\?group=/.test(wrapperSource))errors.push(`${wrapperFile}: legacy Faith Wheel links must redirect to the dedicated game instead of falling back to Scripture or Suspicion.`);
}

const retiredWheelFile=['wheel-of-faith','.html'].join('');
if(fs.existsSync(path.join(root,retiredWheelFile)))errors.push('Retired Wheel of Faith page still exists. Use Faith Wheel branding only.');
const jeopardyCount=registered.flatMap(pack=>pack.questions||[]).filter(question=>question.game==='jeopardy').length;
const wheelCount=registered.flatMap(pack=>pack.questions||[]).filter(question=>question.game==='wheel').length;
if(jeopardyCount<25)errors.push(`Bible Jeopardy needs at least 25 pack clues; found ${jeopardyCount}.`);
if(wheelCount<20)errors.push(`Faith Wheel needs at least 20 pack puzzles; found ${wheelCount}.`);

const report=['# Game Pack Audit','',`Packs: **${registered.length}**`,`Questions: **${[...questionIds].length}**`,`Jeopardy clues: **${jeopardyCount}**`,`Faith Wheel puzzles: **${wheelCount}**`,`Errors: **${errors.length}**`,`Warnings: **${warnings.length}**`,'','## Errors','',...(errors.length?errors.map(item=>`- ${item}`):['- None']),'','## Warnings','',...(warnings.length?warnings.map(item=>`- ${item}`):['- None'])].join('\n');
fs.writeFileSync(path.join(root,'GAME-PACK-AUDIT.md'),report+'\n');
console.log(report);
if(errors.length)process.exit(1);
