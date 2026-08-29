(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='')=>merge(id,{ref,note});

add('jeremiah','Jeremiah 26–45');add('jehoiakim','Jeremiah 26; 35–36');add('zedekiah','Jeremiah 27–28; 32–34; 37–39');add('nebuchadnezzar','Jeremiah 27–29; 32; 34; 39; 43–44');

// Jeremiah 26 and the precedent of Uriah.
add('ahikam','Jeremiah 26:24','Ahikam son of Shaphan protects Jeremiah from being handed over to the people for death.');
add('shaphan','Jeremiah 26:24','Shaphan is named as father of Ahikam.');
put(R('shemaiah-uriah26','Shemaiah','Jeremiah / Uriah prophet','Person','male',[],[],'Jeremiah 26:20','Father of Uriah the prophet from Kiriath-Jearim. Distinct from many other Shemaiahs.','explicit',['Shemaiah father of Uriah the prophet']));
put(R('uriah-prophet','Uriah','Jeremiah / Uriah prophet','Prophet','male',['shemaiah-uriah26'],[],'Jeremiah 26:20–23','Son of Shemaiah from Kiriath-Jearim; prophesies against Jerusalem, flees to Egypt, is returned by Jehoiakim’s agents, and is executed. Distinct from Uriah the Hittite and Uriah the priest.','explicit',['Uriah son of Shemaiah','Uriah the prophet']));
put(R('achbor-elnathan-jer','Achbor','Jeremiah / royal officials','Person','male',[],[],'Jeremiah 26:22; 36:12,25','Father of Elnathan, a royal official. He may be the Josiah-era Achbor of 2 Kings 22, but Jeremiah does not explicitly identify the records.','probable',['Achbor father of Elnathan'],[C('probable identity','achbor','Jeremiah 26:22; 2 Kings 22:12','Chronology and court setting fit the Josiah-era official, but identity is not directly stated.') ]));
put(R('elnathan-achbor-jer','Elnathan','Jeremiah / royal officials','Royal official','male',['achbor-elnathan-jer'],[],'Jeremiah 26:22; 36:12,25','Son of Achbor; sent to Egypt to seize Uriah and later sits in Jehoiakim’s court. He may be Elnathan of Jerusalem, father of Nehushta in 2 Kings 24:8, but the cross-book identity is not explicit.','probable',['Elnathan son of Achbor'],[C('probable identity','elnathan-nehushta','Jeremiah 26:22; 36:12; 2 Kings 24:8','Same period and court context suggest identity, but Scripture does not directly state it.') ]));

// Jeremiah 28: Hananiah.
put(R('azzur-hananiah28','Azzur','Jeremiah / rival prophets','Person','male',[],[],'Jeremiah 28:1','Father of Hananiah the Gibeonite prophet. Distinct from other Azzurs.','explicit',['Azzur father of Hananiah']));
put(R('hananiah-azzur','Hananiah','Jeremiah / rival prophets','Prophet','male',['azzur-hananiah28'],[],'Jeremiah 28:1–17','Son of Azzur from Gibeon; prophet who contradicts Jeremiah concerning Babylon and dies after Jeremiah’s judgment oracle. Distinct from other Hananiahs.','explicit',['Hananiah son of Azzur']));

