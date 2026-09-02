import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='jonah-study-data'+js,enGuide='jonah-study-guide'+js,esData='jonah-study-data-es'+js,enPage='jonah-study'+html,esPage=['es','jonas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('jonah')?.status!=='published')fail('Jonah must be marked published.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='jonas-estudio')fail('Spanish Jonah slug must be jonas-estudio.');
 if(es?.book!=='Jonás')fail('Spanish book name must be Jonás.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Jonah must declare NTV.');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Jonah must retain four lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Jonah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.teaching?.length??0)!==6)fail(`${label}: expected six teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: expected eight discussion questions.`);
  if(!String(b?.scripture||'').startsWith('Jonás '))fail(`${label}: Scripture reference must begin with Jonás.`);
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Jonah series guide block count must match English.');
 for(const field of ['themeLabel','seriesPurposeLabel','lessonPurposeLabel','openingLabel','mainPassageLabel','supportingScriptureLabel','scriptureContextLabel','recommendedRhythm','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Spanish Jonah missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Jonah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['disaster victim-blaming','no sugieras que cada tormenta'],
  ['crisis does not guarantee reform','una crisis transforma automáticamente'],
  ['mental-health care','salud mental competente'],
  ['violence named in repentance','abandonar maldad y violencia'],
  ['institutional accountability','rendición de cuentas institucional'],
  ['safe reconciliation','no exijas contacto directo ni reconciliación'],
  ['consent and boundaries','seguridad, consentimiento, límites'],
  ['enemy population dignity','no reduce a una población enemiga'],
  ['Nineveh violence not minimized','nunca minimiza la violencia asiria'],
  ['ethnic hatred rejected','odio étnico'],
  ['antisemitism rejected','antisemitismo'],
  ['anti-Arab hatred rejected','odio antiárabe'],
  ['Christian nationalism rejected','nacionalismo cristiano'],
  ['dehumanization rejected','deshumanización'],
  ['forced reconciliation rejected','reconciliación forzada']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail(`Jonah safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/jonas-estudio'+html+'"'))fail('English Jonah page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.69.0'))fail('English Jonah page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/jonas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/jonah-study'+html+'"','../jonah-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.69.0'])if(!spanish.includes(marker))fail(`Spanish Jonah page missing ${marker}.`);
 if(!i18n.includes("'jonah-study"+html+"':'es/jonas-estudio"+html+"'"))fail('Jonah bilingual route is missing.');
 if(!hub.includes('href="jonas-estudio'+html+'"'))fail('Spanish Jonah library card is missing.');
 if(!hub.includes('cincuenta y nueve series completas y revisadas'))fail('Spanish library count must be fifty-nine series.');
}
if(errors.length){console.error('Spanish Jonah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Jonah study audit passed.');
