import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const failures=[];
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const articlePages=['family-nobody-talks-about','grace-accountability','faith-hard-seasons','truth-online','church-shows-up','jesus-loves-you'].map(slug=>`articles/${slug}.html`);
const devotionalPages=['when-following-jesus-is-inconvenient','you-are-known','not-your-past','you-are-held','created-for-good-works','more-than-a-label','peace-is-a-practice','hope-that-holds','when-god-feels-silent','the-courage-to-lead','faithful-in-what-god-has-given-you','faith-for-the-next-decision','growing-into-the-leader-god-is-forming'].map(id=>`devotionals/${id}.html`);
const newsletterPages=['newsletter.html','newsletter/who-god-says-you-are.html'];
const pages=['index.html','articles.html','devotionals.html','contact.html','mission.html','book-by-book.html',...articlePages,...devotionalPages,...newsletterPages];
const canonicals=new Map();

for(const file of pages){
 assert(exists(file),`${file}: file is missing`);
 if(!exists(file))continue;
 const html=read(file);
 for(const marker of ['<title>','name="description"','rel="canonical"','property="og:title"','property="og:description"','property="og:image"','name="twitter:card"'])assert(html.includes(marker),`${file}: missing ${marker}`);
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
 assert(Boolean(canonical),`${file}: canonical URL is missing`);
 if(canonical){assert(!canonicals.has(canonical),`${file}: duplicate canonical also used by ${canonicals.get(canonical)}`);canonicals.set(canonical,file)}
}

const home=read('index.html');
assert(home.includes('"@type":"WebSite"'),'index.html: WebSite structured data is missing');
assert(home.includes('"@type":"Organization"'),'index.html: Organization structured data is missing');

assert(exists('robots.txt'),'robots.txt is missing');
assert(exists('sitemap.xml'),'sitemap.xml is missing');
if(exists('robots.txt'))assert(read('robots.txt').includes('https://nolabelsdesignedbygod.org/sitemap.xml'),'robots.txt: sitemap address is missing');
if(exists('sitemap.xml')){
 const sitemap=read('sitemap.xml');
 for(const file of ['contact.html','mission.html','book-by-book.html',...articlePages,...devotionalPages,...newsletterPages])assert(sitemap.includes(`https://nolabelsdesignedbygod.org/${file}`),`sitemap.xml: missing ${file}`);
}

const expectedBookOrder=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Songs','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
assert(exists('book-by-book.html'),'book-by-book.html is missing');
if(exists('book-by-book.html')){
 const library=read('book-by-book.html');
 const libraryCanonical='https://nolabelsdesignedbygod.org/book-by-book.html';
 const canonical=library.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
 const ogUrl=library.match(/<meta property="og:url" content="([^"]+)"/i)?.[1];
 assert(canonical===libraryCanonical,`book-by-book.html: canonical URL should be ${libraryCanonical}`);
 assert(ogUrl===libraryCanonical,`book-by-book.html: og:url should be ${libraryCanonical}`);
 const cards=[...library.matchAll(/<article class="book-card">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
 const titles=cards.map(card=>card.match(/<h2>([^<]+)<\/h2>/)?.[1]||'');
 const hrefs=cards.map(card=>card.match(/<a href="([^"]+)"/)?.[1]||'');
 const lessonTotal=cards.reduce((sum,card)=>sum+Number(card.match(/·\s*(\d+)\s+lessons/)?.[1]||0),0);
 assert(cards.length===66,`book-by-book.html: expected 66 book cards, found ${cards.length}`);
 assert(JSON.stringify(titles)===JSON.stringify(expectedBookOrder),'book-by-book.html: canonical book order does not match the 66-book Protestant canon');
 assert(new Set(hrefs).size===66,'book-by-book.html: book study links must be unique');
 assert(lessonTotal===447,`book-by-book.html: expected 447 lessons, found ${lessonTotal}`);
 const sitemap=exists('sitemap.xml')?read('sitemap.xml'):'';
 for(const href of hrefs){
  assert(Boolean(href),`book-by-book.html: a book card is missing its href`);
  if(!href)continue;
  assert(exists(href),`book-by-book.html: linked book page is missing: ${href}`);
  if(sitemap)assert(sitemap.includes(`https://nolabelsdesignedbygod.org/${href}`),`sitemap.xml: missing Book-by-Book page ${href}`);
  if(!exists(href))continue;
  const html=read(href);
  const expectedCanonical=`https://nolabelsdesignedbygod.org/${href}`;
  for(const marker of ['<title>','name="description"','rel="canonical"','property="og:title"','property="og:description"','property="og:url"','property="og:type"'])assert(html.includes(marker),`${href}: missing ${marker}`);
  const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const ogUrl=html.match(/<meta property="og:url" content="([^"]+)"/i)?.[1];
  assert(canonical===expectedCanonical,`${href}: canonical URL should be ${expectedCanonical}`);
  assert(ogUrl===expectedCanonical,`${href}: og:url should be ${expectedCanonical}`);
 }
}

assert(exists('contact-links.js'),'contact-links.js is missing');
assert(exists('contact-library.js'),'contact-library.js is missing');
if(exists('contact.html')){
 const contact=read('contact.html');
 assert(contact.includes('team@nolabelsdesignedbygod.org'),'contact.html: ministry email is missing');
 assert(contact.includes('mailto:team@nolabelsdesignedbygod.org'),'contact.html: email action is missing');
 assert(contact.includes('"@type":"ContactPage"'),'contact.html: ContactPage structured data is missing');
}
if(exists('contact-links.js'))assert(read('contact-links.js').includes('team@nolabelsdesignedbygod.org'),'contact-links.js: ministry email is missing');

assert(exists('mission.css'),'mission.css is missing');
assert(exists('mission-library.js'),'mission-library.js is missing');
if(exists('mission.html')){
 const mission=read('mission.html');
 assert(mission.includes('"@type":"AboutPage"'),'mission.html: AboutPage structured data is missing');
 assert(mission.includes('To help people move beyond the labels'),'mission.html: mission statement is missing');
 assert(mission.includes('What we believe')&&mission.includes('Who we serve')&&mission.includes('How we serve'),'mission.html: core mission sections are incomplete');
}
if(exists('mission-library.js'))assert(read('mission-library.js').includes("id:'our-mission'")&&read('mission-library.js').includes("url:'mission.html'"),'mission-library.js: search registration is incomplete');
if(exists('contact-links.js'))assert(read('contact-links.js').includes('mission-library.js?v=1.0.0'),'contact-links.js: mission search loader is missing');

if(failures.length){
 console.error(`SEO and social preview audit FAILED with ${failures.length} problem(s):`);
 failures.forEach(item=>console.error(`- ${item}`));
 process.exit(1);
}
console.log(`SEO and social preview audit PASSED for ${pages.length} core pages plus all 66 Book-by-Book routes.`);