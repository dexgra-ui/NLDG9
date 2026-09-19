import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='micah-study-data'+js,enGuide='micah-study-guide'+js,esData='micah-study-data-es'+js,enPage='micah-study'+html,esPage=['es','miqueas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('micah')?.status!=='published')fail('Micah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Miqueas':'Micah','2 Reyes':'2 Kings','Isaías':'Isaiah','Amós':'Amos','Lamentaciones':'Lamentations','1 Pedro':'1 Peter','Éxodo':'Exodus','Levítico':'Leviticus','1 Reyes':'1 Kings','Juan':'John','Deuteronomio':'Deuteronomy','Ezequiel':'Ezekiel','Jeremías':'Jeremiah','Marcos':'Mark','Santiago':'James','Salmo':'Psalm','Zacarías':'Zechariah','Mateo':'Matthew','Apocalipsis':'Revelation','2 Samuel':'2 Samuel','Efesios':'Ephesians','Hebreos':'Hebrews','Oseas':'Hosea','Lucas':'Luke','1 Juan':'1 John'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const normList=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);
 if(es?.slug!=='miqueas-estudio')fail('Spanish Micah slug must be miqueas-estudio.');
 if(es?.book!=='Miqueas')fail('Spanish Micah book name must be Miqueas.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Micah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==7||es?.lessons?.length!==7)fail('Micah must retain seven lessons in both languages.');
 if(JSON.stringify(normList(es.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))fail('Micah series main Scripture references must match English exactly.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<7;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Micah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English exactly.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Miqueas '))fail(`${label}: Scripture reference must begin with Miqueas.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Micah theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Micah must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Micah series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Micah series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Micah series guide must retain eight discussion questions.');
 if(String(es?.seriesContext||'').split('\n\n').filter(Boolean).length!==2)fail('Spanish Micah series context must retain two paragraphs.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Micah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['disaster blame',['no diagnostiques desastres modernos como castigo divino','no afirmes que cada catástrofe revela un pecado específico']],
  ['land law restraint',['no equipares directamente los arreglos modernos de propiedad','política moderna uno a uno']],
  ['evidence based accountability',['rendición de cuentas basada en evidencia','acusaciones sin fundamento']],
  ['paid ministry restraint',['no asumas que clero pagado','compensación con corrupción']],
  ['holy war restraint',['no conviertas miqueas 4:13 en mandato cristiano de guerra santa','permiso para violencia religiosa']],
  ['Babylon horizon humility',['no fuerces una sola solución al horizonte de babilonia']],
  ['Bethlehem restraint',['caso bíblico más amplio para la identidad eterna de cristo','no conviertas \'siete...ocho\' en numerología']],
  ['nationalism restraint',['eslogan nacionalista','nacionalismo o violencia cristiana']],
  ['Micah 6 nonpartisan',['no reduzcas miqueas 6:8 a una plataforma partidista','no hagas de miqueas 6:8 una prueba partidista']],
  ['child sacrifice restraint',['no leas el versículo 7 como aprobación divina del sacrificio infantil','primogénito expresa algo que dios desea']],
  ['family safety',['no uses los versículos 5–6 para justificar control o abuso familiar','situaciones inseguras']],
  ['safe reconciliation',['reconciliación insegura','perdón, responsabilidad, restitución, límites, reconciliación y confianza restaurada']],
  ['enemy dehumanization',['no leas la imagen del polvo como permiso para degradar enemigos']],
  ['Christ centered Bethlehem',['mateo aplica explícitamente el texto del gobernante de belén a jesús']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Micah safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/miqueas-estudio'+html+'"'))fail('English Micah page must link Spanish alternate.');
 if(!english.includes('micah-study-data'+js+'?v=1.1.0')||!english.includes('micah-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Micah page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/miqueas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/micah-study'+html+'"','../micah-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.70.0'])if(!spanish.includes(marker))fail(`Spanish Micah page missing ${marker}.`);
 if(!i18n.includes("'micah-study"+html+"':'es/miqueas-estudio"+html+"'"))fail('Micah bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Micah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Micah study audit passed.');
