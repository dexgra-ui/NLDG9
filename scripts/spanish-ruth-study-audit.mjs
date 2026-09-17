import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read=file=>readFileSync(file,'utf8');
const load=file=>{const sandbox={window:{}};vm.runInNewContext(read(file),sandbox,{filename:file});return sandbox.window.NLDG_BOOK_STUDY;};
const errors=[];
const fail=message=>errors.push(message);
const en=load('ruth-study-data.js');
const es=load('ruth-study-data-es.js');

if(en.slug!=='ruth-study')fail('English slug changed.');
if(es.slug!=='rut-estudio')fail('Spanish slug changed.');
if(es.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish study must retain the NTV standard.');
if(en.lessons?.length!==5||es.lessons?.length!==5)fail('Ruth must contain five lessons in both languages.');

for(let i=0;i<5;i++){
 const a=en.lessons[i],b=es.lessons[i];
 if(a.number!==i+1||b.number!==i+1)fail(`Lesson order mismatch at ${i+1}.`);
 if(a.teaching?.length!==8||b.teaching?.length!==8)fail(`Lesson ${i+1} must have eight substantive teaching movements in both languages.`);
 if(a.questions?.length!==8||b.questions?.length!==8)fail(`Lesson ${i+1} must have eight text-based questions in both languages.`);
 for(const [field,value] of Object.entries({question:b.question,truth:b.truth,goal:b.goal,examination:b.examination,challenge:b.challenge,caution:b.caution,closingTakeaway:b.closingTakeaway,prayer:b.prayer}))if(!String(value||'').trim())fail(`Spanish lesson ${i+1} missing ${field}.`);
 if(b.contextParagraphs?.length<2||b.jesusParagraphs?.length<2||b.guardrailParagraphs?.length<5)fail(`Spanish lesson ${i+1} lacks corrected context, Jesus connection, or guardrails.`);
 if(a.scripture.replace('Ruth','Rut')!==b.scripture)fail(`Scripture range mismatch in lesson ${i+1}.`);
}

for(const phrase of ['coerción','castigo','acoso','consentimiento','antisemitismo'])if(!read('ruth-study-data-es.js').toLowerCase().includes(phrase))fail(`Spanish safeguards missing “${phrase}”.`);
for(const phrase of ['intercourse','punishment','harassment','antisemitism','not a dating manual'])if(!read('ruth-study-data.js').toLowerCase().includes(phrase))fail(`English safeguards missing “${phrase}”.`);

const enPage=read('ruth-study.html'),esPage=read('es/rut-estudio.html'),i18n=read('nldg-i18n.js');
for(const marker of ['hreflang="es" href="https://nolabelsdesignedbygod.org/es/rut-estudio.html"','ruth-study-data.js?v=1.1.0','book-study-series.js?v=0.2.0','nldg-i18n.js?v=1.45.0'])if(!enPage.includes(marker))fail(`English Ruth page missing ${marker}.`);
for(const marker of ['<html lang="es"','hreflang="en" href="https://nolabelsdesignedbygod.org/ruth-study.html"','ruth-study-data-es.js?v=1.1.0','book-study-series.js?v=0.2.0','book-study-series-es.js?v=1.2.0','nldg-i18n.js?v=1.45.0'])if(!esPage.includes(marker))fail(`Spanish Ruth page missing ${marker}.`);
if(!i18n.includes("'ruth-study.html':'es/rut-estudio.html'"))fail('Ruth bilingual route is missing.');

if(errors.length){console.error('Spanish Ruth study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Ruth study audit passed.');
