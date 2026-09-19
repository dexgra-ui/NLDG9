import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='habakkuk-study-data'+js,enGuide='habakkuk-study-guide'+js,esData='habakkuk-study-data-es'+js,enPage='habakkuk-study'+html,esPage=['es','habacuc-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('habakkuk')?.status!=='published')fail('Habakkuk must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Habacuc':'Habakkuk','Salmo':'Psalm','Isaías':'Isaiah','Lucas':'Luke','Apocalipsis':'Revelation','Romanos':'Romans','Gálatas':'Galatians','Hebreos':'Hebrews','Amós':'Amos','Santiago':'James','Éxodo':'Exodus','Deuteronomio':'Deuteronomy','Lamentaciones':'Lamentations','Filipenses':'Philippians','1 Pedro':'1 Peter'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const normList=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);

 if(es?.slug!=='habacuc-estudio')fail('Spanish Habakkuk slug must be habacuc-estudio.');
 if(es?.book!=='Habacuc')fail('Spanish book name must be Habacuc.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Habakkuk must declare Nueva Traducción Viviente (NTV).');
 if(es?.themeLabel!=='Verdad clave')fail('Spanish Habakkuk theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true||en?.lessonSubtitleMode!==true)fail('Habakkuk must retain lesson subtitle mode in both languages.');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Habakkuk must retain four lessons in both languages.');
 if(JSON.stringify(normList(es.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))fail('Habakkuk series main Scripture references must match English exactly.');

 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Habakkuk lesson ${i+1}`;
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
  if(!String(b?.scripture||'').startsWith('Habacuc '))fail(`${label}: Scripture reference must begin with Habacuc.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Habakkuk series foundation missing ${field}.`);
 if((en?.seriesTeaching?.length??0)!==8||(es?.seriesTeaching?.length??0)!==8)fail('Habakkuk series guide must retain eight teaching movements.');
 if((en?.seriesQuestions?.length??0)!==8||(es?.seriesQuestions?.length??0)!==8)fail('Habakkuk series guide must retain eight discussion questions.');
 if(String(en?.seriesContext||'').split('\n\n').filter(Boolean).length!==2||String(es?.seriesContext||'').split('\n\n').filter(Boolean).length!==2)fail('Habakkuk series context must retain two paragraphs in both languages.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Habakkuk contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['historical humility',['la fecha precisa es debatida']],
  ['no modern Babylon mapping',['no identifiques una nación moderna como la babilonia escogida por dios']],
  ['Babylon not morally approved',['uso soberano no significa aprobación moral']],
  ['disaster restraint',['no ofrece un mapa para predecir desastres naturales modernos']],
  ['lament is faithful',['el lamento puede ser lenguaje fiel del pacto']],
  ['waiting is not passivity',['no es una orden de permanecer expuesto a abuso, peligro o injusticia prevenible']],
  ['danger requires action',['nunca digas a alguien en peligro que simplemente espere el tiempo de dios']],
  ['personal dream restraint',['todo sueño personal']],
  ['Habakkuk 2:4 NT use',['romanos 1:17, gálatas 3:11 y hebreos 10:38']],
  ['sexual humiliation victim protection',['la vergüenza en el cuarto ay pertenece al explotador, no a la víctima']],
  ['evidence based accusations',['la aplicación debe basarse en evidencia y no en acusaciones']],
  ['Christian domination restraint',['dominación política cristiana']],
  ['divine warrior violence restraint',['no uses lenguaje del guerrero divino para bendecir violencia cristiana, nacionalismo o venganza']],
  ['Shigionoth humility',['el significado exacto de sigionot es incierto']],
  ['messianic restraint',['no debe tratarse por sí sola como predicción directa de jesús']],
  ['fear and faith distinction',['el temor no es automáticamente prueba de fracaso espiritual']],
  ['joy not denial',['el gozo aquí dice la verdad acerca de la pérdida']],
  ['Philippians 4:13 restraint',['no es promesa de logro ilimitado']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Habakkuk safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/habacuc-estudio'+html+'"'))fail('English Habakkuk page must link Spanish alternate.');
 if(!english.includes('habakkuk-study-data'+js+'?v=1.1.0')||!english.includes('habakkuk-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0')||!english.includes('nldg-i18n'+js+'?v=1.72.0'))fail('English Habakkuk page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/habacuc-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/habakkuk-study'+html+'"','../habakkuk-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.72.0'])if(!spanish.includes(marker))fail(`Spanish Habakkuk page missing ${marker}.`);
 if(!i18n.includes("'habakkuk-study"+html+"':'es/habacuc-estudio"+html+"'"))fail('Habakkuk bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Habakkuk study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Habakkuk study audit passed.');
