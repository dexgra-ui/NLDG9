import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='haggai-study-data'+js,enGuide='haggai-study-guide'+js,esData='haggai-study-data-es'+js,enPage='haggai-study'+html,esPage=['es','hageo-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail('Missing '+file+'.');
if(spanishOldTestamentByKey.get('haggai')?.status!=='published')fail('Haggai must be marked published.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='hageo-estudio')fail('Spanish Haggai slug must be hageo-estudio.');
 if(es?.book!=='Hageo')fail('Spanish book name must be Hageo.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Haggai must declare NTV.');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Haggai must retain four lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','examination','challenge','caution','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Haggai lesson '+(i+1);
  if(a?.number!==b?.number)fail(label+': lesson number mismatch.');
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(label+': missing '+field+'.');
  if(!String(b?.context||'').trim())fail(label+': missing context.');
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(label+': '+field+' count must match English.');
  if((b?.teaching?.length??0)!==6)fail(label+': expected six teaching movements.');
  if((b?.questions?.length??0)!==8)fail(label+': expected eight discussion questions.');
  if((b?.supporting?.length??0)!==3)fail(label+': expected three supporting Scriptures.');
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(label+': incomplete teaching movement.');
  if(!String(b?.scripture||'').startsWith('Hageo '))fail(label+': Scripture reference must begin with Hageo.');
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Haggai guide block count must match English.');
 for(let i=0;i<(en?.seriesGuideBlocks?.length||0);i++){
  const a=en.seriesGuideBlocks[i],b=es.seriesGuideBlocks[i],label='Haggai guide block '+(i+1);
  if(!b?.title?.trim())fail(label+': missing title.');
  if(Array.isArray(a?.items)){
   if((b?.items?.length??-1)!==a.items.length)fail(label+': item count must match English.');
   for(const item of b?.items||[])if(!String(item).trim())fail(label+': empty item.');
  }else if(!String(b?.text||'').trim())fail(label+': missing text.');
 }
 const richFields=['themeLabel','seriesPurposeLabel','purpose','lessonPurposeLabel','openingLabel','mainPassageLabel','supportingScriptureLabel','scriptureContextLabel'];
 for(const field of richFields)if(!String(es?.[field]||'').trim())fail('Spanish Haggai missing '+field+'.');
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp('\\b'+version+'\\b').test(raw))fail('Spanish Haggai contains disallowed Bible version '+version+'.');
 for(const phrase of ['Central Aim','Series Purpose','Historical and Literary Setting','Lesson Map','Recommended Rhythm','Leader Commitments','Pastoral Safeguards','Christ-Centered Reading','Desired Fruit'])if(raw.includes(phrase))fail('Spanish Haggai contains untranslated interface label: '+phrase+'.');
 const safeguards=[
  ['Persian returned-community setting','comunidad que regresó durante el dominio persa'],
  ['hardship not proof of personal sin','no como una fórmula universal según la cual toda dificultad demuestra pecado personal'],
  ['hidden-sin blame rejected','sin culpar de toda dificultad a un pecado oculto'],
  ['homes are not condemned','el problema no es que los hogares sean malos'],
  ['shared worship and covenant responsibility','la adoración comunitaria y la responsabilidad del pacto'],
  ['renewal is God-enabled and communal','dios hace posible la renovación, y la comunidad la pone en práctica'],
  ['comparison does not deny loss','hageo aborda la comparación sin negar la pérdida'],
  ['nostalgia cannot devalue obedience','la nostalgia se vuelve dañina cuando hace que la obediencia presente parezca inútil'],
  ['presence over visible scale','«yo estoy con ustedes» importa más que la magnitud visible'],
  ['covenant and Spirit remain','dios les recuerda su promesa del éxodo y la presencia de su espíritu'],
  ['human accomplishment is not final hope','más allá de los logros humanos, hacia el reino de dios'],
  ['religious proximity is insufficient','la actividad en la iglesia, el trabajo ministerial o el lenguaje religioso no pueden sustituir la entrega a dios'],
  ['tolerated sin affects community','el pecado tolerado afecta la adoración y la comunidad'],
  ['external service cannot bribe God','el servicio externo no puede sobornar a dios'],
  ['prosperity formula rejected','no enseña una fórmula de prosperidad'],
  ['repentant restoration preserved','restaurar a un pueblo arrepentido'],
  ['no empire has permanent control','ningún imperio tiene control permanente'],
  ['military and political power not ultimate','la fuerza militar o política como seguridad definitiva'],
  ['Zerubbabel not final king','sin declarar que zorobabel sea el rey final'],
  ['election not superiority','la elección de dios es gracia y responsabilidad, no superioridad'],
  ['Jesus fulfills the hope','jesús cumple la esperanza inconmovible'],
  ['warnings not panic shame or suspicion','no uses las advertencias para producir pánico, vergüenza ni sospecha'],
  ['questions distinguished from rebellion','distingue las preguntas de la rebelión'],
  ['weakness distinguished from unwillingness','la debilidad de la falta de voluntad'],
  ['accountability distinguished from control','la rendición de cuentas legítima del control'],
  ['no automatic hardship judgment','no trates la dificultad material como prueba automática de pecado personal'],
  ['covenant setting preserved','mantén claro el contexto del pacto'],
  ['confidentiality and harm protected','protege la confidencialidad, toma en serio el daño'],
  ['trauma disclosure not pressured','no presiones a los participantes para que revelen experiencias traumáticas'],
  ['Christ-centered roles','jesús es el templo verdadero y definitivo, el rey davídico'],
  ['Christlike fruit','una esperanza que produzca un carácter semejante al de cristo']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail('Haggai safeguard missing '+label+': '+phrase+'.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/hageo-estudio'+html+'"'))fail('English Haggai page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.74.0'))fail('English Haggai page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/hageo-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/haggai-study'+html+'"','../haggai-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.74.0'])if(!spanish.includes(marker))fail('Spanish Haggai page missing '+marker+'.');
 if(!i18n.includes("'haggai-study"+html+"':'es/hageo-estudio"+html+"'"))fail('Haggai bilingual route is missing.');
 if(!hub.includes('href="hageo-estudio'+html+'"'))fail('Spanish Haggai library card is missing.');
 if(!hub.includes('sesenta y cuatro series completas y revisadas'))fail('Spanish library count must be sixty-four series.');
}
if(errors.length){console.error('Spanish Haggai study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Haggai study audit passed.');
