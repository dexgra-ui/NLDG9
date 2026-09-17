import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='first-kings-study-data'+js,enGuide='first-kings-study-guide'+js,esData='first-kings-study-data-es'+js,enPage='first-kings-study'+html,esPage=['es','primera-reyes-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('first-kings');
if(book?.status!=='published')fail('1 Kings must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='primera-reyes-estudio')fail('Spanish 1 Kings slug must be primera-reyes-estudio.');
 if(es?.book!=='1 Reyes')fail('Spanish book name must be 1 Reyes.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 1 Kings must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('1 Kings must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`1 Kings lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)<4)fail(`${label}: needs at least four supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('1 Reyes '))fail(`${label}: Scripture reference must begin with 1 Reyes.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`1 Kings series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('1 Kings series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('1 Kings series foundation must retain eight discussion questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 1 Kings contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['Abishag and violent consolidation',['propiedad real transferible','No conviertas ejecuciones en modelo de liderazgo']],
  ['forced labor and institutional immunity',['No romantices trabajo forzado','no vuelven inmune a una institución']],
  ['anti-racism and responsibility',['No uses capítulo 11 contra matrimonio interracial','No culpes a mujeres por decisiones de un rey']],
  ['division and child suffering',['no vuelve buena la arrogancia','conectes muerte infantil con pecado paterno']],
  ['Jezebel labels and Hiel uncertainty',['No uses Jezabel como insulto','No interpretes muerte infantil como prueba de pecado paterno']],
  ['widow exploitation and Carmel violence',['No presiones a pobres a dar lo último','La ejecución no autoriza violencia']],
  ['self-harm dignity and crisis response',['La autolesión señala angustia','Ante autolesión o peligro actual']],
  ['Elijah crisis care',['No diagnostiques a Elías','no dejes sola a la persona']],
  ['Naboth and disputed vision',['herencia del pacto','espíritu engañador como difícil y disputado']],
  ['antisemitism',['nunca justifican antisemitismo']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`1 Kings safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','obligaciones de protección y denuncia','proceso justo','ayuda calificada'])if(!all.includes(phrase))fail(`1 Kings leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/primera-reyes-estudio'+html+'"'))fail('English 1 Kings page must link Spanish alternate.');
 if(!english.includes('first-kings-study-data'+js+'?v=1.1.0')||!english.includes('first-kings-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English 1 Kings page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/primera-reyes-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/first-kings-study'+html+'"','../first-kings-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.48.0'])if(!spanish.includes(marker))fail(`Spanish 1 Kings page missing ${marker}.`);
 if(!i18n.includes("'first-kings-study"+html+"':'es/primera-reyes-estudio"+html+"'"))fail('1 Kings bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish 1 Kings study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 1 Kings study audit passed.');
