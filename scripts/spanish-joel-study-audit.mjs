import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='joel-study-data'+js,enGuide='joel-study-guide'+js,esData='joel-study-data-es'+js,enPage='joel-study'+html,esPage=['es','joel-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('joel')?.status!=='published')fail('Joel must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Salmo':'Psalm','Lamentaciones':'Lamentations','Romanos':'Romans','Santiago':'James','2 Corintios':'2 Corinthians','Éxodo':'Exodus','Isaías':'Isaiah','Jonás':'Jonah','Lucas':'Luke','Números':'Numbers','Hechos':'Acts','1 Corintios':'1 Corinthians','1 Tesalonicenses':'1 Thessalonians','Miqueas':'Micah','Mateo':'Matthew','Apocalipsis':'Revelation'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='joel-estudio')fail('Spanish Joel slug must be joel-estudio.');
 if(es?.book!=='Joel')fail('Spanish Joel book name must be Joel.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Joel must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Joel must retain four lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Joel lesson ${i+1}`;
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
  if(!String(b?.scripture||'').startsWith('Joel '))fail(`${label}: Scripture reference must begin with Joel.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Joel theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Joel must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Joel series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Joel series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Joel series guide must retain eight discussion questions.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Joel contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['dating humility',['la fecha del libro es debatida','no hace de una fecha precisa una prueba de fe']],
  ['chapter numbering',['tradición hebrea corresponden a joel 3:1–5 y capítulo 4','no es una diferencia textual']],
  ['disaster blame',['no autoriza a lectores modernos a asignar un pecado secreto','no culpes a sobrevivientes de desastre por pecado oculto']],
  ['locust humility',['se debate si describen etapas, especies o intensificación poética','no un código de tecnología militar moderna']],
  ['addiction dignity',['trastornos por consumo de sustancias','compasión, tratamiento, responsabilidad y apoyo comunitario']],
  ['lament dignity',['el gozo mismo se marchitó','sin convertirlos en prueba de fe débil']],
  ['army imagery humility',['los intérpretes difieren sobre si son langostas descritas como ejército','no debe mapearse con seguridad sobre helicópteros, misiles']],
  ['no manufactured panic',['pánico manufacturado','miedo usado para controlar dinero y lealtad']],
  ['heart repentance',['rasguen sus corazones, no solo sus ropas','forzar vergüenza pública']],
  ['who knows humility',['«¿quién sabe?» protege','dios nos debe una reversión particular']],
  ['no prosperity guarantee',['no debe garantizarse como dinero reemplazado','no prediques «restaurar los años» como promesa garantizada']],
  ['women Spirit inclusion',['hijos e hijas profetizan','las mujeres están explícitamente incluidas']],
  ['age inclusion',['ancianos y jóvenes reciben sueños y visiones']],
  ['servants slavery safeguard',['no respalda la esclavitud como institución']],
  ['prophecy accountability',['«dios me dijo» nunca debe terminar la rendición de cuentas','probarlo todo']],
  ['cosmic signs no countdown',['cada eclipse, incendio, guerra o evento astronómico','cuenta regresiva segura del fin']],
  ['Pentecost fulfillment',['pentecostés es por tanto un cumplimiento decisivo','jesús resucitado derrama el espíritu']],
  ['valley decision correction',['el valle de decisión es el veredicto de dios','no principalmente nuestro llamado al altar']],
  ['human trafficking',['trata, explotación sexual, trabajo forzado, venta de niños']],
  ['ancient nations not modern codes',['no códigos étnicos modernos','nunca autoriza odio hacia supuestos descendientes']],
  ['retributive sale not model',['no debe usarse para defender esclavitud, venta de niños, castigo colectivo o venganza']],
  ['anti-militarism',['no es mandato cristiano para glorificar guerra','no uses «arados en espadas» para bautizar militarismo']],
  ['Zion political restraint',['no debe usarse como respaldo incuestionable de cada política de un estado moderno','no conviertas sion en cheque en blanco para cualquier gobierno moderno']],
  ['leader safety',['prioriza seguridad, atención calificada, protección legal','responsabilidades aplicables de denuncia']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Joel safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/joel-estudio'+html+'"'))fail('English Joel page must link Spanish alternate.');
 if(!english.includes('joel-study-data'+js+'?v=1.1.0')||!english.includes('joel-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Joel page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/joel-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/joel-study'+html+'"','../joel-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.66.0'])if(!spanish.includes(marker))fail(`Spanish Joel page missing ${marker}.`);
 if(!i18n.includes("'joel-study"+html+"':'es/joel-estudio"+html+"'"))fail('Joel bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Joel study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Joel study audit passed.');
