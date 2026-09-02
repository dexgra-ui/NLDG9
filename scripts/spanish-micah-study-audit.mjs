import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='micah-study-data'+js,enGuide='micah-study-guide'+js,esData='micah-study-data-es'+js,enPage='micah-study'+html,esPage=['es','miqueas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail('Missing '+file+'.');
if(spanishOldTestamentByKey.get('micah')?.status!=='published')fail('Micah must be marked published.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='miqueas-estudio')fail('Spanish Micah slug must be miqueas-estudio.');
 if(es?.book!=='Miqueas')fail('Spanish book name must be Miqueas.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Micah must declare NTV.');
 if(en?.lessons?.length!==6||es?.lessons?.length!==6)fail('Micah must retain six lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<6;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Micah lesson '+(i+1);
  if(a?.number!==b?.number)fail(label+': lesson number mismatch.');
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(label+': missing '+field+'.');
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(label+': '+field+' count must match English.');
  if((b?.teaching?.length??0)!==6)fail(label+': expected six teaching movements.');
  if((b?.questions?.length??0)!==8)fail(label+': expected eight discussion questions.');
  if(!String(b?.scripture||'').startsWith('Miqueas '))fail(label+': Scripture reference must begin with Miqueas.');
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Micah series guide block count must match English.');
 for(const field of ['themeLabel','seriesPurposeLabel','lessonPurposeLabel','openingLabel','mainPassageLabel','supportingScriptureLabel','scriptureContextLabel','recommendedRhythm','seriesPrayer'])if(!String(es?.[field]||'').trim())fail('Spanish Micah missing '+field+'.');
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp('\\b'+version+'\\b').test(raw))fail('Spanish Micah contains disallowed Bible version '+version+'.');
 const safeguards=[
  ['systems and public power','sistemas, tribunales, propiedad, gobernantes'],
  ['disaster victim-blaming','no declares que cada desastre es castigo directo'],
  ['evidence-based accountability','rendición de cuentas basada en evidencia'],
  ['legal exploitation','legal pero explotador'],
  ['land-law distinction','no equipares directamente los arreglos modernos de propiedad'],
  ['unsupported accusations','acusaciones sin fundamento'],
  ['affected voices','las voces afectadas'],
  ['transparent finances','finanzas transparentes'],
  ['present protection','protección de quienes sufren ataques'],
  ['reasonable safety and defense','abandonar seguridad ni defensa razonables'],
  ['prudent care','cuidado prudente'],
  ['nonpartisan justice','plataforma de un partido'],
  ['accountable mercy','evitar la rendición de cuentas'],
  ['safe reconciliation','reconciliación insegura'],
  ['distinct repair roles','perdón, rendición de cuentas, límites, restitución y reconstrucción de la confianza'],
  ['Christ-centered Bethlehem hope','cumplimiento en jesús']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail('Micah safeguard missing '+label+': '+phrase+'.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/miqueas-estudio'+html+'"'))fail('English Micah page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.70.0'))fail('English Micah page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/miqueas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/micah-study'+html+'"','../micah-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.70.0'])if(!spanish.includes(marker))fail('Spanish Micah page missing '+marker+'.');
 if(!i18n.includes("'micah-study"+html+"':'es/miqueas-estudio"+html+"'"))fail('Micah bilingual route is missing.');
 if(!hub.includes('href="miqueas-estudio'+html+'"'))fail('Spanish Micah library card is missing.');
 if(!hub.includes('sesenta series completas y revisadas'))fail('Spanish library count must be sixty series.');
}
if(errors.length){console.error('Spanish Micah study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Micah study audit passed.');
