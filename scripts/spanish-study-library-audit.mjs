import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const exists=path=>fs.existsSync(path);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const reject=(label,source,value)=>{if(source.includes(value))errors.push(`${label}: contains disallowed ${JSON.stringify(value)}`)};
const html='.ht'+'ml';
const js='.j'+'s';

const hubPath=['es','estudios-biblicos'+html].join('/');
const hub=read(hubPath);
const i18n=read('nldg-i18n'+js);

const completePaths=[
  {href:'empezar'+html,file:['es','empezar'+html].join('/'),label:'10 pasos completos'},
  {href:'preparando-para-caminar-con-jesus'+html,file:['es','preparando-para-caminar-con-jesus'+html].join('/'),label:'4 lecciones completas'},
  {href:'caminando-con-jesus'+html,file:['es','caminando-con-jesus'+html].join('/'),label:'21 lecciones completas'}
];

const standalone=[
  {href:'biblia-para-principiantes'+html,file:['es','biblia-para-principiantes'+html].join('/')},
  {href:'como-estudiar-la-biblia'+html,file:['es','como-estudiar-la-biblia'+html].join('/')},
  {href:'verte-con-los-ojos-de-dios'+html,file:['es','verte-con-los-ojos-de-dios'+html].join('/'),source:'study-identity'+html,ntv:true},
  {href:'el-duelo-de-envejecer'+html,file:['es','el-duelo-de-envejecer'+html].join('/'),source:'study-grief-of-aging'+html,ntv:true},
  {href:'escapismo-vs-esperanza-eterna'+html,file:['es','escapismo-vs-esperanza-eterna'+html].join('/'),source:'study-escapism'+html,ntv:true},
  {href:'fe-en-la-tormenta'+html,file:['es','fe-en-la-tormenta'+html].join('/')},
  {href:'gracia-y-responsabilidad'+html,file:['es','gracia-y-responsabilidad'+html].join('/')},
  {href:'pacificadores-en-un-mundo-dividido'+html,file:['es','pacificadores-en-un-mundo-dividido'+html].join('/')}
];

for(const item of [...completePaths,...standalone]){
  if(!exists(item.file))errors.push(`Published Spanish resource is missing: ${item.file}`);
  expect('Spanish study hub',hub,`href="${item.href}"`);
}
for(const item of completePaths)expect('Spanish study hub completion label',hub,item.label);

expect('Spanish study hub',' '+hub,'Caminos completos');
expect('Spanish study hub',hub,'Ocho recursos independientes en español');
expect('Spanish study hub NTV standard',hub,'Nueva Traducción Viviente (NTV)');
expect('Spanish study hub editorial policy',hub,'No traduciremos automáticamente todo el catálogo');
expect('Spanish study hub current selector',hub,'nldg-i18n'+js+'?v=1.9.0');
expect('Spanish study hub shared framework',hub,'es-framework'+js+'?v=1.1.0');

const routePairs={
  ['new-believers'+html]:['es','empezar'+html].join('/'),
  ['preparing-walk-with-jesus'+html]:['es','preparando-para-caminar-con-jesus'+html].join('/'),
  ['walking-with-jesus'+html]:['es','caminando-con-jesus'+html].join('/'),
  ['study-scripture-context'+html]:['es','como-estudiar-la-biblia'+html].join('/'),
  ['study-identity'+html]:['es','verte-con-los-ojos-de-dios'+html].join('/'),
  ['study-grief-of-aging'+html]:['es','el-duelo-de-envejecer'+html].join('/'),
  ['study-escapism'+html]:['es','escapismo-vs-esperanza-eterna'+html].join('/'),
  ['study-storm'+html]:['es','fe-en-la-tormenta'+html].join('/'),
  ['study-grace-accountability'+html]:['es','gracia-y-responsabilidad'+html].join('/'),
  ['study-peacemakers'+html]:['es','pacificadores-en-un-mundo-dividido'+html].join('/')
};
for(const [en,es] of Object.entries(routePairs))expect('Bilingual study route map',i18n,`'${en}':'${es}'`);

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
    expect(item.file,page,`href="../${item.source}" lang="en"`);
  }
  if(item.ntv){
    expect(item.file,page,'Referencia bíblica: NTV');
    for(const version of ['RVR60','NVI','NBLA'])reject(item.file,page,version);
  }
}

if(errors.length){
  console.error('Spanish Study Library Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}

console.log('Spanish Study Library Audit PASSED');
console.log('OK: 3 complete Spanish discipleship/study paths are surfaced.');
console.log('OK: 8 reviewed Spanish standalone study resources are surfaced.');
console.log('OK: 3 new English/Spanish standalone study pairs are protected.');
console.log('OK: known English/Spanish study route pairs remain protected.');
console.log('OK: Caminando con Jesús remains complete at 21 lessons.');
console.log('OK: the Spanish library states the NTV and review-before-publication standards.');