// Jeremiah 29: exilic letter and rival prophets.
put(R('elasah-shaphan','Elasah','Shaphan family','Royal messenger','male',['shaphan'],[],'Jeremiah 29:3','Son of Shaphan, one of the men through whom Jeremiah’s letter is sent to the exiles.','explicit',['Elasah son of Shaphan']));
put(R('hilkiah-gemariah29','Hilkiah','Jeremiah / exilic letter','Person','male',[],[],'Jeremiah 29:3','Father of Gemariah who carries Jeremiah’s letter. Distinct from Jeremiah’s father Hilkiah and the Josiah-era high priest unless Scripture identifies them.','unresolved identification',['Hilkiah father of Gemariah']));
put(R('gemariah-hilkiah29','Gemariah','Jeremiah / exilic letter','Royal messenger','male',['hilkiah-gemariah29'],[],'Jeremiah 29:3','Son of Hilkiah and messenger carrying Jeremiah’s letter. Distinct from Gemariah son of Shaphan in Jeremiah 36.','explicit',['Gemariah son of Hilkiah']));
put(R('kolaiah-ahab29','Kolaiah','Jeremiah / exilic rivals','Person','male',[],[],'Jeremiah 29:21','Father of Ahab, a false prophet among the exiles.'));
put(R('ahab-kolaiah','Ahab','Jeremiah / exilic rivals','False prophet','male',['kolaiah-ahab29'],[],'Jeremiah 29:21–23','Son of Kolaiah, false prophet among the exiles condemned by Jeremiah. Distinct from Ahab king of Israel.','explicit',['Ahab son of Kolaiah']));
put(R('maaseiah-zedekiah29','Maaseiah','Jeremiah / exilic rivals','Person','male',[],[],'Jeremiah 29:21','Father of Zedekiah, a false prophet among the exiles. Distinct from Maaseiah father of Zephaniah.','explicit',['Maaseiah father of Zedekiah the false prophet']));
put(R('zedekiah-maaseiah29','Zedekiah','Jeremiah / exilic rivals','False prophet','male',['maaseiah-zedekiah29'],[],'Jeremiah 29:21–23','Son of Maaseiah, false prophet among the exiles. Distinct from King Zedekiah.','explicit',['Zedekiah son of Maaseiah']));
put(R('shemaiah-nehelamite','Shemaiah the Nehelamite','Jeremiah / exilic rivals','False prophet / correspondent','male',[],[],'Jeremiah 29:24–32','Exilic opponent who sends letters against Jeremiah to Jerusalem. His family designation “Nehelamite” is preserved without inventing parentage.','explicit',['Shemaiah the Nehelamite']));
add('zephaniah-maaseiah','Jeremiah 29:25–29','Zephaniah son of Maaseiah receives Shemaiah’s letter and reads it to Jeremiah.');

// Jeremiah 31 ancestral figures.
add('rachel','Jeremiah 31:15','Jeremiah poetically names Rachel weeping for her children.');
add('ephraim','Jeremiah 31:9,18,20','Ephraim is used as an ancestral/collective name for the northern people.');
add('jacob','Jeremiah 30:7,10,18; 31:7,11','Jacob is used as patriarchal and collective covenant language.');

// Jeremiah 32: Baruch and Jeremiah’s land-redemption family.
put(R('mahseiah-baruch','Mahseiah','Baruch family','Person','male',[],[],'Jeremiah 32:12; 51:59','Father of Neriah and grandfather of Baruch; the same patronymic sequence later appears for Seraiah son of Neriah. Distinct from many Maaseiahs.','explicit',['Mahseiah ancestor of Baruch']));
put(R('neriah','Neriah','Baruch family','Person','male',['mahseiah-baruch'],[],'Jeremiah 32:12,16; 36:4,8,14,32; 43:3,6; 45:1; 51:59','Father of Baruch and Seraiah.'));
put(R('baruch','Baruch','Baruch family','Scribe / prophetic associate','male',['neriah'],[],'Jeremiah 32:12–16; 36; 43:3,6; 45:1–5','Son of Neriah and grandson of Mahseiah; Jeremiah’s scribe and close associate who writes and reads Jeremiah’s scroll.','explicit',['Baruch son of Neriah']));
put(R('shallum-jeremiah-uncle','Shallum','Jeremiah family','Relative / landholder','male',[],[],'Jeremiah 32:7–9','Father of Hanamel and called Jeremiah’s uncle. The exact relation to Jeremiah’s father Hilkiah is not separately spelled out, so no sibling link to Hilkiah is fabricated.','explicit',['Shallum uncle of Jeremiah'],[C('uncle of','jeremiah','Jeremiah 32:7–9')]));
put(R('hanamel','Hanamel','Jeremiah family','Relative / landholder','male',['shallum-jeremiah-uncle'],[],'Jeremiah 32:7–12','Son of Jeremiah’s uncle Shallum; Jeremiah’s cousin/kinsman who sells him the field at Anathoth.','explicit',['Hanamel son of Shallum'],[C('cousin / kinsman','jeremiah','Jeremiah 32:7–9')]));

