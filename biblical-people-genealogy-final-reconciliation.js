(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const get=id=>db.records.find(r=>r.id===id);
const addRef=(id,ref,note='')=>{const r=get(id);if(!r)return;if(ref&&!String(r.ref||'').includes(ref))r.ref=[r.ref,ref].filter(Boolean).join('; ');if(note&&!String(r.note||'').includes(note))r.note=[r.note,note].filter(Boolean).join(' ');};
const addConn=(id,c)=>{const r=get(id);if(!r)return;r.connections=r.connections||[];if(!r.connections.some(x=>x.type===c.type&&x.target===c.target&&x.ref===c.ref))r.connections.push(c);};

// Restore foundational relationships if later reference-only records supplied empty arrays.
const eve=get('eve');if(eve){eve.spouses=[...new Set([...(eve.spouses||[]),'adam'])];addRef('eve','1 Timothy 2:13–14','Eve is explicitly named in 1 Timothy’s creation/deception reference; this later citation does not replace her Genesis relationship to Adam.');}
const adam=get('adam');if(adam){adam.spouses=[...new Set([...(adam.spouses||[]),'eve'])];}

// Jude’s Korah is the wilderness Korah son of Izhar already stored under a precise ID.
addRef('korah-izhar','Jude 11','Jude explicitly recalls Korah’s rebellion as a warning example.');

// Reconcile reciprocal identity notes without collapsing records the text itself leaves distinct.
addConn('james-brother-jesus',C('same Jerusalem leadership identity','james-jerusalem','Galatians 1:19; 2:9; Acts 15:13; 21:18','Galatians explicitly names the Lord’s brother James and then places James among the Jerusalem pillars, strongly identifying the Acts leader with Jesus’ brother.'));
addConn('james-jerusalem',C('same Jerusalem leadership identity','james-brother-jesus','Galatians 1:19; 2:9','The Pauline letter supplies the family designation Acts omits.'));
addConn('james-epistle',C('probable identity','james-brother-jesus','James 1:1; Galatians 1:19','Traditional authorship fits the early Jerusalem leader, but the Epistle of James itself only says “James, servant of God and of the Lord Jesus Christ.”'));
addConn('jude-epistle',C('probable identity','judas-brother-jesus','Jude 1; Matthew 13:55; Mark 6:3','Jude calls himself brother of James; the Gospels name brothers James and Judas/Jude in Jesus’ family, supporting but not explicitly proving the identification.'));
addConn('john-revelation',C('possible identity','john-zebedee','Revelation 1:1,4,9; 22:8','Revelation identifies the seer only as John; apostolic identification remains traditional rather than textually explicit.'));

// Keep likely ministry-name equivalences visible without forced mergers.
addConn('silas',C('probable identity','silvanus','Acts 15–18; 1 Thessalonians 1:1; 1 Peter 5:12','Missionary context strongly supports Silas/Silvanus as the same man.'));
addConn('silvanus',C('probable identity','silas','1 Thessalonians 1:1; 1 Peter 5:12; Acts 15–18','The New Testament never directly says “Silas, who was also called Silvanus,” so the identification remains labeled.'));
addConn('john-mark',C('probable identity','mark-barnabas-cousin','Acts 12:12,25; 15:37–39; Colossians 4:10','The name Mark plus Barnabas association strongly supports identity.'));
addConn('mark-barnabas-cousin',C('probable identity','john-mark','Colossians 4:10; Acts 12:12,25; 15:37–39','Likely John Mark, but the Epistle itself uses only Mark.'));
addConn('mark-1peter',C('probable identity','john-mark','1 Peter 5:13; Acts 12:12,25','Common early-Christian identification remains probable rather than explicit.'));

// All 66 Protestant canonical books have now been audited.
db.completedBooks=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Songs','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
db.completedPhases=[1,2,3,4,5,6,7,8,9,10,11,12,13,14];
db.scope='Genesis–Revelation';db.phase=14;db.status='complete';
})();