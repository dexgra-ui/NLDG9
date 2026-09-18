import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='first-chronicles-study-data'+js,enGuide='first-chronicles-study-guide'+js,esData='first-chronicles-study-data-es'+js,enPage='first-chronicles-study'+html,esPage=['es','primera-cronicas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('first-chronicles');
if(book?.status!=='published')fail('1 Chronicles must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='primera-cronicas-estudio')fail('Spanish 1 Chronicles slug must be primera-cronicas-estudio.');
 if(es?.book!=='1 Crónicas')fail('Spanish book name must be 1 Crónicas.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 1 Chronicles must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('1 Chronicles must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`1 Chronicles lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)<4)fail(`${label}: needs at least four supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('1 Crónicas '))fail(`${label}: Scripture reference must begin with 1 Crónicas.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`1 Chronicles series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('1 Chronicles series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('1 Chronicles series foundation must retain eight discussion questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 1 Chronicles contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['genealogy and prosperity misuse',['no una base para superioridad étnica','no una fórmula de prosperidad']],
  ['suicide and coercive unity',['castigo directo por un pecado conocido','La lealtad no entrega a un líder cuerpos, dinero, seguridad ni conciencia']],
  ['Uzzah and tragedy misuse',['no sirve para asustar congregaciones','explicar toda muerte repentina como castigo']],
  ['institutional humility',['no contiene a Dios','inmune a una institución frente a la corrección']],
  ['war and nationalism',['no bendice conquista, racismo, nacionalismo ni venganza','no autoriza violencia cristiana ni encubrimiento']],
  ['leader accountability',['no borra el abuso de David','nunca debe proteger a un líder']],
  ['census ambiguity and civilian harm',['inferencias razonables','El sufrimiento civil debe lamentarse']],
  ['repentance and repair',['no devuelve a quienes murieron','son distintos']],
  ['labor exploitation',['no santifica explotación','trabajo oculto, inseguro o no pagado']],
  ['voluntary giving',['No autoriza vergüenza pública','dar descuidando necesidades básicas']],
  ['Jesus-centered leadership',['Hijo fiel de David','vence por cruz y resurrección']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`1 Chronicles safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','responsabilidades de denuncia y protección','ayuda calificada','revisión independiente','revisión financiera independiente'])if(!all.includes(phrase))fail(`1 Chronicles leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/primera-cronicas-estudio'+html+'"'))fail('English 1 Chronicles page must link Spanish alternate.');
 if(!english.includes('first-chronicles-study-data'+js+'?v=1.1.0')||!english.includes('first-chronicles-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English 1 Chronicles page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/primera-cronicas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/first-chronicles-study'+html+'"','../first-chronicles-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.50.0'])if(!spanish.includes(marker))fail(`Spanish 1 Chronicles page missing ${marker}.`);
 if(!i18n.includes("'first-chronicles-study"+html+"':'es/primera-cronicas-estudio"+html+"'"))fail('1 Chronicles bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish 1 Chronicles study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 1 Chronicles study audit passed.');
