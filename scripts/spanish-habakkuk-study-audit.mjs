import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='habakkuk-study-data'+js,enGuide='habakkuk-study-guide'+js,esData='habakkuk-study-data-es'+js,enPage='habakkuk-study'+html,esPage=['es','habacuc-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail('Missing '+file+'.');
if(spanishOldTestamentByKey.get('habakkuk')?.status!=='published')fail('Habakkuk must be marked published.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='habacuc-estudio')fail('Spanish Habakkuk slug must be habacuc-estudio.');
 if(es?.book!=='Habacuc')fail('Spanish book name must be Habacuc.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Habakkuk must declare NTV.');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Habakkuk must retain four lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Habakkuk lesson '+(i+1);
  if(a?.number!==b?.number)fail(label+': lesson number mismatch.');
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(label+': missing '+field+'.');
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(label+': '+field+' count must match English.');
  if((b?.teaching?.length??0)!==6)fail(label+': expected six teaching movements.');
  if((b?.questions?.length??0)!==8)fail(label+': expected eight discussion questions.');
  if((b?.supporting?.length??0)!==4)fail(label+': expected four supporting Scriptures.');
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(label+': incomplete teaching movement.');
  if(!String(b?.scripture||'').startsWith('Habacuc '))fail(label+': Scripture reference must begin with Habacuc.');
 }
 if((es?.seriesOverviewParagraphs?.length??-1)!==(en?.seriesOverviewParagraphs?.length??0))fail('Spanish Habakkuk series overview count must match English.');
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Habakkuk guide block count must match English.');
 for(let i=0;i<(en?.seriesGuideBlocks?.length||0);i++){
  const a=en.seriesGuideBlocks[i],b=es.seriesGuideBlocks[i],label='Habakkuk guide block '+(i+1);
  if(!b?.title?.trim())fail(label+': missing title.');
  if(Array.isArray(a?.items)){
   if((b?.items?.length??-1)!==a.items.length)fail(label+': item count must match English.');
   for(const item of b?.items||[])if(!String(item).trim())fail(label+': empty item.');
  }else if(!String(b?.text||'').trim())fail(label+': missing text.');
 }
 const richFields=['themeLabel','seriesPurposeLabel','lessonPurposeLabel','openingLabel','mainPassageLabel','supportingScriptureLabel','scriptureContextLabel','seriesPrayerLabel','seriesPrayer'];
 for(const field of richFields)if(!String(es?.[field]||'').trim())fail('Spanish Habakkuk missing '+field+'.');
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp('\\b'+version+'\\b').test(raw))fail('Spanish Habakkuk contains disallowed Bible version '+version+'.');
 for(const phrase of ['Series Overview','Lesson Purpose','Opening Discussion','Main Passage','Supporting Scriptures','Scripture Context','Closing Prayer'])if(raw.includes(phrase))fail('Spanish Habakkuk contains untranslated interface label: '+phrase+'.');
 const safeguards=[
  ['late seventh-century setting','crisis de judá a fines del siglo vii a. c.'],
  ['hard questions welcomed','no avergüenza a quienes hacen preguntas difíciles'],
  ['lament not spiritual failure','sin tratar el lamento como un fracaso espiritual'],
  ['Babylon not morally approved','el poder de babilonia no equivale a aprobación moral'],
  ['divine use does not sanctify cruelty','que dios use una nación para juzgar no convierte en justos su orgullo ni su crueldad'],
  ['no modern judgment claims','no identifiques a naciones modernas como instrumentos escogidos de dios para juzgar'],
  ['no calamity victim-blaming','no culpes a las víctimas por una calamidad'],
  ['success is not righteousness','el éxito no demuestra justicia'],
  ['danger is not passive waiting','nunca le digas a alguien que está en peligro que simplemente espere'],
  ['reporting protection and justice','denunciar el daño, buscar protección, procurar justicia'],
  ['Habakkuk 2:4 kept in context','habacuc 2:4 en su contexto profético y en su uso en el nuevo testamento'],
  ['sexual exploitation named','la explotación sexual y la humillación pública'],
  ['shame stays off victims','no sugieras que la vergüenza pertenece a la persona explotada; el ay recae sobre quien explota'],
  ['material devastation not hidden','no usa la adoración para ocultar la devastación económica'],
  ['bodily distress permitted','el valor y la angustia física pueden coexistir'],
  ['joy does not deny devastation','sin negar circunstancias devastadoras'],
  ['grievers not pressured','no presiones a las personas en duelo para que aparenten gozo'],
  ['no direct-punishment claims','cada tragedia es un castigo directo de dios'],
  ['cheerfulness not required','la fe exige aparentar alegría'],
  ['safety and justice prioritized','prioriza la seguridad y la justicia'],
  ['trust not passive oppression','no es aceptación pasiva de la opresión']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail('Habakkuk safeguard missing '+label+': '+phrase+'.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/habacuc-estudio'+html+'"'))fail('English Habakkuk page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.72.0'))fail('English Habakkuk page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/habacuc-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/habakkuk-study'+html+'"','../habakkuk-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.72.0'])if(!spanish.includes(marker))fail('Spanish Habakkuk page missing '+marker+'.');
 if(!i18n.includes("'habakkuk-study"+html+"':'es/habacuc-estudio"+html+"'"))fail('Habakkuk bilingual route is missing.');
 if(!hub.includes('href="habacuc-estudio'+html+'"'))fail('Spanish Habakkuk library card is missing.');
 if(!hub.includes('sesenta y dos series completas y revisadas'))fail('Spanish library count must be sixty-two series.');
}
if(errors.length){console.error('Spanish Habakkuk study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Habakkuk study audit passed.');
