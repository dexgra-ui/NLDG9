import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('study-people-pilot.js','utf8');
function run(book,lesson=false,hash='',sample=''){
 const elements=[];
 const make=tag=>{const el={tag,children:[],value:'',hidden:false,events:{},append(...children){this.children.push(...children);},prepend(child){this.children.unshift(child);},setAttribute(name,value){this[name]=value;},addEventListener(name,fn){this.events[name]=fn;},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;},querySelectorAll(){return [];},querySelector(){return lesson?{}:null;}};elements.push(el);return el;};
 const view=make('div');view.id=book==='james'?'james-view':'book-view';
 let replacement;
 if(sample)view.querySelectorAll=()=>[{id:'',closest:()=>null,sample}];
 if(book==='lamentations')view.querySelectorAll=()=>[{closest:()=>null}]; // Empty name maps must skip inline traversal.
 const document={readyState:'complete',head:make('head'),getElementById:id=>elements.find(el=>el.id===id),createElement:make};
 document.head.appendChild=child=>document.head.append(child);
 document.createTextNode=text=>({textContent:text});document.createDocumentFragment=()=>make('fragment');
 document.createTreeWalker=block=>{const node={textContent:block.sample,parentElement:{closest:()=>null},replaceWith(fragment){replacement=fragment;}};let visited=false;return {currentNode:node,nextNode(){if(visited)return false;visited=true;return true;}};};
 const location=new URL(`https://nolabelsdesignedbygod.org/${book==='james'?'james-series.html':`${book}-study.html`}${lesson?(book==='james'?'?week=2':'?lesson=2'):''}${hash}`);
 vm.runInNewContext(source,{document,location,URL,Set,RegExp,NodeFilter:{SHOW_TEXT:4},setTimeout:fn=>fn()});
 return {elements,replacement,panel:elements.find(el=>el.id==='study-people'),input:elements.find(el=>el.id==='study-people-search'),list:elements.find(el=>el.id==='study-people-list')};
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
assert.ok(fs.readFileSync('book-study-series.js','utf8').includes("if(['/ruth-study.html','/esther-study.html','/genesis-study.html','/exodus-study.html','/leviticus-study.html','/numbers-study.html','/deuteronomy-study.html','/joshua-study.html','/judges-study.html','/first-samuel-study.html','/second-samuel-study.html','/first-kings-study.html','/second-kings-study.html','/first-chronicles-study.html','/second-chronicles-study.html','/ezra-study.html','/nehemiah-study.html','/job-study.html','/psalms-study.html','/proverbs-study.html','/ecclesiastes-study.html','/song-of-songs-study.html','/isaiah-study.html','/jeremiah-study.html','/lamentations-study.html','/ezekiel-study.html','/daniel-study.html','/hosea-study.html','/joel-study.html','/amos-study.html','/obadiah-study.html','/jonah-study.html','/micah-study.html','/nahum-study.html','/habakkuk-study.html','/zephaniah-study.html','/haggai-study.html','/zechariah-study.html','/malachi-study.html','/matthew-study.html','/mark-study.html','/luke-study.html','/john-study.html','/acts-study.html','/romans-study.html','/first-corinthians-study.html','/second-corinthians-study.html','/galatians-study.html','/ephesians-study.html','/philippians-study.html','/colossians-study.html','/first-thessalonians-study.html','/second-thessalonians-study.html','/first-timothy-study.html','/second-timothy-study.html','/titus-study.html','/philemon-study.html','/hebrews-study.html','/first-peter-study.html','/second-peter-study.html','/first-john-study.html','/second-john-study.html','/third-john-study.html','/jude-study.html','/revelation-study.html'].includes(location.pathname))"));
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

