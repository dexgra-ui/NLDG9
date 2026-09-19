import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='obadiah-study-data'+js,enGuide='obadiah-study-guide'+js,esData='obadiah-study-data-es'+js,enPage='obadiah-study'+html,esPage=['es','abdias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('obadiah')?.status!=='published')fail('Obadiah must be published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Abdías':'Obadiah','Génesis':'Genesis','Jeremías':'Jeremiah','Proverbios':'Proverbs','Santiago':'James','1 Corintios':'1 Corinthians','Salmo':'Psalm','Ezequiel':'Ezekiel','Lucas':'Luke','Isaías':'Isaiah','Romanos':'Romans','Mateo':'Matthew','Apocalipsis':'Revelation'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='abdias-estudio')fail('Spanish Obadiah slug must be abdias-estudio.');
 if(es?.book!=='Abdías')fail('Spanish Obadiah book name must be Abdías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Obadiah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==3||es?.lessons?.length!==3)fail('Obadiah must retain three lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<3;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Obadiah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Abdías '))fail(`${label}: Scripture reference must begin with Abdías.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Obadiah theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Obadiah must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Obadiah series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Obadiah series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Obadiah series guide must retain eight discussion questions.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Obadiah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['date humility',['muchos intérpretes la relacionan con la destrucción de jerusalén por babilonia en 586 a.c.','se han propuesto fechas anteriores']],
  ['Jeremiah relationship humility',['la dirección literaria no debe presentarse como certeza','no finjas certeza sobre la relación literaria con jeremías']],
  ['Edom not modern code',['no identifiques edom con una etnia, religión o nación moderna','reasignar edom a etnias, religiones o naciones modernas es irresponsable']],
  ['prudent security protected',['la defensa prudente','no condenes la planificación responsable de seguridad']],
  ['survivor safety',['no deben ser avergonzados por sobrevivir','no avergüences a quienes carecían de poder seguro para intervenir']],
  ['gloating rejected',['no celebres el sufrimiento del oponente','regodeo']],
  ['crisis profiteering',['precios abusivos','lucro durante desastres']],
  ['escape protection',['rutas seguras','bloquear la huida']],
  ['refugee nuance',['no conviertas el lenguaje de refugiados en prueba de una sola política']],
  ['divine justice not karma',['no es karma','no prediques «como hiciste» como karma']],
  ['revenge rejected',['la justicia divina no autoriza venganza personal','no venganza']],
  ['cup annihilation restraint',['no una invitación devocional a disfrutar exterminio','no celebres aniquilación']],
  ['fire ethnic hatred restraint',['no deben convertirse en odio étnico','fantasías genocidas']],
  ['ancient geography restraint',['no son un plano simple de fronteras contemporáneas','no conviertas geografía antigua en mapa político incuestionable']],
  ['Zion political restraint',['no uses sion como cheque en blanco']],
  ['deliverers accountable',['no conviertas a «libertadores» humanos en gobernantes sin rendición de cuentas']],
  ['kingdom belongs to LORD',['el reino pertenece al señor']],
  ['leader safety',['prioriza seguridad, atención calificada, protección legal','deberes aplicables de denuncia']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Obadiah safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/abdias-estudio'+html+'"'))fail('English Obadiah page must link Spanish alternate.');
 if(!english.includes('obadiah-study-data'+js+'?v=1.1.0')||!english.includes('obadiah-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Obadiah page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/abdias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/obadiah-study'+html+'"','../obadiah-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.68.0'])if(!spanish.includes(marker))fail(`Spanish Obadiah page missing ${marker}.`);
 if(!i18n.includes("'obadiah-study"+html+"':'es/abdias-estudio"+html+"'"))fail('Obadiah bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Obadiah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Obadiah study audit passed.');
