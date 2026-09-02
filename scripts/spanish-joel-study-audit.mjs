import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='joel-study-data'+js,enGuide='joel-study-guide'+js,esData='joel-study-data-es'+js,enPage='joel-study'+html,esPage=['es','joel-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('joel');
if(book?.status!=='published')fail('Joel must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='joel-estudio')fail('Spanish Joel slug must be joel-estudio.');
 if(es?.book!=='Joel')fail('Spanish book name must be Joel.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Joel must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Joel must retain four lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Joel lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Joel '))fail(`${label}: Scripture reference must begin with Joel.`);
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Joel series guide block count must match English.');
 for(const field of ['seriesPurposeLabel','lessonPurposeLabel','supportingScriptureLabel'])if(!String(es?.[field]||'').trim())fail(`Spanish Joel missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Joel contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['disaster blame','pecado oculto o falta de fe'],
  ['lament dignity','lamentar no significa falta de fe'],
  ['qualified crisis care','atención médica, de salud mental, emergencia, vivienda'],
  ['manufactured fear','pánico manufacturado'],
  ['coerced confession','no obligues confesiones públicas'],
  ['children protected','exponerlos a vergüenza'],
  ['prosperity rejected','fórmula de prosperidad'],
  ['women receive the Spirit','hijas e hijos'],
  ['slavery rejected','justificar esclavitud o explotación'],
  ['date setting rejected','no fijes fechas'],
  ['human trafficking','trata, explotación sexual, trabajo forzado'],
  ['private revenge rejected','no autoriza venganza personal'],
  ['modern war speculation','guerras modernas'],
  ['antisemitism rejected','antisemitismo'],
  ['automatic protection rejected','protección física automática']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail(`Joel safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/joel-estudio'+html+'"'))fail('English Joel page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.66.0'))fail('English Joel page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/joel-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/joel-study'+html+'"','../joel-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.66.0'])if(!spanish.includes(marker))fail(`Spanish Joel page missing ${marker}.`);
 if(!i18n.includes("'joel-study"+html+"':'es/joel-estudio"+html+"'"))fail('Joel bilingual route is missing.');
 if(!hub.includes('href="joel-estudio'+html+'"'))fail('Spanish Joel library card is missing.');
 if(!hub.includes('cincuenta y seis series completas y revisadas'))fail('Spanish library count must be fifty-six series.');
}
if(errors.length){console.error('Spanish Joel study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Joel study audit passed.');
