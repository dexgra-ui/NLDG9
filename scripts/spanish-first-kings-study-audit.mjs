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
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`1 Kings lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('1 Reyes '))fail(`${label}: Scripture reference must begin with 1 Reyes.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`1 Kings series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('1 Kings series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('1 Kings series foundation must retain eight discussion questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 1 Kings contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['fair process and anti-assassination',['proceso justo y rechaza el asesinato','No conviertas este relato en una prueba improvisada']],
  ['worker protection',['nunca debe depender de trabajadores explotados','Trabajo forzado, impuestos y riqueza centralizada']],
  ['foreigner dignity and anti-superiority',['dar la bienvenida a las naciones','superioridad étnica o cultural']],
  ['women and ethnic blame',['no la pureza étnica ni culpar solamente a las mujeres','insulto sexista']],
  ['child suffering',['todo sufrimiento infantil es castigo por los padres']],
  ['widow and poverty exploitation',['no permiso para que líderes presionen a personas pobres','no promete que cada muerte será revertida ahora']],
  ['Carmel violence safeguard',['no es un modelo cristiano','no mediante violencia religiosa']],
  ['mental-health crisis dignity',['requieren atención compasiva inmediata','ayuda profesional, médica o de crisis','no debe reemplazar nutrición, sueño, medicamentos ni tratamiento profesional']],
  ['Naboth property and institutional abuse',['no crea derecho sobre la propiedad de otra persona','ganancias producidas por abuso']],
  ['antisemitism',['nunca deben convertirse en antisemitismo']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`1 Kings safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','obligaciones de protección y denuncia','silenciar denuncias de discriminación o abuso','proceso justo','ayuda profesional calificada'])if(!all.includes(phrase))fail(`1 Kings leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/primera-reyes-estudio'+html+'"'))fail('English 1 Kings page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.48.0'))fail('English 1 Kings page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/primera-reyes-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/first-kings-study'+html+'"','../first-kings-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.48.0'])if(!spanish.includes(marker))fail(`Spanish 1 Kings page missing ${marker}.`);
 if(!i18n.includes("'first-kings-study"+html+"':'es/primera-reyes-estudio"+html+"'"))fail('1 Kings bilingual route is missing.');
 if(!hub.includes('href="primera-reyes-estudio'+html+'"'))fail('Spanish 1 Kings library card is missing.');
 if(!hub.includes('treinta y ocho series completas y revisadas'))fail('Spanish library count must be thirty-eight series.');
}
if(errors.length){console.error('Spanish 1 Kings study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 1 Kings study audit passed.');