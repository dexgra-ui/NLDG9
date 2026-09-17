import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='second-samuel-study-data'+js,enGuide='second-samuel-study-guide'+js,esData='second-samuel-study-data-es'+js,enPage='second-samuel-study'+html,esPage=['es','segunda-samuel-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('second-samuel');
if(book?.status!=='published')fail('2 Samuel must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='segunda-samuel-estudio')fail('Spanish 2 Samuel slug must be segunda-samuel-estudio.');
 if(es?.book!=='2 Samuel')fail('Spanish book name must be 2 Samuel.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 2 Samuel must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('2 Samuel must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`2 Samuel lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)<4)fail(`${label}: needs at least four supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('2 Samuel '))fail(`${label}: Scripture reference must begin with 2 Samuel.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`2 Samuel series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('2 Samuel series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('2 Samuel series foundation must retain eight discussion questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 2 Samuel contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['Saul death accounts and lament',['El texto no armoniza los relatos','obligar a sobrevivientes a elogiar']],
  ['Uzzah and Michal safeguards',['sistemas inseguros','no dice que Dios hizo estéril a Mical']],
  ['conquest and disability dignity',['no inventar justificación','Mefiboset no simboliza que discapacidad']],
  ['Bathsheba power imbalance',['silencio bajo orden real no prueba consentimiento','no culpa a Betsabé']],
  ['abuse accountability',['Perdón no cancela denuncia','investigación independiente']],
  ['Tamar survivor care',['toda culpa pertenece al agresor','No pidas testimonios']],
  ['political sexual violence',['no vuelve moralmente bueno el abuso','concubinas en objetos de cumplimiento']],
  ['suicide crisis care',['no ofrece diagnóstico clínico','activa emergencias y atención de crisis calificada']],
  ['disability evidence safeguards',['No resuelvas la disputa Siba-Mefiboset','discapacidad como prueba']],
  ['reconciliation and access',['Regreso, perdón, reconciliación, confianza y acceso son distintos','seguridad y rendición de cuentas preceden acceso']],
  ['collective punishment and Rizpah',['nunca autoriza castigar hijos','Honra a Rizpa como agente de protesta']],
  ['census interpretive honesty',['Reconoce 2 Samuel 24:1 y 1 Crónicas 21:1','no afirmes certeza sobre el pecado del censo']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`2 Samuel safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','procedimientos aprobados de protección','obligaciones legales de denuncia','investigación independiente','acceso inseguro'])if(!all.includes(phrase))fail(`2 Samuel leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/segunda-samuel-estudio'+html+'"'))fail('English 2 Samuel page must link Spanish alternate.');
 if(!english.includes('second-samuel-study-data'+js+'?v=1.1.0')||!english.includes('second-samuel-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English 2 Samuel page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/segunda-samuel-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/second-samuel-study'+html+'"','../second-samuel-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.47.0'])if(!spanish.includes(marker))fail(`Spanish 2 Samuel page missing ${marker}.`);
 if(!i18n.includes("'second-samuel-study"+html+"':'es/segunda-samuel-estudio"+html+"'"))fail('2 Samuel bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish 2 Samuel study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 2 Samuel study audit passed.');