// Jeremiah 35: Rechabites and temple chamber officials.
put(R('rechab-jonadab','Rechab','Rechabites','Ancestor','male',[],[],'Jeremiah 35:6,8,14,16,18–19','Father/ancestor of Jonadab and ancestral name of the Rechabite household.'));
put(R('jonadab-rechab','Jonadab / Jehonadab','Rechabites','Ancestor / reform ally','male',['rechab-jonadab'],[],'Jeremiah 35:6–19','Son of Rechab whose commands shape the Rechabite way of life. This is generally the Jehonadab son of Rechab who appears with Jehu in 2 Kings 10; the alternate form is preserved.','textual variant',['Jonadab son of Rechab','Jehonadab son of Rechab']));
put(R('habazziniah','Habazziniah','Rechabites','Ancestor','male',[],[],'Jeremiah 35:3','Grandfather of Jaazaniah through another Jeremiah.'));
put(R('jeremiah-rechabite','Jeremiah','Rechabites','Person','male',['habazziniah'],[],'Jeremiah 35:3','Son of Habazziniah and father of Jaazaniah. Explicitly a different Jeremiah from the prophet.','explicit',['Jeremiah father of Jaazaniah']));
put(R('jaazaniah-rechabite','Jaazaniah','Rechabites','Rechabite leader','male',['jeremiah-rechabite'],[],'Jeremiah 35:3','Son of Jeremiah and grandson of Habazziniah; named with his brothers, sons, and the whole Rechabite house.','explicit',['Jaazaniah son of Jeremiah']));
put(R('igdaliah','Igdaliah','Jeremiah / temple chambers','Person','male',[],[],'Jeremiah 35:4','Father of Hanan; called in the ancestry of “Hanan son of Igdaliah, the man of God.”'));
put(R('hanan-igdaliah','Hanan','Jeremiah / temple chambers','Man of God / chamber holder','male',['igdaliah'],[],'Jeremiah 35:4','Son of Igdaliah; associated with the chamber where Jeremiah brings the Rechabites. Distinct from other Hanans.','explicit',['Hanan son of Igdaliah']));
put(R('shallum-maaseiah35','Shallum','Jeremiah / temple chambers','Person','male',[],[],'Jeremiah 35:4','Father of Maaseiah the keeper of the threshold. Distinct from Jeremiah’s uncle Shallum.','explicit',['Shallum father of Maaseiah']));
put(R('maaseiah-threshold','Maaseiah','Jeremiah / temple chambers','Temple official','male',['shallum-maaseiah35'],[],'Jeremiah 35:4','Son of Shallum, keeper of the threshold, whose chamber is below Hanan’s.','explicit',['Maaseiah keeper of the threshold']));

