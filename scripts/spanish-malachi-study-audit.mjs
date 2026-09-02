import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentBooks, spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='malachi-study-data'+js,enGuide='malachi-study-guide'+js,esData='malachi-study-data-es'+js,enPage='malachi-study'+html,esPage=['es','malaquias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail('Missing '+file+'.');
if(spanishOldTestamentByKey.get('malachi')?.status!=='published')fail('Malachi must be marked published.');
if(spanishOldTestamentBooks.filter(book=>book.status==='published').length!==39)fail('All 39 Old Testament books must be published in Spanish.');
if(spanishOldTestamentBooks.some(book=>book.status==='prepared'))fail('No Old Testament book should remain prepared after Malachi.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='malaquias-estudio')fail('Spanish Malachi slug must be malaquias-estudio.');
 if(es?.book!=='Malaquías')fail('Spanish book name must be Malaquías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Malachi must declare NTV.');
 if(en?.lessons?.length!==5||es?.lessons?.length!==5)fail('Malachi must retain five lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','examination','challenge','caution','prayer'];
 for(let i=0;i<5;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Malachi lesson '+(i+1);
  if(a?.number!==b?.number)fail(label+': lesson number mismatch.');
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(label+': missing '+field+'.');
  if(!String(b?.context||'').trim())fail(label+': missing context.');
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(label+': '+field+' count must match English.');
  if((b?.teaching?.length??0)!==6)fail(label+': expected six teaching movements.');
  if((b?.questions?.length??0)!==8)fail(label+': expected eight discussion questions.');
  if((b?.supporting?.length??0)!==3)fail(label+': expected three supporting Scriptures.');
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(label+': incomplete teaching movement.');
  if(!String(b?.scripture||'').startsWith('Malaquías '))fail(label+': Scripture reference must begin with Malaquías.');
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Malachi guide block count must match English.');
 for(let i=0;i<(en?.seriesGuideBlocks?.length||0);i++){
  const a=en.seriesGuideBlocks[i],b=es.seriesGuideBlocks[i],label='Malachi guide block '+(i+1);
  if(!b?.title?.trim())fail(label+': missing title.');
  if(Array.isArray(a?.items)){
   if((b?.items?.length??-1)!==a.items.length)fail(label+': item count must match English.');
   for(const item of b?.items||[])if(!String(item).trim())fail(label+': empty item.');
  }else if(!String(b?.text||'').trim())fail(label+': missing text.');
 }
 const richFields=['themeLabel','seriesPurposeLabel','purpose','lessonPurposeLabel','openingLabel','mainPassageLabel','supportingScriptureLabel','scriptureContextLabel'];
 for(const field of richFields)if(!String(es?.[field]||'').trim())fail('Spanish Malachi missing '+field+'.');
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp('\\b'+version+'\\b').test(raw))fail('Spanish Malachi contains disallowed Bible version '+version+'.');
 for(const phrase of ['Central Aim','Series Purpose','Historical and Literary Setting','Lesson Map','Recommended Rhythm','Leader Commitments','Pastoral Safeguards','Christ-Centered Reading','Desired Fruit'])if(raw.includes(phrase))fail('Spanish Malachi contains untranslated interface label: '+phrase+'.');
 const safeguards=[
  ['Edom is not ethnic superiority','no de superioridad étnica'],
  ['election is grace not superiority','la elección es gracia, no superioridad'],
  ['leaders carry greater responsibility','mayor influencia significa mayor responsabilidad'],
  ['authority cannot protect abuse','proteger abuso'],
  ['intermarriage issue is not ethnicity','el problema no es la etnia de una persona'],
  ['marriage does not authorize domination','no dominio de una persona sobre otra'],
  ['harmed spouses are not trapped','nunca debe obligar a una persona dañada a permanecer insegura'],
  ['wage theft and exploitation are named','robo de salarios y opresión'],
  ['tithing is not guaranteed wealth','no puede venderse como garantía de riqueza personal'],
  ['giving must not be pressured','dar nunca debe conseguirse mediante presión'],
  ['final judgment belongs to God','no reciben permiso para ejecutar el juicio de dios por su cuenta'],
  ['healing is not an automatic present promise','sin prometer que toda enfermedad será sanada ahora'],
  ['reconciliation cannot be forced','la reconciliación bíblica requiere verdad, seguridad y responsabilidad'],
  ['forgiveness distinct from trust','el perdón no borra consecuencias, elimina límites ni restaura automáticamente la confianza'],
  ['professional help preserved','ayuda médica, de salud mental, legal, financiera o de protección apropiada'],
  ['Jewish setting protected','respetar el contexto judío de malaquías'],
  ['Jesus centered','jesús es el señor que viene a su templo']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail('Malachi safeguard missing '+label+': '+phrase+'.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/malaquias-estudio'+html+'"'))fail('English Malachi page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.76.0'))fail('English Malachi page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/malaquias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/malachi-study'+html+'"','../malachi-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.76.0'])if(!spanish.includes(marker))fail('Spanish Malachi page missing '+marker+'.');
 if(!i18n.includes("'malachi-study"+html+"':'es/malaquias-estudio"+html+"'"))fail('Malachi bilingual route is missing.');
 if(!hub.includes('href="malaquias-estudio'+html+'"'))fail('Spanish Malachi library card is missing.');
 if(!hub.includes('sesenta y seis series completas y revisadas'))fail('Spanish library count must be sixty-six series.');
 if(!hub.includes('Los 66 libros, disponibles en español.'))fail('Spanish library must state the 66-book collection is complete.');
}
if(errors.length){console.error('Spanish Malachi study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Malachi study audit passed.');
console.log('Spanish Old Testament complete: 39 of 39 books published.');
console.log('Spanish Bible book-study collection complete: 66 of 66 books published.');
