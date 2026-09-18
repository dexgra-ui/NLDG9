import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='second-chronicles-study-data'+js,enGuide='second-chronicles-study-guide'+js,esData='second-chronicles-study-data-es'+js,enPage='second-chronicles-study'+html,esPage=['es','segunda-cronicas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('second-chronicles');
if(book?.status!=='published')fail('2 Chronicles must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='segunda-cronicas-estudio')fail('Spanish 2 Chronicles slug must be segunda-cronicas-estudio.');
 if(es?.book!=='2 Crónicas')fail('Spanish book name must be 2 Crónicas.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 2 Chronicles must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('2 Chronicles must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`2 Chronicles lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)<4)fail(`${label}: needs at least four supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('2 Crónicas '))fail(`${label}: Scripture reference must begin with 2 Crónicas.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`2 Chronicles series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('2 Chronicles series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('2 Chronicles series foundation must retain eight discussion questions.');
 for(const field of ['seriesTeaching','seriesQuestions'])if(es[field]?.length!==en[field]?.length)fail(`2 Chronicles ${field} must match English.`);
 if(es?.lessonSubtitleMode!==true)fail('2 Chronicles must retain lesson subtitle mode.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 2 Chronicles contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['forced labor',['trabajo coercitivo','153.600 extranjeros residentes']],
  ['temple and national misuse',['no pueden contener a Dios','una nación moderna en Israel']],
  ['royal burden',['yugo pesado','no convierte el pecado humano en virtud']],
  ['war and medicine',['no autoriza coerción religiosa','La medicina no es enemiga de la fe']],
  ['truth and alliances',['Micaías','La alabanza no es un arma manipulable']],
  ['child protection and finance',['seguridad infantil','El dinero sagrado necesita sistemas transparentes']],
  ['illness and disability',['enfermedad de Hansen','personas discapacitadas']],
  ['child sacrifice and restitution',['sacrifica hijos','liberar, vestir, alimentar, curar y devolver']],
  ['grace and safeguards',['consentimiento, protección infantil o denuncia','presión financiera']],
  ['victims and repentance',['víctimas y consecuencias nacionales no desaparecen','Hulda interpreta las Escrituras con autoridad']],
  ['antisemitism and exile',['Corrige de inmediato el antisemitismo','brutalidad imperial']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`2 Chronicles safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','responsabilidades de protección y denuncia','apoyo pastoral, médico, legal o profesional calificado','presionar revelaciones personales','silenciar preocupaciones','exigir dinero','encubrir abuso','promover nacionalismo o violencia'])if(!all.includes(phrase))fail(`2 Chronicles leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/segunda-cronicas-estudio'+html+'"'))fail('English 2 Chronicles page must link Spanish alternate.');
 if(!english.includes('second-chronicles-study-data'+js+'?v=1.1.0')||!english.includes('second-chronicles-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English 2 Chronicles page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/segunda-cronicas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/second-chronicles-study'+html+'"','../second-chronicles-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.51.0'])if(!spanish.includes(marker))fail(`Spanish 2 Chronicles page missing ${marker}.`);
 if(!i18n.includes("'second-chronicles-study"+html+"':'es/segunda-cronicas-estudio"+html+"'"))fail('2 Chronicles bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish 2 Chronicles study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 2 Chronicles study audit passed.');
