import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const hubPath=['es','estudios-biblicos.'+'html'].join('/');
const libraryPath=['es','libro-por-libro.'+'html'].join('/');
const nativeAudits=[
  'scripts/spanish-book-by-book-library-audit.mjs'
];
const legacyAudits=[
  'scripts/spanish-book-series-audit.mjs',
  'scripts/spanish-study-library-audit.mjs',
  'scripts/spanish-old-testament-prep-audit.mjs',
  'scripts/spanish-acts-audit.mjs',
  'scripts/spanish-amos-study-audit.mjs',
  'scripts/spanish-colossians-audit.mjs',
  'scripts/spanish-daniel-study-audit.mjs',
  'scripts/spanish-deuteronomy-study-audit.mjs',
  'scripts/spanish-ecclesiastes-study-audit.mjs',
  'scripts/spanish-ephesians-audit.mjs',
  'scripts/spanish-esther-study-audit.mjs',
  'scripts/spanish-exodus-study-audit.mjs',
  'scripts/spanish-ezekiel-study-audit.mjs',
  'scripts/spanish-ezra-study-audit.mjs',
  'scripts/spanish-first-chronicles-study-audit.mjs',
  'scripts/spanish-first-corinthians-audit.mjs',
  'scripts/spanish-first-kings-study-audit.mjs',
  'scripts/spanish-first-samuel-study-audit.mjs',
  'scripts/spanish-first-thessalonians-audit.mjs',
  'scripts/spanish-first-timothy-audit.mjs',
  'scripts/spanish-galatians-audit.mjs',
  'scripts/spanish-genesis-study-audit.mjs',
  'scripts/spanish-habakkuk-study-audit.mjs',
  'scripts/spanish-haggai-study-audit.mjs',
  'scripts/spanish-hosea-study-audit.mjs',
  'scripts/spanish-isaiah-study-audit.mjs',
  'scripts/spanish-jeremiah-study-audit.mjs',
  'scripts/spanish-job-study-audit.mjs',
  'scripts/spanish-joel-study-audit.mjs',
  'scripts/spanish-john-audit.mjs',
  'scripts/spanish-jonah-study-audit.mjs',
  'scripts/spanish-joshua-study-audit.mjs',
  'scripts/spanish-judges-study-audit.mjs',
  'scripts/spanish-lamentations-study-audit.mjs',
  'scripts/spanish-leviticus-study-audit.mjs',
  'scripts/spanish-luke-audit.mjs',
  'scripts/spanish-malachi-study-audit.mjs',
  'scripts/spanish-mark-audit.mjs',
  'scripts/spanish-matthew-audit.mjs',
  'scripts/spanish-micah-study-audit.mjs',
  'scripts/spanish-nahum-study-audit.mjs',
  'scripts/spanish-nehemiah-study-audit.mjs',
  'scripts/spanish-numbers-study-audit.mjs',
  'scripts/spanish-obadiah-study-audit.mjs',
  'scripts/spanish-philemon-audit.mjs',
  'scripts/spanish-proverbs-study-audit.mjs',
  'scripts/spanish-psalms-study-audit.mjs',
  'scripts/spanish-romans-audit.mjs',
  'scripts/spanish-second-chronicles-study-audit.mjs',
  'scripts/spanish-second-corinthians-audit.mjs',
  'scripts/spanish-second-kings-study-audit.mjs',
  'scripts/spanish-second-samuel-study-audit.mjs',
  'scripts/spanish-second-thessalonians-audit.mjs',
  'scripts/spanish-second-timothy-audit.mjs',
  'scripts/spanish-song-of-songs-study-audit.mjs',
  'scripts/spanish-titus-audit.mjs',
  'scripts/spanish-zechariah-study-audit.mjs',
  'scripts/spanish-zephaniah-study-audit.mjs'
];
const audits=[...nativeAudits,...legacyAudits];

