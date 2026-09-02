import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='ezekiel-study-data'+js,enGuide='ezekiel-study-guide'+js,esData='ezekiel-study-data-es'+js,enPage='ezekiel-study'+html,esPage=['es','ezequiel-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('ezekiel');
if(book?.status!=='published')fail('Ezekiel must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='ezequiel-estudio')fail('Spanish Ezekiel slug must be ezequiel-estudio.');
 if(es?.book!=='Ezequiel')fail('Spanish book name must be Ezequiel.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Ezekiel must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Ezekiel must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Ezekiel lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Ezequiel '))fail(`${label}: Scripture reference must begin with Ezequiel.`);
 }
 for(const field of ['themeLabel','seriesPurposeLabel','lessonPurposeLabel','recommendedRhythm','facilitatorSafeguards','howToReadTogether','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Spanish Ezekiel missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Ezekiel contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['exile and covenant setting',['dentro del exilio y el juicio del pacto']],
  ['no harmful prophetic imitation',['Nunca imites actos proféticos que dañen cuerpos']],
  ['trauma survivor dignity',['avergonzar a sobrevivientes de trauma']],
  ['no disaster victim blaming',['los desastres prueban culpa individual']],
  ['antisemitism rejected',['Rechaza antisemitismo']],
  ['religious violence rejected',['violencia religiosa']],
  ['ableism rejected',['capacitismo']],
  ['watchman authority limited',['lenguaje autoritario de ‘atalaya’','Advertir no es controlar']],
  ['no manipulation',['sin amenazas manipuladoras, seguimiento invasivo ni abuso de autoridad espiritual']],
  ['individual responsibility not systemic denial',['La responsabilidad personal tampoco debe usarse para negar sistemas injustos, trauma o daño recibido']],
  ['no delight in death',['Dios no se complace en la muerte','Nunca celebres muerte, desastre, enfermedad o caída de enemigos']],
  ['repentance includes repair',['reparación cuando sea posible y cambios que protejan a quienes fueron dañados']],
  ['prophetic signs not modern harm',['No son modelos para que líderes actuales dañen su cuerpo o el de otros']],
  ['displaced people dignity',['Las personas desplazadas, refugiadas o que escapan de peligro merecen dignidad, protección y ayuda práctica']],
  ['institutional accountability',['Proteger la reputación de una iglesia nunca debe tener prioridad sobre arrepentimiento, seguridad y justicia']],
  ['wife death not reenacted',['nunca debe usarse para reprimir duelo, excusar negligencia conyugal ni ordenar que otra persona vuelva a representar un trauma']],
  ['trauma not spectacle',['El trauma no debe convertirse en espectáculo']],
  ['leader privilege rejected',['La posición espiritual nunca convierte privilegio en derecho']],
  ['disability dignity',['respeta dignidad de personas enfermas o discapacitadas']],
  ['care respects consent',['Buscar no significa acosar; el cuidado respeta límites, consentimiento y seguridad']],
  ['community intimidation addressed',['protege frente a intimidación y abuso entre miembros']],
  ['no modern messiahs',['No convierte a ningún dirigente moderno en mesías, rey incuestionable o sustituto de Cristo']],
  ['cleansing not body shame',['no debe usarse para avergonzar cuerpos, menstruación, discapacidad, trauma, historia sexual']],
  ['no mental health stigma',['No etiquetes a personas traumatizadas, deprimidas o neurodivergentes como espiritualmente ‘duras’ por sus síntomas']],
  ['boundaries preserved',['Vulnerabilidad espiritual nunca significa renunciar a límites sanos ni volver a situaciones abusivas']],
  ['spiritual claims tested',['deben probarse por carácter, verdad, fruto, Escrituras y responsabilidad comunitaria']],
  ['no ethnic superiority',['no evidencia de superioridad étnica, nacional, económica o religiosa']],
  ['replacement theology rejected',['reemplazo arrogante de Israel']],
  ['no prosperity theology',['teologías de prosperidad']],
  ['dry bones historical context',['La visión habla primero de Israel exiliado como comunidad devastada']],
  ['healing not blamed on faith',['no da permiso para culpar a personas enfermas porque ‘no respondieron’ a una declaración de fe']],
  ['medical care included',['La oración camina junto a tratamiento y cuidado']],
  ['suicide safety',['riesgo suicida','prioriza seguridad inmediata y apoyo de crisis calificado']],
  ['no Christian nationalism',['No justifica nacionalismo cristiano']],
  ['Gog not modern propaganda',['Identificar con certeza a una etnia, país o líder contemporáneo puede convertir una visión profética en propaganda peligrosa']],
  ['no holy war authorization',['no autoriza a personas o gobiernos a cometer violencia diciendo que están adelantando el juicio de Dios']],
  ['no headline decoding',['No decodifiques los titulares','no autoriza nombrar naciones actuales con certeza, fijar fechas ni provocar pánico']],
  ['leaders need limits',['La autoridad piadosa necesita límites reales, transparencia y mecanismos para corregir abuso']],
  ['no modern dispossession',['No es autorización para despojo moderno, supremacía étnica ni desprecio hacia comunidades actuales']],
  ['healing imagery not medical replacement',['no reemplaza medicina ni promete curación física instantánea']],
  ['no forced disclosure or unsafe reconciliation',['Nunca presiones revelaciones personales, reconciliación insegura']],
  ['qualified practical support',['apoyo médico, de salud mental, legal, financiero, de vivienda y de protección']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Ezekiel safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/ezequiel-estudio'+html+'"'))fail('English Ezekiel page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.63.0'))fail('English Ezekiel page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/ezequiel-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/ezekiel-study'+html+'"','../ezekiel-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.63.0'])if(!spanish.includes(marker))fail(`Spanish Ezekiel page missing ${marker}.`);
 if(!i18n.includes("'ezekiel-study"+html+"':'es/ezequiel-estudio"+html+"'"))fail('Ezekiel bilingual route is missing.');
 if(!hub.includes('href="ezequiel-estudio'+html+'"'))fail('Spanish Ezekiel library card is missing.');
 if(!hub.includes('cincuenta y tres series completas y revisadas'))fail('Spanish library count must be fifty-three series.');
}
if(errors.length){console.error('Spanish Ezekiel study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Ezekiel study audit passed.');
