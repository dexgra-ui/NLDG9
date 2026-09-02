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
 if(es?.slug!=='job-estudio')fail('Spanish Job slug must be job-estudio.');
 if(es?.book!=='Job')fail('Spanish book name must be Job.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Job must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Job must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Job lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Job '))fail(`${label}: Scripture reference must begin with Job.`);
 }
 if(es?.themeLabel!=='Compromisos interpretativos')fail('Job theme label must be Compromisos interpretativos.');
 for(const field of ['recommendedRhythm','facilitatorSafeguards','howToReadTogether','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Spanish Job missing guide field ${field}.`);
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Job contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['integrity before blame',['El sufrimiento no es evidencia confiable de culpa personal','rechaza la culpa automática']],
  ['abuse is not a divine test',['Nunca digas que Dios está probando a alguien por medio del abuso o de un daño prevenible']],
  ['disability dignity',['La enfermedad y la discapacidad no son señales de fe inferior']],
  ['endurance is not abuse acceptance',['La perseverancia no es aceptación pasiva del abuso']],
  ['suicide safety',['la prioridad es la seguridad, no un debate teológico','no dejes sola a una persona en riesgo','ayuda profesional, de crisis o de emergencia']],
  ['medical and mental health care',['La oración puede acompañar medicamentos, consejería, cuidado del dolor']],
  ['tragedy does not assign guilt',['Nunca uses una tragedia para asignar culpa a los muertos o a quienes están de duelo']],
  ['leaders must not intensify shame',['Los líderes nunca deben aumentar la vergüenza']],
  ['structural injustice',['sistemas injustos pueden crearlo y profundizarlo']],
  ['certainty can become prosecution',['ya no estamos discerniendo; estamos procesando a una persona como culpable']],
  ['formation cannot be imposed',['nunca debe imponerse como explicación del abuso, enfermedad o pérdida de otra persona']],
  ['mystery not blame',['El misterio nunca debe convertirse nuevamente en culpa']],
  ['silence not coercion',['Esto no es silencio impuesto por líderes abusivos']],
  ['humility not self-hatred',['La humildad no es desprecio de uno mismo']],
  ['reconciliation safety',['sin responsabilidad, reparación y seguridad']],
  ['children are not replaced',['Los nuevos hijos no reemplazan a los hijos que murieron']],
  ['no prosperity formula',['no promete que toda persona fiel recuperará el doble en esta vida','No uses Job 42 como promesa de que Dios duplicará dinero, hijos, salud o posesiones']],
  ['facilitator care',['una fe suficiente eliminaría el dolor, los medicamentos, la consejería, los límites o las preguntas']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Job safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/job-estudio'+html+'"'))fail('English Job page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.55.0'))fail('English Job page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/job-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/job-study'+html+'"','../job-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.55.0'])if(!spanish.includes(marker))fail(`Spanish Job page missing ${marker}.`);
 if(!i18n.includes("'job-study"+html+"':'es/job-estudio"+html+"'"))fail('Job bilingual route is missing.');
 if(!hub.includes('href="job-estudio'+html+'"'))fail('Spanish Job library card is missing.');
 if(!hub.includes('cuarenta y cinco series completas y revisadas'))fail('Spanish library count must be forty-five series.');
}
if(errors.length){console.error('Spanish Job study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Job study audit passed.');