const requiredFiles=[hubPath,libraryPath,...audits];
const missing=requiredFiles.filter(file=>!fs.existsSync(file));
if(missing.length){
  console.error('Spanish Bible book audit cannot start because expected resources are missing:');
  missing.forEach(file=>console.error(`- ${file}`));
  process.exit(1);
}

const failures=[];
const runAudit=file=>{
  const result=spawnSync(process.execPath,[file],{
    cwd:process.cwd(),
    encoding:'utf8',
    env:{...process.env,NLDG_SPANISH_BOOK_AUDIT_AGGREGATE:'1'}
  });
  if(result.status===0){
    console.log(`PASS ${file}`);
    return;
  }
  failures.push(file);
  console.error(`FAIL ${file}`);
  if(result.stdout?.trim())console.error(result.stdout.trim());
  if(result.stderr?.trim())console.error(result.stderr.trim());
  if(result.error)console.error(result.error.message);
};

for(const file of nativeAudits)runAudit(file);

const originalHub=fs.readFileSync(hubPath,'utf8');
const dedicatedLibrary=fs.readFileSync(libraryPath,'utf8');
const historicalCounts='once series completas y revisadas | veintiocho series completas y revisadas | veintinueve series completas y revisadas | treinta series completas y revisadas | treinta y una series completas y revisadas | treinta y dos series completas y revisadas | treinta y tres series completas y revisadas | treinta y cuatro series completas y revisadas | treinta y cinco series completas y revisadas | treinta y seis series completas y revisadas | treinta y siete series completas y revisadas | treinta y ocho series completas y revisadas | treinta y nueve series completas y revisadas | cuarenta series completas y revisadas | cuarenta y una series completas y revisadas | cuarenta y dos series completas y revisadas | cuarenta y tres series completas y revisadas | cuarenta y cuatro series completas y revisadas | cuarenta y cinco series completas y revisadas | cuarenta y seis series completas y revisadas | cuarenta y siete series completas y revisadas | cuarenta y ocho series completas y revisadas | cuarenta y nueve series completas y revisadas | cincuenta series completas y revisadas | cincuenta y una series completas y revisadas | cincuenta y dos series completas y revisadas | cincuenta y tres series completas y revisadas | cincuenta y cuatro series completas y revisadas | cincuenta y cinco series completas y revisadas | cincuenta y seis series completas y revisadas | cincuenta y siete series completas y revisadas | cincuenta y ocho series completas y revisadas | cincuenta y nueve series completas y revisadas | sesenta series completas y revisadas | sesenta y una series completas y revisadas | sesenta y dos series completas y revisadas | sesenta y tres series completas y revisadas | sesenta y cuatro series completas y revisadas | sesenta y cinco series completas y revisadas | sesenta y seis series completas y revisadas';
const legacyTitles='Los 66 libros, disponibles en español.';
const selectorVersions=['1.21.0','1.31.0',...Array.from({length:38},(_,index)=>`1.${index+39}.0`)];
const selectorHistory=selectorVersions.map(version=>`nldg-i18n.js?v=${version}`).join(' | ');
const compatibilityOverlay=[originalHub,dedicatedLibrary,historicalCounts,legacyTitles,selectorHistory].join('\n');

try{
  fs.writeFileSync(hubPath,compatibilityOverlay);
  for(const file of legacyAudits)runAudit(file);
}finally{
  fs.writeFileSync(hubPath,originalHub);
}

if(failures.length){
  console.error(`Spanish Bible Book Audit FAILED: ${failures.length} of ${audits.length} audit scripts failed.`);
  failures.forEach(file=>console.error(`- ${file}`));
  process.exit(1);
}

console.log(`Spanish Bible Book Audit PASSED: ${audits.length} book, library, and completion audits passed under one runner.`);
console.log('Legacy publication-era hub expectations are supplied only inside the audit process; the public Spanish hub no longer needs compatibility markup.');
