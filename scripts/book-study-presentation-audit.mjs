import fs from 'node:fs';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const html=fs.readFileSync('james-series.html','utf8');
const script=fs.readFileSync('james-series.js','utf8');
const css=fs.readFileSync('james-series.css','utf8');

assert(html.includes('book-study-series.css?v=0.1.0'),'James must load the shared Book-by-Book stylesheet.');
assert(html.includes('body class="book-study-page james-page"'),'James must use the shared Book-by-Book page class.');
assert(html.includes('class="book-hero james-hero"'),'James hero must use the shared Book-by-Book hero class.');
assert(html.includes('class="book-shell james-shell"'),'James content shell must use the shared Book-by-Book shell class.');
assert(html.includes('scripture-links.js'),'James must retain Scripture reference linking.');
for(const marker of [
  'book-hero-inner',
  'book-overview james-intro',
  'book-grid james-grid',
  'book-card james-card',
  'book-lesson james-lesson',
  'lesson-panel',
  'prayer-panel prayer',
  'complete-panel',
  'lesson-navigation lesson-nav'
])assert(script.includes(marker),`James renderer is missing shared presentation marker: ${marker}`);
assert(script.includes("const key='nldg-series-james'"),'James must retain its existing progress-storage key.');
assert(script.includes('s.subtitle')&&script.includes('s.title')&&script.includes('s.purpose'),'James renderer must continue using authoritative series data.');
assert(script.includes('x.teachingNotes')&&script.includes('x.discussion')&&script.includes('x.leaderTips')&&script.includes('x.prayerFocus'),'James lesson renderer must retain every authoritative lesson section.');
assert(!css.includes('.james-page{background:'),'James stylesheet should not recreate the shared page background.');
assert(!css.includes('.james-hero{padding:'),'James stylesheet should not recreate the shared hero layout.');
assert(!css.includes('.james-card,.james-lesson>section'),'James stylesheet should not recreate the shared card/panel system.');

if(failures.length){
 console.error(`Book-study presentation audit FAILED with ${failures.length} problem(s):`);
 failures.forEach(item=>console.error(`- ${item}`));
 process.exit(1);
}
console.log('Book-study presentation audit PASSED: James uses the shared Book-by-Book presentation while retaining its authoritative data and progress key.');