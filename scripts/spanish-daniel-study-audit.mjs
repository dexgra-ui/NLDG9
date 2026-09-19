import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='daniel-study-data'+js,enGuide='daniel-study-guide'+js,esData='daniel-study-data-es'+js,enPage='daniel-study'+html,esPage=['es','daniel-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('daniel');
if(book?.status!=='published')fail('Daniel must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Daniel':'Daniel','2 Reyes':'2 Kings','Jeremías':'Jeremiah','Romanos':'Romans','1 Corintios':'1 Corinthians','Santiago':'James','Génesis':'Genesis','Salmo':'Psalm','Isaías':'Isaiah','Apocalipsis':'Revelation','Éxodo':'Exodus','Mateo':'Matthew','Hechos':'Acts','Hebreos':'Hebrews','Deuteronomio':'Deuteronomy','Proverbios':'Proverbs','Lucas':'Luke','Gálatas':'Galatians','1 Timoteo':'1 Timothy','1 Pedro':'1 Peter','Marcos':'Mark','2 Tesalonicenses':'2 Thessalonians'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='daniel-estudio')fail('Spanish Daniel slug must be daniel-estudio.');
 if(es?.book!=='Daniel')fail('Spanish book name must be Daniel.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Daniel must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Daniel must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Daniel lesson ${i+1}`;
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
  if(!String(b?.scripture||'').startsWith('Daniel '))fail(`${label}: Scripture reference must begin with Daniel.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Daniel theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Daniel must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Daniel series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Daniel series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Daniel series guide must retain eight discussion questions.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Daniel contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['composition humility',['Este estudio no hace de una teoría composicional una prueba de fe','muchos estudiosos modernos argumentan que el libro alcanzó su forma final']],
  ['Hebrew Aramaic structure',['Daniel es bilingüe','están en arameo']],
  ['Daniel diet not universal',['no establece una «dieta de Daniel» eterna','No conviertas Daniel 1 en dieta universal']],
  ['kingdom schemes debated',['Una lectura cristiana tradicional suele ver Babilonia, Medo-Persia, Grecia y Roma','las identificaciones posteriores son debatidas']],
  ['stone not conquest',['no lo crea mediante conquista, coerción o nacionalismo']],
  ['fourth figure restraint',['el texto no identifica explícitamente a la figura como Jesús preencarnado','no insistas en que la cuarta figura debe ser Cristo preencarnado']],
  ['no persecution inflation',['no convertirse en razón para imaginar persecución cristiana cada vez que existe desacuerdo normal']],
  ['rescue not guaranteed',['La fe no es contrato que garantice supervivencia','no prometas rescate de todo fuego']],
  ['mental health dignity',['La enfermedad mental no es evidencia de castigo divino','No diagnostiques a Nabucodonosor con enfermedad mental moderna']],
  ['leader restoration accountability',['responsabilidad observable y práctica cambiada con el tiempo','no supongas que restauración exige devolver a un líder a su cargo']],
  ['Belshazzar historical context',['Belsasar es conocido por registros babilónicos como hijo de Nabónido','tercer gobernante']],
  ['no private judgment formula',['no deben reclamar autoridad privada para anunciar que todo fracaso institucional, enfermedad, derrota electoral o desastre']],
  ['Darius uncertainty',['Su identificación histórica precisa sigue debatida','La incertidumbre debe reconocerse']],
  ['collective punishment rejected',['La represalia colectiva no es justicia cristiana','La culpa personal no debe asignarse por relación familiar, etnia o pertenencia grupal']],
  ['religious freedom not coercion',['sin querer que el Estado coaccione adoración a su favor']],
  ['beast labeling rejected',['no nombrar políticos actuales con certeza','No conviertas a todo gobernante actual en bestia o cuerno pequeño']],
  ['Son of Man and saints',['Los santos y el Hijo del Hombre pertenecen juntos','Jesús reclama personalmente la imagen del Hijo del Hombre']],
  ['Daniel 8 explicit interpretation',['el carnero representa a los reyes de Media y Persia','el macho cabrío representa a Grecia']],
  ['Antiochus horizon',['Antíoco IV Epífanes','no borres a Antíoco IV del horizonte histórico']],
  ['2300 humility',['debaten si la frase cuenta 2.300 días o 1.150 sacrificios','no debe convertirse casualmente en años y fechas modernas']],
  ['seventy weeks humility',['Las setenta semanas son importantes y profundamente debatidas','no fijar fechas de regreso']],
  ['no demonizing people',['no autoriza demonizar personas','no identifiques personas como demonios']],
  ['Daniel 11 uncertainty',['Hay desacuerdo sobre si 36–45 continúa con Antíoco','Se requiere humildad']],
  ['resurrection final horizon',['La resurrección, no el cálculo, es el horizonte final','La última palabra no es un gráfico sino resurrección']],
  ['leader safeguards',['No uses profecía para crear pánico','atención calificada','protección legal','deberes aplicables de denuncia']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Daniel safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/daniel-estudio'+html+'"'))fail('English Daniel page must link Spanish alternate.');
 if(!english.includes('daniel-study-data'+js+'?v=1.1.0')||!english.includes('daniel-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Daniel page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/daniel-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/daniel-study'+html+'"','../daniel-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.64.0'])if(!spanish.includes(marker))fail(`Spanish Daniel page missing ${marker}.`);
 if(!i18n.includes("'daniel-study"+html+"':'es/daniel-estudio"+html+"'"))fail('Daniel bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Daniel study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Daniel study audit passed.');
