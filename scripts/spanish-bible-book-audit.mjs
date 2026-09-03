import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const audits=[
  'scripts/spanish-book-by-book-library-audit.mjs',
  'scripts/spanish-book-series-audit.mjs',
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

const missing=audits.filter(file=>!fs.existsSync(file));
if(missing.length){
  console.error('Spanish Bible book audit cannot start because expected legacy audit scripts are missing:');
  missing.forEach(file=>console.error(`- ${file}`));
  process.exit(1);
}

const failures=[];
for(const file of audits){
  const result=spawnSync(process.execPath,[file],{
    cwd:process.cwd(),
    encoding:'utf8',
    env:{...process.env,NLDG_SPANISH_BOOK_AUDIT_AGGREGATE:'1'}
  });
  if(result.status===0){
    console.log(`PASS ${file}`);
    continue;
  }
  failures.push(file);
  console.error(`FAIL ${file}`);
  if(result.stdout?.trim())console.error(result.stdout.trim());
  if(result.stderr?.trim())console.error(result.stderr.trim());
  if(result.error)console.error(result.error.message);
}

if(failures.length){
  console.error(`Spanish Bible Book Audit FAILED: ${failures.length} of ${audits.length} audit scripts failed.`);
  failures.forEach(file=>console.error(`- ${file}`));
  process.exit(1);
}

console.log(`Spanish Bible Book Audit PASSED: ${audits.length} existing book and library audits passed under one runner.`);
