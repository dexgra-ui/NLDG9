import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const exists=path=>fs.existsSync(path);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};

const hubPath='es/estudios-biblicos.html';
const hub=read(hubPath);
const i18n=read('nldg-i18n.js');

const completePaths=[
  {href:'empezar.html',file:'es/empezar.html',label:'10 pasos completos'},
  {href:'preparando-para-caminar-con-jesus.html',file:'es/preparando-para-caminar-con-jesus.html',label:'4 lecciones completas'},
  {href:'caminando-con-jesus.html',file:'es/caminando-con-jesus.html',label:'21 lecciones completas'}
];

const standalone=[
  {href:'biblia-para-principiantes.html',file:'es/biblia-para-principiantes.html'},
  {href:'como-estudiar-la-biblia.html',file:'es/como-estudiar-la-biblia.html'},
  {href:'fe-en-la-tormenta.html',file:'es/fe-en-la-tormenta.html'},
  {href:'gracia-y-responsabilidad.html',file:'es/gracia-y-responsabilidad.html'},
  {href:'pacificadores-en-un-mundo-dividido.html',file:'es/pacificadores-en-un-mundo-dividido.html'}
];

for(const item of [...completePaths,...standalone]){
  if(!exists(item.file))errors.push(`Published Spanish resource is missing: ${item.file}`);
  expect('Spanish study hub',hub,`href="${item.href}"`);
}
for(const item of completePaths)expect('Spanish study hub completion label',hub,item.label);

expect('Spanish study hub',' '+hub,'Caminos completos');
expect('Spanish study hub',hub,'Estudios y guías');
expect('Spanish study hub NTV standard',hub,'Nueva Traducción Viviente (NTV)');
expect('Spanish study hub editorial policy',hub,'No traduciremos automáticamente todo el catálogo');
expect('Spanish study hub current selector',hub,'nldg-i18n.js?v=1.8.0');
expect('Spanish study hub shared framework',hub,'es-framework.js?v=1.1.0');

const routePairs={
  'new-believers.html':'es/empezar.html',
  'preparing-walk-with-jesus.html':'es/preparando-para-caminar-con-jesus.html',
  'walking-with-jesus.html':'es/caminando-con-jesus.html',
  'study-scripture-context.html':'es/como-estudiar-la-biblia.html',
  'study-storm.html':'es/fe-en-la-tormenta.html',
  'study-grace-accountability.html':'es/gracia-y-responsabilidad.html',
  'study-peacemakers.html':'es/pacificadores-en-un-mundo-dividido.html'
};
for(const [en,es] of Object.entries(routePairs))expect('Bilingual study route map',i18n,`'${en}':'${es}'`);

const walking=read('es/caminando-con-jesus.html');
expect('Caminando con Jesús',walking,'data-caminando-count>21</span> lecciones están disponibles en español');
expect('Caminando con Jesús',walking,'max="21" value="21"');
for(const dataFile of [
  'walking-with-jesus-data-es-01-04.js',
  'walking-with-jesus-data-es-05-07.js',
  'walking-with-jesus-data-es-08-11.js',
  'walking-with-jesus-data-es-12-15.js',
  'walking-with-jesus-data-es-16-18.js',
  'walking-with-jesus-data-es-19-21.js'
])if(!exists(dataFile))errors.push(`Caminando con Jesús data file is missing: ${dataFile}`);

const preparing=read('es/preparando-para-caminar-con-jesus.html');
expect('Preparing pathway',preparing,'preparing-walk-data-es.js');
if(!exists('preparing-walk-data-es.js'))errors.push('Spanish Preparing to Walk data is missing');

for(const item of standalone){
  const page=read(item.file);
  expect(item.file,page,'<html lang="es"');
  expect(item.file,page,'<link rel="canonical"');
}

if(errors.length){
  console.error('Spanish Study Library Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}

console.log('Spanish Study Library Audit PASSED');
console.log('OK: 3 complete Spanish discipleship/study paths are surfaced.');
console.log('OK: 5 reviewed Spanish standalone study resources are surfaced.');
console.log('OK: known English/Spanish study route pairs remain protected.');
console.log('OK: Caminando con Jesús remains complete at 21 lessons.');
console.log('OK: the Spanish library states the NTV and review-before-publication standards.');
