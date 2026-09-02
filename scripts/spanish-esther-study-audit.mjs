import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='esther-study-data'+js,enGuide='esther-study-guide'+js,esData='esther-study-data-es'+js,enPage='esther-study'+html,esPage=['es','ester-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('esther');
if(book?.status!=='published')fail('Esther must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='ester-estudio')fail('Spanish Esther slug must be ester-estudio.');
 if(es?.book!=='Ester')fail('Spanish book name must be Ester.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Esther must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==9||es?.lessons?.length!==9)fail('Esther must retain nine lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<9;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Esther lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Ester '))fail(`${label}: Scripture reference must begin with Ester.`);
 }
 if(es?.themeLabel!=='Tema central')fail('Esther theme label must be Tema central.');
 if((es?.seriesGuideBlocks?.length??0)!==(en?.seriesGuideBlocks?.length??0))fail('Esther series guide block count must match English.');
 if((es?.postLessonMapGuideBlocks?.length??0)!==(en?.postLessonMapGuideBlocks?.length??0))fail('Esther post-lesson guide block count must match English.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Esther contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['coercive authority and women dignity',['control masculino, humillación ni obediencia forzada','la agencia limitada deben permanecer visibles']],
  ['survival is not consent',['No describas la entrada de Ester al sistema real como un romance moderno','No culpes a víctimas por la coerción']],
  ['sexual exploitation safety',['explotación sexual','prioriza seguridad, apoyo apropiado']],
  ['antisemitism and genocide',['nombrar claramente el antisemitismo','minimicen el genocidio']],
  ['ethnic difference not suspicion',['conviertan diferencias étnicas en sospecha']],
  ['unsafe disclosure',['no exijas revelaciones que puedan ponerlo en peligro','nadie debe ser avergonzado por no revelar algo inmediatamente']],
  ['calling with boundaries',['ni presionar a alguien a exponerse a peligro','El llamado incluye sabiduría, comunidad, límites y seguridad']],
  ['providence without overclaiming',['sin afirmar que toda coincidencia es un mensaje directo de Dios','ni una fórmula para interpretar coincidencias']],
  ['truth with due process',['verdad, evidencia, debido proceso y seguridad','castigo sin proceso justo']],
  ['structural repair',['LAS ESTRUCTURAS INJUSTAS REQUIEREN RESPUESTA ESTRUCTURAL','La protección no debe dejar a personas vulnerables permanentemente dependientes y sin voz']],
  ['self-defense not revenge',['Distingue la defensa comunitaria antigua','venganza personal, el vigilantismo moderno']],
  ['violence not Christian mandate',['La violencia antigua no es un mandato cristiano para imitación','No celebres la muerte humana']],
  ['leader safeguards',['no conviertas una narración antigua en permiso para venganza personal, violencia étnica o vigilantismo']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Esther safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/ester-estudio'+html+'"'))fail('English Esther page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.54.0'))fail('English Esther page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/ester-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/esther-study'+html+'"','../esther-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.54.0'])if(!spanish.includes(marker))fail(`Spanish Esther page missing ${marker}.`);
 if(!i18n.includes("'esther-study"+html+"':'es/ester-estudio"+html+"'"))fail('Esther bilingual route is missing.');
 if(!hub.includes('href="ester-estudio'+html+'"'))fail('Spanish Esther library card is missing.');
 if(!hub.includes('cuarenta y cuatro series completas y revisadas'))fail('Spanish library count must be forty-four series.');
}
if(errors.length){console.error('Spanish Esther study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Esther study audit passed.');