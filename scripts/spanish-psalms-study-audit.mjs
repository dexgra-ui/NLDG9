import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='psalms-study-data'+js,enGuide='psalms-study-guide'+js,esData='psalms-study-data-es'+js,enPage='psalms-study'+html,esPage=['es','salmos-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('psalms');
if(book?.status!=='published')fail('Psalms must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Salmos':'Psalms','Deuteronomio':'Deuteronomy','Josué':'Joshua','Hechos':'Acts','2 Timoteo':'2 Timothy','Hebreos':'Hebrews','Juan':'John','Lucas':'Luke','Romanos':'Romans','2 Corintios':'2 Corinthians','1 Reyes':'1 Kings','Marcos':'Mark','Proverbios':'Proverbs','Mateo':'Matthew','1 Juan':'1 John','Génesis':'Genesis','Colosenses':'Colossians','Apocalipsis':'Revelation','Gálatas':'Galatians','1 Corintios':'1 Corinthians','Efesios':'Ephesians','Santiago':'James','Éxodo':'Exodus'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='salmos-estudio')fail('Spanish Psalms slug must be salmos-estudio.');
 if(es?.book!=='Salmos')fail('Spanish book name must be Salmos.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Psalms must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Psalms must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Psalms lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Salmos '))fail(`${label}: Scripture reference must begin with Salmos.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Psalms theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Psalms must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Psalms series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6||(en?.seriesTeaching?.length??0)!==6)fail('Psalms series guide must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Psalms series guide must retain eight discussion questions.');
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Psalms series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Psalms contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['Psalm 1 not prosperity',['no como fórmula de prosperidad','no debe convertirse en promesa de riqueza, salud, éxito profesional']],
  ['Christ above politics',['no autoriza a partido, nación, campaña o líder alguno a reclamar su trono único','no uses el estudio para clasificar partidos, candidatos o naciones']],
  ['creation not secret code',['no como reemplazo de la Escritura ni código para obtener predicciones privadas']],
  ['Psalm 91 not immunity',['sin crear un contrato de inmunidad','garantiza inmunidad contra enfermedad, accidente, persecución, violencia o muerte']],
  ['Jesus refuses presumption',['Jesús se niega a convertir Salmo 91 en permiso para probar a Dios','la presunción fabrica riesgo']],
  ['responsible care',['Medicina, planificación de emergencia, consejería, evacuación, refugio','expresiones de sabiduría y no incredulidad']],
  ['lament dignity',['El lamento continúa hablando a Dios','Salmo 88 rechaza un final feliz forzado']],
  ['suicide distinction',['La desesperación poética y el riesgo suicida actual deben distinguirse','No trates todo lamento intenso como idéntico a riesgo suicida']],
  ['suicide safety',['intención suicida actual, plan, acceso a medios letales','no dejes a la persona sola']],
  ['Psalm 32 not diagnosis',['sin medicalizar la culpa','no usarse para decir a personas enfermas, discapacitadas, en duelo o deprimidas que pecado oculto causó su cuerpo o mente']],
  ['Bathsheba Uriah harm',['Betsabé, Urías, el hogar y el abuso de poder real','No uses Salmo 51:4 para borrar a Betsabé, Urías']],
  ['no coerced victim confession',['La confesión pertenece a quien hizo el mal','no deben presionar a víctimas o sobrevivientes a revelar trauma públicamente']],
  ['forgiveness and accountability',['El perdón no restaura automáticamente confianza, acceso, cargo o seguridad','reconciliación inmediata de una persona herida']],
  ['universal dignity',['La dignidad se recibe de Dios y no se gana por fuerza, productividad, riqueza, raza, sexo, edad, salud o capacidad']],
  ['Elohim translation humility',['«un poco menor que Dios» o «un poco menor que los seres celestiales/ángeles»']],
  ['dominion not exploitation',['Dominio no puede significar permiso para crueldad inútil, destrucción imprudente']],
  ['disaster blame',['no identifica todo desastre como castigo','no ofrece un código para asignar culpa moral a comunidades']],
  ['Psalm 109 ambiguity',['Algunos intérpretes leen los versículos 6–19 como imprecación del salmista','otros argumentan que al menos una parte puede citar acusaciones hostiles']],
  ['Psalm 137 trauma not violence',['no es mandato para que el pueblo de Dios mate niños o ataque una etnia','dañar niños']],
  ['lawful justice',['justicia por medios veraces, legales y protectores','preserva evidencia']],
  ['Psalm 37 not poverty blame',['no debe transformarse en regla universal de que la pobreza prueba pecado','no es un cheque en blanco — Salmo 37:4–6']],
  ['Psalm 121 not accident proof',['no contrato de viaje sin accidentes','planes de seguridad no contradicen el salmo']],
  ['unity not cover up',['La unidad bíblica no puede significar uniformidad, encubrimiento','Salmo 133 para silenciar informes de maldad']],
  ['human rulers limited',['Ningún gobernante, nación o movimiento político merece confianza mesiánica','mortalidad y limitación de todo gobernante humano']],
  ['Psalm 149 no holy violence',['sin crear un mandato cristiano de violencia','No invites a imaginar violencia contra oponentes actuales']],
  ['praise not forced happiness',['no negación del lamento','No conviertas Salmo 150 en mandato de que personas en duelo siempre deben sonar celebratorias']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Psalms safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['Participantes pueden pasar o salir sin explicación','No prometas confidencialidad','intención suicida actual','deberes de seguridad o denuncia','tratamiento de salud mental','límites de sobrevivientes','justicia legal'])if(!all.includes(phrase))fail(`Psalms leader safeguard missing ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/salmos-estudio'+html+'"'))fail('English Psalms page must link Spanish alternate.');
 if(!english.includes('psalms-study-data'+js+'?v=1.1.0')||!english.includes('psalms-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Psalms page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/salmos-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/psalms-study'+html+'"','../psalms-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.56.0'])if(!spanish.includes(marker))fail(`Spanish Psalms page missing ${marker}.`);
 if(!i18n.includes("'psalms-study"+html+"':'es/salmos-estudio"+html+"'"))fail('Psalms bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Psalms study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Psalms study audit passed.');
