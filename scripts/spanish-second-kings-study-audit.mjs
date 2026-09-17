import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='second-kings-study-data'+js,enGuide='second-kings-study-guide'+js,esData='second-kings-study-data-es'+js,enPage='second-kings-study'+html,esPage=['es','segunda-reyes-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('second-kings');
if(book?.status!=='published')fail('2 Kings must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='segunda-reyes-estudio')fail('Spanish 2 Kings slug must be segunda-reyes-estudio.');
 if(es?.book!=='2 Reyes')fail('Spanish book name must be 2 Reyes.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 2 Kings must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('2 Kings must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`2 Kings lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)<4)fail(`${label}: needs at least four supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('2 Reyes '))fail(`${label}: Scripture reference must begin with 2 Reyes.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`2 Kings series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('2 Kings series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('2 Kings series foundation must retain eight discussion questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 2 Kings contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['Bethel precision and nonviolence',['cuarenta y dos murieron','violencia contra niños, jóvenes, burladores o críticos']],
  ['war and prosperity misuse',['No celebres la campaña de Moab','fórmula de prosperidad']],
  ['grief and healing dignity',['culpar familias en duelo','no promete reversión inmediata']],
  ['captivity and survivor agency',['obliga a personas dañadas a rescatar agresores','su cautiverio no se aprueba ni repara']],
  ['illness and disability dignity',['Enfermedad y discapacidad no son abreviaturas','enfermedad como pecado oculto']],
  ['financial exploitation',['sanidad, oración y favor no están en venta','lucro oculto']],
  ['siege trauma and hunger',['canibalismo','no culpa a madres hambrientas','inseguridad alimentaria']],
  ['violent political reform',['violencia moderna','borra víctimas','investigación independiente']],
  ['child protection and reporting',['Protege menores y denunciantes','protección y denuncia aprobadas']],
  ['disaster blame and ethnicity',['culpa moderna de desastre','El pecado no es etnia','Rechaza racismo']],
  ['medical care dignity',['Oración y tratamiento se encuentran','Une oración con medicina']],
  ['antisemitism and women prophets',['antisemitismo','Hulda habla con autoridad reconocida']],
  ['civilian suffering and exile dignity',['culpes civiles por sitio','desplazamiento y trauma']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`2 Kings safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','protección y denuncia aprobadas','ayuda calificada','proceso justo','revisión financiera independiente'])if(!all.includes(phrase))fail(`2 Kings leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/segunda-reyes-estudio'+html+'"'))fail('English 2 Kings page must link Spanish alternate.');
 if(!english.includes('second-kings-study-data'+js+'?v=1.1.0')||!english.includes('second-kings-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English 2 Kings page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/segunda-reyes-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/second-kings-study'+html+'"','../second-kings-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.49.0'])if(!spanish.includes(marker))fail(`Spanish 2 Kings page missing ${marker}.`);
 if(!i18n.includes("'second-kings-study"+html+"':'es/segunda-reyes-estudio"+html+"'"))fail('2 Kings bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish 2 Kings study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 2 Kings study audit passed.');
