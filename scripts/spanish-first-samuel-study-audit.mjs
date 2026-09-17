import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='first-samuel-study-data'+js,enGuide='first-samuel-study-guide'+js,esData='first-samuel-study-data-es'+js,enPage='first-samuel-study'+html,esPage=['es','primera-samuel-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('first-samuel');
if(book?.status!=='published')fail('1 Samuel must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='primera-samuel-estudio')fail('Spanish 1 Samuel slug must be primera-samuel-estudio.');
 if(es?.book!=='1 Samuel')fail('Spanish book name must be 1 Samuel.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 1 Samuel must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('1 Samuel must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`1 Samuel lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)<4)fail(`${label}: needs at least four supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('1 Samuel '))fail(`${label}: Scripture reference must begin with 1 Samuel.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`1 Samuel series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('1 Samuel series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('1 Samuel series foundation must retain eight discussion questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 1 Samuel contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['infertility without formulas',['no autoriza explicar la infertilidad','no es una fórmula']],
  ['clergy abuse and protection',['no los detuvo','acción protectora']],
  ['religious symbols and non-vandalism',['no autoriza a cristianos a vandalizar','no es amuleto']],
  ['political extraction and limits',['El poder real puede reclutar cuerpos','limitada por la verdad']],
  ['harmful vows and modern violence',['Un voto dañino debe confesarse y abandonarse','nunca autoriza genocidio']],
  ['mental-health dignity',['no ofrece diagnóstico clínico','atención médica o psicológica calificada']],
  ['anointed-abuser safety',['no obligan a una persona amenazada','acceso inseguro']],
  ['evidence over family reputation',['reúne evidencia','¿protejo reputación familiar']],
  ['authority limits and safe distance',['La autoridad tiene límites morales','mantiene distancia']],
  ['Abigail and survivor burden',['interrumpe una masacre','no significa que una persona abusada deba calmar']],
  ['occult rejection and human dignity',['nada aprueba la necromancia','conserva dignidad humana']],
  ['suicide crisis care',['sufrimiento complejo','activa procedimientos de emergencia']],
  ['truthful grief over failed leaders',['termina con duelo','líder fallido sin negar bien ni daño']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`1 Samuel safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','procedimientos aprobados de protección','obligaciones legales de denuncia','abuso','acceso inseguro'])if(!all.includes(phrase))fail(`1 Samuel leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/primera-samuel-estudio'+html+'"'))fail('English 1 Samuel page must link Spanish alternate.');
 if(!english.includes('first-samuel-study-data'+js+'?v=1.1.0')||!english.includes('first-samuel-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English 1 Samuel page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/primera-samuel-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/first-samuel-study'+html+'"','../first-samuel-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.46.0'])if(!spanish.includes(marker))fail(`Spanish 1 Samuel page missing ${marker}.`);
 if(!i18n.includes("'first-samuel-study"+html+"':'es/primera-samuel-estudio"+html+"'"))fail('1 Samuel bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish 1 Samuel study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 1 Samuel study audit passed.');
