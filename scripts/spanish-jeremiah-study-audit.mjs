import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='jeremiah-study-data'+js,enGuide='jeremiah-study-guide'+js,esData='jeremiah-study-data-es'+js,enPage='jeremiah-study'+html,esPage=['es','jeremias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('jeremiah');
if(book?.status!=='published')fail('Jeremiah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='jeremias-estudio')fail('Spanish Jeremiah slug must be jeremias-estudio.');
 if(es?.book!=='Jeremías')fail('Spanish book name must be Jeremías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Jeremiah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Jeremiah must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Jeremiah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Jeremías '))fail(`${label}: Scripture reference must begin with Jeremías.`);
 }
 for(const field of ['themeLabel','seriesPurposeLabel','lessonPurposeLabel','recommendedRhythm','facilitatorSafeguards','howToReadTogether','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Spanish Jeremiah missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Jeremiah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['prophecy not weaponized',['No uses el lenguaje profético como arma contra opositores modernos','no equipares desacuerdo con rebelión contra Dios']],
  ['critics not enemies',['no da permiso para tratar a cada crítico como enemigo de Dios']],
  ['institutions and justice',['Las instituciones no pueden reemplazar justicia y arrepentimiento','La pertenencia religiosa, un edificio, una denominación o una reputación cristiana nunca excusan abuso']],
  ['immigrants orphans widows',['Dios nombra específicamente a inmigrantes, huérfanos y viudas']],
  ['child safeguarding',['La protección infantil tiene prioridad sobre la imagen institucional']],
  ['prophetic accountability',['Nunca uses «Dios me dijo» para silenciar preguntas','Los líderes siguen sujetos a rendición de cuentas']],
  ['political and medical manipulation',['manipular votos, dinero, relaciones, tratamientos médicos o decisiones de seguridad']],
  ['religious abuse',['El abuso espiritual, físico o institucional no se vuelve santo porque lo cometa una autoridad religiosa']],
  ['despair and suicide safety',['pensamientos suicidas, prioriza seguridad inmediata, compañía y apoyo profesional de crisis']],
  ['suffering not proof of obedience',['Nadie debe permanecer en peligro para probar obediencia']],
  ['displacement dignity',['refugiados, inmigrantes y desplazados','desplazamiento es bueno']],
  ['faithful presence not nationalism',['sin nacionalismo ni dominio religioso','lealtad partidista o silencio ante injusticia']],
  ['Jeremiah 29:11 in context',['Jeremías 29:11 habla a una comunidad que enfrenta un exilio largo','no promete éxito individual instantáneo, riqueza, ausencia de enfermedad ni el cumplimiento de cada sueño personal']],
  ['Jewish identity and new covenant',['sin borrar la identidad judía, fomentar antisemitismo','como si Dios hubiera rechazado a Israel']],
  ['forgiveness and safe boundaries',['el perdón no obliga acceso inseguro','No conviertas el perdón en secreto, impunidad, reconciliación forzada']],
  ['Jerusalem tragedy',['La destrucción de Jerusalén se narra como tragedia, no entretenimiento','Nunca debe alimentar antisemitismo, nacionalismo cristiano ni deleite en el sufrimiento civil']],
  ['survivor and displaced care',['Cuidado de sobrevivientes y desplazados','seguridad, vivienda, alimento, atención médica, salud mental, apoyo legal y acompañamiento a largo plazo']],
  ['disaster victim blaming',['no declares que una guerra, huracán, enfermedad, pobreza o muerte moderna demuestra culpa específica']],
  ['civilian suffering dignity',['El sufrimiento civil merece lamento, protección y ayuda, no satisfacción religiosa']],
  ['qualified care',['apoyo pastoral, médico, de salud mental, legal o de protección']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Jeremiah safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/jeremias-estudio'+html+'"'))fail('English Jeremiah page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.61.0'))fail('English Jeremiah page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/jeremias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/jeremiah-study'+html+'"','../jeremiah-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.61.0'])if(!spanish.includes(marker))fail(`Spanish Jeremiah page missing ${marker}.`);
 if(!i18n.includes("'jeremiah-study"+html+"':'es/jeremias-estudio"+html+"'"))fail('Jeremiah bilingual route is missing.');
 if(!hub.includes('href="jeremias-estudio'+html+'"'))fail('Spanish Jeremiah library card is missing.');
 if(!hub.includes('cincuenta y una series completas y revisadas'))fail('Spanish library count must be fifty-one series.');
}
if(errors.length){console.error('Spanish Jeremiah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Jeremiah study audit passed.');
