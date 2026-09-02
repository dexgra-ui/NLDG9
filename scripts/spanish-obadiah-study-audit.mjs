import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='obadiah-study-data'+js,enGuide='obadiah-study-guide'+js,esData='obadiah-study-data-es'+js,enPage='obadiah-study'+html,esPage=['es','abdias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('obadiah');
if(book?.status!=='published')fail('Obadiah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='abdias-estudio')fail('Spanish Obadiah slug must be abdias-estudio.');
 if(es?.book!=='Abdías')fail('Spanish book name must be Abdías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Obadiah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==3||es?.lessons?.length!==3)fail('Obadiah must retain three lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<3;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Obadiah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Abdías '))fail(`${label}: Scripture reference must begin with Abdías.`);
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Obadiah series guide block count must match English.');
 for(const field of ['seriesPurposeLabel','lessonPurposeLabel','openingLabel','mainPassageLabel','supportingScriptureLabel','scriptureContextLabel'])if(!String(es?.[field]||'').trim())fail(`Spanish Obadiah missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Obadiah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['modern nation mapping','no conviertas edom en una etiqueta'],
  ['antisemitism rejected','antisemitismo'],
  ['anti-arab hatred rejected','odio contra árabes'],
  ['celebrating suffering rejected','no celebres sufrimiento ajeno'],
  ['crisis profiteering','precios abusivos'],
  ['survivor escape protected','rutas seguras'],
  ['trauma privacy','nunca presiones revelaciones de trauma'],
  ['revenge rejected','no autoriza venganza personal'],
  ['collective dehumanization rejected','pueblos enteros como si fueran desechables'],
  ['restoration requires repair','reparación material'],
  ['nationalism rejected','nacionalismo cristiano'],
  ['kingdom belongs to God','el reino será del señor']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail(`Obadiah safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/abdias-estudio'+html+'"'))fail('English Obadiah page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.68.0'))fail('English Obadiah page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/abdias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/obadiah-study'+html+'"','../obadiah-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.68.0'])if(!spanish.includes(marker))fail(`Spanish Obadiah page missing ${marker}.`);
 if(!i18n.includes("'obadiah-study"+html+"':'es/abdias-estudio"+html+"'"))fail('Obadiah bilingual route is missing.');
 if(!hub.includes('href="abdias-estudio'+html+'"'))fail('Spanish Obadiah library card is missing.');
 if(!hub.includes('cincuenta y ocho series completas y revisadas'))fail('Spanish library count must be fifty-eight series.');
}
if(errors.length){console.error('Spanish Obadiah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Obadiah study audit passed.');