// Jeremiah 36: the scroll and Jehoiakim’s court.
put(R('gemariah-shaphan','Gemariah','Shaphan family','Royal official','male',['shaphan'],[],'Jeremiah 36:10–25','Son of Shaphan; his chamber is used for Baruch’s public reading and he urges Jehoiakim not to burn the scroll. Distinct from Gemariah son of Hilkiah in Jeremiah 29.','explicit',['Gemariah son of Shaphan']));
put(R('micaiah-gemariah36','Micaiah','Shaphan family','Person / messenger','male',['gemariah-shaphan'],[],'Jeremiah 36:11–13','Son of Gemariah and grandson of Shaphan; reports Baruch’s words to the officials.','explicit',['Micaiah son of Gemariah']));
put(R('elishama-secretary36','Elishama','Jeremiah / Jehoiakim court','Royal secretary','male',[],[],'Jeremiah 36:12,20–21','Royal secretary whose chamber holds the scroll. Distinct from other Elishamas.','explicit',['Elishama the secretary']));
put(R('delaiah-shemaiah36','Delaiah','Jeremiah / Jehoiakim court','Royal official','male',['shemaiah-father-delaiah36'],[],'Jeremiah 36:12,25','Son of Shemaiah; official who urges the king not to burn the scroll.','explicit',['Delaiah son of Shemaiah']));
put(R('shemaiah-father-delaiah36','Shemaiah','Jeremiah / Jehoiakim court','Person','male',[],[],'Jeremiah 36:12','Father of Delaiah. Distinct from other Shemaiahs.','explicit',['Shemaiah father of Delaiah']));
put(R('hananiah-zedekiah36','Hananiah','Jeremiah / Jehoiakim court','Person','male',[],[],'Jeremiah 36:12','Father of Zedekiah the official. Distinct from Hananiah son of Azzur.','explicit',['Hananiah father of Zedekiah']));
put(R('zedekiah-hananiah36','Zedekiah','Jeremiah / Jehoiakim court','Royal official','male',['hananiah-zedekiah36'],[],'Jeremiah 36:12','Son of Hananiah, court official. Distinct from King Zedekiah.','explicit',['Zedekiah son of Hananiah']));
put(R('nethaniah-jehudi','Nethaniah','Jeremiah / Jehoiakim court','Person','male',['shelemiah-nethaniah36'],[],'Jeremiah 36:14','Father of Jehudi and son of Shelemiah. Distinct from Nethaniah father of Ishmael.','explicit',['Nethaniah father of Jehudi']));
put(R('shelemiah-nethaniah36','Shelemiah','Jeremiah / Jehoiakim court','Person','male',['cushi36'],[],'Jeremiah 36:14','Father of Nethaniah and son of Cushi in Jehudi’s ancestry.'));
put(R('cushi36','Cushi','Jeremiah / Jehoiakim court','Person','male',[],[],'Jeremiah 36:14','Ancestor of Jehudi through Shelemiah and Nethaniah. “Cushi” is preserved as the personal/ancestral form supplied by the text.'));
put(R('jehudi','Jehudi','Jeremiah / Jehoiakim court','Royal messenger','male',['nethaniah-jehudi'],[],'Jeremiah 36:14,21,23','Son of Nethaniah, descendant of Shelemiah and Cushi; summoned to fetch and read Jeremiah’s scroll to Jehoiakim.','explicit',['Jehudi son of Nethaniah'],[C('grandfather','shelemiah-nethaniah36','Jeremiah 36:14'),C('ancestor','cushi36','Jeremiah 36:14')]));
put(R('jerahmeel-kings-son','Jerahmeel','Jeremiah / Jehoiakim court','Royal son / official','male',['jehoiakim'],[],'Jeremiah 36:26','Called “the king’s son” and ordered to arrest Baruch and Jeremiah. The phrase can function as an official title in royal administration, so biological parentage to Jehoiakim is marked probable rather than certain.','probable',['Jerahmeel the king’s son']));
put(R('azriel-seraiah36','Azriel','Jeremiah / Jehoiakim court','Person','male',[],[],'Jeremiah 36:26','Father of Seraiah ordered to arrest Baruch and Jeremiah.'));
put(R('seraiah-azriel36','Seraiah','Jeremiah / Jehoiakim court','Royal official','male',['azriel-seraiah36'],[],'Jeremiah 36:26','Son of Azriel, ordered to arrest Baruch and Jeremiah. Distinct from other Seraiahs.','explicit',['Seraiah son of Azriel']));
put(R('abdeel-shelemiah36','Abdeel','Jeremiah / Jehoiakim court','Person','male',[],[],'Jeremiah 36:26','Father of Shelemiah ordered to arrest Baruch and Jeremiah.'));
put(R('shelemiah-abdeel36','Shelemiah','Jeremiah / Jehoiakim court','Royal official','male',['abdeel-shelemiah36'],[],'Jeremiah 36:26','Son of Abdeel, ordered to arrest Baruch and Jeremiah. Distinct from other Shelemiahs.','explicit',['Shelemiah son of Abdeel']));

