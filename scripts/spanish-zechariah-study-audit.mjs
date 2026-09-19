import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='zechariah-study-data'+js,enGuide='zechariah-study-guide'+js,esData='zechariah-study-data-es'+js,enPage='zechariah-study'+html,esPage=['es','zacarias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('zechariah')?.status!=='published')fail('Zechariah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={
  'Zacarías':'Zechariah','2 Crónicas':'2 Chronicles','Hageo':'Haggai','Malaquías':'Malachi','Santiago':'James','Apocalipsis':'Revelation',
  'Ezequiel':'Ezekiel','Efesios':'Ephesians','Levítico':'Leviticus','Isaías':'Isaiah','Jeremías':'Jeremiah','Romanos':'Romans',
  'Hebreos':'Hebrews','Salmo':'Psalm','Esdras':'Ezra','1 Corintios':'1 Corinthians','2 Corintios':'2 Corinthians','Miqueas':'Micah',
  'Mateo':'Matthew','Juan':'John','1 Pedro':'1 Peter','Números':'Numbers'
 };
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const normList=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);

 if(es?.slug!=='zacarias-estudio')fail('Spanish Zechariah slug must be zacarias-estudio.');
 if(es?.book!=='Zacarías')fail('Spanish book name must be Zacarías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Zechariah must declare Nueva Traducción Viviente (NTV).');
 if(es?.themeLabel!=='Verdad clave')fail('Spanish Zechariah theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true||en?.lessonSubtitleMode!==true)fail('Zechariah must retain lesson subtitle mode in both languages.');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Zechariah must retain eight lessons in both languages.');
 if(JSON.stringify(normList(es.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))fail('Zechariah series main Scripture references must match English exactly.');

 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Zechariah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b?.scripture)!==a?.scripture)fail(`${label}: main Scripture range must match English exactly.`);
  if(JSON.stringify((b?.supporting||[]).map(norm))!==JSON.stringify(a?.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','openingParagraphs','contextParagraphs','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain exactly two Scripture-context paragraphs.`);
  if((b?.jesusParagraphs?.length??0)!==1)fail(`${label}: must retain one Jesus Connection paragraph.`);
  if((b?.guardrailParagraphs?.length??0)!==1)fail(`${label}: must retain one Do Not Miss This paragraph.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Zacarías '))fail(`${label}: Scripture reference must begin with Zacarías.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Zechariah series foundation missing ${field}.`);
 if((en?.seriesTeaching?.length??0)!==8||(es?.seriesTeaching?.length??0)!==8)fail('Zechariah series guide must retain eight teaching movements.');
 if((en?.seriesQuestions?.length??0)!==8||(es?.seriesQuestions?.length??0)!==8)fail('Zechariah series guide must retain eight discussion questions.');
 if(String(en?.seriesContext||'').split('\n\n').filter(Boolean).length!==2||String(es?.seriesContext||'').split('\n\n').filter(Boolean).length!==2)fail('Zechariah series context must retain two paragraphs in both languages.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Zechariah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['Persian postexilic setting',['período persa temprano']],
  ['no modern political decoding',['no identifiques los cuernos, carros, pastores, batallas de jerusalén o naciones de zacarías con políticos']],
  ['antisemitism rejection',['rechaza antisemitismo']],
  ['replacement contempt rejection',['desprecio de reemplazo']],
  ['accuser restraint',['no llames satánicos a críticos, víctimas o procesos de responsabilidad']],
  ['body shame restraint',['no uses ropas sucias para avergonzar cuerpos o personas vulnerables']],
  ['leader accountability after grace',['líderes restaurados siguen obligados']],
  ['Spirit not excuse for poor preparation',['no uses no con ejército ni fuerza para excusar mala preparación']],
  ['woman-in-basket safeguard',['no debe usarse para presentar a las mujeres como inherentemente pecadoras']],
  ['fasting and justice',['no elogies ayuno mientras ignoras injusticia']],
  ['Jewish garment dignity',['no trates la ropa de un judío como permiso para exotizar o explotar judíos']],
  ['no collective Jewish blame',['no uses zacarías 12 para culpar colectivamente al pueblo judío']],
  ['no modern holy war mapping',['no conviertas imágenes de batalla de jerusalén en aprobación de guerra religiosa moderna']],
  ['shepherd accountability',['los pastores son responsables de seguridad y bienestar del rebaño']],
  ['Matthew 27 complexity',['no simplifiques en exceso la atribución de mateo 27 a jeremías']],
  ['sexual violence not approved',['atrocidad descrita y no conducta aprobada']],
  ['no date setting',['no uses zacarías 14 para predecir fecha o secuencia militar exacta del fin']],
  ['Canaanite not ethnic exclusion',['no leas la referencia final al cananeo como permiso para exclusión étnica']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Zechariah safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/zacarias-estudio'+html+'"'))fail('English Zechariah page must link Spanish alternate.');
 if(!english.includes('zechariah-study-data'+js+'?v=1.1.0')||!english.includes('zechariah-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0')||!english.includes('nldg-i18n'+js+'?v=1.75.0'))fail('English Zechariah page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/zacarias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/zechariah-study'+html+'"','../zechariah-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.75.0'])if(!spanish.includes(marker))fail(`Spanish Zechariah page missing ${marker}.`);
 if(!i18n.includes("'zechariah-study"+html+"':'es/zacarias-estudio"+html+"'"))fail('Zechariah bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Zechariah study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Zechariah study audit passed.');
