(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const named=(prefix,names,ref,kind='Named individual',line='Nehemiah')=>names.forEach((raw,i)=>{const n=raw.split(' / ')[0];put(R(`${prefix}-${i+1}-${slug(n)}`,raw,line,kind,'male',[],[],ref,`Named in ${ref}. Kept separate from same-name people elsewhere unless Scripture supplies an identity link.`,raw.includes(' / ')?'textual variant':'explicit',raw.includes(' / ')?raw.split(' / '):[]));});
const chain=(prefix,names,ref,line,kind='Person / ancestor name')=>{let prev=null;for(let i=names.length-1;i>=0;i--){const n=names[i],id=`${prefix}-${i}-${slug(n)}`;put(R(id,n,line,kind,'male',prev?[prev]:[],[],ref,`${i===0?'Named individual':'Ancestor'} in the stated genealogy.`, 'explicit',[`${n} (${line})`]));prev=id;}return `${prefix}-0-${slug(names[0])}`;};

merge('ezra-scribe',{ref:'Nehemiah 8:1–9; 12:26,36'});merge('nehemiah-governor',{ref:'Nehemiah 8:9; 10:1; 12:26,31,38,40; 13'});
// Men standing beside Ezra and Levites teaching the law.
named('neh8-platform',['Mattithiah','Shema','Anaiah','Uriah','Hilkiah','Maaseiah','Pedaiah','Mishael','Malchiah','Hashum','Hashbadana','Zechariah','Meshullam'],'Nehemiah 8:4','Platform attendant','Nehemiah / Torah reading');
named('neh8-teachers',['Jeshua','Bani','Sherebiah','Jamin','Akkub','Shabbethai','Hodijah','Maaseiah','Kelita','Azariah','Jozabad','Hanan','Pelaiah'],'Nehemiah 8:7','Levite teacher','Levi / Torah reading');
merge('sherebiah',{ref:'Nehemiah 8:7; 9:4–5; 10:12; 12:8,24'});merge('shabbethai-ezra',{ref:'Nehemiah 8:7; 11:16'});
// Prayer leaders in chapter 9.
named('neh9-stairs',['Jeshua','Bani','Kadmiel','Shebaniah','Bunni','Sherebiah','Bani','Chenani'],'Nehemiah 9:4','Levite prayer leader','Levi / covenant prayer');
named('neh9-blessing',['Jeshua','Kadmiel','Bani','Hashabniah','Sherebiah','Hodijah','Shebaniah','Pethahiah'],'Nehemiah 9:5','Levite prayer leader','Levi / covenant prayer');

// Covenant signers: named present individuals, not ancestor-family labels.
put(R('zidkijah-neh10','Zidkijah','Nehemiah covenant','Covenant signer','male',[],[],'Nehemiah 10:1','Named immediately after Nehemiah among covenant signers.','explicit',['Zidkijah','Zedekiah?']));
named('neh10-priest',['Seraiah','Azariah','Jeremiah','Pashur','Amariah','Malchijah','Hattush','Shebaniah','Malluch','Harim','Meremoth','Obadiah','Daniel','Ginnethon','Baruch','Meshullam','Abijah','Mijamin','Maaziah','Bilgai','Shemaiah'],'Nehemiah 10:2–8','Priest / covenant signer','Nehemiah covenant');
named('neh10-levite',['Jeshua','Binnui','Kadmiel','Shebaniah','Hodijah','Kelita','Pelaiah','Hanan','Micha','Rehob','Hashabiah','Zaccur','Sherebiah','Shebaniah','Hodijah','Bani','Beninu'],'Nehemiah 10:9–13','Levite / covenant signer','Nehemiah covenant');
named('neh10-chief',['Parosh','Pahath-Moab','Elam','Zattu','Bani','Bunni','Azgad','Bebai','Adonijah','Bigvai','Adin','Ater','Hezekiah','Azzur','Hodijah','Hashum','Bezai','Hariph','Anathoth','Nebai','Magpiash','Meshullam','Hezir','Meshezabeel','Zadok','Jaddua','Pelatiah','Hanan','Anaiah','Hoshea','Hananiah','Hashub','Hallohesh','Pileha','Shobek','Rehum','Hashabnah','Maaseiah','Ahijah','Hanan','Anan','Malluch','Harim','Baanah'],'Nehemiah 10:14–27','Chief / covenant signer','Nehemiah covenant');

// Jerusalem residents, chapter 11.
const athaiah=chain('neh11-athaiah',['Athaiah','Uzziah','Zechariah','Amariah','Shephatiah','Mahalaleel'],'Nehemiah 11:4','Judah / Jerusalem residents');merge(athaiah,{connections:[{type:'descendant of',target:'perez',ref:'Nehemiah 11:4'}]});
const maaseiah=chain('neh11-maaseiah',['Maaseiah','Baruch','Colhozeh','Hazaiah','Adaiah','Joiarib','Zechariah','Shiloni'],'Nehemiah 11:5','Judah / Jerusalem residents');
const sallu=chain('neh11-sallu',['Sallu','Meshullam','Joed','Pedaiah','Kolaiah','Maaseiah','Ithiel','Jesaiah'],'Nehemiah 11:7','Benjamin / Jerusalem residents');
put(R('gabbai','Gabbai','Benjamin / Jerusalem residents','Leader','male',[],[],'Nehemiah 11:8','Benjaminite Jerusalem resident named after Sallu.'));put(R('sallai','Sallai','Benjamin / Jerusalem residents','Leader','male',[],[],'Nehemiah 11:8','Benjaminite Jerusalem resident named with Gabbai.'));
put(R('zichri-joel11','Zichri','Jerusalem administration','Person','male',[],[],'Nehemiah 11:9','Father of Joel the overseer.'));put(R('joel-zichri11','Joel','Jerusalem administration','Overseer','male',['zichri-joel11'],[],'Nehemiah 11:9','Son of Zichri, overseer of Jerusalem residents.'));
put(R('senuah','Senuah','Jerusalem administration','Person','male',[],[],'Nehemiah 11:9','Father of Judah, second over the city.'));put(R('judah-senuah','Judah','Jerusalem administration','City official','male',['senuah'],[],'Nehemiah 11:9','Son of Senuah, second over Jerusalem.'));
named('neh11-priest-basic',['Jedaiah','Joiarib','Jachin'],'Nehemiah 11:10','Priest','Priests / Jerusalem residents');
const seraiah11=chain('neh11-seraiah',['Seraiah','Hilkiah','Meshullam','Zadok','Meraioth','Ahitub'],'Nehemiah 11:11','Priests / Jerusalem residents','Priest / ancestor name');merge(seraiah11,{note:'Seraiah heads the house of God in the Jerusalem-resident list.'});
const adaiah11=chain('neh11-adaiah',['Adaiah','Jeroham','Pelaliah','Amzi','Zechariah','Pashhur','Malchiah'],'Nehemiah 11:12','Priests / Jerusalem residents','Priest / ancestor name');
const amashai11=chain('neh11-amashai',['Amashai','Azareel','Ahasai','Meshillemoth','Immer'],'Nehemiah 11:13','Priests / Jerusalem residents','Priest / ancestor name');
put(R('zabdiel11','Zabdiel','Priests / Jerusalem residents','Overseer','male',[],[],'Nehemiah 11:14','Overseer of 128 mighty men. His father is described but not named.'));
const shemaiah11=chain('neh11-shemaiah',['Shemaiah','Hashub','Azrikam','Hashabiah','Bunni'],'Nehemiah 11:15','Levi / Jerusalem residents','Levite / ancestor name');
merge('shabbethai-ezra',{ref:'Nehemiah 11:16'});put(R('jozabad-neh11','Jozabad','Levi / Jerusalem residents','Levite leader','male',[],[],'Nehemiah 11:16','Chief Levite overseeing outside work of the house of God. Distinct from same-name Levites unless linked.','explicit',['Jozabad in Nehemiah 11:16']));
const mattaniah11=chain('neh11-mattaniah',['Mattaniah','Micha','Zabdi','Asaph'],'Nehemiah 11:17','Levi / singers','Singer / ancestor name');put(R('bakbukiah','Bakbukiah','Levi / singers','Singer / leader','male',[],[],'Nehemiah 11:17; 12:9,25','Second among the singers/Levites in thanksgiving service.'));
const abda11=chain('neh11-abda',['Abda','Shammua','Galal','Jeduthun'],'Nehemiah 11:17','Levi / singers','Singer / ancestor name');
put(R('gispa','Gispa','Temple servants / Nehemiah','Nethinim overseer','male',[],[],'Nehemiah 11:21','Overseer of temple servants at Ophel with Ziha.'));put(R('ziha-overseer','Ziha','Temple servants / Nehemiah','Nethinim overseer','male',[],[],'Nehemiah 11:21','Overseer of temple servants at Ophel with Gispa; may relate to the Ziha return-family name, but identity is not forced.','unresolved identification',['Ziha overseer']));
const uzzi11=chain('neh11-uzzi',['Uzzi','Bani','Hashabiah','Mattaniah','Micha'],'Nehemiah 11:22','Levi / singers','Levite / ancestor name');merge(uzzi11,{note:'Uzzi is overseer of the Levites at Jerusalem and connected to the sons of Asaph.'});
put(R('meshezabeel-pethahiah','Meshezabeel','Judah / Persian court','Person','male',[],[],'Nehemiah 11:24','Father of Pethahiah.'));put(R('pethahiah-meshezabeel','Pethahiah','Judah / Persian court','Royal liaison','male',['meshezabeel-pethahiah'],[],'Nehemiah 11:24','Descendant of Zerah son of Judah, serving at the king’s hand in matters concerning the people.','explicit',[],[{type:'descendant of',target:'zerah-judah',ref:'Nehemiah 11:24'}]));

// Priestly and high-priest lines, chapter 12.
named('neh12-first-priests',['Seraiah','Jeremiah','Ezra','Amariah','Malluch','Hattush','Shecaniah','Rehum','Meremoth','Iddo','Ginnetho','Abijah','Miamin','Maadiah','Bilgah','Shemaiah','Joiarib','Jedaiah','Sallu','Amok','Hilkiah','Jedaiah'],'Nehemiah 12:1–7','Priest / family head','Priests / first return');
named('neh12-first-levites',['Jeshua','Binnui','Kadmiel','Sherebiah','Judah','Mattaniah','Bakbukiah','Unni'],'Nehemiah 12:8–9','Levite / family head','Levi / first return');
put(R('joiakim-high-priest','Joiakim','High-priest succession','High priest','male',['jeshua-jozadak'],[],'Nehemiah 12:10,12,26','Son of Jeshua and father of Eliashib in the high-priest succession.'));
merge('eliashib-high-priest',{parents:['joiakim-high-priest'],ref:'Nehemiah 12:10,22–23'});
put(R('joiada-high-priest','Joiada','High-priest succession','High priest','male',['eliashib-high-priest'],[],'Nehemiah 12:10–11,22; 13:28','Son of Eliashib and father of Jonathan in the succession. One unnamed son becomes son-in-law to Sanballat.'));
put(R('jonathan-high-priest','Jonathan','High-priest succession','High priest / ancestor','male',['joiada-high-priest'],[],'Nehemiah 12:11','Son of Joiada and father of Jaddua in the succession. Nehemiah 12:22–23 also names Johanan in this period; identity between Jonathan and Johanan is not forced.','unresolved identification',['Jonathan son of Joiada']));
put(R('jaddua-high-priest','Jaddua','High-priest succession','High priest','male',['jonathan-high-priest'],[],'Nehemiah 12:11,22','Son of Jonathan in the stated high-priest succession and named among the later recorded priestly generation.'));
put(R('johanan-high-priest','Johanan','High-priest succession','Priestly leader','male',['eliashib-high-priest'],[],'Nehemiah 12:22–23','Named in the later priestly record and explicitly called son of Eliashib in verse 23. Relationship to Jonathan of verse 11 is unresolved and may reflect a name variant or a different generation.','unresolved identification',['Johanan son of Eliashib']));

const priestHeads=[['Meraiah','Seraiah'],['Hananiah','Jeremiah'],['Meshullam','Ezra'],['Jehohanan','Amariah'],['Jonathan','Melicu'],['Joseph','Shebaniah'],['Adna','Harim'],['Helkai','Meraioth'],['Zechariah','Iddo'],['Meshullam','Ginnethon'],['Zichri','Abijah'],['Piltai','Moadiah'],['Shammua','Bilgah'],['Jehonathan','Shemaiah'],['Mattenai','Joiarib'],['Uzzi','Jedaiah'],['Kallai','Sallai'],['Eber','Amok'],['Hashabiah','Hilkiah'],['Nethaneel','Jedaiah']];
for(const [n,f] of priestHeads)put(R(`neh12-head-${slug(n)}-${slug(f)}`,n,'Priests / Joiakim','Priestly family head','male',[],[],'Nehemiah 12:12–21',`Priestly family head in Joiakim’s generation, representing the house of ${f}. Distinct from same-name people elsewhere unless Scripture connects them.`,'explicit',[`${n} of ${f}`]));

// Wall dedication.
named('neh12-dedication-a',['Hoshaiah','Azariah','Ezra','Meshullam','Judah','Benjamin','Shemaiah','Jeremiah'],'Nehemiah 12:32–34','Dedication participant','Wall dedication');
const zaccurchain=chain('neh12-zechariah-trumpet',['Zechariah','Jonathan','Shemaiah','Mattaniah','Michaiah','Zaccur','Asaph'],'Nehemiah 12:35','Wall dedication','Priestly musician / ancestor name');
named('neh12-musicians',['Shemaiah','Azarael','Milalai','Gilalai','Maai','Nethaneel','Judah','Hanani'],'Nehemiah 12:36','Musician / dedication participant','Wall dedication');
named('neh12-priests-trumpets',['Eliakim','Maaseiah','Miniamin','Michaiah','Elioenai','Zechariah','Hananiah'],'Nehemiah 12:41','Priest / trumpeter','Wall dedication');
named('neh12-singers',['Maaseiah','Shemaiah','Eleazar','Uzzi','Jehohanan','Malchijah','Elam','Ezer','Jezrahiah'],'Nehemiah 12:42','Singer / dedication participant','Wall dedication');

// Final reforms.
merge('tobiah-ammonite',{ref:'Nehemiah 13:4–9'});merge('eliashib-high-priest',{ref:'Nehemiah 13:4,7,28',connections:[{type:'allied with',target:'tobiah-ammonite',ref:'Nehemiah 13:4'}]});merge('sanballat',{ref:'Nehemiah 13:28',note:'An unnamed son of Joiada, grandson of Eliashib, is married to Sanballat’s daughter; because neither spouse is named, no fabricated individual record is created.'});
put(R('shelemiah-treasurer13','Shelemiah','Nehemiah reform','Priest / treasurer','male',[],[],'Nehemiah 13:13','Priest appointed as treasurer after Nehemiah restores temple provisions.'));
put(R('zadok-scribe13','Zadok','Nehemiah reform','Scribe / treasurer','male',[],[],'Nehemiah 13:13','Scribe appointed over the treasuries. Distinct from other Zadoks.','explicit',['Zadok the scribe']));
put(R('pedaiah-treasurer13','Pedaiah','Nehemiah reform','Levite / treasurer','male',[],[],'Nehemiah 13:13','Levite appointed over the treasuries. Distinct from other Pedaiahs.','explicit',['Pedaiah the treasurer']));
put(R('mattaniah-zaccur13','Mattaniah','Nehemiah reform','Person','male',[],[],'Nehemiah 13:13','Grandfather/ancestor of Hanan through Zaccur. Distinct from other Mattaniahs.','explicit',['Mattaniah ancestor of Hanan']));
put(R('zaccur-hanan13','Zaccur','Nehemiah reform','Person','male',['mattaniah-zaccur13'],[],'Nehemiah 13:13','Son of Mattaniah and father of Hanan.'));
put(R('hanan-zaccur13','Hanan','Nehemiah reform','Distribution official','male',['zaccur-hanan13'],[],'Nehemiah 13:13','Son of Zaccur, appointed next to Shelemiah, Zadok, and Pedaiah to distribute provisions.'));

db.scope='Genesis–Nehemiah';db.phase=7;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Nehemiah'])];
})();