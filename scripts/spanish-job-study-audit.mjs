import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='job-study-data'+js,enGuide='job-study-guide'+js,esData='job-study-data-es'+js,enPage='job-study'+html,esPage=['es','job-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('job');
if(book?.status!=='published')fail('Job must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Juan':'John','Lucas':'Luke','Salmo':'Psalm','2 Corintios':'2 Corinthians','Santiago':'James','1 Reyes':'1 Kings','Romanos':'Romans','Gálatas':'Galatians','Hebreos':'Hebrews','Isaías':'Isaiah','1 Corintios':'1 Corinthians','Proverbios':'Proverbs','Colosenses':'Colossians','1 Pedro':'1 Peter','Marcos':'Mark','Mateo':'Matthew','Apocalipsis':'Revelation'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='job-estudio')fail('Spanish Job slug must be job-estudio.');
 if(es?.book!=='Job')fail('Spanish book name must be Job.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Job must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Job must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Job lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)<5)fail(`${label}: needs at least five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Job '))fail(`${label}: Scripture reference must begin with Job.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Job theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Job must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Job series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6||(en?.seriesTeaching?.length??0)!==6)fail('Job series guide must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Job series guide must retain eight discussion questions.');
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Job series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Job contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['integrity and without cause',['«sin causa»','sufrimiento no puede tratarse como evidencia confiable de culpa personal']],
  ['test language limits',['No digas a quien sufre: «Dios hizo esto para probarte»','no debe convertirse en afirmación de que toda tragedia sea una prueba celestial']],
  ['wife dignity',['La esposa de Job también está dentro de la catástrofe','habla como una de las mujeres necias']],
  ['illness dignity',['Enfermedad, discapacidad, dolor crónico o desfiguración no son veredictos morales','medicamentos, tratamiento del dolor']],
  ['abuse not endurance',['Recibir adversidad no significa aceptar pasivamente el abuso','permanezca con un abusador']],
  ['lament and suicide distinction',['Lamento bíblico y riesgo clínico no son la misma pregunta','no supongas que todo lamento significa suicidio inminente']],
  ['suicide safety',['pregunta directamente por peligro inmediato','no dejes sola a una persona en riesgo inminente']],
  ['private vision limits',['Experiencias espirituales privadas no deben usarse para reclamar autoridad incuestionable','evidencia, Escritura, sabiduría y humildad']],
  ['dead children not blamed',['Nunca uses una tragedia para asignar culpa oculta a muertos','los hijos de Job murieron porque pecaron']],
  ['Job 13 textual humility',['Job 13:15 no debe construirse como un eslogan sencillo de fe','permiten traducciones']],
  ['redeemer humility',['go’el es un redentor familiar o vindicador','no debe separarse de la demanda inmediata de Job por vindicación']],
  ['social injustice',['Job nombra sistemas sociales que producen sufrimiento','injusticia humana']],
  ['Elihu ambiguity',['no lo reprende explícitamente junto a los otros tres','Su papel se debate']],
  ['formation not imposed',['ese significado no debe imponerse','abuso, enfermedad, discapacidad, duelo o trauma']],
  ['whirlwind not weaponized',['No uses «¿Dónde estabas tú?» como arma pastoral','un líder humano no tiene derecho a imitar interrogación divina']],
  ['friends not vindicated',['sin vindicar a los amigos','nada en el discurso dice que su calamidad pruebe maldad secreta']],
  ['Behemoth Leviathan humility',['No insistas en que Behemot y Leviatán son definitivamente dinosaurios','criptozoología']],
  ['humility not self hate',['sin enseñarnos desprecio propio','sin convertir humildad en desprecio propio']],
  ['Job 42 translation difficulty',['Job 42:6 exige humildad de traducción e interpretación','no debe usarse para enseñar odio propio']],
  ['Job 42 calamity difficulty',['El texto atribuye calamidad a Dios sin darnos una fórmula universal','Tampoco autoriza a cuidadores a decir a personas específicas que Dios causó personalmente']],
  ['reconciliation safety',['no es un guion universal de reconciliación forzada','responsabilidad, reparación y seguridad']],
  ['children not replacements',['Los nuevos hijos son regalos, no reemplazos','sin hacer intercambiables a los hijos anteriores']],
  ['daughters inheritance',['Jemima, Cesia y Keren-hapuc','reciben herencia entre sus hermanos']],
  ['no prosperity formula',['No prometas posesiones duplicadas','No prometas «doble por tu problema»']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Job safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['Participantes pueden pasar o salir sin explicación','No prometas confidencialidad absoluta','intención suicida actual','deberes de seguridad o denuncia','tratamiento de salud mental','protección legal'])if(!all.includes(phrase))fail(`Job leader safeguard missing ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/job-estudio'+html+'"'))fail('English Job page must link Spanish alternate.');
 if(!english.includes('job-study-data'+js+'?v=1.1.0')||!english.includes('job-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Job page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/job-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/job-study'+html+'"','../job-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.55.0'])if(!spanish.includes(marker))fail(`Spanish Job page missing ${marker}.`);
 if(!i18n.includes("'job-study"+html+"':'es/job-estudio"+html+"'"))fail('Job bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Job study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Job study audit passed.');
