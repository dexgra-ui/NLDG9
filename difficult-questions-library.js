(()=>{
if(window.NLDG_DIFFICULT_QUESTIONS_LIBRARY_LOADED||!window.NLDG_LIBRARY)return;
const base={category:'Difficult Questions',series:'Difficult Questions',difficulty:'All Levels',duration:60,status:'published',publishedAt:'2026-07-29',updatedAt:'2026-08-28'};
const items=[
{id:'difficult-questions',type:'Study Collection',title:'Difficult Questions',description:'Honest questions. Faithful Scripture. Hope in Christ through suffering, Scripture, science, denominations, salvation, silence, judgment, other religions, doubt, and discipleship.',url:'difficult-questions.html',scripture:['John 6:68','1 Peter 3:15-16'],book:'Various',topics:['questions','doubt','apologetics','faith','truth','hope'],audience:['Believers','Seekers','Skeptics','New Christians','Small Groups'],featured:true,...base},
{id:'dq-suffering',type:'Study',title:'Why Does God Allow Suffering?',description:'Explore lament, human freedom, brokenness, compassion, faithful action, and resurrection hope.',url:'difficult-questions-study.html?study=1',scripture:['Psalm 13','John 11:17-44','Romans 8:18-39'],book:'Various',topics:['suffering','evil','lament','grief','hope'],audience:['Believers','Seekers','Small Groups','Mentors'],...base},
{id:'dq-trust-bible',type:'Study',title:'Can I Trust the Bible?',description:'Learn how genre, context, inspiration, Christ-centered reading, and obedience shape trust in Scripture.',url:'difficult-questions-study.html?study=2',scripture:['2 Timothy 3:14-17','Luke 24:25-27','2 Peter 1:16-21'],book:'Various',topics:['Bible','Scripture','interpretation','inspiration','trust'],audience:['Believers','Seekers','New Christians','Students'],...base},
{id:'dq-science-faith',type:'Study',title:'Does Science Conflict with Faith?',description:'Distinguish scientific investigation, biblical interpretation, and philosophical claims.',url:'difficult-questions-study.html?study=3',scripture:['Genesis 1:1-31','Psalm 19:1-6','Colossians 1:15-17'],book:'Various',topics:['science','creation','Genesis','faith','reason'],audience:['Students','Young Adults','Believers','Seekers'],...base},
{id:'dq-denominations',type:'Study',title:'Why Are There So Many Christian Denominations?',description:'Examine conviction, history, human failure, essential beliefs, secondary differences, and Christian unity.',url:'difficult-questions-study.html?study=4',scripture:['John 17:20-23','Ephesians 4:1-6','Romans 14:1-13'],book:'Various',topics:['denominations','church','unity','doctrine','tradition'],audience:['Believers','Seekers','Church Groups','New Christians'],...base},
{id:'dq-never-hear',type:'Study',title:'What About People Who Never Hear the Gospel?',description:'Hold together Christ’s saving work, God’s justice and mercy, human limits, and faithful mission.',url:'difficult-questions-study.html?study=5',scripture:['Romans 1:18-25','Romans 2:6-16','Romans 10:9-17'],book:'Romans',topics:['salvation','mission','gospel','justice','mercy'],audience:['Believers','Seekers','Mission Groups','Mentors'],...base},
{id:'dq-god-silent',type:'Study',title:'Why Does God Seem Silent?',description:'Walk through unanswered prayer, spiritual dryness, lament, ordinary grace, community, and patient trust.',url:'difficult-questions-study.html?study=6',scripture:['Psalm 13','Psalm 22:1-5','1 Kings 19:9-13'],book:'Various',topics:['prayer','silence','waiting','lament','spiritual dryness'],audience:['Believers','Seekers','Care Groups','Mentors'],...base},
{id:'dq-judgment',type:'Study',title:'How Can a Loving God Judge Sin?',description:'Consider holiness, justice, mercy, repentance, the cross, and Christian differences about final judgment.',url:'difficult-questions-study.html?study=7',scripture:['Romans 2:1-11','Romans 3:21-26','Ezekiel 18:23'],book:'Various',topics:['judgment','hell','justice','love','grace','repentance'],audience:['Believers','Seekers','Small Groups','Teachers'],...base},
{id:'dq-other-religions',type:'Study',title:'What About Other Religions?',description:'Confess Jesus faithfully while practicing accuracy, dignity, listening, gentleness, and freedom from coercion.',url:'difficult-questions-study.html?study=8',scripture:['Acts 17:16-34','John 1:1-18','1 Peter 3:15-16'],book:'Various',topics:['religions','witness','Jesus','dialogue','respect'],audience:['Believers','Seekers','Students','Outreach Groups'],...base},
{id:'dq-doubt',type:'Study',title:'What Should Christians Do with Doubt?',description:'Identify different kinds of doubt and respond through honest prayer, study, community, and perseverance.',url:'difficult-questions-study.html?study=9',scripture:['Mark 9:14-29','John 20:24-29','Jude 20-23'],book:'Various',topics:['doubt','questions','faith','community','perseverance'],audience:['Believers','Seekers','Students','Mentors'],...base},
{id:'dq-following',type:'Study',title:'Following Jesus Without Having Every Answer',description:'Build a mature faith that seeks understanding, obeys what is clear, and remains teachable.',url:'difficult-questions-study.html?study=10',scripture:['John 6:60-69','Proverbs 3:5-6','Micah 6:8'],book:'Various',topics:['discipleship','trust','humility','obedience','perseverance'],audience:['Believers','Seekers','New Christians','Small Groups'],...base}
];
const existing=new Set(window.NLDG_LIBRARY.map(item=>item.id));
window.NLDG_LIBRARY.push(...items.filter(item=>!existing.has(item.id)));
window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(item=>item.type==='Study'&&item.status==='published');
window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(item=>item.status==='published');
function addSpanishLink(){
 if(document.documentElement.lang==='es')return;
 const page=location.pathname.split('/').pop()||'';
 if(page==='difficult-questions.html'){
  const hero=document.querySelector('.dq-hero>div:first-child');
  if(!hero||hero.querySelector('[data-dq-spanish-link]'))return;
  const el=document.createElement('div');el.className='actions dq-language-switch';el.dataset.dqSpanishLink='true';el.innerHTML='<a class="button primary" href="difficult-questions.html" aria-current="page">English</a><a class="button secondary" href="preguntas-dificiles.html">Español</a>';
  hero.querySelector('.lead')?.insertAdjacentElement('afterend',el);return;
 }
 if(page==='difficult-questions-study.html'){
  const n=Number(new URLSearchParams(location.search).get('study')||1);if(n<1||n>10)return;
  const hero=document.querySelector('.dq-study-hero');if(!hero||hero.querySelector('[data-dq-spanish-link]'))return;
  const el=document.createElement('div');el.className='actions dq-language-switch';el.dataset.dqSpanishLink='true';el.innerHTML=`<a class="button primary" href="difficult-questions-study.html?study=${n}" aria-current="page">English</a><a class="button secondary" href="preguntas-dificiles.html?study=${n}">Español</a>`;
  hero.querySelector('.dq-study-meta')?.insertAdjacentElement('afterend',el);
 }
}
addSpanishLink();
window.NLDG_DIFFICULT_QUESTIONS_LIBRARY_LOADED=true;
})();