const scOpening='Begin with prayer for wisdom, honesty, and love. Read the main passage aloud and allow a quiet moment before discussion. Invite observation before interpretation. Participants may pass on any question, and no one should be pressured to share private experiences. The aim is transformation under Scripture, not performance or debate.';
const scContext='Attend to the book’s argument, historical setting, literary form, repeated words, emotional movement, and immediate context. Distinguish what the text explicitly teaches from inference and application. Supporting Scriptures clarify the whole-Bible witness without erasing the distinctive voice of this passage.';
const scQuestions=[
 'What stands out in the passage, and what question does it raise?',
 'What does this text reveal about God, human limits, or faithful discipleship?',
 'Which cultural promise or ministry habit does the passage challenge?',
 'What distinction in this lesson prevents misuse of Scripture?',
 'How might this truth comfort someone who is tired, grieving, or overlooked?',
 'Where do you sense invitation to repentance, courage, or gratitude?',
 'What safe and concrete action could embody this teaching this week?',
 'How can this group support one another without pressure or shallow answers?'
];
const scExamination='Sit quietly before God. Where am I striving for control, protecting an image, avoiding grief, misusing influence, or asking a created gift to carry ultimate meaning? What truth must I receive, what wrong must I name, and what faithful response is the Spirit inviting? Refuse both self-condemnation and self-excuse.';
const scPractice='Choose one specific practice: reread the main passage three times; write an honest prayer; receive an ordinary gift with gratitude; encourage someone in distress; examine a use of time, money, work, or influence; repair a truthful conversation; or strengthen a necessary boundary. Keep the practice safe, realistic, and measurable.';
const scLeader='Welcome questions and avoid forced conclusions. Do not use suffering, submission, forgiveness, generosity, weakness, or God’s sovereignty to silence people, excuse misconduct, demand money, or pressure reconciliation. Where abuse, danger, severe distress, or criminal conduct is present, prioritize safety, qualified care, and applicable reporting responsibilities. Trust and leadership access require demonstrated character.';
const scPrayer=(truth)=>'Faithful God, '+truth+' Teach us to receive Your grace, walk in truth, honor every person made in Your image, and serve without manipulation or fear. Give us wisdom for what we cannot control and courage for what obedience requires. Form the life of Jesus in us. Amen.';

