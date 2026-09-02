import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='lamentations-study-data'+js,enGuide='lamentations-study-guide'+js,esData='lamentations-study-data-es'+js,enPage='lamentations-study'+html,esPage=['es','lamentaciones-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('lamentations');
if(book?.status!=='published')fail('Lamentations must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='lamentaciones-estudio')fail('Spanish Lamentations slug must be lamentaciones-estudio.');
 if(es?.book!=='Lamentaciones')fail('Spanish book name must be Lamentaciones.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Lamentations must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Lamentations must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Lamentations lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Lamentaciones '))fail(`${label}: Scripture reference must begin with Lamentaciones.`);
 }
 for(const field of ['themeLabel','seriesPurposeLabel','lessonPurposeLabel','recommendedRhythm','facilitatorSafeguards','howToReadTogether','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Spanish Lamentations missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Lamentations contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['grief not rushed',['No apresures el duelo','El duelo no avanza en línea recta']],
  ['survivor dignity',['culpes a sobrevivientes','Las sobrevivientes y demás víctimas merecen ser creídas, protegidas y acompañadas hacia justicia']],
  ['no misogynistic shame',['nunca debe convertirse en permiso para vergüenza misógina']],
  ['steady nonintrusive presence',['compañía constante y no invasiva']],
  ['institutions accountable',['Proteger la imagen de un ministerio no es lo mismo que proteger el honor de Dios']],
  ['false comfort',['El consuelo separado de la verdad deja a las personas sin preparación']],
  ['children and trauma care',['centra protección, alimento, refugio y cuidado informado por trauma']],
  ['tears are not weak faith',['Las lágrimas no son fe débil']],
  ['qualified trauma care',['La sanidad puede requerir tiempo y cuidado profesional calificado']],
  ['mercies not pain-free guarantee',['no promete un día sin dolor, enfermedad, depresión o pérdidas']],
  ['active waiting and treatment',['Esperar puede incluir oración, supervivencia, tratamiento, descanso, defensa de derechos y reconstrucción']],
  ['food justice not sensationalism',['justicia alimentaria y ayuda concreta, no hacia sensacionalismo']],
  ['no voyeurism',['Evita voyeurismo y superioridad moral fácil']],
  ['religious leader accountability',['El estatus espiritual nunca elimina rendición de cuentas']],
  ['no political messiah',['Ningún líder, partido o nación merece confianza mesiánica']],
  ['material trauma care',['La oración debe caminar junto con alimento, vivienda, atención médica, seguridad y comunidad paciente']],
  ['dispossession and housing',['La reparación debe reconocer pérdidas materiales, vivienda y seguridad']],
  ['labor exploitation',['Dios escucha la humillación económica y la explotación laboral']],
  ['violence against women and elders',['La violencia ataca cuerpos y dignidad social']],
  ['unresolved prayer',['La Escritura permite una oración todavía no resuelta']],
  ['trauma in the body',['El trauma también está en el cuerpo']],
  ['grief is not competition',['El duelo no es competencia']],
  ['practical accompaniment',['comidas, transporte, vivienda, consejería, protección y compañía sostenida']],
  ['hope does not silence testimony',['La esperanza nunca debe silenciar testimonios de dolor o abuso']],
  ['no victim blaming in repentance',['sin culpar a víctimas por el daño que otros les hicieron']],
  ['lawful protection not vengeance',['Busca protección legal, seguridad y rendición de cuentas']],
  ['repair requires truth',['Reconstruir exige nombrar fallas de liderazgo, violencia, hambre y desplazamiento en vez de proteger reputaciones']],
  ['open-ended hope',['Una esperanza inconclusa sigue siendo esperanza']],
  ['suicide safety',['pensamientos suicidas','prioriza seguridad inmediata y apoyo de crisis calificado']],
  ['no forced disclosure or reconciliation',['Nunca presiones revelaciones personales ni reconciliación insegura']],
  ['qualified practical support',['apoyo médico, de salud mental, legal, financiero, de vivienda y de protección']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Lamentations safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/lamentaciones-estudio'+html+'"'))fail('English Lamentations page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.62.0'))fail('English Lamentations page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/lamentaciones-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/lamentations-study'+html+'"','../lamentations-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.62.0'])if(!spanish.includes(marker))fail(`Spanish Lamentations page missing ${marker}.`);
 if(!i18n.includes("'lamentations-study"+html+"':'es/lamentaciones-estudio"+html+"'"))fail('Lamentations bilingual route is missing.');
 if(!hub.includes('href="lamentaciones-estudio'+html+'"'))fail('Spanish Lamentations library card is missing.');
 if(!hub.includes('cincuenta y dos series completas y revisadas'))fail('Spanish library count must be fifty-two series.');
}
if(errors.length){console.error('Spanish Lamentations study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Lamentations study audit passed.');
