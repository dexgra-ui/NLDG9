import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const failures=[];
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const articlePages=['family-nobody-talks-about','grace-accountability','faith-hard-seasons','truth-online','church-shows-up','jesus-loves-you'].map(slug=>`articles/${slug}.html`);
const devotionalPages=['you-are-known','not-your-past','you-are-held','created-for-good-works','more-than-a-label','peace-is-a-practice','hope-that-holds','when-god-feels-silent','the-courage-to-lead','faithful-in-what-god-has-given-you','faith-for-the-next-decision','growing-into-the-leader-god-is-forming'].map(id=>`devotionals/${id}.html`);
const pages=['index.html','articles.html','devotionals.html','contact.html',...articlePages,...devotionalPages];
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
 for(const file of ['contact.html',...articlePages,...devotionalPages])assert(sitemap.includes(`https://nolabelsdesignedbygod.org/${file}`),`sitemap.xml: missing ${file}`);
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

if(failures.length){
 console.error(`SEO and social preview audit FAILED with ${failures.length} problem(s):`);
 failures.forEach(item=>console.error(`- ${item}`));
 process.exit(1);
}
console.log(`SEO and social preview audit PASSED for ${pages.length} pages.`);
