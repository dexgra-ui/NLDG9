import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='ezra-study-data'+js,enGuide='ezra-study-guide'+js,esData='ezra-study-data-es'+js,enPage='ezra-study'+html,esPage=['es','esdras-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('ezra');
if(book?.status!=='published')fail('Ezra must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const referenceNames={
  'Esdras':'Ezra','2 Crónicas':'2 Chronicles','Jeremías':'Jeremiah','Isaías':'Isaiah','Salmo':'Psalm',
  'Levítico':'Leviticus','Hageo':'Haggai','Juan':'John','Efesios':'Ephesians','2 Reyes':'2 Kings',
  'Nehemías':'Nehemiah','Mateo':'Matthew','Romanos':'Romans','Zacarías':'Zechariah',
  'Deuteronomio':'Deuteronomy','Santiago':'James','1 Corintios':'1 Corinthians','Éxodo':'Exodus','Rut':'Ruth'
 };
 const normalizeReference=r=>{for(const [spanish,english] of Object.entries(referenceNames))if(r.startsWith(spanish+' '))return english+r.slice(spanish.length);return r;};
 if(es?.slug!=='esdras-estudio')fail('Spanish Ezra slug must be esdras-estudio.');
 if(es?.book!=='Esdras')fail('Spanish book name must be Esdras.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Ezra must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==6||es?.lessons?.length!==6)fail('Ezra must retain six lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<6;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Ezra lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(normalizeReference(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(normalizeReference))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)<4)fail(`${label}: needs at least four supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Esdras '))fail(`${label}: Scripture reference must begin with Esdras.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Ezra theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Ezra must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Ezra series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('Ezra series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('Ezra series foundation must retain eight discussion questions.');
 if((en?.seriesTeaching?.length??0)!==6||(en?.seriesQuestions?.length??0)!==8)fail('English Ezra series guide must retain six teaching movements and eight discussion questions.');
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Ezra series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Ezra contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['providence without ruler worship',['sin convertir al imperio en santo','no equivale a devoción política']],
  ['diaspora and ancestry',['no avergüenza a toda persona que se queda en la diáspora','pruebas de pureza racial o étnica']],
  ['grief and safety',['ningún líder debe usar este texto para descartar medidas razonables de seguridad','esperanza y duelo suenen juntos']],
  ['ethnicity and conflict',['no es una plantilla étnica','sin odio étnico']],
  ['chronology and propaganda',['Esdras comprime intencionalmente reinados posteriores','fragmentos verdaderos sin contexto justo']],
  ['imperial violence limits',['pena violenta sigue siendo coerción imperial','no es modelo de disciplina eclesial']],
  ['leadership limits',['Las penas civiles severas no son autoridad de la iglesia','La oración no reemplaza los controles']],
  ['intermarriage is not race',['“Semilla santa” no debe convertirse en doctrina de raza biológica','matrimonio interracial']],
  ['human proposal and coercion',['propuesta humana dentro del relato','presión coercitiva seria']],
  ['dissent and unheard voices',['oposición y una investigación de meses','esposas e hijos permanecen en gran medida sin voz']],
  ['new testament marriage application',['no divorciarse de un cónyuge no creyente dispuesto a permanecer','divorcio forzado, separación étnica o abandono familiar']],
  ['anti-racism and anti-antisemitism',['racismo, antisemitismo, hostilidad contra inmigrantes','caricatura antisemita']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Ezra safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','seguridad infantil','apoyo pastoral','legal','profesional calificado','No invites revelación pública'])if(!all.includes(phrase))fail(`Ezra leader safeguard missing ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/esdras-estudio'+html+'"'))fail('English Ezra page must link Spanish alternate.');
 if(!english.includes('ezra-study-data'+js+'?v=1.1.0')||!english.includes('ezra-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Ezra page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/esdras-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/ezra-study'+html+'"','../ezra-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.52.0'])if(!spanish.includes(marker))fail(`Spanish Ezra page missing ${marker}.`);
 if(!i18n.includes("'ezra-study"+html+"':'es/esdras-estudio"+html+"'"))fail('Ezra bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Ezra study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Ezra study audit passed.');
