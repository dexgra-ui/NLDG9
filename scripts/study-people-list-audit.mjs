import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('study-people-pilot.js','utf8');
function run(book,lesson=false,hash=''){
 const elements=[];
 const make=tag=>{const el={tag,children:[],value:'',hidden:false,events:{},append(...children){this.children.push(...children);},prepend(child){this.children.unshift(child);},setAttribute(name,value){this[name]=value;},addEventListener(name,fn){this.events[name]=fn;},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;},querySelectorAll(){return [];},querySelector(){return lesson?{}:null;}};elements.push(el);return el;};
 const view=make('div');view.id='book-view';
 if(book==='lamentations')view.querySelectorAll=()=>[{closest:()=>null}]; // Empty name maps must skip inline traversal.
 const document={readyState:'complete',head:make('head'),getElementById:id=>elements.find(el=>el.id===id),createElement:make};
 document.head.appendChild=child=>document.head.append(child);
 const location=new URL(`https://nolabelsdesignedbygod.org/${book}-study.html${lesson?'?lesson=2':''}${hash}`);
 vm.runInNewContext(source,{document,location,URL,Set,RegExp,setTimeout:fn=>fn()});
 return {elements,panel:elements.find(el=>el.id==='study-people'),input:elements.find(el=>el.id==='study-people-search'),list:elements.find(el=>el.id==='study-people-list')};
}
for(const book of ['ruth','esther','genesis','exodus','leviticus','numbers','deuteronomy','joshua','judges','first-samuel','second-samuel','first-kings','second-kings',"first-chronicles","second-chronicles","ezra","nehemiah"])for(const lesson of [false,true]){
 const r=run(book,lesson,'#study-people');assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);
 if(lesson)assert.equal(r.panel.open,true);
 const personRows=r.list.children.filter(row=>row.children[0]?.tag==='a');
 const links=personRows.map(row=>row.children[0]);assert.equal(links.length,{"first-chronicles":12,"second-chronicles":12,"ezra":11,"nehemiah":10}[book]??(book==='second-kings'?18:['judges','first-samuel','second-samuel','first-kings'].includes(book)?14:book==='joshua'?10:book==='deuteronomy'?13:book==='numbers'?14:book==='exodus'?10:book==='genesis'?11:book==='esther'?6:8));
 assert.equal(new Set(links.map(a=>new URL(a.href).searchParams.get('person'))).size,links.length);
 for(const link of links){const url=new URL(link.href);assert.equal(url.searchParams.get('return'),`/${book}-study.html${lesson?'?lesson=2':''}#study-people`);}
 r.input.value={"first-chronicles":"jeduthun","second-chronicles":"huldah","ezra":"sheshbazzar","nehemiah":"gashmu"}[book]??(book==='second-kings'?'jehoshabeath':book==='first-kings'?'administrator':book==='second-samuel'?'jedidiah':book==='first-samuel'?'carmel':book==='judges'?'jerubbaal':book==='joshua'?'aksah':book==='deuteronomy'?'abram':book==='numbers'?'noah':book==='leviticus'?'shelomith':book==='exodus'?'puah':book==='genesis'?'sarai':book==='esther'?'hadassah':'kilion');r.input.events.input();assert.equal(personRows.filter(row=>!row.hidden).length,1);
 if(book==='second-kings')assert.equal(new URL(personRows.find(row=>!row.hidden).children[0].href).searchParams.get('person'),'jehosheba');
 if(book==='numbers')assert.equal(new URL(personRows.find(row=>!row.hidden).children[0].href).searchParams.get('person'),'noah-zelophehad');
 if(['genesis','exodus','leviticus','numbers','deuteronomy','joshua','judges','first-samuel','second-samuel','first-kings','second-kings',"first-chronicles","second-chronicles","ezra","nehemiah"].includes(book))assert.equal(r.list.children.filter(row=>row.className==='study-people-group'&&!row.hidden).length,1);
 r.input.value='no such person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(personRows.filter(row=>!row.hidden).length,links.length);
 if(['genesis','exodus','leviticus','numbers','deuteronomy','joshua','judges','first-samuel','second-samuel','first-kings','second-kings',"first-chronicles","second-chronicles","ezra","nehemiah"].includes(book))assert.equal(r.list.children.filter(row=>row.className==='study-people-group'&&!row.hidden).length,3);
 if(book==='exodus'){assert.ok(r.elements.some(el=>el.textContent?.includes('not named in the Exodus narrative')));assert.ok(links.every(link=>!new URL(link.href).searchParams.get('person').includes('pharaoh')));}
}
assert.ok(fs.readFileSync('book-study-series.js','utf8').includes("if(['/ruth-study.html','/esther-study.html','/genesis-study.html','/exodus-study.html','/leviticus-study.html','/numbers-study.html','/deuteronomy-study.html','/joshua-study.html','/judges-study.html','/first-samuel-study.html','/second-samuel-study.html','/first-kings-study.html','/second-kings-study.html','/first-chronicles-study.html','/second-chronicles-study.html','/ezra-study.html','/nehemiah-study.html','/job-study.html','/psalms-study.html','/proverbs-study.html','/ecclesiastes-study.html','/song-of-songs-study.html','/isaiah-study.html','/jeremiah-study.html','/lamentations-study.html','/ezekiel-study.html','/daniel-study.html','/hosea-study.html','/joel-study.html','/amos-study.html','/obadiah-study.html','/jonah-study.html','/micah-study.html','/nahum-study.html','/habakkuk-study.html','/zephaniah-study.html','/haggai-study.html','/zechariah-study.html','/malachi-study.html','/matthew-study.html','/mark-study.html','/luke-study.html','/john-study.html'].includes(location.pathname))"));
console.log('PASS: All enabled study overview and lesson lists, groups, aliases, empty/reset searches, unique profiles, exact returns, and reopening the lesson panel.');

