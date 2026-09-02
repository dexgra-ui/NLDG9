import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='ecclesiastes-study-data'+js,enGuide='ecclesiastes-study-guide'+js,esData='ecclesiastes-study-data-es'+js,enPage='ecclesiastes-study'+html,esPage=['es','eclesiastes-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('ecclesiastes');
if(book?.status!=='published')fail('Ecclesiastes must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='eclesiastes-estudio')fail('Spanish Ecclesiastes slug must be eclesiastes-estudio.');
 if(es?.book!=='Eclesiastés')fail('Spanish book name must be Eclesiastés.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Ecclesiastes must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==6||es?.lessons?.length!==6)fail('Ecclesiastes must retain six lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<6;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Ecclesiastes lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Eclesiastés '))fail(`${label}: Scripture reference must begin with Eclesiastés.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesTeaching','seriesQuestions','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!es?.[field]||(Array.isArray(es[field])&&!es[field].length))fail(`Spanish Ecclesiastes missing ${field}.`);
 if(es?.seriesTeaching?.length!==6)fail('Spanish Ecclesiastes must retain six series teaching movements.');
 if(es?.seriesQuestions?.length!==8)fail('Spanish Ecclesiastes must retain eight series questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Ecclesiastes contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['vapor not nihilism',['El libro no dice que nada importa','La vida es real y valiosa']],
  ['mental health care',['No lo uses para descartar depresión ni sufrimiento','atención médica o de salud mental']],
  ['mortality not hopelessness',['La mortalidad no vuelve inútil el servicio','no niega la resurrección']],
  ['sovereignty and grief',['La soberanía nunca debe convertirse en una forma de decir a personas en duelo que su dolor es simple o merecido']],
  ['injustice and reporting',['denunciar delitos o abusos','buscar procesos justos']],
  ['oppression and accountable institutions',['protección, acompañamiento, defensa veraz y justicia responsable','transparencia, rendición de cuentas']],
  ['community beyond marriage',['Esto no se limita al matrimonio']],
  ['wealth not spiritual superiority',['Tener recursos trae responsabilidad, no prueba de una fe superior','La abundancia no equivale al bienestar']],
  ['victims not told to tolerate abuse',['Nunca excusa pecado ni dice a víctimas que toleren abuso']],
  ['authority not absolute',['la obediencia a la autoridad nunca es absoluta']],
  ['document harm',['documentamos daño','rendición de cuentas justa']],
  ['outcomes beyond merit',['Los resultados dependen de condiciones más allá del mérito','culpar a cada persona que lucha']],
  ['aging dignity',['los creyentes mayores no valen menos','Los cuerpos cambian, pero las personas siguen mereciendo honor, voz, comunidad y apoyo compasivo']],
  ['joy with accountability',['El gozo bíblico no es vergonzoso ni temerario']],
  ['safe pastoral care',['No uses el sufrimiento, la sumisión, el perdón, la generosidad, la debilidad ni la soberanía de Dios para silenciar personas','prioriza seguridad, atención calificada y las responsabilidades de denuncia aplicables']],
  ['leadership trust earned',['La confianza y el acceso al liderazgo requieren carácter demostrado']],
  ['no forced reconciliation',['presionar una reconciliación']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Ecclesiastes safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/eclesiastes-estudio'+html+'"'))fail('English Ecclesiastes page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.58.0'))fail('English Ecclesiastes page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/eclesiastes-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/ecclesiastes-study'+html+'"','../ecclesiastes-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.58.0'])if(!spanish.includes(marker))fail(`Spanish Ecclesiastes page missing ${marker}.`);
 if(!i18n.includes("'ecclesiastes-study"+html+"':'es/eclesiastes-estudio"+html+"'"))fail('Ecclesiastes bilingual route is missing.');
 if(!hub.includes('href="eclesiastes-estudio'+html+'"'))fail('Spanish Ecclesiastes library card is missing.');
 if(!hub.includes('cuarenta y ocho series completas y revisadas'))fail('Spanish library count must be forty-eight series.');
}
if(errors.length){console.error('Spanish Ecclesiastes study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Ecclesiastes study audit passed.');
