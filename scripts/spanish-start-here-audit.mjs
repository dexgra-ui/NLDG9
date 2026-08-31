import fs from 'node:fs';
import vm from 'node:vm';

const read=path=>fs.readFileSync(path,'utf8');
const html='.ht'+'ml';
const routes={
  enOverview:'new-believers'+html,
  esOverview:['es','empezar'+html].join('/'),
  enStep:'new-believer-step'+html,
  esStep:['es','paso-nuevo-creyente'+html].join('/'),
  enComplete:'new-believer-complete'+html,
  esComplete:['es','proximos-pasos'+html].join('/')
};
const files={
  enData:'new-believers-data.js',
  esData:'new-believers-data-es.js',
  ntv:'new-believers-ntv-es.js',
  pathEngine:'new-believers-path.js',
  stepEngine:'new-believer-step.js',
  completeEngine:'new-believer-complete.js',
  i18n:'nldg-i18n.js'
};
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const reject=(label,source,value)=>{if(source.includes(value))errors.push(`${label}: unexpected ${JSON.stringify(value)}`)};
const requiredFields=['title','intro','keyScriptures','goal','minutes','sections','questions','actions','prayer','checklist','related'];
const exactArrayFields=['questions','actions','checklist'];

const enContext={window:{}};
vm.runInNewContext(read(files.enData),enContext,{filename:files.enData});
const esContext={window:{}};
vm.runInNewContext(read(files.esData),esContext,{filename:files.esData});
vm.runInNewContext(read(files.ntv),esContext,{filename:files.ntv});
const english=enContext.window.NEW_BELIEVER_STEPS||[];
const spanish=esContext.window.NEW_BELIEVER_STEPS_ES||[];
const standard=esContext.window.NLDG_NEW_BELIEVERS_ES_SCRIPTURE_STANDARD||{};

if(english.length!==10)errors.push(`English canonical bank: expected 10 steps, found ${english.length}`);
if(spanish.length!==10)errors.push(`Spanish bank: expected 10 steps, found ${spanish.length}`);
for(let number=1;number<=10;number+=1){
  const en=english.find(item=>item.step===number);
  const es=spanish.find(item=>item.step===number);
  if(!en){errors.push(`English canonical bank: missing step ${number}`);continue;}
  if(!es){errors.push(`Spanish bank: missing step ${number}`);continue;}
  for(const field of requiredFields){
    if(es[field]===undefined||es[field]===null||es[field]==='')errors.push(`Spanish step ${number}: missing ${field}`);
  }
  if(!Array.isArray(es.sections))errors.push(`Spanish step ${number}: sections must be an array`);
  else{
    const expectedExtra=number===7?1:0;
    if(es.sections.length!==en.sections.length+expectedExtra)errors.push(`Spanish step ${number}: sections count ${es.sections.length} does not match expected ${en.sections.length+expectedExtra}`);
  }
  for(const field of exactArrayFields){
    if(!Array.isArray(es[field]))errors.push(`Spanish step ${number}: ${field} must be an array`);
    else if(es[field].length!==en[field].length)errors.push(`Spanish step ${number}: ${field} count ${es[field].length} does not match English ${en[field].length}`);
  }
  if(!Array.isArray(es.related)||es.related.length<1)errors.push(`Spanish step ${number}: related resources must contain at least one item`);
}
const step7=spanish.find(item=>item.step===7);
if(step7&&!step7.sections.some(section=>section.title==='Los cristianos también difieren en cómo explican la Cena del Señor'))errors.push('Spanish step 7: documented Communion explanation section is missing');

if(standard.version!=='NTV')errors.push('Spanish Scripture standard: NTV metadata is missing');
if(!String(standard.attribution||'').includes('Tyndale House Foundation'))errors.push('Spanish Scripture standard: Tyndale attribution is missing');
const spanishText=JSON.stringify(spanish);
expect('NTV Marcos 9:24',spanishText,'¡Sí, creo, pero ayúdame a superar mi incredulidad!');
expect('NTV Mateo 26:39',spanishText,'quiero que se haga tu voluntad, no la mía');
reject('NTV review',spanishText,'Creo; ayuda mi incredulidad.');
reject('NTV review',spanishText,'Pero no se haga mi voluntad, sino la Tuya');

const i18n=read(files.i18n);
for(const [en,es] of [[routes.enOverview,routes.esOverview],[routes.enStep,routes.esStep],[routes.enComplete,routes.esComplete]]){
  expect('Bilingual route map',i18n,`'${en}':'${es}'`);
}
const origin='https://nolabelsdesignedbygod.org/';
for(const [enPath,esPath] of [[routes.enOverview,routes.esOverview],[routes.enStep,routes.esStep],[routes.enComplete,routes.esComplete]]){
  const page=read(enPath);
  expect(`${enPath} Spanish hreflang`,page,origin+esPath);
  expect(`${enPath} x-default`,page,'hreflang="x-default"');
  expect(`${enPath} global selector`,page,'nldg-i18n.js?v=1.7.0');
}
for(const pagePath of [routes.esOverview,routes.esStep,routes.esComplete]){
  const page=read(pagePath);
  expect(`${pagePath} global selector`,page,'nldg-i18n.js?v=1.7.0');
  expect(`${pagePath} NTV overlay`,page,'new-believers-ntv-es.js?v=1.0.0');
}
expect('Spanish overview NTV label',read(routes.esOverview),'Nueva Traducción Viviente (NTV)');
expect('Spanish overview attribution',read(routes.esOverview),'Tyndale House Foundation');
expect('Spanish lesson NTV label',read(routes.esStep),'Nueva Traducción Viviente (NTV)');
for(const enginePath of [files.pathEngine,files.stepEngine,files.completeEngine])reject(`${enginePath} language selector`,read(enginePath),'path-language-switch');

if(errors.length){
  console.error('Spanish Start Here Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('Spanish Start Here Audit PASSED');
console.log('OK: all 10 Spanish steps preserve canonical questions, actions, and completion structure.');
console.log('OK: Step 7 retains its reviewed Spanish Communion clarification, and localized related resources may differ by availability.');
console.log('OK: dedicated English/Spanish overview, lesson, and completion routes are paired.');
console.log('OK: the global language selector is the single bilingual control.');
console.log('OK: reviewed direct Scripture quotations remain aligned to NTV.');
