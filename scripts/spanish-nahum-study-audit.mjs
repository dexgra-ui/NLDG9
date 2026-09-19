import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='nahum-study-data'+js,enGuide='nahum-study-guide'+js,esData='nahum-study-data-es'+js,enPage='nahum-study'+html,esPage=['es','nahum-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('nahum')?.status!=='published')fail('Nahum must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Nahúm':'Nahum','Éxodo':'Exodus','Salmo':'Psalm','Romanos':'Romans','Hebreos':'Hebrews','Isaías':'Isaiah','Apocalipsis':'Revelation','Habacuc':'Habakkuk','Amós':'Amos','Lucas':'Luke','Santiago':'James','Deuteronomio':'Deuteronomy','Proverbios':'Proverbs','1 Pedro':'1 Peter','Colosenses':'Colossians'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const normList=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);
 if(es?.slug!=='nahum-estudio')fail('Spanish Nahum slug must be nahum-estudio.');
 if(es?.book!=='Nahúm')fail('Spanish book name must be Nahúm.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Nahum must declare Nueva Traducción Viviente (NTV).');
 if(es?.themeLabel!=='Verdad clave')fail('Spanish Nahum theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true||en?.lessonSubtitleMode!==true)fail('Nahum must retain lesson subtitle mode in both languages.');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Nahum must retain four lessons in both languages.');
 if(JSON.stringify(normList(es.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))fail('Nahum series main Scripture references must match English exactly.');

 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Nahum lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b?.scripture)!==a?.scripture)fail(`${label}: main Scripture range must match English exactly.`);
  if(JSON.stringify((b?.supporting||[]).map(norm))!==JSON.stringify(a?.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','openingParagraphs','contextParagraphs','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain exactly two Scripture-context paragraphs.`);
  if((b?.jesusParagraphs?.length??0)!==1)fail(`${label}: must retain one Jesus Connection paragraph.`);
  if((b?.guardrailParagraphs?.length??0)!==1)fail(`${label}: must retain one Do Not Miss This paragraph.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Nahúm '))fail(`${label}: Scripture reference must begin with Nahúm.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Nahum series foundation missing ${field}.`);
 if((en?.seriesTeaching?.length??0)!==8||(es?.seriesTeaching?.length??0)!==8)fail('Nahum series guide must retain eight teaching movements.');
 if((en?.seriesQuestions?.length??0)!==8||(es?.seriesQuestions?.length??0)!==8)fail('Nahum series guide must retain eight discussion questions.');
 if(String(en?.seriesContext||'').split('\n\n').filter(Boolean).length!==2||String(es?.seriesContext||'').split('\n\n').filter(Boolean).length!==2)fail('Nahum series context must retain two paragraphs in both languages.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Nahum contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['historical window',['tebas en egipto, capturada por asiria en 663 a.c.','nínive en 612 a.c.']],
  ['modern Nineveh restraint',['no identifiques automáticamente a nínive con una nación moderna']],
  ['divine vengeance distinction',['la venganza divina es el juicio santo e informado de dios']],
  ['disaster restraint',['no autorizan identificar una tormenta, terremoto o sequía moderna como castigo revelado']],
  ['Elkosh humility',['no afirmes certeza sobre la ubicación de elcos']],
  ['alphabetic-pattern humility',['un patrón alfabético debatido']],
  ['river-gate humility',['no insistas en que nahúm 2:6 decide exactamente cómo cayó nínive']],
  ['no automatic national approval',['dios respalda automáticamente su nación, partido, institución o bando']],
  ['Isaiah citation accuracy',['romanos 10:15 cita explícitamente isaías, no nahúm']],
  ['city of blood not racial',['el juicio bíblico es moral, no racial']],
  ['women and victim protection',['no es permiso para degradar mujeres, trabajadoras sexuales, sobrevivientes de abuso']],
  ['accountability not entertainment',['la responsabilidad debe servir verdad, protección, arrepentimiento y justicia']],
  ['evidence requirement',['sin evidencia']],
  ['living people not beyond grace',['persona viva, etnia o nación moderna fuera del arrepentimiento, misericordia o alcance de la gracia de dios']],
  ['relief not suffering delight',['el alivio cuando termina el terror es moralmente distinto de disfrutar el dolor ajeno']],
  ['atrocity not command',['no instrucciones divinas que creyentes deban imitar']],
  ['forgiveness distinctions',['distingue perdón, reconciliación, confianza, restitución, responsabilidad legal y límites']],
  ['enemy love',['amor a enemigos']],
  ['Jesus-centered formation',['bajo el señorío de jesús']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Nahum safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/nahum-estudio'+html+'"'))fail('English Nahum page must link Spanish alternate.');
 if(!english.includes('nahum-study-data'+js+'?v=1.1.0')||!english.includes('nahum-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0')||!english.includes('nldg-i18n'+js+'?v=1.71.0'))fail('English Nahum page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/nahum-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/nahum-study'+html+'"','../nahum-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.71.0'])if(!spanish.includes(marker))fail(`Spanish Nahum page missing ${marker}.`);
 if(!i18n.includes("'nahum-study"+html+"':'es/nahum-estudio"+html+"'"))fail('Nahum bilingual route is missing.');
 if(!hub.includes('href="nahum-estudio'+html+'"'))fail('Spanish Nahum library card is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Nahum study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Nahum study audit passed.');
