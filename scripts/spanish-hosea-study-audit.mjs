import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='hosea-study-data'+js,enGuide='hosea-study-guide'+js,esData='hosea-study-data-es'+js,enPage='hosea-study'+html,esPage=['es','oseas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('hosea')?.status!=='published')fail('Hosea must be published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Oseas':'Hosea','2 Reyes':'2 Kings','Deuteronomio':'Deuteronomy','Romanos':'Romans','1 Pedro':'1 Peter','Efesios':'Ephesians','Isaías':'Isaiah','Jeremías':'Jeremiah','Ezequiel':'Ezekiel','2 Samuel':'2 Samuel','Lucas':'Luke','Miqueas':'Micah','Malaquías':'Malachi','Santiago':'James','Salmo':'Psalm','Mateo':'Matthew','1 Samuel':'1 Samuel','Éxodo':'Exodus'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='oseas-estudio')fail('Spanish Hosea slug must be oseas-estudio.');
 if(es?.book!=='Oseas')fail('Spanish Hosea book name must be Oseas.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Hosea must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Hosea must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Hosea lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Oseas '))fail(`${label}: Scripture reference must begin with Oseas.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Hosea theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Hosea must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Hosea series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Hosea series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Hosea series guide must retain eight discussion questions.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Hosea contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['eighth-century setting',['reino del norte de Israel','caída de Samaria en 722 a.C.']],
  ['marriage metaphor not counseling',['metáfora, no consejería matrimonial','Consentimiento, seguridad, protección legal']],
  ['anti-antisemitism',['nunca debe convertirse en caricatura antisemita','no uses el fracaso de Efraín para despreciar al pueblo judío']],
  ['Gomer uncertainty',['vida interior de Gomer permanece mayormente desconocida','No inventes la historia sexual de Gomer']],
  ['children dignity',['Ningún niño debe ser etiquetado','no romantices que hijos proféticos carguen etiquetas de rechazo']],
  ['Jehu Jezreel tension',['Existe una tensión canónica real','violencia de Jehú']],
  ['exposure not imitation',['Ningún cónyuge, iglesia, padre o líder puede usar Oseas para justificar humillación sexual','pornografía de venganza']],
  ['stalking coercion rejected',['no llames al acoso «amor que persigue»','control coercitivo']],
  ['Hosea 3 woman not explicit Gomer',['La mujer no es nombrada','No digas como hecho que Oseas 3 nombra explícitamente a Gomer']],
  ['payment not ownership',['no especifica si la transacción','no conviertas el pago en prueba de propiedad matrimonial']],
  ['forgiveness distinct access',['El perdón no restaura automáticamente contacto, matrimonio, liderazgo o confianza']],
  ['knowledge not anti-education',['no desprecia educación, experiencia, medicina, ciencia','No uses Oseas 4:6 para despreciar educación']],
  ['sexual double standard',['rechaza explícitamente una doble moral sexual','hombres mismos visitan prostitutas']],
  ['political neutrality',['no debe reasignarse mecánicamente a estados, partidos, alianzas o elecciones modernas','No uses Oseas para clasificar partidos políticos']],
  ['no victim blaming whirlwind',['no debe usarse para decir que todo desastre prueba que la víctima','sin culpar víctimas ni hacer profecía partidista']],
  ['third day humility',['no cita Oseas 6:2 como predicción directa','No prediques Oseas 6:2 como una predicción directa e indiscutible']],
  ['mercy accountability',['«Misericordia no sacrificio» no debe usarse para cancelar responsabilidad de perpetradores']],
  ['Adam translation humility',['«Como Adán» o «en Adán» es debatido']],
  ['Israel first Matthew typology',['«De Egipto llamé a mi hijo» primero nombra a Israel','La conexión es tipológica']],
  ['parental abuse rejected',['no da permiso para crianza abusiva','no uses la imagen parental de Dios para excusar crianza abusiva']],
  ['healing not medical guarantee',['«Sanaré su apostasía» es sanidad del pacto','no garantiza cura médica']],
  ['prosperity rejected',['no contrato de prosperidad','teología de prosperidad']],
  ['disability grief safeguard',['discapacidad, enfermedad, pobreza o duelo']],
  ['leader safety',['prioriza seguridad inmediata, atención calificada, protección legal','responsabilidades aplicables de denuncia']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Hosea safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/oseas-estudio'+html+'"'))fail('English Hosea page must link Spanish alternate.');
 if(!english.includes('hosea-study-data'+js+'?v=1.1.0')||!english.includes('hosea-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Hosea page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/oseas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/hosea-study'+html+'"','../hosea-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.65.0'])if(!spanish.includes(marker))fail(`Spanish Hosea page missing ${marker}.`);
 if(!i18n.includes("'hosea-study"+html+"':'es/oseas-estudio"+html+"'"))fail('Hosea bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Hosea study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Hosea study audit passed.');
