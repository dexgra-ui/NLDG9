import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml';
const js='.j'+'s';
const enData='numbers-study-data'+js;
const enGuide='numbers-study-guide'+js;
const esData='numbers-study-data-es'+js;
const enPage='numbers-study'+html;
const esPage=['es','numeros-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enData,enGuide,esData,enPage,esPage,hubPath,i18nPath];
const book=spanishOldTestamentByKey.get('numbers');
for(const file of required)if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(book?.status!=='published')fail('Numbers must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
  const en=load(enData,enGuide),es=load(esData);
  if(es?.slug!=='numeros-estudio')fail('Spanish Numbers slug must be numeros-estudio.');
  if(es?.book!=='Números')fail('Spanish book name must be Números.');
  if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Numbers must declare Nueva Traducción Viviente (NTV).');
  if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Numbers must retain eight lessons in both languages.');
  const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
  for(let i=0;i<8;i++){
    const a=en.lessons[i],b=es.lessons[i],label=`Numbers lesson ${i+1}`;
    if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
    for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
    for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
    for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
    if(!String(b?.scripture||'').startsWith('Números '))fail(`${label}: Scripture reference must use Números.`);
  }
  for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Numbers series foundation missing ${field}.`);
  if((es?.seriesTeaching?.length??0)!==6)fail('Numbers series foundation must retain six teaching movements.');
  if((es?.seriesQuestions?.length??0)!==8)fail('Numbers series foundation must retain eight discussion questions.');
  const data=read(esData);
  for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))fail(`Spanish Numbers contains disallowed Bible version ${version}.`);
  const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons;
  if(!l1.teaching[0].body.includes('plena dignidad')||!l1.teaching[3].body.includes('privacidad')||!l1.teaching[3].body.includes('accesibilidad')||!l1.teaching[4].body.includes('no fórmula mágica')||!l1.teaching[5].body.includes('descanso no es fracaso'))fail('Lesson 1 must preserve dignity, health privacy, accessibility, non-formula blessing, and rest safeguards.');
  if(!l2.teaching[1].body.includes('agotamiento no prueba falta de fe')||!l2.teaching[2].body.includes('dones que no controlan')||!l2.teaching[4].body.includes('prejuicio étnico o racial')||!l2.teaching[5].body.includes('No es modelo para avergonzar a mujeres'))fail('Lesson 2 must preserve burnout care, shared leadership, anti-racism, and anti-shaming safeguards.');
  if(!l3.teaching[0].body.includes('exagerado')||!l3.teaching[0].body.includes('diseñado para controlar')||!l3.teaching[3].body.includes('no en superioridad')||!l3.teaching[3].body.includes('ni glorifica conquista')||!l3.teaching[4].body.includes('conducta de turba')||!l3.teaching[4].body.includes('rechazar intimidación'))fail('Lesson 3 must preserve evidence-based discernment, anti-superiority, non-glorification of conquest, and mob-intimidation safeguards.');
  if(!l4.teaching[1].body.includes('no ejecuta en privado')||!l4.teaching[1].body.includes('Nunca autoriza')||!l4.teaching[2].body.includes('jamás deben imitar estos juicios')||!l4.teaching[5].body.includes('impureza ritual no es vergüenza moral'))fail('Lesson 4 must preserve non-retaliatory leadership, sober judgment, and grief dignity safeguards.');
  if(!l5.teaching[0].body.includes('espacio para lamentar')||!l5.teaching[1].body.includes('necesidad material')||!l5.teaching[3].body.includes('resultados visibles no prueban liderazgo sano')||!l5.teaching[4].body.includes('no borran responsabilidad presente')||!l5.teaching[5].body.includes('Respetar un límite'))fail('Lesson 5 must preserve grief care, material needs, leadership accountability, and boundaries.');
  if(!l6.teaching[2].body.includes('enfermedad o desastre prueba culpa personal')||!l6.teaching[4].body.includes('no posee poder independiente')||!l6.teaching[5].heading.includes('convertirse en ídolo'))fail('Lesson 6 must preserve illness dignity, non-magical healing, and anti-idolatry safeguards.');
  if(!l7.teaching[0].body.includes('se niega a vender favor divino')||!l7.teaching[2].body.includes('criatura indefensa')||!l7.teaching[3].body.includes('superioridad étnica')||!l7.teaching[4].body.includes('culpar a mujeres o extranjeros')||!l7.teaching[5].body.includes('Nunca es modelo para violencia religiosa moderna')||!l7.teaching[5].body.includes('no violenta'))fail('Lesson 7 must preserve anti-exploitation, animal dignity, anti-ethnic-superiority, anti-victim-blaming, and Phinehas nonviolence safeguards.');
  if(!l8.teaching[1].body.includes('Cinco mujeres')||!l8.teaching[1].body.includes('la ley cambia')||!l8.teaching[3].body.includes('control abusivo')||!l8.teaching[3].body.includes('consentimiento')||!l8.teaching[4].body.includes('genocidio')||!l8.teaching[4].body.includes('explotación sexual')||!l8.teaching[5].body.includes('evidencia, proceso, proporcionalidad'))fail('Lesson 8 must preserve women’s agency, consent, Numbers 31 safeguards, and due process.');
  const guide=String(es.seriesLeaderGuidance||'');
  for(const phrase of ['plagas','guerra','prejuicio','discapacidad','explotación sexual','duelo','amenazar críticos','sobrevivientes','consentimiento','racismo','misoginia','atención médica','debido proceso'])if(!guide.includes(phrase))fail(`Numbers leader guidance must preserve ${phrase}.`);
  const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
  if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/numeros-estudio'+html+'"'))fail('English Numbers page must link Spanish alternate.');
  if(!english.includes('nldg-i18n'+js+'?v=1.42.0'))fail('English Numbers page must load current language switcher.');
  for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/numeros-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/numbers-study'+html+'"','../numbers-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.42.0'])if(!spanish.includes(marker))fail(`Spanish Numbers page missing ${marker}.`);
  if(!i18n.includes("'numbers-study"+html+"':'es/numeros-estudio"+html+"'"))fail('Numbers bilingual route is missing.');
  if(!hub.includes('href="numeros-estudio'+html+'"'))fail('Spanish Numbers library card is missing.');
  if(!hub.includes('treinta y dos series completas y revisadas'))fail('Spanish library count must be thirty-two series.');
}

if(errors.length){console.error('Spanish Numbers study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Numbers study audit passed.');