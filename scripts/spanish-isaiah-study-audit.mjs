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
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Isaiah series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Isaiah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['composition humility',['no hace de una teoría composicional una prueba de fe','horizontes históricos']],
  ['hardening not ministry strategy',['La comisión de endurecimiento es juicio, no estrategia ministerial','no autoriza a maestros a manipular, confundir o abandonar personas']],
  ['Immanuel two horizons',['debe tener significado dentro de esa emergencia','cumplimiento de Mateo']],
  ['Jewish dignity',['no ridiculices la interpretación judía','identidad e historia judías']],
  ['Assyria not modern code',['no uses Asiria como código para un país actual']],
  ['chapters 36 to 39 restored',['Isaías 36–39 corre paralelo a 2 Reyes 18–20','giro entre Asiria y el consuelo exílico']],
  ['nation oracles not ethnic hate',['no autorizan a cristianos a declarar malditas poblaciones étnicas modernas','sufrimiento civil']],
  ['disability dignity',['personas discapacitadas sean menos espirituales o menos humanas','Accesibilidad y dignidad son obligaciones presentes']],
  ['healing not guarantee',['no promete que cada oración fiel alargará la vida','No presiones a personas enfermas o discapacitadas para reclamar una cura']],
  ['Israel servant identity',['Israel es explícitamente el siervo escogido de Dios','conservar esa identidad corporativa']],
  ['Cyrus not political canonization',['Providencia no equivale a aprobación moral','no es un cheque en blanco para declarar a un político favorito elegido por Dios']],
  ['Isaiah 45 calamity',['no enseña que Dios cometa mal moral']],
  ['servant identity nuance',['El Siervo está arraigado en la vocación de Israel','restaurar a Israel']],
  ['Isaiah 53 no abuse mandate',['nunca autoriza a abusadores a exigir silencio','no digas a víctimas que imiten al Siervo permaneciendo en peligro']],
  ['healing verse not cure formula',['no garantiza cura física inmediata','no debe usarse para culpar a enfermos o discapacitados']],
  ['infertility dignity',['no son espiritualmente deficientes','no garantía de fertilidad']],
  ['word not magic formula',['no promete que todo sermón, predicción personal o supuesta profecía']],
  ['foreigners and eunuchs dignity',['Extranjeros y eunucos reciben un nombre','diferencia corporal como descalificación automática']],
  ['leader accountability',['El oficio espiritual nunca elimina rendición de cuentas','protección contra represalias']],
  ['fasting not prosperity',['no son fórmulas que garanticen riqueza o recuperación médica']],
  ['divine armor not vigilantism',['no autoriza a vigilantes a tomar armas literales']],
  ['Isaiah 64 context',['«Trapos contaminados» confiesa justicia corrompida, no inutilidad de toda buena obra','no enseña que misericordia, justicia, arrepentimiento u obediencia del Espíritu sean repugnantes']],
  ['potter not pastor',['El Alfarero es Dios, no el pastor','no da a clero, cónyuges, padres, políticos o instituciones derecho a «moldear» personas']],
  ['Isaiah 65 not Revelation flattening',['no debe igualarse línea por línea con Apocalipsis 21','La imagen de nueva creación de Isaías no es idéntica']],
  ['no longevity prosperity guarantee',['no debe predicarse como promesa de que toda persona fiel vivirá cierta edad, poseerá casa, tendrá hijos o prosperará financieramente ahora']],
  ['final judgment not delight',['No debe volverse antisemitismo, triunfo nacionalista ni entretenimiento con castigo']],
  ['no partisan codebook',['No conviertas Isaías en código para elecciones modernas, guerras, países, conspiraciones o fechas']],
  ['leader support and safeguarding',['No prometas confidencialidad absoluta','violencia doméstica','apoyo médico']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Isaiah safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/isaias-estudio'+html+'"'))fail('English Isaiah page must link Spanish alternate.');
 if(!english.includes('isaiah-study-data'+js+'?v=1.1.0')||!english.includes('isaiah-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Isaiah page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/isaias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/isaiah-study'+html+'"','../isaiah-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.60.0'])if(!spanish.includes(marker))fail(`Spanish Isaiah page missing ${marker}.`);
 if(!i18n.includes("'isaiah-study"+html+"':'es/isaias-estudio"+html+"'"))fail('Isaiah bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Isaiah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Isaiah study audit passed.');