const scLessons=[
{
 number:1,
 title:'Comforted to Comfort Others',
 scripture:'2 Corinthians 1:1–2:17; Psalm 34:18; Romans 12:15',
 question:'How can suffering, comfort, integrity, and forgiveness shape a trustworthy Christian community?',
 truth:'God meets us in affliction so we can comfort others, walk with integrity, and pursue restoration without denying truth or safety.',
 goal:'To receive God’s comfort, reject simplistic explanations of suffering, and practice reliable presence, honest communication, and wise forgiveness.',
 teaching:[
  {heading:'1. The Father of Mercies',body:'Paul praises God as the source of compassion and comfort in every affliction. Comfort is not merely an explanation; it is God’s sustaining presence often carried through people who listen, pray, protect, and remain.'},
  {heading:'2. Comfort Becomes Ministry',body:'Those comforted can comfort others, but shared pain does not make one person’s story identical to another’s. We offer empathy without taking over, comparing trauma, or forcing meaning before someone is ready.'},
  {heading:'3. Beyond Our Strength',body:'Paul describes despairing of life and learning dependence on God. This should never be used to romanticize crisis or tell people not to seek help. Prayer, medical care, counseling, safety planning, and community can all be instruments of God’s care.'},
  {heading:'4. Integrity in Changing Plans',body:'Paul’s travel change caused conflict, yet he appeals to a conscience shaped by grace. Trustworthy leadership communicates honestly, admits limits, and avoids pretending that every decision is a direct command from God.'},
  {heading:'5. Grief and Correction',body:'Paul’s severe letter came from anguish and love, not a desire to dominate. Correction should seek restoration, remain proportionate, and reject public humiliation. Leaders must distinguish discomfort from harm and accountability from control.'},
  {heading:'6. Forgiveness Without Naivety',body:'The community is urged to reaffirm repentant love. Restoration includes evidence of change and concern that discipline not become endless punishment. Forgiveness does not erase boundaries, consequences, safeguarding, or the time needed to rebuild trust.'}
 ]
},
{
 number:2,
 title:'Treasure in Jars of Clay',
 scripture:'2 Corinthians 3:1–4:18; Exodus 34:29–35; John 8:12',
 question:'Why does God place the treasure of the gospel in weak and ordinary people?',
 truth:'The gospel’s transforming power belongs to God, so servants can reject deception, endure hardship, and point beyond themselves to Christ.',
 goal:'To cultivate transparent ministry, dependence on the Spirit, endurance in suffering, and freedom from image-based leadership.',
 teaching:[
  {heading:'1. Letters Written by the Spirit',body:'Paul calls the believers his letter, written by the Spirit on human hearts. Ministry credibility includes transformed lives, not merely titles, platforms, or recommendations. People are not trophies; God remains the author of change.'},
  {heading:'2. Competence Comes From God',body:'Paul does not deny training or effort. He denies self-sufficiency. Competence is stewardship received from God, exercised with humility, preparation, accountability, and dependence on the Spirit.'},
  {heading:'3. Freedom and Transformation',body:'Where the Spirit is, there is freedom, and believers are transformed into Christ’s image. Freedom is not exemption from holiness or responsibility. It is liberation from condemnation and bondage for obedient life with God.'},
  {heading:'4. Renouncing Hidden Methods',body:'Paul rejects secret shame, cunning, and distortion of Scripture. Results never justify manipulation. Honest ministry presents truth openly, welcomes questions, and refuses emotional pressure, fabricated testimony, or financial secrecy.'},
  {heading:'5. Jars of Clay',body:'Fragile vessels carry extraordinary treasure so the power is clearly God’s. Weakness can reveal dependence, but abuse, neglect, incompetence, and preventable harm must not be excused as spirituality.'},
  {heading:'6. Outer Loss and Inner Renewal',body:'Paul’s affliction is real, yet resurrection hope changes its horizon. Calling suffering light and momentary is his testimony, not permission to minimize another person’s pain. We remain present while fixing hope on eternal glory.'}
 ]
},
{
 number:3,
 title:'The Ministry of Reconciliation',
 scripture:'2 Corinthians 5:1–21; Romans 5:6–11; Ephesians 2:11–22',
 question:'How does reconciliation with God reshape identity, relationships, and mission?',
 truth:'In Christ, God makes people new, reconciles them to Himself, and entrusts them with a truthful ministry of reconciliation.',
 goal:'To ground Christian identity in Christ, understand reconciliation as God’s work, and practice peacemaking that includes truth, repentance, and justice.',
 teaching:[
  {heading:'1. Longing for Resurrection',body:'Paul acknowledges mortality and groaning while hoping for resurrection life. Christian hope does not despise the body; it trusts God to redeem embodied life. Grief and hope can coexist.'},
  {heading:'2. Walking by Faith',body:'Faith is not denial of evidence or refusal of wise planning. It is loyal trust in Christ when sight is incomplete. Because all appear before Christ, present choices carry moral weight.'},
  {heading:'3. The Love of Christ Controls Us',body:'Christ’s self-giving love redirects ambition. Ministry is no longer centered on protecting status. Those who live because of Christ learn to live for Him and for the good of others.'},
  {heading:'4. A New Creation',body:'Anyone in Christ belongs to God’s new creation. This identity offers forgiveness and a new direction without pretending consequences vanish. Transformation is both gift and ongoing formation.'},
  {heading:'5. God Initiates Reconciliation',body:'God reconciles enemies through Christ, not counting sins against them. The church announces this grace; it does not manufacture peace through denial. Reconciliation names the real breach and depends on God’s costly action.'},
  {heading:'6. Ambassadors With Integrity',body:'Ambassadors represent Christ’s appeal. They must not manipulate, coerce, or confuse their preferences with God’s voice. In human conflicts, repentance, restitution, safety, and demonstrated change may be necessary before relational trust can grow.'}
 ]
},
{
 number:4,
 title:'Holiness, Grief, and Restored Trust',
 scripture:'2 Corinthians 6:1–7:16; Psalm 51:10–17; James 4:7–10',
 question:'How do holiness, godly grief, boundaries, and encouragement work together in restored relationships?',
 truth:'Godly grief produces honest repentance and changed direction, while holy love joins openhearted affection with wise boundaries and accountable trust.',
 goal:'To distinguish repentance from shame, holiness from isolation, and reconciliation from pressured access.',
 teaching:[
  {heading:'1. Do Not Receive Grace in Vain',body:'Grace is opposed to earning, not to transformation. Paul’s appeal calls believers to respond now. Urgency should invite repentance, never override consent or become a tool of spiritual pressure.'},
  {heading:'2. Commending Ministry Through Character',body:'Paul names endurance, purity, knowledge, patience, kindness, and truthful speech. Christian credibility grows through tested character, not charisma alone. Hardship itself does not prove a leader is right.'},
  {heading:'3. Open Hearts',body:'Paul asks for mutual affection rather than manipulation. Healthy community makes room for honest emotion and direct speech. Openness is invited, not demanded; people retain the right to wise privacy and boundaries.'},
  {heading:'4. Unequal Yoking and Holiness',body:'The call to separation concerns covenant loyalty and idolatry, not permission for racial prejudice, contempt toward unbelievers, or isolation from neighbors. Holiness means belonging fully to God while loving people truthfully.'},
  {heading:'5. Godly Grief Versus Shame',body:'Godly grief faces specific wrong, receives truth, and produces change. Worldly grief collapses into self-protection, despair, or concern only about consequences. Repentance bears fruit through honesty, restitution, and different behavior.'},
  {heading:'6. Trust Rebuilt Over Time',body:'Paul rejoices in the Corinthians’ response. Encouragement should recognize real growth without ignoring safeguarding. Forgiveness may be immediate as a posture, while trust, access, and leadership responsibility are rebuilt gradually through consistent fruit.'}
 ]
},
{
 number:5,
 title:'The Grace of Generosity',
 scripture:'2 Corinthians 8:1–9:15; Exodus 16:13–18; Mark 12:41–44',
 question:'What makes Christian generosity willing, equitable, transparent, and joyful?',
 truth:'Gospel generosity flows from Christ’s grace and is practiced freely, proportionately, transparently, and for the genuine good of others.',
 goal:'To replace pressure-driven giving with grace-shaped stewardship, trustworthy administration, and concern for equity.',
 teaching:[
  {heading:'1. Grace in Severe Trial',body:'The Macedonians give amid affliction and poverty. Their example honors willing generosity; it must never be used to extract money from vulnerable people. Leaders should protect basic needs and refuse shame-based appeals.'},
  {heading:'2. Christ Is the Pattern',body:'Jesus became poor for our sake, giving Himself to bring salvation. His grace motivates generosity but does not turn giving into a transaction that purchases favor, healing, influence, or guaranteed wealth.'},
  {heading:'3. According to What One Has',body:'Paul says willingness is accepted according to available means, not what a person lacks. Equal dollar amounts are not required. Faithful giving considers responsibilities, debt, dependents, health, and honest capacity.'},
  {heading:'4. A Concern for Fairness',body:'The goal is that another’s relief not create crushing hardship for the giver, but that needs be met through shared abundance. Generosity seeks mutual care rather than dependence, superiority, or control.'},
  {heading:'5. Transparent Administration',body:'Paul sends trusted representatives so no one can blame the ministry’s handling of the gift. Churches need clear records, multiple accountable people, honest reporting, and safeguards against conflicts of interest.'},
  {heading:'6. Cheerful, Not Compelled',body:'Each person decides without reluctance or compulsion. God supplies seed for sowing so generosity produces thanksgiving and service. Appeals should inform and invite, never threaten spiritual loss or promise a financial formula.'}
 ]
},
{
 number:6,
 title:'Power Made Perfect in Weakness',
 scripture:'2 Corinthians 10:1–13:14; Mark 10:42–45; Galatians 6:1–5',
 question:'How does Christ redefine strength, authority, weakness, and leadership?',
 truth:'Christ-shaped authority builds people up through truth and service, while God’s power is displayed through humble dependence rather than domination or self-promotion.',
 goal:'To test spiritual leadership, reject coercive power, embrace dependent strength, and practice restoration with accountability.',
 teaching:[
  {heading:'1. Weapons of Divine Power',body:'Paul’s warfare is not physical violence or domination. Gospel ministry confronts false arguments and proud resistance through truth, prayer, holiness, and obedience to Christ. People are not enemies to be crushed.'},
  {heading:'2. Authority to Build Up',body:'Paul says his authority is for building up, not tearing down. Spiritual authority is limited, accountable, and cruciform. It never grants unrestricted access to bodies, money, decisions, secrets, or loyalty.'},
  {heading:'3. The Folly of Comparison',body:'False apostles boast through appearance, credentials, and self-measurement. Comparison feeds performance. Faithful leaders evaluate fruit, doctrine, character, treatment of the vulnerable, financial integrity, and willingness to be corrected.'},
  {heading:'4. A Thorn and Sufficient Grace',body:'Paul’s unanswered prayer teaches dependence. We should not claim certainty about the thorn or use the passage to discourage treatment and practical help. Grace can sustain while believers continue seeking healing and support.'},
  {heading:'5. Weakness Is Not Abuse',body:'Paul boasts in limitations that make Christ’s power visible, not in sin or harm inflicted on others. Leaders cannot label criticism, misconduct, or lack of preparation as weakness to avoid accountability.'},
  {heading:'6. Examine Yourselves',body:'The letter closes with self-examination, restoration, peace, and blessing. Biblical testing is not anxious perfectionism. It asks whether Christ’s life is bearing fruit and whether correction leads toward truth, repair, maturity, and loving community.'}
 ]
}
];

scLessons.forEach(function(l){
 l.opening=scOpening;
 l.context=scContext;
 l.questions=scQuestions.slice();
 l.examination=scExamination;
 l.practice=scPractice;
 l.caution=scLeader;
 l.prayer=scPrayer(l.truth);
 l.supporting=[];
});

window.NLDG_BOOK_STUDY={
 slug:'second-corinthians-study',
 book:'2 Corinthians',
 title:'2 Corinthians: Comfort, Reconciliation, Generosity, and Strength in Weakness',
 description:'A six-lesson study of comfort, integrity, reconciliation, holiness, generosity, and weakness',
 theme:'The power of Christ is displayed through truthful love, reconciled relationships, generous grace, accountable leadership, and strength made perfect in weakness.',
 audience:'Adults, groups, classes, and ministry teams',
 purpose:'To form resilient disciples and trustworthy leaders who reject manipulation, embrace reconciliation, steward influence carefully, and depend on God rather than image.',
 background:'',
 lessons:scLessons
};
