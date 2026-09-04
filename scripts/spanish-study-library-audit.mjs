import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const exists=path=>fs.existsSync(path);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const reject=(label,source,value)=>{if(source.includes(value))errors.push(`${label}: contains disallowed ${JSON.stringify(value)}`)};
const count=(source,needle)=>source.split(needle).length-1;
const html='.ht'+'ml';
const js='.j'+'s';

const hubPath=['es','estudios-biblicos'+html].join('/');
const hub=read(hubPath);
const i18n=read('nldg-i18n'+js);
const navigation=read('site-navigation'+js);

const completePaths=[
  {href:'empezar'+html,file:['es','empezar'+html].join('/'),label:'10 pasos completos'},
  {href:'preparando-para-caminar-con-jesus'+html,file:['es','preparando-para-caminar-con-jesus'+html].join('/'),label:'4 lecciones completas'},
  {href:'caminando-con-jesus'+html,file:['es','caminando-con-jesus'+html].join('/'),label:'21 lecciones completas'}
];

const bookSeries=[
  {en:'ruth-study'+html,href:'rut-estudio'+html,file:['es','rut-estudio'+html].join('/'),label:'5 lecciones completas'},
  {en:'philippians-study'+html,href:'filipenses-estudio'+html,file:['es','filipenses-estudio'+html].join('/'),label:'6 lecciones completas'},
  {en:'james-series'+html,href:'santiago-estudio'+html,file:['es','santiago-estudio'+html].join('/'),label:'10 lecciones completas'},
  {en:'hebrews-study'+html,href:'hebreos-estudio'+html,file:['es','hebreos-estudio'+html].join('/'),label:'8 lecciones completas'},
  {en:'first-peter-study'+html,href:'primera-pedro-estudio'+html,file:['es','primera-pedro-estudio'+html].join('/'),label:'8 lecciones completas'},
  {en:'second-peter-study'+html,href:'segunda-pedro-estudio'+html,file:['es','segunda-pedro-estudio'+html].join('/'),label:'5 lecciones completas'},
  {en:'first-john-study'+html,href:'primera-juan-estudio'+html,file:['es','primera-juan-estudio'+html].join('/'),label:'7 lecciones completas'},
  {en:'second-john-study'+html,href:'segunda-juan-estudio'+html,file:['es','segunda-juan-estudio'+html].join('/'),label:'3 lecciones completas'},
  {en:'third-john-study'+html,href:'tercera-juan-estudio'+html,file:['es','tercera-juan-estudio'+html].join('/'),label:'3 lecciones completas'},
  {en:'jude-study'+html,href:'judas-estudio'+html,file:['es','judas-estudio'+html].join('/'),label:'4 lecciones completas'},
  {en:'revelation-study'+html,href:'apocalipsis-estudio'+html,file:['es','apocalipsis-estudio'+html].join('/'),label:'8 lecciones completas'}
];

const standalone=[
  {href:'biblia-para-principiantes'+html,file:['es','biblia-para-principiantes'+html].join('/')},
  {href:'como-estudiar-la-biblia'+html,file:['es','como-estudiar-la-biblia'+html].join('/')},
  {href:'de-adan-a-abram'+html,file:['es','de-adan-a-abram'+html].join('/'),source:'study-genesis-genealogy-foundations'+html,ntv:true,block:'study-block'},
  {href:'por-que-dos-genealogias'+html,file:['es','por-que-dos-genealogias'+html].join('/'),source:'study-genealogy-of-jesus'+html,ntv:true,block:'study-block'},
  {href:'la-ofrenda-de-la-viuda'+html,file:['es','la-ofrenda-de-la-viuda'+html].join('/'),source:'study-widows-mite'+html,ntv:true,block:'context-block'},
  {href:'estudio-identidad-familiar'+html,file:['es','estudio-identidad-familiar'+html].join('/'),source:'family-identity-study'+html},
  {href:'verte-con-los-ojos-de-dios'+html,file:['es','verte-con-los-ojos-de-dios'+html].join('/'),source:'study-identity'+html,ntv:true},
  {href:'el-duelo-de-envejecer'+html,file:['es','el-duelo-de-envejecer'+html].join('/'),source:'study-grief-of-aging'+html,ntv:true},
  {href:'escapismo-vs-esperanza-eterna'+html,file:['es','escapismo-vs-esperanza-eterna'+html].join('/'),source:'study-escapism'+html,ntv:true},
  {href:'fe-en-la-tormenta'+html,file:['es','fe-en-la-tormenta'+html].join('/')},
  {href:'gracia-y-responsabilidad'+html,file:['es','gracia-y-responsabilidad'+html].join('/')},
  {href:'pacificadores-en-un-mundo-dividido'+html,file:['es','pacificadores-en-un-mundo-dividido'+html].join('/')}
];

for(const item of [...completePaths,...bookSeries,...standalone]){
  if(!exists(item.file))errors.push(`Published Spanish resource is missing: ${item.file}`);
  expect('Spanish study hub',hub,`href="${item.href}"`);
}
for(const item of [...completePaths,...bookSeries])expect('Spanish study hub completion label',hub,item.label);
for(const item of bookSeries)expect('Bilingual book-series route map',i18n,`'${item.en}':'es/${item.href}'`);