const actsLetterLists={"acts":{"count":16,"search":"dorcas","id":"tabitha-dorcas","note":"Paul / Saul is distinct from King Saul. Philip the evangelist is distinguished from Philip the apostle; Ananias of Damascus is distinct from the other Ananias figures in Acts. Bare John, Philip, Ananias, and Saul are not automatically assigned a profile.","groups":3},"romans":{"count":14,"search":"cenchreae","id":"phoebe","note":"Mary in Romans 16 is not identified with a Gospel Mary. Junia and Andronicus retain their profile’s translation-sensitive apostolic-language note. Tertius’s writing role is distinguished from Paul’s role as sender.","groups":3},"first-corinthians":{"count":12,"search":"co-sender","id":"sosthenes-corinthians","note":"Sosthenes the co-sender is not silently merged with the synagogue ruler in Acts. Gaius of Corinth retains the uncertainty about other people named Gaius. Chloe’s people and Stephanas’s household are not assigned invented individual names.","groups":3},"second-corinthians":{"count":7,"search":"aretas","id":"aretas","note":"The unnamed collection delegates and the person described in the third person in 2 Corinthians 12 are not given invented identities. Moses and Abraham are Scripture references, not people present in Paul’s mission.","groups":3}};
for(const [book,c] of Object.entries(actsLetterLists))for(const lesson of [false,true]){
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
console.log('PASS: Acts and letters lists, groups, short lists, identity notes, search reset and exact returns.');

const paulineLists={"galatians": {"count": 10, "groups": 3, "search": "hagar", "id": "hagar", "note": "James is identified as the Lord’s brother. John among the pillars retains the profile’s contextual identification; bare James and John are not automatically linked. Hagar and Isaac appear in Paul’s scriptural comparison, not as mission coworkers. Sarah and Ishmael are not personally named in Galatians 4."}, "ephesians": {"count": 3, "groups": 0, "search": "tychicus", "id": "tychicus", "note": "Paul is named as sender in the letter. Tychicus is the named messenger; unnamed apostles, prophets, and household members are not assigned personal identities. This list does not settle historical authorship debates."}, "philippians": {"count": 7, "groups": 2, "search": "epaphroditus", "id": "epaphroditus", "note": "Euodia and Syntyche are named gospel coworkers. Epaphroditus is distinct from Epaphras in Colossians. Clement is not identified with a later historical figure, and the unnamed loyal companion is not given an invented identity."}, "colossians": {"count": 14, "groups": 3, "search": "nymphas", "id": "nympha", "note": "Jesus called Justus is distinct from Jesus Christ; bare Jesus and Justus are not automatically linked. Mark’s probable identification with John Mark and Nympha / Nymphas’s textual variants remain explained in their profiles. Luke’s profile does not assert Gospel authorship. Epaphras and Epaphroditus remain distinct."}, "first-thessalonians": {"count": 4, "groups": 2, "search": "silas", "id": "silvanus", "note": "Silvanus is probably the Silas of Acts, but the profile preserves that identification as probable. Unnamed opponents and collective groups are not assigned invented personal identities."}, "second-thessalonians": {"count": 4, "groups": 2, "search": "silas", "id": "silvanus", "note": "Silvanus is probably the Silas of Acts, but the profile preserves that identification as probable. Unnamed opponents and collective groups are not assigned invented personal identities. The man of lawlessness is not identified with a named historical or modern person."}};
for(const [book,c] of Object.entries(paulineLists))for(const lesson of [false,true]){
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
console.log('PASS: Galatians through 2 Thessalonians lists, aliases, identity notes, search/reset, groups and exact returns.');

// Exercise actual text traversal: qualified names must resolve without assigning bare names.
for(const [book,text,ids,labels] of [
 ['galatians','Paul met James and John. Barnabas and Titus accompanied him.',['saul-paul','barnabas','titus'],['Paul','Barnabas','Titus']],
 ['ephesians','Tychicus encouraged the believers.',['tychicus'],['Tychicus']],
 ['philippians','Euodia and Syntyche served with Epaphroditus.',['euodia','syntyche','epaphroditus'],['Euodia','Syntyche','Epaphroditus']],
 ['colossians','Jesus called Justus and Jesus Christ are distinct. Jesus and Justus are bare names. Nymphas welcomed the church.',['jesus-justus','jesus','nympha'],['Jesus called Justus','Jesus Christ','Nymphas']],
 ['colossians','Mark and Luke are bare names. Mark cousin of Barnabas and Luke the beloved physician have qualified labels.',['mark-barnabas-cousin','luke-physician'],['Mark cousin of Barnabas','Luke the beloved physician']],
 ['first-thessalonians','Silvanus and Timothy write with Paul.',['silvanus','timothy','saul-paul'],['Silvanus','Timothy','Paul']],
 ['second-thessalonians','Paul and Silvanus speak about the man of lawlessness.',['saul-paul','silvanus'],['Paul','Silvanus']]
]){
 const r=run(book,true,'',text),parts=r.replacement.children,links=parts.filter(el=>el.tag==='a');
 assert.deepEqual(links.map(a=>new URL(a.href).searchParams.get('person')),ids);
 assert.deepEqual(links.map(a=>a.textContent),labels);
 assert.equal(parts.map(el=>el.textContent).join(''),text);
 for(const link of links)assert.equal(new URL(link.href).searchParams.get('return'),`/${book}-study.html?lesson=2#person-context-0`);
}
console.log('PASS: actual inline name traversal preserves text, distinct identities, unlinked ambiguous names and exact passage returns.');

const pastoralLists={"first-timothy": {"count": 8, "groups": 3, "search": "alexander", "id": "alexander-1timothy", "note": "Paul names himself as sender and addresses Timothy as his child in the faith, not a biological son. Alexander in this letter is not automatically identified with the coppersmith. Adam and Eve are Scripture references; unnamed church leaders are not assigned invented identities."}, "second-timothy": {"count": 20, "groups": 3, "search": "grandmother", "id": "lois", "note": "Lois is Timothy’s grandmother and Eunice his mother; Paul’s child language describes faith, not biological parentage. Alexander the coppersmith is not silently merged with other Alexanders. Mark’s traditional identification with John Mark is retained in the profile. Jannes and Jambres are named here, not in Exodus. Unnamed household members receive no invented identities."}, "titus": {"count": 7, "groups": 3, "search": "lawyer", "id": "zenas", "note": "Titus is addressed as Paul’s child in a common faith, not a biological son. Zenas is called a lawyer, but the kind of legal expertise is not specified. The unnamed Cretan prophet is not assigned a historical identity."}, "philemon": {"count": 12, "groups": 3, "search": "apphia", "id": "apphia", "note": "Apphia is not explicitly called Philemon’s wife, and Archippus is not explicitly called their son. Onesimus is Paul’s child in the faith, not a biological son; his relationship with Philemon involves enslavement, not stated kinship. Mark’s probable identification with John Mark is preserved. Luke’s profile does not assert Gospel authorship."}};
for(const [book,c] of Object.entries(pastoralLists))for(const lesson of [false,true]){
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
console.log('PASS: Pastoral and Philemon lists, identities, search/reset and exact returns.');

for(const [book,text,ids] of [
 ['first-timothy','Alexander is ambiguous. Paul writes to Timothy about Hymenaeus.',['saul-paul','timothy','hymenaeus']],
 ['second-timothy','Lois and Eunice taught Timothy. Alexander the coppersmith is distinct from Alexander. Mark and Luke remain unlinked.',['lois','eunice','timothy','alexander-coppersmith']],
 ['titus','Artemas and Tychicus travel; Zenas and Apollos need support.',['artemas','tychicus','zenas','apollos']],
 ['philemon','Apphia and Archippus are greeted with Philemon. Onesimus is a brother. Mark and Luke remain unlinked.',['apphia','archippus','philemon','onesimus']]
]){
 const r=run(book,true,'',text),parts=r.replacement.children,links=parts.filter(el=>el.tag==='a');
 assert.deepEqual(links.map(a=>new URL(a.href).searchParams.get('person')),ids);
 assert.equal(parts.map(el=>el.textContent).join(''),text);
 for(const link of links)assert.equal(new URL(link.href).searchParams.get('return'),`/${book}-study.html?lesson=2#person-context-0`);
}
console.log('PASS: pastoral inline traversal, ambiguous-name exclusions, preserved text and passage returns.');

const hebrewsPeterLists={"hebrews": {"count": 23, "groups": 4, "search": "jared", "id": "enoch-sethite", "note": "Hebrews does not name its human author; no author is assigned here. Joshua in Hebrews 4:8 is son of Nun; older English translations may call him Jesus, so bare Jesus is not automatically linked. Melchizedek’s literary and theological comparison does not supply invented parents or establish a nonhuman identity. The faith examples are people recalled from Scripture, not contemporaries of the writer."}, "first-peter": {"count": 7, "groups": 2, "search": "mark", "id": "mark-1peter", "note": "Peter is named as sender in the letter. Silvanus’s identification with Silas remains probable. Mark is called Peter’s son in a ministry context; biological parentage is not asserted, and identification with John Mark remains probable. Sarah, Abraham and Noah are scriptural examples. The woman or community in Babylon is not assigned a personal name."}, "second-peter": {"count": 7, "groups": 2, "search": "bosor", "id": "beor-balaam", "note": "The sender identifies himself as Simon Peter; this panel does not settle historical authorship debates. Paul is the named brother whose letters are mentioned. Balaam’s father is distinguished from Beor father of Bela; the Beor / Bosor textual variation is retained in the profile. Noah and Lot are scriptural examples, and unnamed false teachers receive no invented identities."}};
for(const [book,c] of Object.entries(hebrewsPeterLists))for(const lesson of [false,true]){
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
console.log('PASS: Hebrews and Peter lists, notes, searches and exact returns.');

for(const [book,text,ids] of [
 ['hebrews','Jesus in older wording may refer to Joshua. Jesus Christ is our high priest. Sarah trusted the promise.',['joshua','jesus','sarai']],
 ['first-peter','Peter writes through Silvanus. Mark is a bare name. Sarah and Abraham are examples.',['simon-peter','silvanus','sarai','abram']],
 ['second-peter','Simon Peter names Paul; Balaam is son of Bosor.',['simon-peter','saul-paul','balaam','beor-balaam']]
]){
 const r=run(book,true,'',text),parts=r.replacement.children,links=parts.filter(el=>el.tag==='a');
 assert.deepEqual(links.map(a=>new URL(a.href).searchParams.get('person')),ids);
 assert.equal(parts.map(el=>el.textContent).join(''),text);
 for(const link of links)assert.equal(new URL(link.href).searchParams.get('return'),`/${book}-study.html?lesson=2#person-context-0`);
}
console.log('PASS: Hebrews/Peter inline traversal, ambiguity exclusions and passage returns.');

const finalNTLists={"first-john": {"count": 2, "groups": 0, "search": "cain", "id": "cain", "note": "This letter does not name its human sender. John is not inserted as an explicitly named author. Cain is the named negative example; his brother is not personally named in 1 John 3:12."}, "second-john": {"count": 1, "groups": 0, "search": "jesus", "id": "jesus", "note": "The sender calls himself the elder; the elect lady, her children, and her chosen sister are not given personal names. Whether the lady represents a person or a community is not settled by this panel. Jesus Christ is the one named person listed."}, "third-john": {"count": 3, "groups": 0, "search": "commended", "id": "demetrius-3john", "note": "The elder does not give a personal name. Gaius is kept distinct from other New Testament men named Gaius, and Demetrius is not identified with the silversmith in Acts. Unnamed traveling believers receive no invented identities."}, "jude": {"count": 9, "groups": 2, "search": "seventh", "id": "enoch-sethite", "note": "Jude calls himself a servant of Jesus Christ and brother of James. Identification of these brothers with Jesus’ family remains probable rather than explicitly stated in this letter. Enoch is the seventh from Adam, distinct from Cain’s son. Michael is an archangel and is outside this human-person list."}, "revelation": {"count": 9, "groups": 3, "search": "thyatira", "id": "jezebel-revelation", "note": "John identifies himself as witness and brother; identity with John son of Zebedee remains unresolved in the profile. Antipas of Pergamum is not Herod Antipas. Jezebel of Thyatira is distinct from Ahab’s queen; the name may be symbolic. David, Judah and Moses are named scriptural references. Angels, symbolic figures, the two witnesses, and collective Gog/Magog imagery receive no invented human identities."}};
for(const [book,c] of Object.entries(finalNTLists))for(const lesson of [false,true]){
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
console.log('PASS: final NT lists, short lists, notes, searches and exact returns.');

for(const [book,text,ids] of [
 ['first-john','John is not named as sender. Jesus and Cain are named.',['jesus','cain']],
 ['second-john','The elder addresses the elect lady about Jesus Christ.',['jesus']],
 ['third-john','Gaius welcomes believers; Diotrephes opposes them. Demetrius is commended.',['gaius-3john','diotrephes','demetrius-3john']],
 ['jude','Jude names James as brother and recalls Enoch, Adam and Korah.',['jude-epistle','enoch-sethite','adam','korah-izhar']],
 ['revelation','John and Antipas are bare names. John of Revelation names Antipas of Pergamum and Jezebel of Thyatira. Balaam and Balak are recalled.',['john-revelation','antipas','jezebel-revelation','balaam','balak']]
]){
 const r=run(book,true,'',text),parts=r.replacement.children,links=parts.filter(el=>el.tag==='a');
 assert.deepEqual(links.map(a=>new URL(a.href).searchParams.get('person')),ids);
 assert.equal(parts.map(el=>el.textContent).join(''),text);
 for(const link of links)assert.equal(new URL(link.href).searchParams.get('return'),`/${book}-study.html?lesson=2#person-context-0`);
}
console.log('PASS: final NT inline traversal, identity exclusions, text and passage returns.');

for(const lesson of [false,true]){
 const r=run('james',lesson,'#study-people');
 assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);if(lesson)assert.equal(r.panel.open,true);
 const rows=r.list.children.filter(row=>row.children[0]?.tag==='a');
 assert.equal(rows.length,7);assert.equal(new Set(rows.map(row=>new URL(row.children[0].href).searchParams.get('person'))).size,7);
 for(const row of rows)assert.equal(new URL(row.children[0].href).searchParams.get('return'),`/james-series.html${lesson?'?week=2':''}#study-people`);
 r.input.value='abram';r.input.events.input();assert.equal(rows.filter(row=>!row.hidden).length,1);
 r.input.value='missing person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(rows.filter(row=>!row.hidden).length,7);
}
const jamesText='James is traditionally identified with Jesus’ brother. Abraham, Isaac, Rahab, Job and Elijah are examples.';
const jamesInline=run('james',true,'',jamesText).replacement.children;
assert.deepEqual(jamesInline.filter(el=>el.tag==='a').map(a=>new URL(a.href).searchParams.get('person')),['jesus','abram','isaac','rahab','job','elijah']);
assert.equal(jamesInline.map(el=>el.textContent).join(''),jamesText);
for(const a of jamesInline.filter(el=>el.tag==='a'))assert.equal(new URL(a.href).searchParams.get('return'),'/james-series.html?week=2#person-context-0');
console.log('PASS: James overview/lesson panels, search/reset, unique profiles, week-based returns, reopening and safe inline identities.');