// Jeremiah 37-38: prison and court figures.
put(R('shelemiah-jehucal','Shelemiah','Jeremiah / Zedekiah court','Person','male',[],[],'Jeremiah 37:3; 38:1','Father of Jehucal/Jucal. Distinct from Shelemiah son of Abdeel.','explicit',['Shelemiah father of Jehucal']));
put(R('jehucal','Jehucal / Jucal','Jeremiah / Zedekiah court','Royal official','male',['shelemiah-jehucal'],[],'Jeremiah 37:3; 38:1','Son of Shelemiah; sent by Zedekiah to Jeremiah and later joins officials demanding Jeremiah’s death.','textual variant',['Jehucal','Jucal']));
add('zephaniah-maaseiah','Jeremiah 37:3');
put(R('hananiah-irijah','Hananiah','Jeremiah / prison episode','Person','male',[],[],'Jeremiah 37:13','Father of Shelemiah and grandfather of Irijah; distinct from other Hananiahs.','explicit',['Hananiah grandfather of Irijah']));
put(R('shelemiah-irijah','Shelemiah','Jeremiah / prison episode','Person','male',['hananiah-irijah'],[],'Jeremiah 37:13','Father of Irijah and son of Hananiah.'));
put(R('irijah','Irijah','Jeremiah / prison episode','Guard captain','male',['shelemiah-irijah'],[],'Jeremiah 37:13–14','Son of Shelemiah, grandson of Hananiah; guard captain who arrests Jeremiah at the Benjamin Gate.','explicit',['Irijah son of Shelemiah']));
put(R('jonathan-secretary-prison','Jonathan','Jeremiah / prison episode','Royal secretary','male',[],[],'Jeremiah 37:15,20; 38:26','Secretary whose house is converted into a prison where Jeremiah is held. Distinct from other Jonathans.','explicit',['Jonathan the secretary']));
put(R('mattan-shephatiah38','Mattan','Jeremiah / Zedekiah court','Person','male',[],[],'Jeremiah 38:1','Father of Shephatiah.'));
put(R('shephatiah-mattan','Shephatiah','Jeremiah / Zedekiah court','Royal official','male',['mattan-shephatiah38'],[],'Jeremiah 38:1–6','Son of Mattan; one of the officials pressing for Jeremiah’s execution. Distinct from other Shephatiahs.','explicit',['Shephatiah son of Mattan']));
put(R('pashhur-gedaliah38','Pashhur','Jeremiah / Zedekiah court','Person','male',[],[],'Jeremiah 38:1','Father of Gedaliah the official. Distinct from Pashhur son of Immer and Pashhur son of Malchijah.','explicit',['Pashhur father of Gedaliah']));
put(R('gedaliah-pashhur38','Gedaliah','Jeremiah / Zedekiah court','Royal official','male',['pashhur-gedaliah38'],[],'Jeremiah 38:1–6','Son of Pashhur; one of the officials pressing for Jeremiah’s execution. Distinct from Gedaliah son of Ahikam.','explicit',['Gedaliah son of Pashhur']));
add('pashhur-malchijah','Jeremiah 38:1');
put(R('ebed-melech','Ebed-Melech','Jeremiah / Zedekiah court','Royal official','male',[],[],'Jeremiah 38:7–13; 39:15–18','Cushite/Ethiopian court official who persuades Zedekiah to rescue Jeremiah from the cistern and receives a promise of deliverance. The name means “servant of the king” but functions as the text’s identifying name/designation.','explicit',['Ebed-melech the Cushite']));
put(R('malchijah-kings-son-cistern','Malchijah','Jeremiah / Zedekiah court','Royal son / official','male',['zedekiah'],[],'Jeremiah 38:6','Owner/associated royal figure of the cistern where Jeremiah is lowered, called “the king’s son.” Biological sonship is possible but the phrase can also be an official title, so parentage is probable.','probable',['Malchijah the king’s son']));

