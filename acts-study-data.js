const acOpening='Begin with prayer for humility, wisdom, and compassionate attention. Read the main passage aloud and allow silence before discussion. Invite observation first. Participants may pass on any question. Do not require disclosure about mental health, finances, discrimination, disability, trauma, or leadership conflict. The goal is faithful formation under Scripture.';
const acContext='Read within the book’s historical setting, narrative movement, covenant context, and whole-Bible witness. Notice repeated evaluations, speeches, geographic movement, economic pressures, and the difference between description and command. Internal Jewish debates must never be turned into antisemitism, and extraordinary events should not be made universal formulas.';
const acQuestions=[
 'What detail or conflict in the passage needs the closest attention?',
 'What does the text reveal about God, the Spirit, leadership, or mission?',
 'Where do wealth, fear, power, ethnicity, or reputation distort faithfulness?',
 'Which distinction prevents harmful or coercive application?',
 'How does the passage honor workers, widows, outsiders, disabled people, or the exhausted?',
 'Where are repentance, courage, discernment, or generosity needed?',
 'What concrete practice can embody this teaching this week?',
 'How can the group support witness without pressure or unsafe disclosure?'
];
const acExamination='Come honestly before God. Where am I tempted by pride, fear, wealth, control, cultural superiority, image protection, or spiritual performance? What truth must reshape me? Name one place for repentance, rest, courageous witness, financial integrity, shared leadership, or renewed dependence on God.';
const acPractice='Choose one concrete practice: reread the passage three times; examine a financial or leadership system; encourage an exhausted person; listen across a cultural boundary; verify a claim before repeating it; repair a truthful conversation; strengthen accountability; or serve without recognition. Keep it safe, specific, and measurable.';
const acLeader='Do not use prophetic authority, temple holiness, Spirit guidance, church unity, discipline, generosity, healing, or mission to demand money, shame illness, promote violence, silence discrimination or abuse reports, or bypass fair process. Do not promise confidentiality. Follow safeguarding and reporting duties, and refer crisis or mental-health concerns to qualified help.';
const acPrayer=(truth)=>'Living God, '+truth+' Purify our worship, make our leadership just, and fill us with the courage and humility of Your Spirit. Protect the vulnerable, sustain the weary, expose corruption, and send us as truthful witnesses to Jesus. Amen.';