const wisdomLists={"job":{"count":8,"groups":3,"search":"jemima","id":"jemimah","note":"Job’s wife and his initial children are not named. Eliphaz the Temanite is not identified here with Eliphaz son of Esau."},"psalms":{"count":9,"groups":3,"search":"ethan","id":"ethan-ezrahite","note":"Psalm headings preserve associations with named people; these labels do not settle every authorship question. Heman and Ethan the Ezrahites retain the identity cautions in their profiles. The sons of Korah are a collective group, not one named individual."},"proverbs":{"count":5,"groups":2,"search":"jakeh","id":"agur","note":"Woman Wisdom and Woman Folly are poetic personifications. Lemuel’s mother and the woman of Proverbs 31 are unnamed; Agur and Lemuel are not identified with Solomon."},"ecclesiastes":{"count":1,"groups":0,"search":"david","id":"david","note":"Ecclesiastes calls the Teacher / Preacher / Qoheleth a son of David but does not give the speaker a personal name. Solomon is a traditional identification, not an explicitly named speaker in this book. David is listed as a named reference, not as its speaker."},"song-of-songs":{"count":1,"groups":0,"search":"solomon","id":"solomon","note":"Solomon is named in the title and poem. His relationship to the lovers is debated. The Shulamite is a designation, not a supplied personal name, and the lovers are not assigned invented identities here."}};
for(const [book,c] of Object.entries(wisdomLists))for(const lesson of [false,true]){
 const r=run(book,lesson,'#study-people');
 assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);if(lesson)assert.equal(r.panel.open,true);
 const rows=r.list.children.filter(row=>row.children[0]?.tag==='a');
 assert.equal(rows.length,c.count);assert.equal(new Set(rows.map(row=>new URL(row.children[0].href).searchParams.get('person'))).size,c.count);
 for(const row of rows)assert.equal(new URL(row.children[0].href).searchParams.get('return'),`/${book}-study.html${lesson?'?lesson=2':''}#study-people`);
 assert.ok(r.elements.some(el=>el.textContent===c.note));
 assert.equal(r.list.children.filter(row=>row.className==='study-people-group').length,c.groups);
 r.input.value=c.search;r.input.events.input();const visible=rows.filter(row=>!row.hidden);assert.equal(visible.length,1);assert.equal(new URL(visible[0].children[0].href).searchParams.get('person'),c.id);
 r.input.value='no such person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(rows.filter(row=>!row.hidden).length,c.count);
}
console.log('PASS: wisdom-book lists, small lists, identity notes, aliases, groups, empty/reset searches and exact returns.');

