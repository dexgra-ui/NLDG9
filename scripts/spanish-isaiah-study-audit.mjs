import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='isaiah-study-data'+js,enGuide='isaiah-study-guide'+js,esData='isaiah-study-data-es'+js,enPage='isaiah-study'+html,esPage=['es','isaias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('isaiah');
if(book?.status!=='published')fail('Isaiah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Isaías':'Isaiah','Deuteronomio':'Deuteronomy','Miqueas':'Micah','Amós':'Amos','Lucas':'Luke','Apocalipsis':'Revelation','2 Reyes':'2 Kings','Mateo':'Matthew','Romanos':'Romans','Salmo':'Psalm','Santiago':'James','Éxodo':'Exodus','Marcos':'Mark','Juan':'John','Hechos':'Acts','1 Pedro':'1 Peter','Lamentaciones':'Lamentations','2 Pedro':'2 Peter'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='isaias-estudio')fail('Spanish Isaiah slug must be isaias-estudio.');
 if(es?.book!=='Isaías')fail('Spanish book name must be Isaías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Isaiah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Isaiah must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Isaiah lesson ${i+1}`;
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
  if(!String(b?.scripture||'').startsWith('Isaías '))fail(`${label}: Scripture reference must begin with Isaías.`);
 }
 if(en.lessons[2]?.scripture!=='Isaiah 13–39'||es.lessons[2]?.scripture!=='Isaías 13–39')fail('Isaiah lesson 3 must restore chapters 36–39 by covering 13–39.');
 if(es?.themeLabel!=='Verdad clave')fail('Isaiah theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Isaiah must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Isaiah series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Isaiah series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Isaiah series guide must retain eight discussion questions.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Isaiah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['composition humility',['no hace de una teoría composicional una prueba de fe','horizontes históricos']],
  ['worship and justice',['La santidad expone adoración separada de justicia','adoración usada para cubrir injusticia']],
  ['hardening not ministry strategy',['La comisión de endurecimiento es juicio, no estrategia ministerial','autorizan a maestros a manipular, confundir o abandonar personas']],
  ['Immanuel historical horizon',['La señal de Emanuel debe tener significado dentro de esa emergencia','sin borrar el primer horizonte']],
  ['Jewish dignity',['No presentes desacuerdo judío como deshonestidad o inferioridad espiritual','no ridiculices la interpretación judía']],
  ['nation oracles not ethnic hate',['no autorizan a cristianos a declarar malditas poblaciones étnicas modernas','No conviertas oráculos de naciones en odio a grupos actuales']],
  ['disability dignity',['Accesibilidad y dignidad son obligaciones presentes','No presiones a personas enfermas o discapacitadas para reclamar una cura']],
  ['Hezekiah hinge',['Isaías 36–39','giro entre Asiria y el consuelo exílico del capítulo 40']],
  ['Cyrus not political canonization',['Providencia no equivale a aprobación moral','no uses a Ciro para canonizar un político favorito']],
  ['Israel remains servant',['Israel es explícitamente el siervo escogido de Dios','no trates la identidad de Israel como siervo como obsoleta']],
  ['Servant abuse safeguard',['Nunca autoriza a abusadores a exigir silencio','no digas a víctimas que imiten al Siervo permaneciendo en peligro']],
  ['healing not guaranteed',['no garantiza cura física inmediata','no prometas sanidad física a toda persona que crea']],
  ['infertility dignity',['no garantía de fertilidad','no avergüences la infertilidad']],
  ['outsider inclusion',['Extranjeros y eunucos reciben un nombre en la casa de Dios','resiste tratar etnia, nacionalidad o diferencia corporal como descalificación automática']],
  ['fasting not prosperity',['no son fórmulas que garanticen riqueza o recuperación médica']],
  ['divine warrior not Christian violence',['Los cristianos no son invitados a imitar el lagar','el Guerrero divino en permiso para violencia cristiana']],
  ['filthy rags context',['«Trapos contaminados» confiesa justicia corrompida, no inutilidad de toda buena obra','no enseña que misericordia, justicia, arrepentimiento u obediencia del Espíritu sean repugnantes para Dios']],
  ['potter not pastor',['El Alfarero es Dios, no el pastor','ni barro/alfarero en autoridad humana sobre otra persona']],
  ['new creation texture',['La imagen de nueva creación de Isaías no es idéntica a la forma final de Apocalipsis','no aplanes Isaías 65 dentro de Apocalipsis 21']],
  ['no prosperity guarantees',['no garantía individual','No uses Isaías 65 para garantizar larga vida, casa propia, fertilidad o prosperidad']],
  ['no antisemitic final judgment',['No debe volverse antisemitismo, triunfo nacionalista ni entretenimiento con castigo']],
  ['leader safeguards',['No prometas confidencialidad absoluta','deberes de protección','apoyo médico','violencia doméstica']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Isaiah safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/isaias-estudio'+html+'"'))fail('English Isaiah page must link Spanish alternate.');
 if(!english.includes('isaiah-study-data'+js+'?v=1.1.0')||!english.includes('isaiah-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Isaiah page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/isaias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/isaiah-study'+html+'"','../isaiah-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.60.0'])if(!spanish.includes(marker))fail(`Spanish Isaiah page missing ${marker}.`);
 if(!i18n.includes("'isaiah-study"+html+"':'es/isaias-estudio"+html+"'"))fail('Isaiah bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Isaiah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Isaiah study audit passed.');