const acLessons=[
{
 number:1,
 title:'The Spirit Creates a Witnessing Community',
 scripture:'Acts 1:1–2:47; Joel 2:28–32; Psalm 16:8–11',
 question:'How do waiting, prayer, the Spirit, proclamation, baptism, generosity, and shared life launch the church’s witness?',
 truth:'The risen Jesus sends the Spirit to empower a prayerful, diverse community that proclaims Him and shares life generously.',
 goal:'To receive mission as Spirit-empowered witness and form community without coercing spiritual experiences or finances.',
 teaching:[
  {heading:'1. You Will Be My Witnesses',body:'Jesus redirects speculation about political timing toward Spirit-enabled witness from Jerusalem to the ends of the earth. Mission centers on Him, not predictions.'},
  {heading:'2. Prayerful Waiting',body:'Women and men gather in prayer while waiting for the promise. Waiting is active dependence, not inactivity. Women are present at the church’s foundation.'},
  {heading:'3. Replacing Judas',body:'The community names qualifications, prays, and casts lots. This descriptive process is not a required method for every church decision. Discernment should include Scripture, prayer, character, and accountable process.'},
  {heading:'4. Pentecost Languages',body:'The Spirit enables people to speak recognizable languages so nations hear God’s works. Pentecost reverses exclusion and launches mission. No one gift should be used as a hierarchy of worth.'},
  {heading:'5. Peter Proclaims Jesus',body:'Peter connects Joel, David, Jesus’ death, resurrection, and lordship. His audience is called to repent and receive the promise. Evangelism is invitation and truth, never coercion.'},
  {heading:'6. Shared Life and Possessions',body:'Believers learn, eat, pray, and share voluntarily so needs are met. This is radical generosity, not permission for leaders to seize property or demand financial disclosure without safeguards.'}
 ]
},
{
 number:2,
 title:'Courageous Witness Under Pressure',
 scripture:'Acts 3:1–5:42; Psalm 118:22–24; Matthew 5:10–12',
 question:'How does the Spirit produce healing, courage, generosity, integrity, and obedience when authorities resist the gospel?',
 truth:'Jesus’ name brings restoring power and courageous witness, while the Spirit-filled community practices generosity, truth, and obedience to God above human pressure.',
 goal:'To witness boldly without spectacle and to handle money, discipline, authority, and healing with care.',
 teaching:[
  {heading:'1. A Man Is Seen',body:'Peter and John attend to a disabled man who is regularly passed at the gate. They address him directly and restore mobility through Jesus. Disabled people are persons, not ministry props.'},
  {heading:'2. No Credit to Human Power',body:'Peter rejects the idea that personal power or piety caused healing. Testimony should point to Jesus and never imply that unhealed people lack faith.'},
  {heading:'3. We Cannot Stop Speaking',body:'The council threatens the apostles, who answer that God’s command outranks silence. Civil disobedience is accountable allegiance, not contempt for every law.'},
  {heading:'4. One Heart and Open Hands',body:'Believers share so no one lacks, and Barnabas gives land proceeds. Generosity is willing and needs-focused. Transparent administration becomes increasingly important.'},
  {heading:'5. Ananias and Sapphira',body:'The couple lies about a voluntary gift and dies under extraordinary judgment. Their property was theirs to keep. The story condemns deceptive performance, not refusal to donate, and must never be copied through violent discipline.'},
  {heading:'6. Gamaliel’s Restraint',body:'A respected teacher urges caution against killing the apostles. The council still beats them. Religious institutions can combine reason with abuse; physical punishment for dissent is not faithful accountability.'}
 ]
},
{
 number:3,
 title:'Servants, Stephen, and Expanding Mission',
 scripture:'Acts 6:1–8:40; Isaiah 53:7–8; Micah 6:8',
 question:'How does the church address ethnic neglect, share leadership, endure persecution, and follow the Spirit across boundaries?',
 truth:'Spirit-filled mission requires fair care, trustworthy shared leadership, courageous truth, and welcome that crosses ethnic and social boundaries.',
 goal:'To build equitable systems, honor servant leadership, reject antisemitic readings, and follow God toward overlooked people.',
 teaching:[
  {heading:'1. Widows Are Neglected',body:'Greek-speaking Jewish widows are overlooked in daily distribution. The apostles do not dismiss the complaint as division. Growth requires systems that hear affected communities and correct inequity.'},
  {heading:'2. Seven Trusted Servants',body:'The community selects Spirit-filled people for responsibility, many with Greek names. Practical administration is spiritual ministry. Service roles deserve authority, training, and accountability.'},
  {heading:'3. Stephen’s Witness',body:'Stephen retells Israel’s story to expose repeated resistance. This is an internal Jewish prophetic argument by a Jewish believer, not permission for Christians to condemn Jewish people collectively.'},
  {heading:'4. Mob Violence and Forgiveness',body:'Stephen is killed by a crowd and prays for his killers. His forgiveness does not make the execution just or eliminate the need to confront persecution.'},
  {heading:'5. The Gospel Reaches Samaria',body:'Philip proclaims Christ among Samaritans, and joy spreads across historic hostility. Peter confronts Simon’s attempt to purchase spiritual power. Gifts cannot be bought or controlled.'},
  {heading:'6. The Ethiopian Official',body:'The Spirit sends Philip to a powerful yet socially marginalized traveler reading Isaiah. Philip asks before explaining, and baptism follows faith. Mission listens and joins the person’s question rather than imposing an unrelated agenda.'}
 ]
},
{
 number:4,
 title:'Saul, Peter, and the Welcome of Gentiles',
 scripture:'Acts 9:1–10:48; Isaiah 56:3–8; Galatians 3:26–29',
 question:'How does Jesus transform a persecutor and lead the church to welcome people once considered outside?',
 truth:'The risen Jesus confronts violence, uses courageous servants, and gives the Spirit across cultural boundaries so the church must not call unclean those God welcomes.',
 goal:'To value repentance with accountability and to follow God’s initiative in dismantling ethnic and religious exclusion.',
 teaching:[
  {heading:'1. Saul Confronted by Jesus',body:'Saul’s zeal has become violence against Christ’s people. Encounter humbles him and interrupts harm. Sincere conviction does not make persecution righteous.'},
  {heading:'2. Ananias Names the Risk',body:'God sends Ananias, who honestly describes Saul’s danger. He obeys, but the text does not require victims to approach every violent offender without safeguards. God’s specific call is not a general rule against boundaries.'},
  {heading:'3. Repentance and Suspicion',body:'Saul begins proclaiming Jesus, yet believers fear him until Barnabas advocates. Trust develops through evidence and community discernment, not a dramatic testimony alone.'},
  {heading:'4. Peter and Tabitha',body:'Peter raises Tabitha, remembered for practical care. Her community displays the work of her hands. Quiet service carries public theological weight.'},
  {heading:'5. Cornelius and Peter',body:'A Gentile officer prays and gives generously while Peter receives a vision challenging purity boundaries. Both are prepared by God before meeting.'},
  {heading:'6. The Spirit Interrupts the Sermon',body:'Gentiles receive the Spirit, and Peter orders baptism. God’s action overturns exclusion. The church should follow clear fruit rather than protect cultural control.'}
 ]
},
{
 number:5,
 title:'Antioch and the Mission Begins',
 scripture:'Acts 11:1–13:52; Isaiah 49:5–6; Acts 1:8',
 question:'How do explanation, generosity, diverse leadership, prayer, and sending establish a cross-cultural mission?',
 truth:'The Spirit forms a diverse church that explains God’s work humbly, shares across need, worships together, and sends servants into mission.',
 goal:'To cultivate accountable testimony, intercultural leadership, generous relief, and mission initiated through worship and the Spirit.',
 teaching:[
  {heading:'1. Peter Explains in Order',body:'Jerusalem believers question Gentile fellowship, and Peter recounts events carefully. Accountability is not hostility. Leaders should explain decisions rather than invoke spiritual authority to end discussion.'},
  {heading:'2. They Glorify God',body:'The community recognizes that God grants repentance leading to life to Gentiles. Healthy discernment can change inherited assumptions when evidence and Scripture align.'},
  {heading:'3. Antioch’s Diverse Church',body:'Jewish believers from different regions proclaim to Greeks, Barnabas encourages, and Saul teaches. A new name, Christian, emerges in a multicultural setting.'},
  {heading:'4. Famine Relief',body:'Disciples give according to ability for Judean believers. Cross-regional generosity is proportionate and entrusted to named representatives. Crisis aid needs transparent handling.'},
  {heading:'5. Herod and Public Power',body:'Herod kills James, imprisons Peter, accepts praise, and dies under judgment. Political leaders are not divine. The church prays and refuses ruler worship.'},
  {heading:'6. Sent by the Spirit',body:'Antioch’s prophets and teachers worship, fast, hear the Spirit, and send Barnabas and Saul. Mission belongs to a praying community, not a lone celebrity entrepreneur.'}
 ]
},
{
 number:6,
 title:'Grace Without Unnecessary Barriers',
 scripture:'Acts 14:1–16:40; Amos 9:11–12; Galatians 2:1–10',
 question:'How does the church preserve gospel truth while refusing unnecessary cultural barriers for Gentile believers?',
 truth:'Salvation is by the grace of Jesus, and Spirit-led discernment welcomes Gentiles without imposing ethnic conversion while calling everyone to holy love.',
 goal:'To learn communal discernment, handle doctrinal conflict openly, and distinguish gospel essentials from cultural preferences.',
 teaching:[
  {heading:'1. Mission Includes Suffering',body:'Paul and Barnabas face welcome, opposition, stoning, and return to strengthen churches. Hardship does not prove failure, but it should never be manufactured or romanticized.'},
  {heading:'2. Appointing Elders',body:'Local leaders are appointed with prayer and fasting. Rapid growth still requires accountable, plural leadership rather than permanent dependence on traveling ministers.'},
  {heading:'3. The Circumcision Dispute',body:'Some teachers require Gentile circumcision for salvation. The issue threatens grace and belonging, so leaders gather rather than suppress debate.'},
  {heading:'4. Testimony, Scripture, and Discussion',body:'Peter recounts the Spirit’s gift, Barnabas and Paul report signs, and James interprets Scripture. Healthy councils listen to evidence, Scripture, and affected communities.'},
  {heading:'5. No Unnecessary Yoke',body:'The decision refuses ethnic conversion as a salvation requirement and gives practical instructions for fellowship and holiness. It is not permission for antisemitism or contempt toward Torah-observant Jews.'},
  {heading:'6. Paul and Barnabas Disagree',body:'A sharp dispute over Mark leads to separate teams. Scripture does not hide missionary conflict. Separation can occur without declaring the other person outside God’s work.'}
 ]
},
{
 number:7,
 title:'The Gospel in the Public Square',
 scripture:'Acts 17:1–20:38; 1 Thessalonians 2:1–12; Micah 6:8',
 question:'How can Christians witness thoughtfully in synagogues, marketplaces, workplaces, and public controversy?',
 truth:'Faithful witness reasons from Scripture, listens to culture, confronts idolatry, protects public integrity, and serves people without coveting their resources.',
 goal:'To develop context-aware witness, resist manipulation, and practice accountable ministry amid economic and ideological conflict.',
 teaching:[
  {heading:'1. Reasoning in Synagogues',body:'Paul explains from Israel’s Scriptures that Messiah suffered and rose. Opposition described in Acts must not become collective blame against Jewish people; many Jewish people believe and lead.'},
  {heading:'2. Bereans Examine Scripture',body:'The Bereans receive eagerly and test daily. Questions and verification are marks of nobility, not rebellion against leadership.'},
  {heading:'3. Athens and Cultural Listening',body:'Paul observes altars, quotes poets, affirms glimpses of truth, and confronts idolatry. Contextual witness neither flatters everything nor insults the audience.'},
  {heading:'4. Corinth and Shared Work',body:'Paul works with Priscilla and Aquila while teaching. Tentmaking can support mission, though churches should still compensate labor fairly when able.'},
  {heading:'5. Ephesus and Economic Conflict',body:'The gospel threatens an idol-related trade, and merchants stir a crowd. Moral change can affect economies. Christians should confront exploitation without mob behavior.'},
  {heading:'6. Paul’s Farewell',body:'Paul reminds elders of tears, teaching, work, and refusal to covet. He warns that destructive leaders can arise from within. Oversight must protect the flock and leaders themselves from unaccountable power.'}
 ]
},
{
 number:8,
 title:'Witness From Jerusalem to Rome',
 scripture:'Acts 21:1–28:31; Isaiah 6:8–10; Philippians 1:12–18',
 question:'How does God sustain witness through arrest, legal defense, danger, disagreement, shipwreck, and delayed outcomes?',
 truth:'The risen Jesus advances His witness through courageous testimony, lawful rights, providential protection, hospitality, and endurance even when servants remain constrained.',
 goal:'To conclude with resilient mission that uses public justice wisely and trusts God when the path includes suffering and delay.',
 teaching:[
  {heading:'1. Warnings and the Journey',body:'Believers warn Paul about suffering in Jerusalem, yet he continues. Interpreters differ on whether every step was ideal. Calling and counsel should be weighed humbly, not used to shame cautious voices.'},
  {heading:'2. Rumor and Arrest',body:'False assumptions and crowd violence lead to Paul’s arrest. Public accusation is not proof. Authorities should investigate rather than appease mobs.'},
  {heading:'3. Roman Citizenship',body:'Paul invokes citizenship, legal hearings, and appeal to Caesar. Using lawful rights is compatible with faith and can protect witness and others from abuse.'},
  {heading:'4. Testimony Before Rulers',body:'Paul tells his story to councils, governors, and a king, adapting emphasis without changing the gospel. He refuses bribes and exposes delayed justice.'},
  {heading:'5. Storm and Shipwreck',body:'Paul receives assurance, gives practical instructions, encourages food, and protects prisoners from execution. Trust in God works through preparation, expertise, and humane action.'},
  {heading:'6. The Gospel Unhindered',body:'In Rome, Paul lives under guard, welcomes visitors, teaches Scripture, and proclaims Jesus. Acts ends without resolving Paul’s case because the mission continues beyond one servant’s circumstances.'}
 ]
}
];

acLessons.forEach(function(l){
 l.opening=acOpening;
 l.context=acContext;
 l.questions=acQuestions.slice();
 l.examination=acExamination;
 l.challenge=acPractice;
 l.caution=acLeader;
 l.prayer=acPrayer(l.truth);
 l.supporting=[];
});

window.NLDG_BOOK_STUDY={
 slug:'acts-study',
 book:'Acts',
 title:'Acts: Spirit-Empowered Witness From Jerusalem to Rome',
 description:'An eight-lesson study of the Holy Spirit, witness, community, inclusion, mission, justice, and endurance',
 theme:'The Holy Spirit empowers witnesses to proclaim Jesus, form generous communities, cross ethnic and social boundaries, discern together, and carry the gospel toward the nations.',
 audience:'Adults, groups, classes, and ministry teams',
 purpose:'To follow the gospel from Jerusalem to Rome and form churches marked by prayer, generosity, shared leadership, courageous witness, inclusion, discernment, and public integrity.',
 background:'',
 lessons:acLessons
};