const prophetLists={"isaiah":{"count":12,"search":"maher","id":"maher-shalal-hash-baz","note":"The prophetess in Isaiah 8 is not personally named. Symbolic titles and poetic images are not assigned invented human identities.","groups":3},"jeremiah":{"count":12,"search":"neriah","id":"baruch","note":"Descriptive labels distinguish the prophet Jeremiah, King Zedekiah, Hananiah son of Azzur, and Gedaliah son of Ahikam from others with the same names.","groups":3},"lamentations":{"count":0,"search":null,"id":null,"note":"Lamentations does not name its human author or individual human characters. Its traditional association with Jeremiah is not an explicit authorship statement in the text. Daughter Zion and other poetic voices are not assigned named-person profiles.","groups":0},"ezekiel":{"count":8,"search":"danel","id":"daniel-ezekiel","note":"Ezekiel’s Daniel / Danel retains its debated identification and is not silently merged with Daniel of the court narratives. Ezekiel’s wife is unnamed; Oholah and Oholibah are symbolic personifications.","groups":3},"daniel":{"count":9,"search":"belteshazzar","id":"daniel-judean","note":"Daniel / Belteshazzar and King Belshazzar are different people. Darius the Mede retains his uncertain historical identification and is distinct from Darius in Ezra. Named heavenly beings are outside this human genealogy list.","groups":3}};
for(const [book,c] of Object.entries(prophetLists))for(const lesson of [false,true]){
 const r=run(book,lesson,'#study-people');assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);if(lesson)assert.equal(r.panel.open,true);
 const rows=r.list.children.filter(row=>row.children[0]?.tag==='a');assert.equal(rows.length,c.count);
 assert.equal(new Set(rows.map(row=>new URL(row.children[0].href).searchParams.get('person'))).size,c.count);
 assert.ok(r.elements.some(el=>el.textContent===c.note));
 assert.equal(r.list.children.filter(row=>row.className==='study-people-group').length,c.groups);
 for(const row of rows)assert.equal(new URL(row.children[0].href).searchParams.get('return'),`/${book}-study.html${lesson?'?lesson=2':''}#study-people`);
 if(!c.count){assert.equal(r.input.hidden,true);assert.equal(r.list.hidden,true);assert.ok(r.elements.some(el=>el.textContent==='No named individuals are listed for this book.'));continue;}
 r.input.value=c.search;r.input.events.input();const visible=rows.filter(row=>!row.hidden);assert.equal(visible.length,1);assert.equal(new URL(visible[0].children[0].href).searchParams.get('person'),c.id);
 r.input.value='no such person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(rows.filter(row=>!row.hidden).length,c.count);
}
console.log('PASS: major-prophet lists, aliases, groups, identity notes, Lamentations empty state and exact returns.');

const minorProphetLists={"hosea":{"count":9,"search":"lo-ruhamah","id":"lo-ruhamah","note":"Jezreel’s person profile is distinguished from the place-name. The profiles preserve the text’s differing parentage statements for the children. Gomer is not the Genesis ancestor with the same name.","groups":3},"joel":{"count":2,"search":"joel","id":"joel-prophet","note":"Joel is identified as son of Pethuel. The book names no reigning human king in its opening, so no ruler or date is assigned from a chronology theory.","groups":0},"amos":{"count":5,"search":"bethel","id":"amaziah-bethel","note":"Amos of Tekoa is distinct from Amoz, Isaiah’s father. Amaziah here is the priest of Bethel, not King Amaziah of Judah. Jeroboam II is distinct from Jeroboam son of Nebat.","groups":2},"obadiah":{"count":4,"search":"edom","id":"esau","note":"Obadiah’s ancestry is not stated; he is not identified with Ahab’s administrator. Esau, Jacob, and Joseph occur in ancestral and collective house language. Their profiles describe the ancestors, not separate individuals invented for those communities.","groups":2},"jonah":{"count":2,"search":"jonah","id":"jonah","note":"The king of Nineveh, the sailors, and the ship’s captain are not personally named in Jonah. No historical royal identity or invented name is assigned to them.","groups":0},"micah":{"count":11,"search":"miriam","id":"miriam","note":"Micah of Moresheth is distinct from Micaiah son of Imlah. The people recalled in Micah 6 and the covenant ancestors are named references across the book, not people present in every lesson.","groups":3}};
for(const [book,c] of Object.entries(minorProphetLists))for(const lesson of [false,true]){
 const r=run(book,lesson,'#study-people');assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);if(lesson)assert.equal(r.panel.open,true);
 const rows=r.list.children.filter(row=>row.children[0]?.tag==='a');assert.equal(rows.length,c.count);
 assert.equal(new Set(rows.map(row=>new URL(row.children[0].href).searchParams.get('person'))).size,c.count);
 assert.ok(r.elements.some(el=>el.textContent===c.note));
 assert.equal(r.list.children.filter(row=>row.className==='study-people-group').length,c.groups);
 for(const row of rows)assert.equal(new URL(row.children[0].href).searchParams.get('return'),`/${book}-study.html${lesson?'?lesson=2':''}#study-people`);
 r.input.value=c.search;r.input.events.input();const visible=rows.filter(row=>!row.hidden);assert.equal(visible.length,1);assert.equal(new URL(visible[0].children[0].href).searchParams.get('person'),c.id);
 r.input.value='no such person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(rows.filter(row=>!row.hidden).length,c.count);
}
console.log('PASS: Hosea–Micah lists, aliases, groups, short lists, identity notes, search reset and exact returns.');

