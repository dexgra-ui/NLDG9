import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='judges-study-data'+js,enGuide='judges-study-guide'+js,esData='judges-study-data-es'+js,enPage='judges-study'+html,esPage=['es','jueces-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('judges');
if(book?.status!=='published')fail('Judges must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='jueces-estudio')fail('Spanish Judges slug must be jueces-estudio.');
 if(es?.book!=='Jueces')fail('Spanish book name must be Jueces.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Judges must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Judges must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Judges lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Jueces '))fail(`${label}: Scripture reference must use Jueces.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Judges series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('Judges series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('Judges series foundation must retain eight discussion questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Judges contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['forced labor and generational responsibility',['trabajo forzado','generaciones mayores']],
  ['body dignity and non-transferable assassination',['diferencia corporal','no es modelo para venganza privada']],
  ['women leadership and anti-gender weaponization',['liderazgo se presenta como real','desprecio entre géneros']],
  ['Gideon accountability and anti-revenge',['represalia','autoexaltación']],
  ['Abimelech financial transparency and due process',['transparencia','debido proceso']],
  ['Jephthah daughter protection and child sacrifice',['Ella no tiene la culpa','sacrificio de niños']],
  ['Samson consent, responsibility, and suicide safeguard',['consentimiento','Sansón sigue siendo responsable','no celebración del suicidio']],
  ['Judges 19 victim dignity and anti-retaliation',['La concubina es una víctima','violencia sexual','indignación moral sin sabiduría']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Judges safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No fuerces revelaciones personales','No prometas confidencialidad absoluta','procedimientos aprobados de denuncia','protección contra represalias','Los oponentes modernos no son cananeos'])if(!all.includes(phrase))fail(`Judges leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/jueces-estudio'+html+'"'))fail('English Judges page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.45.0'))fail('English Judges page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/jueces-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/judges-study'+html+'"','../judges-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.45.0'])if(!spanish.includes(marker))fail(`Spanish Judges page missing ${marker}.`);
 if(!i18n.includes("'judges-study"+html+"':'es/jueces-estudio"+html+"'"))fail('Judges bilingual route is missing.');
 if(!hub.includes('href="jueces-estudio'+html+'"'))fail('Spanish Judges library card is missing.');
 if(!hub.includes('treinta y cinco series completas y revisadas'))fail('Spanish library count must be thirty-five series.');
}
if(errors.length){console.error('Spanish Judges study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Judges study audit passed.');