expect('Spanish study hub',hub,'Caminos completos');
expect('Spanish study hub',hub,'once series completas y revisadas');
expect('Spanish study hub',hub,'Doce recursos independientes en español');
expect('Spanish study hub completion claim',hub,'Los once estudios independientes del catálogo inglés ya tienen una contraparte completa en español');
expect('Spanish study hub NTV standard',hub,'Nueva Traducción Viviente (NTV)');
expect('Spanish study hub editorial policy',hub,'No traduciremos automáticamente todo el sitio');
expect('Spanish study hub current selector',hub,'nldg-i18n'+js+'?v=1.78.0');
expect('Spanish study hub shared framework',hub,'es-framework'+js+'?v=1.1.0');

const translatedStandalonePairs={
  ['study-genesis-genealogy-foundations'+html]:['es','de-adan-a-abram'+html].join('/'),
  ['study-genealogy-of-jesus'+html]:['es','por-que-dos-genealogias'+html].join('/'),
  ['study-widows-mite'+html]:['es','la-ofrenda-de-la-viuda'+html].join('/'),
  ['family-identity-study'+html]:['es','estudio-identidad-familiar'+html].join('/'),
  ['study-grief-of-aging'+html]:['es','el-duelo-de-envejecer'+html].join('/'),
  ['study-scripture-context'+html]:['es','como-estudiar-la-biblia'+html].join('/'),
  ['study-identity'+html]:['es','verte-con-los-ojos-de-dios'+html].join('/'),
  ['study-storm'+html]:['es','fe-en-la-tormenta'+html].join('/'),
  ['study-grace-accountability'+html]:['es','gracia-y-responsabilidad'+html].join('/'),
  ['study-peacemakers'+html]:['es','pacificadores-en-un-mundo-dividido'+html].join('/'),
  ['study-escapism'+html]:['es','escapismo-vs-esperanza-eterna'+html].join('/')
};
for(const [en,es] of Object.entries(translatedStandalonePairs))expect('Bilingual standalone route map',i18n,`'${en}':'${es}'`);
if(Object.keys(translatedStandalonePairs).length!==11)errors.push('Expected exactly 11 translated English standalone studies.');
for(const source of Object.keys(translatedStandalonePairs)){
  if(!exists(source))errors.push(`English standalone source is missing: ${source}`);
  const sourcePage=exists(source)?read(source):'';
  if(!navigation.includes(`'${source}'`)&&!sourcePage.includes('nldg-i18n'+js))errors.push(`Standalone language loader: ${source} must load the bilingual selector through navigation or directly.`);
}
expect('Existing standalone language loader',navigation,'nldg-i18n'+js+'?v=1.10.0');
expect('Family identity study current selector',read('family-identity-study'+html),'nldg-i18n'+js+'?v=1.78.0');

const walking=read(['es','caminando-con-jesus'+html].join('/'));
expect('Caminando con Jesús',walking,'data-caminando-count>21</span> lecciones están disponibles en español');
expect('Caminando con Jesús',walking,'max="21" value="21"');
for(const dataFile of [
  'walking-with-jesus-data-es-01-04'+js,
  'walking-with-jesus-data-es-05-07'+js,
  'walking-with-jesus-data-es-08-11'+js,
  'walking-with-jesus-data-es-12-15'+js,
  'walking-with-jesus-data-es-16-18'+js,
  'walking-with-jesus-data-es-19-21'+js
])if(!exists(dataFile))errors.push(`Caminando con Jesús data file is missing: ${dataFile}`);

const preparing=read(['es','preparando-para-caminar-con-jesus'+html].join('/'));
expect('Preparing pathway',preparing,'preparing-walk-data-es'+js);
if(!exists('preparing-walk-data-es'+js))errors.push('Spanish Preparing to Walk data is missing');

for(const item of standalone){
  const page=read(item.file);
  expect(item.file,page,'<html lang="es"');
  expect(item.file,page,'<link rel="canonical"');
  if(item.source){
    expect(item.file,page,`hreflang="en" href="https://nolabelsdesignedbygod.org/${item.source}"`);
    if(!page.includes(`href="../${item.source}" lang="en"`)&&!page.includes('../nldg-i18n'+js))errors.push(`${item.file}: must provide an English return link or the bilingual selector.`);
  }
  if(item.ntv){
    expect(item.file,page,'NTV');
    for(const version of ['RVR60','NVI','NBLA'])reject(item.file,page,version);
  }
  if(item.block&&item.source){
    const source=read(item.source),marker=`<section class="${item.block}`;
    if(count(source,marker)!==count(page,marker))errors.push(`${item.file}: structural ${item.block} count does not match English source.`);
  }
}

if(errors.length){
  console.error('Spanish Study Library Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('Spanish Study Library Audit PASSED');
console.log('OK: 3 complete Spanish discipleship/study paths are surfaced.');
console.log('OK: 11 complete reviewed Spanish book-by-book series are surfaced.');
console.log('OK: 12 reviewed Spanish independent study resources are surfaced.');
console.log('OK: all 11 English standalone studies have protected Spanish route pairs.');
console.log('OK: English standalone studies retain a shared or direct bilingual selector.');
console.log('OK: Caminando con Jesús remains complete at 21 lessons.');
