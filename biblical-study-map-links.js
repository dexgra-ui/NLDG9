(()=>{
 const s=window.NLDG_BOOK_STUDY,hero=document.getElementById('book-hero');
 if(!s||!hero||document.querySelector('.book-geography-resource'))return;
 const book=String(s.book||'').trim().toLowerCase();
 const resources={
  world:{title:'The World of the Bible',href:'biblical-map-world.html'},
  abraham:{title:'Abraham’s Journey',href:'biblical-map-abraham.html'},
  exodus:{title:'The Exodus & Wilderness',href:'biblical-map-exodus.html'},
  tribes:{title:'Conquest & the Twelve Tribes',href:'biblical-map-tribes.html'},
  united:{title:'Israel Under Saul, David & Solomon',href:'biblical-map-united-monarchy.html'},
  divided:{title:'The Divided Kingdom',href:'biblical-map-divided-kingdom.html'},
  exile:{title:'Assyrian & Babylonian Exile',href:'biblical-map-exile.html'},
  return:{title:'Return from Exile & Persian Period',href:'biblical-map-return-exile.html'},
  jesus:{title:'Jesus’ Ministry',href:'biblical-map-jesus-ministry.html'},
  jerusalem:{title:'Jerusalem in the Time of Jesus',href:'biblical-map-jerusalem-jesus.html'},
  paul:{title:'Paul’s Missionary World',href:'biblical-map-paul.html'}
 };
 const groups={
  genesis:['world','abraham'],
  exodus:['exodus'],leviticus:['exodus'],numbers:['exodus'],deuteronomy:['exodus'],
  joshua:['tribes'],judges:['tribes'],ruth:['tribes'],
  '1 samuel':['united'],'2 samuel':['united'],'1 chronicles':['united'],
  '1 kings':['united','divided'],'2 kings':['divided','exile'],'2 chronicles':['divided','exile'],
  ezra:['return'],nehemiah:['return'],esther:['return'],
  job:['world'],psalms:['world'],proverbs:['world'],ecclesiastes:['world'],'song of songs':['world'],
  isaiah:['divided','exile'],jeremiah:['divided','exile'],lamentations:['exile'],ezekiel:['exile'],daniel:['exile'],
  hosea:['divided'],joel:['divided'],amos:['divided'],obadiah:['exile'],jonah:['world','divided'],micah:['divided'],nahum:['world','exile'],habakkuk:['divided','exile'],zephaniah:['divided','exile'],
  haggai:['return'],zechariah:['return'],malachi:['return'],
  matthew:['jesus','jerusalem'],mark:['jesus','jerusalem'],luke:['jesus','jerusalem'],john:['jesus','jerusalem'],acts:['paul','world'],
  romans:['paul'],'1 corinthians':['paul'],'2 corinthians':['paul'],galatians:['paul'],ephesians:['paul'],philippians:['paul'],colossians:['paul'],'1 thessalonians':['paul'],'2 thessalonians':['paul'],'1 timothy':['paul'],'2 timothy':['paul'],titus:['paul'],philemon:['paul'],
  hebrews:['world'],james:['world'],'1 peter':['world'],'2 peter':['world'],'1 john':['world'],'2 john':['world'],'3 john':['world'],jude:['world'],revelation:['world']
 };
 const ids=groups[book];
 if(!ids?.length)return;
 const lesson=Number(new URLSearchParams(location.search).get('lesson')||0);
 let note='Use the map alongside Scripture to place this book in its biblical world.';
 if(book==='genesis')note='See the wider biblical world and Abraham’s movement through Genesis 11–22. Exact ancient travel roads are not claimed.';
 else if(['exodus','leviticus','numbers','deuteronomy'].includes(book))note='Follow the wilderness setting while keeping the sea crossing, Sinai identification, and reconstructed route clearly marked as debated.';
 else if(['joshua','judges','ruth'].includes(book))note='View approximate tribal allotments and key locations without treating ancient boundaries as modern surveyed borders.';
 else if(['1 samuel','2 samuel','1 chronicles'].includes(book))note='Place the story within the United Monarchy while distinguishing Israelite core territory from wider influence.';
 else if(['1 kings','2 kings','2 chronicles','isaiah','jeremiah','hosea','joel','amos','micah','habakkuk','zephaniah'].includes(book))note='Track Israel and Judah with period-sensitive boundaries; political control changed repeatedly across these books.';
 else if(['lamentations','ezekiel','daniel','obadiah','nahum'].includes(book))note='Use the exile geography to distinguish Assyrian and Babylonian settings and generalized deportation corridors.';
 else if(['ezra','nehemiah','esther','haggai','zechariah','malachi'].includes(book))note='Explore the Persian-period world and generalized return routes; uncertain locations are shown as study zones rather than exact pins.';
 else if(['job','psalms','proverbs','ecclesiastes','song of songs'].includes(book))note='This book is not a single travel narrative. Use the biblical-world map for broad geographic orientation without assigning a precise route or setting the text does not establish.';
 else if(['matthew','mark','luke','john'].includes(book))note='Read the Gospel with Galilee, Samaria, Judea, and Jerusalem in view. The maps avoid forcing the Gospel accounts into one speculative itinerary.';
 else if(book==='acts')note='Follow Acts through Paul’s missionary world with separate journey layers and reconstructed route segments clearly identified.';
 else if(ids.includes('paul'))note='Situate this letter in Paul’s missionary world. The map is geographic orientation, not a claim that every route segment can be reconstructed exactly.';
 else if(['hebrews','james','1 peter','2 peter','1 john','2 john','3 john','jude','revelation'].includes(book))note='Use the biblical-world map for regional orientation. The resource does not assign a precise writing location or audience location where the biblical text or scholarship remains uncertain.';
 if(lesson&&['matthew','mark','luke','john'].includes(book))note+=' Jerusalem is included as a second resource for Passion-week and city-context study.';
 const style=document.createElement('style');
 style.textContent='.book-geography-resource{margin:1rem auto 1.5rem;max-width:1180px;padding:1.05rem 1.15rem;border:1px solid rgba(24,59,112,.16);border-left:5px solid #c79b45;border-radius:16px;background:linear-gradient(135deg,#fffaf0,#f6f8fc);box-shadow:0 8px 22px rgba(6,18,45,.05)}.book-geography-resource .kicker{margin:0 0 .2rem}.book-geography-resource h2{margin:.1rem 0 .45rem;font-size:clamp(1.2rem,2vw,1.55rem)}.book-geography-resource p{margin:.25rem 0 .8rem}.book-geography-links{display:flex;gap:.6rem;flex-wrap:wrap}.book-geography-links a{display:inline-flex;align-items:center;padding:.58rem .82rem;border-radius:999px;background:#06122d;color:#fff;text-decoration:none;font-weight:800;font-size:.9rem}.book-geography-links a:nth-child(even){background:#fff;color:#183b70;border:1px solid rgba(24,59,112,.22)}@media(max-width:640px){.book-geography-resource{margin:0 .85rem 1.2rem}.book-geography-links{display:grid}.book-geography-links a{justify-content:center;width:100%;box-sizing:border-box}}';
 document.head.appendChild(style);
 const section=document.createElement('section');
 section.className='book-geography-resource';
 section.setAttribute('aria-label','Biblical geography resources');
 section.innerHTML=`<p class="kicker">Explore the Geography</p><h2>Put ${String(s.book||'this book')} on the map.</h2><p>${note}</p><div class="book-geography-links">${ids.map(id=>`<a href="${resources[id].href}">🗺️ ${resources[id].title}</a>`).join('')}<a href="biblical-maps.html">View all maps</a></div>`;
 hero.insertAdjacentElement('afterend',section);
})();