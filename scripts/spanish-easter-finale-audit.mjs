import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const data=read('cross-empty-tomb-data-es.js');
const engine=read('cross-empty-tomb.js');
const english=read('cross-empty-tomb.html');
const spanish=read('es/la-cruz-y-la-tumba-vacia.html');
const hub=read('es/caminando-con-jesus.html');
const i18n=read('nldg-i18n.js');

const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const reject=(label,source,value)=>{if(source.includes(value))errors.push(`${label}: legacy wording still present ${JSON.stringify(value)}`)};
const finaleFile=['la-cruz-y-la-tumba-vacia','.html'].join('');

expect('Spanish route',spanish,'https://nolabelsdesignedbygod.org/es/la-cruz-y-la-tumba-vacia.html');
expect('Spanish route',spanish,'Nueva Traducción Viviente (NTV)');
expect('English hreflang',english,'https://nolabelsdesignedbygod.org/es/la-cruz-y-la-tumba-vacia.html');
expect('Bilingual pair',i18n,"'cross-empty-tomb.html':'es/la-cruz-y-la-tumba-vacia.html'");
expect('Shared engine',engine,"site('es/la-cruz-y-la-tumba-vacia.html')");
expect('Shared engine',engine,"site('es/caminando-con-jesus.html')");
expect('Spanish Walking hub',hub,`href="${finaleFile}"`);

for(const [label,value] of [
  ['Juan 13:1','los amó hasta el final'],
  ['Juan 13:34','Tal como yo los he amado'],
  ['Mateo 26:39','Que pase de mí esta copa de sufrimiento'],
  ['Mateo 26:39','Que se haga tu voluntad, no la mía'],
  ['Mateo 26:41','el cuerpo es débil'],
  ['Juan 19:30','¡Todo está cumplido!'],
  ['Lucas 24:5','¿Por Qué Buscan Entre los Muertos a Alguien que Está Vivo?'],
  ['Lucas 24:6','¡Él no está aquí! ¡Ha resucitado!'],
  ['Juan 20:28','¡Mi Señor y mi Dios!']
])expect(`NTV ${label}`,data,value);

for(const value of ['Consumado es','«Pase de Mí esta copa»','«No como yo quiero, sino como Tú»','«¡Señor mío y Dios mío!»','¿Por Qué Buscan Entre los Muertos al que Vive?'])reject('NTV review',data,value);

if(errors.length){
  console.error('Spanish Easter Finale Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('Spanish Easter Finale Audit PASSED');
console.log('OK: dedicated English/Spanish finale routes are paired.');
console.log('OK: Spanish Walking hub links to the four-lesson finale.');
console.log('OK: reviewed short Scripture quotations remain aligned to NTV.');
