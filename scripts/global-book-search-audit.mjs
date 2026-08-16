import fs from 'node:fs';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const libraryPage=read('book-by-book.html');
const loader=read('book-by-book-library.js');
const contactLinks=read('contact-links.js');
const searchPage=read('search.html');
const script=read('script.js');

const cards=[...libraryPage.matchAll(/<article class="book-card">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
const routes=cards.map(card=>card.match(/<a href="([^"]+)"/)?.[1]||'').filter(Boolean);
const lessonTotal=cards.reduce((sum,card)=>sum+Number(card.match(/·\s*(\d+)\s+lessons/)?.[1]||0),0);

assert(cards.length===66,`Canonical Book-by-Book search source should contain 66 books, found ${cards.length}.`);
assert(new Set(routes).size===66,'Canonical Book-by-Book search routes must be unique.');
assert(lessonTotal===447,`Canonical Book-by-Book search source should contain 447 lessons, found ${lessonTotal}.`);
assert(contactLinks.includes('book-by-book-library.js?v=1.0.0'),'Sitewide integration must load the Book-by-Book search catalog.');
assert(loader.includes("fetch(`${root}book-by-book.html`)"),'Book search catalog must derive entries from the canonical Book-by-Book page.');
assert(loader.includes("querySelectorAll('.book-card')"),'Book search catalog must discover canonical book cards.');
assert(loader.includes('books.length!==66'),'Book search catalog must reject incomplete discovery.');
assert(loader.includes("library.find(item=>item?.url===book.url)"),'Book search catalog must deduplicate existing static library routes.');
assert(loader.includes('uniquePush(window.NLDG_CONTENT,item)'),'Book search catalog must extend the global searchable content list.');
assert(loader.includes('uniquePush(window.NLDG_STUDIES,item)'),'Book search catalog must extend the published study list.');
assert(loader.includes("window.dispatchEvent(new Event('nldg-library-ready'))"),'Book search catalog must notify search surfaces after loading.');
assert(searchPage.includes('id="site-search"')&&searchPage.includes('script.js'),'Dedicated Search must use the shared search renderer.');
assert(script.includes("const matches=window.NLDG_CONTENT.filter(item=>searchable(item).includes(query)).slice(0,8)"),'Header search must read the live NLDG_CONTENT collection.');
assert(script.includes("window.addEventListener('nldg-library-ready',renderSiteSearch)"),'Dedicated Search must refresh when the Book-by-Book catalog becomes available.');

if(failures.length){
 console.error(`Global Book-by-Book search audit FAILED with ${failures.length} problem(s):`);
 failures.forEach(item=>console.error(`- ${item}`));
 process.exit(1);
}
console.log(`Global Book-by-Book search audit PASSED for ${cards.length} books and ${lessonTotal} lessons.`);