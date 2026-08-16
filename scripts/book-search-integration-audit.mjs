import fs from 'node:fs';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const libraryPage=read('book-by-book.html');
const integration=read('book-search-integration.js');
const contactLinks=read('contact-links.js');
const siteScript=read('script.js');
const searchPage=read('search.html');

const cards=[...libraryPage.matchAll(/<article class="book-card">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
const lessonTotal=cards.reduce((sum,card)=>sum+Number(card.match(/·\s*(\d+)\s+lessons/)?.[1]||0),0);

assert(cards.length===66,`Canonical Book-by-Book library should contain 66 books, found ${cards.length}.`);
assert(lessonTotal===447,`Canonical Book-by-Book library should contain 447 lessons, found ${lessonTotal}.`);
assert(contactLinks.includes("book-search-integration.js?v=1.0.0"),'Site-wide script chain must load the Book-by-Book search integration.');
assert(integration.includes("new URL('book-by-book.html',document.currentScript?.src||location.href).href"),'Search integration must derive its canonical Book-by-Book source URL from its own script location.');
assert(integration.includes("querySelectorAll('.book-card')"),'Search integration must discover canonical Book-by-Book cards instead of duplicating the 66-book registry.');
assert(integration.includes("books.length!==66"),'Search integration must reject incomplete Book-by-Book discovery.');
assert(integration.includes("current.filter(item=>!bookUrls.has(item.url))"),'Search integration must deduplicate existing search entries by route.');
assert(integration.includes("window.NLDG_CONTENT="),'Search integration must publish Book-by-Book entries into the shared search catalog.');
assert(integration.includes("window.dispatchEvent(new Event('nldg-library-ready'))"),'Search integration must refresh consumers after canonical Book-by-Book discovery.');
assert(siteScript.includes("window.NLDG_CONTENT.filter(item=>searchable(item).includes(query))"),'Global header search must use the shared NLDG_CONTENT catalog.');
assert(siteScript.includes("const data=window.NLDG_CONTENT||ministrySearchData"),'Dedicated search page must use the refreshed shared NLDG_CONTENT catalog.');
assert(searchPage.includes('id="site-search"'),'Dedicated search page must expose the site search input.');
assert(searchPage.includes('data-type="studies"'),'Dedicated search page must retain the Bible Studies filter.');

if(failures.length){
  console.error(`Book-by-Book search integration audit FAILED with ${failures.length} problem(s):`);
  failures.forEach(item=>console.error(`- ${item}`));
  process.exit(1);
}
console.log(`Book-by-Book search integration audit PASSED for ${cards.length} books and ${lessonTotal} lessons.`);
