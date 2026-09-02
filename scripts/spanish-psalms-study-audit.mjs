import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='psalms-study-data'+js,enGuide='psalms-study-guide'+js,esData='psalms-study-data-es'+js,enPage='psalms-study'+html,esPage=['es','salmos-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('psalms');
if(book?.status!=='published')fail('Psalms must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='salmos-estudio')fail('Spanish Psalms slug must be salmos-estudio.');
 if(es?.book!=='Salmos')fail('Spanish book name must be Salmos.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Psalms must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Psalms must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Psalms lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Salmos '))fail(`${label}: Scripture reference must begin with Salmos.`);
 }
 for(const field of ['recommendedRhythm','facilitatorSafeguards','howToReadTogether','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Spanish Psalms missing ${field}.`);
 if(es?.themeLabel!=='Compromisos interpretativos')fail('Psalms theme label must be Compromisos interpretativos.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Psalms contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['prosperity formula',['La imagen no promete éxito ininterrumpido ni riqueza']],
  ['Christ above political movements',['Ningún movimiento terrenal puede reclamar su trono','ningún partido, nación o gobernante merece confianza mesiánica']],
  ['Psalm 91 not immunity',['No puede convertirse en una fórmula que prometa inmunidad contra enfermedad, accidentes, persecución o muerte']],
  ['responsible care',['medicamentos, planes de seguridad, consejería, refugio y apoyo comunitario','La precaución no es incredulidad']],
  ['lament dignity',['La lucha emocional no es fracaso espiritual','última imagen es oscuridad']],
  ['suicide safety',['pensamientos de autolesión o suicidio','prioriza la seguridad inmediata en vez de debatir la fe']],
  ['no coerced confession',['nunca debe ser obligada públicamente ni usada para exponer a víctimas']],
  ['accountability after forgiveness',['el perdón no restaura automáticamente cargo, confianza, acceso o seguridad']],
  ['survivor boundaries',['presionar a sobrevivientes hacia una reconciliación insegura']],
  ['universal dignity',['La dignidad humana es universal y nunca se clasifica por raza, sexo, capacidad, riqueza o edad']],
  ['creation stewardship',['No puede justificar crueldad, extinción, desperdicio ni tratar la tierra solamente como fuente de ganancias','daño ambiental']],
  ['disasters not targeted punishment',['no deben usarse para afirmar que cada desastre es un castigo dirigido']],
  ['Psalm 137 trauma not violence',['no autoriza hacer daño a niños ni a ningún grupo étnico']],
  ['lawful justice',['peticiones de seguridad, evidencia, proceso legal o reparación','medios verdaderos, legales, protectores y no violentos']],
  ['safe church community',['no exigir que personas heridas regresen a líderes inseguros']],
  ['unity with accountability',['La unidad no es uniformidad ni silencio ante el mal']],
  ['inclusive pilgrimage',['niños, ancianos, inmigrantes y personas con discapacidades']],
  ['worship and vulnerable neighbors',['cuida a inmigrantes','Una adoración que ignora a vecinos vulnerables contradice sus propios cantos']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Psalms safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/salmos-estudio'+html+'"'))fail('English Psalms page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.56.0'))fail('English Psalms page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/salmos-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/psalms-study'+html+'"','../psalms-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.56.0'])if(!spanish.includes(marker))fail(`Spanish Psalms page missing ${marker}.`);
 if(!i18n.includes("'psalms-study"+html+"':'es/salmos-estudio"+html+"'"))fail('Psalms bilingual route is missing.');
 if(!hub.includes('href="salmos-estudio'+html+'"'))fail('Spanish Psalms library card is missing.');
 if(!hub.includes('cuarenta y seis series completas y revisadas'))fail('Spanish library count must be forty-six series.');
}
if(errors.length){console.error('Spanish Psalms study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Psalms study audit passed.');