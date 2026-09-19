import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='lamentations-study-data'+js,enGuide='lamentations-study-guide'+js,esData='lamentations-study-data-es'+js,enPage='lamentations-study'+html,esPage=['es','lamentaciones-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('lamentations');
if(book?.status!=='published')fail('Lamentations must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Lamentaciones':'Lamentations','2 Reyes':'2 Kings','Salmo':'Psalm','Lucas':'Luke','Romanos':'Romans','1 Samuel':'1 Samuel','Jeremías':'Jeremiah','Marcos':'Mark','1 Pedro':'1 Peter','2 Corintios':'2 Corinthians','Deuteronomio':'Deuteronomy','Isaías':'Isaiah','Ezequiel':'Ezekiel','Santiago':'James','Job':'Job','Eclesiastés':'Ecclesiastes','Hebreos':'Hebrews','Apocalipsis':'Revelation','Mateo':'Matthew'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='lamentaciones-estudio')fail('Spanish Lamentations slug must be lamentaciones-estudio.');
 if(es?.book!=='Lamentaciones')fail('Spanish book name must be Lamentaciones.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Lamentations must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Lamentations must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Lamentations lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Lamentaciones '))fail(`${label}: Scripture reference must begin with Lamentaciones.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Lamentations theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Lamentations must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Lamentations series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Lamentations series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Lamentations series guide must retain eight discussion questions.');
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Lamentations series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Lamentations contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['anonymous authorship',['El libro hebreo no nombra autor','no debe presentarse como si el propio texto afirmara explícitamente esa autoría']],
  ['acrostic structure',['Los capítulos 1, 2 y 4 son acrósticos alfabéticos','el capítulo 3 es un triple acróstico','el capítulo 5 también tiene 22 versículos pero no sigue el patrón alfabético']],
  ['survivor dignity',['sin hacer personalmente responsable a cada víctima','no culpes sobrevivientes individuales por catástrofe']],
  ['divine judgment not cruelty license',['El juicio divino nunca licencia crueldad humana','no uses juicio divino para excusar perpetradores']],
  ['no misogynistic shame',['Nunca debe convertirse en afirmación misógina','No conviertas la humillación de la Hija de Sion en vergüenza hacia mujeres']],
  ['no body stigma',['No debe emplearse para estigmatizar menstruación, historia sexual, sobrevivientes de agresión']],
  ['mercies in devastation',['«Grande es tu fidelidad» no nace de una mañana cómoda sino de ruinas','No cites «misericordias nuevas cada mañana» como orden de sentirse alegre']],
  ['yoke not abuse command',['«Llevar el yugo» no es mandato de abuso','Ningún pastor, cónyuge, empleador o padre puede imponer un «yugo»']],
  ['cheek not violence requirement',['«Dar la mejilla» no exige seguir disponible para violencia','No manda permanecer con un agresor']],
  ['denied justice matters',['Aplastar prisioneros, negar derechos y torcer la causa','no aprueba']],
  ['famine no voyeurism',['La imagen de canibalismo debe enseñarse sin voyeurismo','No sensacionalices el hambre']],
  ['religious leader accountability',['Los líderes religiosos cargan culpa de sangre','El oficio espiritual no protege de rendición de cuentas']],
  ['Edom not modern code',['La burla de Edom es juzgada sin autorizar odio étnico','ni uses Edom como código para un grupo moderno']],
  ['generational consequences not inherited guilt',['Consecuencias generacionales son reales sin convertirse en culpa personal heredada','No trates el versículo 7 como culpa personal heredada']],
  ['sexual violence survivor protection',['La violencia sexual debe nombrarse sin culpar sobrevivientes','La responsabilidad pertenece a perpetradores']],
  ['material trauma care',['El trauma material exige cuidado material','comida, vivienda, atención médica, protección']],
  ['hope not enforced',['La esperanza se ofrece, no se impone','No fuerces una frase de esperanza']],
  ['blocked prayer allowed',['Una nube que bloquea la oración puede ser objeto de oración','no deben forzar a personas a afirmar que se sienten oídas']],
  ['vengeance entrusted to God',['La venganza se ora a Dios','sin venganza personal']],
  ['forgiveness distinct from trust',['El perdón no restaura automáticamente acceso o confianza','perdón, reconciliación, confianza, contacto y roles restaurados son preguntas distintas']],
  ['unresolved ending',['La esperanza inconclusa sigue siendo esperanza','final no resuelto']],
  ['suicide safety',['ideación suicida actual','seguridad inmediata','apoyo profesional o de crisis']],
  ['no forced disclosure',['No exijas revelación','No pidas testimonio de sobrevivientes']],
  ['qualified support',['apoyo calificado','opciones médicas y legales','salvaguarda']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Lamentations safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/lamentaciones-estudio'+html+'"'))fail('English Lamentations page must link Spanish alternate.');
 if(!english.includes('lamentations-study-data'+js+'?v=1.1.0')||!english.includes('lamentations-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Lamentations page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/lamentaciones-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/lamentations-study'+html+'"','../lamentations-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.62.0'])if(!spanish.includes(marker))fail(`Spanish Lamentations page missing ${marker}.`);
 if(!i18n.includes("'lamentations-study"+html+"':'es/lamentaciones-estudio"+html+"'"))fail('Lamentations bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Lamentations study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Lamentations study audit passed.');
