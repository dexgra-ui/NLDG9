import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='second-chronicles-study-data'+js,enGuide='second-chronicles-study-guide'+js,esData='second-chronicles-study-data-es'+js,enPage='second-chronicles-study'+html,esPage=['es','segunda-cronicas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('second-chronicles');
if(book?.status!=='published')fail('2 Chronicles must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='segunda-cronicas-estudio')fail('Spanish 2 Chronicles slug must be segunda-cronicas-estudio.');
 if(es?.book!=='2 Crónicas')fail('Spanish book name must be 2 Crónicas.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 2 Chronicles must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('2 Chronicles must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`2 Chronicles lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('2 Crónicas '))fail(`${label}: Scripture reference must begin with 2 Crónicas.`);
  if(!b?.teaching?.some(move=>move.heading==='Jesús en el centro'))fail(`${label}: Jesus-at-the-center movement is missing.`);
 }
 if(es?.themeLabel!=='Compromisos interpretativos')fail('2 Chronicles must retain interpretive commitments.');
 if((es?.seriesGuideBlocks?.length??0)!==(en?.seriesGuideBlocks?.length??0))fail('2 Chronicles series guide block count must match English.');
 if(es?.lessonSubtitleMode!==true)fail('2 Chronicles must retain lesson subtitle mode.');
 if(!String(es?.seriesQuestion||'').trim()||!String(es?.seriesPrayer||'').trim())fail('2 Chronicles series question or prayer is missing.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 2 Chronicles contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['temple and institutional humility',['no contienen a Dios ni garantizan fidelidad institucional']],
  ['foreigners and spiritual superiority',['extranjeros que buscan a Dios','no producir superioridad espiritual']],
  ['2 Chronicles 7:14 misuse',['pertenece al pacto de Dios con Israel y al contexto del templo','nunca debe convertirse en una promesa de poder político o prosperidad nacional para una nación moderna']],
  ['success and unjust systems',['no prueban que cada sistema sea justo ni que todo líder esté espiritualmente sano']],
  ['harsh leadership',['escoge la intimidación','los lemas sobre unidad no pueden sanar']],
  ['religious claims and conflict',['El lenguaje correcto puede usarse con fines egoístas']],
  ['prophetic retaliation',['encarcela al profeta y oprime a otros','Las represalias contra quienes dicen la verdad']],
  ['justice and bribery',['contra favoritismo y soborno','trato justo y sistemas responsables']],
  ['child protection',['proteger a un niño vulnerable','La protección infantil nunca debe sacrificarse por estabilidad institucional o conveniencia política']],
  ['financial transparency',['El dinero religioso exige transparencia, trabajo competente y rendición de cuentas']],
  ['religious violence',['silencia a Zacarías mediante asesinato','Proteger el poder a costa de la verdad y la vida']],
  ['safe correction',['preocupaciones puedan expresarse con seguridad y sin represalias']],
  ['restoration without exclusion',['las reglas deben servir a la restauración y no convertirse en armas contra buscadores sinceros']],
  ['victim dignity and accountability',['El perdón no borra el dolor de las víctimas ni elimina la necesidad de rendición de cuentas']],
  ['antisemitism and disaster blame',['nunca debe usarse para justificar antisemitismo','culpar simplistamente a personas modernas por desastre, enfermedad, pobreza o muerte']],
  ['covenant suffering safeguard',['No afirmes que toda enfermedad, desastre, derrota, pobreza o muerte demuestra pecado personal']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`2 Chronicles safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['presionar revelaciones personales','silenciar preocupaciones','exigir dinero','encubrir abuso','promover nacionalismo o violencia','responsabilidades de protección y denuncia','apoyo pastoral, médico, legal o profesional calificado'])if(!all.includes(phrase))fail(`2 Chronicles leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/segunda-cronicas-estudio'+html+'"'))fail('English 2 Chronicles page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.51.0'))fail('English 2 Chronicles page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/segunda-cronicas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/second-chronicles-study'+html+'"','../second-chronicles-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.51.0'])if(!spanish.includes(marker))fail(`Spanish 2 Chronicles page missing ${marker}.`);
 if(!i18n.includes("'second-chronicles-study"+html+"':'es/segunda-cronicas-estudio"+html+"'"))fail('2 Chronicles bilingual route is missing.');
 if(!hub.includes('href="segunda-cronicas-estudio'+html+'"'))fail('Spanish 2 Chronicles library card is missing.');
 if(!hub.includes('cuarenta y una series completas y revisadas'))fail('Spanish library count must be forty-one series.');
}
if(errors.length){console.error('Spanish 2 Chronicles study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 2 Chronicles study audit passed.');