// Jeremiah 39-41: fall of Jerusalem and Gedaliah administration.
add('nebuzaradan','Jeremiah 39:9–14; 40:1–6','Babylonian captain of the guard who oversees Jerusalem’s aftermath and releases Jeremiah.');
put(R('nergal-sharezer-sinmagir','Nergal-Sharezer','Babylon / fall of Jerusalem','Babylonian official','male',[],[],'Jeremiah 39:3','Babylonian official named among those who enter Jerusalem. Jeremiah 39:3’s division of the Babylonian names/titles varies among translations, so this occurrence is kept separate from the later Nergal-Sharezer called Rab-mag.','textual variant',['Nergal-Sharezer of Samgar / Sin-Magir?']));
put(R('samgar-nebo','Samgar-Nebo','Babylon / fall of Jerusalem','Babylonian name / official reading','male',[],[],'Jeremiah 39:3','Name/office sequence in the list of Babylonian officials. English translations divide the underlying names and titles differently; retained as a textual reading rather than normalized.','textual variant',['Samgar-Nebo']));
put(R('sarsekim','Sarsekim','Babylon / fall of Jerusalem','Babylonian official','male',[],[],'Jeremiah 39:3','Babylonian official associated with the title Rab-saris/chief officer in the fall-of-Jerusalem list.','explicit',['Sarsekim the Rab-saris']));
put(R('nergal-sharezer-rabmag','Nergal-Sharezer','Babylon / fall of Jerusalem','Babylonian official','male',[],[],'Jeremiah 39:3,13','Babylonian official identified with the title Rab-mag/chief magus. Kept separate from the earlier Nergal-Sharezer sequence in verse 3 because the text may name two people.','unresolved identification',['Nergal-Sharezer the Rab-mag']));
add('gedaliah','Jeremiah 39:14; 40–41','Gedaliah son of Ahikam and grandson of Shaphan becomes governor over the remnant in Judah and is assassinated by Ishmael.');add('ahikam','Jeremiah 39:14; 40:5–7; 41:16');add('shaphan','Jeremiah 39:14; 40:5–11; 41:2');
add('ishmael-nethaniah','Jeremiah 40:8,14–16; 41:1–18','Ishmael son of Nethaniah, of royal descent, assassinates Gedaliah.');add('nethaniah-ishmael','Jeremiah 40:8,14–15; 41:1–2');
add('kareah','Jeremiah 40:8,13–16; 41:11–16; 42–43');add('johanan-kareah','Jeremiah 40:8,13–16; 41:11–16; 42–43');
put(R('jonathan-kareah','Jonathan','Judah after the fall','Military leader','male',['kareah'],[],'Jeremiah 40:8','Son of Kareah and brother of Johanan; one of the army officers who comes to Gedaliah. Distinct from Jonathan the secretary.','explicit',['Jonathan son of Kareah'],[C('brother','johanan-kareah','Jeremiah 40:8')]));
add('tanhumeth','Jeremiah 40:8');
put(R('seraiah-tanhumeth','Seraiah','Judah after the fall','Military leader','male',['tanhumeth'],[],'Jeremiah 40:8','Son of Tanhumeth the Netophathite; army officer who comes to Gedaliah. Distinct from other Seraiahs.','explicit',['Seraiah son of Tanhumeth']));
put(R('ephai-netophathite','Ephai','Judah after the fall','Person / ancestor','male',[],[],'Jeremiah 40:8','Ancestor/father-name of Netophathite officers who come to Gedaliah; their individual names are not supplied.','explicit',['Ephai the Netophathite']));
put(R('jezanian-maacathite','Jezaniah','Judah after the fall','Military leader','male',[],[],'Jeremiah 40:8','Son/descendant of a Maacathite family, one of the army officers who comes to Gedaliah. Often linked with Jezaniah/Azariah son of Hoshaiah later, but the text does not explicitly identify them.','unresolved identification',['Jezaniah son of the Maacathite']));
put(R('baalis','Baalis','Ammon','King / ruler','male',[],[],'Jeremiah 40:14','King of the Ammonites who is reported to have sent Ishmael to kill Gedaliah.'));
put(R('elishama-ishmael41','Elishama','Ishmael royal ancestry','Person / royal ancestor','male',[],[],'Jeremiah 41:1','Grandfather/ancestor of Ishmael son of Nethaniah and described in the royal lineage. Distinct from other Elishamas.','explicit',['Elishama ancestor of Ishmael']));
merge('nethaniah-ishmael',{parents:['elishama-ishmael41'],note:'Jeremiah 41:1 calls Ishmael son of Nethaniah son of Elishama, of the royal family; this adds Elishama as Nethaniah’s father/ancestor.'});

// Jeremiah 42-43 textual name issue: Jezaniah/Azariah son of Hoshaiah.
put(R('hoshaiah-azariah43','Hoshaiah','Judah after the fall','Person','male',[],[],'Jeremiah 42:1; 43:2','Father of the military leader whose name appears as Jezaniah in Jeremiah 42:1 and Azariah in 43:2 in many textual/translation traditions.'));
put(R('azariah-jezaniah-hoshaiah','Azariah / Jezaniah','Judah after the fall','Military leader','male',['hoshaiah-azariah43'],[],'Jeremiah 42:1; 43:2','Son of Hoshaiah. Jeremiah 42:1 often reads Jezaniah while 43:2 reads Azariah; translations and manuscripts vary, so both forms remain visible rather than being silently normalized.','textual variant',['Azariah son of Hoshaiah','Jezaniah son of Hoshaiah']));
add('baruch','Jeremiah 43:3,6; 45:1–5');

// Jeremiah 44: Pharaoh Hophra.
put(R('hophra','Pharaoh Hophra','Egypt','King / ruler','male',[],[],'Jeremiah 44:30','King of Egypt named in Jeremiah’s sign of judgment.','explicit',['Hophra','Apries']));

db.scope='Genesis–Jeremiah 45';db.phase=9;
})();