const finalOTLists={"nahum":{"count":1,"search":"elkoshite","id":"nahum-prophet","note":"Nahum is called the Elkoshite. His father and ancestry are not named, and Elkosh is not assigned a personal genealogy. The rulers of Nineveh are not given invented names.","groups":0},"habakkuk":{"count":1,"search":"habakkuk","id":"habakkuk-prophet","note":"Habakkuk is named as the prophet, but his ancestry is not stated. No identity is assigned to the unnamed righteous person or the figures in the taunt songs.","groups":0},"zephaniah":{"count":6,"search":"amariah","id":"amariah-zephaniah","note":"Zephaniah the prophet is distinct from Zephaniah the priest. His ancestor Hezekiah is not explicitly called king in the text, so identity with King Hezekiah remains unresolved.","groups":2},"haggai":{"count":6,"search":"jehozadak","id":"jozadak","note":"Joshua / Jeshua here is the post-exile high priest, not Joshua son of Nun. Darius is the Persian king used to date these messages, not Darius the Mede in Daniel.","groups":2},"zechariah":{"count":7,"search":"iddo","id":"iddo-zechariah-return","note":"The post-exile prophet Zechariah is distinguished from other people with the same name. Joshua is the high priest, not Joshua son of Nun. Symbolic visions and unnamed figures are not assigned invented identities; house-of-David language refers to an ancestral line.","groups":3},"malachi":{"count":6,"search":"messenger","id":"malachi-name","note":"Malachi can be read as a personal name or as “my messenger”; the profile preserves that textual ambiguity. Jacob, Esau, and Levi appear in ancestral or covenant language. No specific identity is assigned to the unnamed messenger in Malachi 3.","groups":3}};
for(const [book,c] of Object.entries(finalOTLists))for(const lesson of [false,true]){
 const r=run(book,lesson,'#study-people');assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);if(lesson)assert.equal(r.panel.open,true);
 const rows=r.list.children.filter(row=>row.children[0]?.tag==='a');assert.equal(rows.length,c.count);
 assert.equal(new Set(rows.map(row=>new URL(row.children[0].href).searchParams.get('person'))).size,c.count);
 assert.ok(r.elements.some(el=>el.textContent===c.note));
 assert.equal(r.list.children.filter(row=>row.className==='study-people-group').length,c.groups);
 for(const row of rows)assert.equal(new URL(row.children[0].href).searchParams.get('return'),`/${book}-study.html${lesson?'?lesson=2':''}#study-people`);
 r.input.value=c.search;r.input.events.input();const visible=rows.filter(row=>!row.hidden);assert.equal(visible.length,1);assert.equal(new URL(visible[0].children[0].href).searchParams.get('person'),c.id);
 r.input.value='no such person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(rows.filter(row=>!row.hidden).length,c.count);
}
console.log('PASS: Nahum–Malachi lists, groups, short lists, identity notes, search reset and exact returns.');

const gospelLists={"matthew":{"count":14,"search":"arimathea","id":"joseph-arimathea","note":"Mary, Joseph, James, John, and Herod have descriptive labels to distinguish people with shared names. Named disciples are not automatically asserted to be Gospel authors.","groups":3},"mark":{"count":12,"search":"timaeus","id":"bartimaeus","note":"Levi son of Alphaeus retains the possible identification with Matthew without forcing a merge. Jairus’s daughter is unnamed. The unnamed women in Mark’s other stories are not assigned Mary Magdalene’s identity.","groups":3},"luke":{"count":14,"search":"zacchaeus","id":"zacchaeus","note":"Zechariah, Simeon, and Anna are the people in Luke’s birth and temple narratives. Mary the mother of Jesus and Mary the sister of Martha remain distinct. Unnamed women and parable characters are not assigned historical identities.","groups":3},"john":{"count":14,"search":"lazarus","id":"lazarus-bethany","note":"Lazarus of Bethany is distinct from the Lazarus in Luke’s parable. Mary of Bethany and Mary Magdalene remain distinct. The Samaritan woman and the beloved disciple are not personally named in John, so no identity is assigned to them here.","groups":3}};
for(const [book,c] of Object.entries(gospelLists))for(const lesson of [false,true]){
 const r=run(book,lesson,'#study-people');assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);if(lesson)assert.equal(r.panel.open,true);
 const rows=r.list.children.filter(row=>row.children[0]?.tag==='a');assert.equal(rows.length,c.count);
 assert.equal(new Set(rows.map(row=>new URL(row.children[0].href).searchParams.get('person'))).size,c.count);
 assert.ok(r.elements.some(el=>el.textContent===c.note));
 assert.equal(r.list.children.filter(row=>row.className==='study-people-group').length,c.groups);
 for(const row of rows)assert.equal(new URL(row.children[0].href).searchParams.get('return'),`/${book}-study.html${lesson?'?lesson=2':''}#study-people`);
 r.input.value=c.search;r.input.events.input();const visible=rows.filter(row=>!row.hidden);assert.equal(visible.length,1);assert.equal(new URL(visible[0].children[0].href).searchParams.get('person'),c.id);
 r.input.value='no such person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(rows.filter(row=>!row.hidden).length,c.count);
}
console.log('PASS: Gospel lists, groups, short lists, identity notes, search reset and exact returns.');
