import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='hosea-study-data'+js,enGuide='hosea-study-guide'+js,esData='hosea-study-data-es'+js,enPage='hosea-study'+html,esPage=['es','oseas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('hosea')?.status!=='published')fail('Hosea must be published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='oseas-estudio')fail('Spanish Hosea slug mismatch.');
 if(es?.book!=='Oseas')fail('Spanish Hosea book name mismatch.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Hosea must use the NTV editorial standard.');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Hosea must retain eight lessons.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Hosea lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Oseas '))fail(`${label}: Scripture must begin with Oseas.`);
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Hosea series guide block count mismatch.');
 if((es?.postLessonMapGuideBlocks?.length??-1)!==(en?.postLessonMapGuideBlocks?.length??0))fail('Hosea post-lesson guide block count mismatch.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Hosea contains disallowed Bible version ${version}.`);
 const required=[
  'cónyuge abusivo o infiel','consentimiento, seguridad','Gomer es una persona','Ningún niño debe ser etiquetado','antisemitismo','Nunca pongas esas palabras en boca de un cónyuge abusivo','trata, explotación sexual','Los límites no son propiedad','víctima a regresar a peligro','teología de reemplazo arrogante','La autoridad espiritual aumenta responsabilidad','vergüenza selectiva hacia mujeres','La medicina y la oración pueden caminar juntas','Ningún partido, presidente, nación','culpar a víctimas','ocultar abuso','Una disculpa emotiva no elimina','castigo abusivo','codependencia','confianza mesiánica','atención médica y de salud mental competente','fórmula de riqueza, fertilidad','reconciliación insegura','responsabilidades legales de denuncia'
 ];
 for(const phrase of required)if(!all.includes(phrase))fail(`Spanish Hosea safeguard missing: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/oseas-estudio'+html+'"'))fail('English Hosea page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.65.0'))fail('English Hosea page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/oseas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/hosea-study'+html+'"','../hosea-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.65.0'])if(!spanish.includes(marker))fail(`Spanish Hosea page missing ${marker}.`);
 if(!i18n.includes("'hosea-study"+html+"':'es/oseas-estudio"+html+"'"))fail('Hosea bilingual route is missing.');
 if(!hub.includes('href="oseas-estudio'+html+'"'))fail('Spanish Hosea library card is missing.');
 if(!hub.includes('cincuenta y cinco series completas y revisadas'))fail('Spanish library count must be fifty-five series.');
}
if(errors.length){console.error('Spanish Hosea study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Hosea study audit passed.');
