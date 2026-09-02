import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='amos-study-data'+js,enGuide='amos-study-guide'+js,esData='amos-study-data-es'+js,enPage='amos-study'+html,esPage=['es','amos-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('amos');
if(book?.status!=='published')fail('Amos must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='amos-estudio')fail('Spanish Amos slug must be amos-estudio.');
 if(es?.book!=='Amós')fail('Spanish book name must be Amós.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Amos must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==7||es?.lessons?.length!==7)fail('Amos must retain seven lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<7;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Amos lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Amós '))fail(`${label}: Scripture reference must begin with Amós.`);
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Amos series guide block count must match English.');
 if((es?.seriesOverviewParagraphs?.length??-1)!==(en?.seriesOverviewParagraphs?.length??0))fail('Spanish Amos series overview count must match English.');
 for(const field of ['themeLabel','seriesPurposeLabel','lessonPurposeLabel','openingLabel','mainPassageLabel','supportingScriptureLabel','scriptureContextLabel','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Spanish Amos missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Amos contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['debt dignity','la deuda nunca elimina la dignidad'],
  ['worship and exploitation','la actividad religiosa no limpia'],
  ['covenant superiority rejected','nunca debe convertirse en superioridad'],
  ['antisemitism rejected','antisemitismo'],
  ['prosperity not favor meter','no son medidores simples del favor de dios'],
  ['misogyny rejected','permiso para misoginia'],
  ['disaster victim blaming rejected','pecado oculto específico o fe insuficiente'],
  ['partisan justice rejected','autocelebración partidista'],
  ['institutional silencing rejected','silenciar reportes creíbles'],
  ['prophetic claims tested','prueba los mensajes mediante escritura, carácter, comunidad, evidencia y fruto'],
  ['retaliation rejected','sin defenderte ni tomar represalias'],
  ['restoration requires repair','restitución, reparación material'],
  ['rest not shamed','descanso, belleza, música, celebración y disfrute son dones']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase))fail(`Amos safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/amos-estudio'+html+'"'))fail('English Amos page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.67.0'))fail('English Amos page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/amos-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/amos-study'+html+'"','../amos-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.67.0'])if(!spanish.includes(marker))fail(`Spanish Amos page missing ${marker}.`);
 if(!i18n.includes("'amos-study"+html+"':'es/amos-estudio"+html+"'"))fail('Amos bilingual route is missing.');
 if(!hub.includes('href="amos-estudio'+html+'"'))fail('Spanish Amos library card is missing.');
 if(!hub.includes('cincuenta y siete series completas y revisadas'))fail('Spanish library count must be fifty-seven series.');
}
if(errors.length){console.error('Spanish Amos study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Amos study audit passed.');
