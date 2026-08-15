const roOpening='Begin with prayer for humility, courage, and careful listening. Read the main passage aloud and allow silence before interpretation. Invite observations first. Participants may pass on any question, and no one should be pressured to disclose trauma, conflict, doubt, or private circumstances. The goal is faithful formation under Scripture.';
const roContext='Read within the book’s historical setting, literary form, covenant location, argument, and whole-Bible witness. Notice repeated words, quotations, contrasts, and narrative movement. Distinguish what the passage explicitly teaches from inference and modern application. Difficult texts deserve honesty rather than defensiveness or simplistic transfer.';
const roQuestions=[
 'What part of the passage is most difficult or important to understand?',
 'What does this text reveal about God’s character, promise, or gospel?',
 'What human pride, fear, injustice, or false security does it confront?',
 'Which interpretive distinction protects this passage from misuse?',
 'How could this truth bring hope without minimizing pain or responsibility?',
 'Where is God calling for repentance, courage, humility, or mercy?',
 'What specific practice can embody this lesson this week?',
 'How can the group support faithfulness without pressure, superiority, or fear?'
];
const roExamination='Come honestly before God. Where am I tempted by self-righteousness, fear, control, nationalism, contempt, compromise, or confidence in status? What gift of grace must I receive? What loyalty, habit, relationship, or use of influence needs repentance, courage, mercy, or a wiser boundary?';
const roPractice='Choose one concrete practice: reread the passage on three days; write a prayer of confession or gratitude; learn from a trusted perspective; examine one political, ethnic, or religious assumption; welcome someone across a difference; repair a truthful conversation; or serve without recognition. Keep it safe, specific, and measurable.';
const roLeader='Do not use conquest, divine sovereignty, judgment, authority, election, submission, conscience, forgiveness, or unity to justify violence, nationalism, racism, antisemitism, fatalism, abuse, or silencing. Never identify modern opponents as Canaanites. Where danger, exploitation, severe distress, or criminal conduct is present, prioritize safety, qualified care, fair process, and applicable reporting responsibilities.';
const roPrayer=(truth)=>'Covenant-keeping and merciful God, '+truth+' Remove our boasting, deepen our courage, and form Christ in us. Teach us to remember Your grace, love our neighbors, resist evil without becoming evil, and live together in the hope of Your kingdom. Amen.';

const roLessons=[
{
 number:1,
 title:'The Gospel and the Human Condition',
 scripture:'Romans 1:1–32; Habakkuk 2:4; Psalm 19:1–6',
 question:'What does the gospel reveal about God’s righteousness, human worship, and the consequences of rejecting truth?',
 truth:'The gospel reveals God’s saving righteousness, while human sin exchanges the Creator’s glory for idols and distorts every area of life.',
 goal:'To center the gospel before examining sin, recognize idolatry beneath human disorder, and avoid using Romans 1 as a weapon against selected groups.',
 teaching:[
  {heading:'1. Set Apart for the Gospel',body:'Paul begins with God’s promised good news concerning His Son, descended from David and declared in power through resurrection. The gospel is announcement before it is moral instruction.'},
  {heading:'2. Not Ashamed',body:'The gospel is God’s power for salvation to everyone who believes, Jew first and also Greek. Its order honors Israel’s story while opening the same saving promise to the nations.'},
  {heading:'3. The Righteous Live by Faith',body:'God’s righteousness is revealed from faith to faith. Salvation rests in God’s faithful action received by trust, not in ethnic status, achievement, or moral superiority.'},
  {heading:'4. Truth Suppressed Through Idolatry',body:'Creation witnesses to God, yet people exchange His glory for images. Idolatry is the foundational disorder: created things are asked to define worth, security, pleasure, and power.'},
  {heading:'5. Dishonorable Desires and Actions',body:'Paul describes disordered worship expressing itself through desires and behavior, including sexual sin. Read the passage within his universal indictment, not as permission for contempt, jokes, harassment, or ignoring heterosexual sin and other forms of idolatry.'},
  {heading:'6. A Catalog That Includes Everyone',body:'Envy, greed, deceit, gossip, arrogance, disobedience, and lack of mercy stand in the same account. Chapter 2 immediately confronts the person who judges. The proper response is repentance, not superiority.'}
 ]
},
{
 number:2,
 title:'No One Can Boast',
 scripture:'Romans 2:1–3:20; Deuteronomy 10:12–22; James 2:8–13',
 question:'Why are moral knowledge, religious identity, and judgment of others unable to make anyone righteous before God?',
 truth:'God judges impartially, exposes hypocrisy, and places every person under sin so no one can boast before Him.',
 goal:'To confront self-righteous judgment, honor God’s impartiality, and prepare for the gospel of justification.',
 teaching:[
  {heading:'1. You Who Judge',body:'The moral critic may condemn sins while practicing the same underlying rebellion. Accurate judgment of an act does not make the judge righteous. Self-examination must precede superiority.'},
  {heading:'2. Kindness Leads to Repentance',body:'God’s patience is not approval. His kindness creates space to turn. Religious communities should pair clear truth with mercy rather than humiliation.'},
  {heading:'3. Impartial Judgment',body:'God does not show favoritism. Privilege, heritage, knowledge, and office increase responsibility rather than creating exemption.'},
  {heading:'4. Hearers and Doers',body:'Possessing the law is not the same as obeying it. Paul also acknowledges conscience among Gentiles. No group can reduce God’s work to its own labels.'},
  {heading:'5. Circumcision of the Heart',body:'External covenant signs without obedience become empty. This critique occurs within a Jewish scriptural argument and must never fuel contempt toward Jewish bodies, customs, or people.'},
  {heading:'6. Every Mouth Silenced',body:'Paul’s chain of Scripture places all under sin. The law gives knowledge of sin but cannot provide a platform for boasting. The courtroom is ready for grace.'}
 ]
},
{
 number:3,
 title:'Justified by Faith',
 scripture:'Romans 3:21–5:21; Genesis 15:1–6; Romans 5:1–11',
 question:'How can God remain just while declaring ungodly people righteous through faith?',
 truth:'God justifies sinners by grace through faith in Jesus Christ, creating peace, hope, and a new humanity under grace.',
 goal:'To understand justification, exclude boasting, and receive peace with God that endures through suffering.',
 teaching:[
  {heading:'1. But Now',body:'God’s righteousness is manifested apart from law, though witnessed by Law and Prophets. The gospel is new in fulfillment and continuous with Israel’s Scriptures.'},
  {heading:'2. Grace Through Christ',body:'All have sinned and are justified freely through redemption in Christ. Faith receives; it does not become a superior work. The cross displays both justice and mercy.'},
  {heading:'3. Boasting Excluded',body:'One God justifies circumcised and uncircumcised through faith. Grace creates one family without erasing cultural identity or permitting Gentile arrogance.'},
  {heading:'4. Abraham Before Circumcision',body:'Abraham is counted righteous by faith before receiving the sign, making him father of believing Jews and Gentiles. Promise rests on grace.'},
  {heading:'5. Peace and Hope',body:'Justified believers have peace with God and access to grace. Suffering can produce endurance through God’s love, but this does not mean every suffering is sent as a lesson or should be passively endured.'},
  {heading:'6. Adam and Christ',body:'Adam’s trespass brings condemnation and death; Christ’s obedience brings justification and life. Grace overflows beyond sin’s reach and establishes a new humanity.'}
 ]
},
{
 number:4,
 title:'United With Christ',
 scripture:'Romans 6:1–7:25; Galatians 2:19–21; Colossians 3:1–10',
 question:'How does union with Christ change our relationship to sin, law, desire, and obedience?',
 truth:'Those united with Christ have died to sin’s rule and risen to new life, yet they must present themselves to God and depend on grace in the ongoing struggle.',
 goal:'To reject both legalism and permission-giving grace and to practice embodied obedience from a new identity.',
 teaching:[
  {heading:'1. Grace Is Not Permission',body:'Paul rejects continuing in sin so grace may increase. Grace transfers believers into Christ’s death and resurrection. New identity creates a new direction.'},
  {heading:'2. Baptized Into Christ',body:'Baptism portrays union, burial, and resurrection. The old humanity’s rule is broken. This does not imply instant perfection, but sin is no longer the rightful master.'},
  {heading:'3. Present Your Members',body:'Bodies become instruments of righteousness. Holiness involves habits, sexuality, speech, work, money, and power. The body is neither shameful nor disposable.'},
  {heading:'4. Slavery Metaphors',body:'Paul uses slavery to describe competing masters and decisive allegiance. The metaphor communicates bondage and freedom but must not minimize the historical and present evil of human slavery.'},
  {heading:'5. Released From the Law’s Condemnation',body:'The marriage illustration shows a changed covenant relationship through death with Christ. God’s law is holy; sin exploits the command. The problem is not Jewishness or Torah as evil.'},
  {heading:'6. The Divided Cry',body:'Romans 7 portrays intense conflict; interpreters differ on the speaker’s precise state. The shared conclusion is human inability and the need for deliverance through Jesus Christ, leading into life in the Spirit.'}
 ]
},
{
 number:5,
 title:'Life in the Spirit',
 scripture:'Romans 8:1–39; Ezekiel 36:25–27; Galatians 4:4–7',
 question:'What security, freedom, and hope belong to those who live in the Spirit?',
 truth:'In Christ there is no condemnation; the Spirit gives life, assures adoption, helps in weakness, and anchors hope in God’s inseparable love.',
 goal:'To replace condemnation with Spirit-led holiness and sustain prayerful hope amid suffering, uncertainty, and weakness.',
 teaching:[
  {heading:'1. No Condemnation',body:'The verdict over those in Christ is no condemnation. Conviction names sin and leads toward God; condemnation declares hopeless identity and drives hiding.'},
  {heading:'2. Mind Set on the Spirit',body:'The Spirit redirects desire and allegiance. Spirit-led life is not disembodied emotion; it produces obedience, life, peace, and resistance to sin.'},
  {heading:'3. Adopted Children',body:'Believers receive the Spirit of adoption and cry, “Abba.” God is not an abusive parent. Human experiences may complicate the metaphor, so communities should teach it with care and point to God’s trustworthy character.'},
  {heading:'4. Creation Groans',body:'Creation, believers, and the Spirit groan. Hope does not deny pain. The Spirit helps when words fail, and Christian community can remain present without forcing explanations.'},
  {heading:'5. All Things Work Together',body:'God works in all things toward conformity to Christ and final glory. This verse must not be used to call evil good, blame sufferers, or silence lament.'},
  {heading:'6. Nothing Can Separate',body:'Paul names forces of suffering and threat, then declares them unable to sever God’s love in Christ. Security rests in God’s action, not our emotional steadiness.'}
 ]
},
{
 number:6,
 title:'Mercy for Israel and the Nations',
 scripture:'Romans 9:1–11:36; Genesis 12:1–3; Isaiah 59:20–21',
 question:'How does God’s faithfulness to Israel display His sovereign mercy and warn Gentile believers against pride?',
 truth:'God remains faithful to His promises, displays mercy freely, and forms a people through faith while warning the nations never to boast over Israel.',
 goal:'To read Romans 9–11 within Paul’s grief and mission, hold sovereignty and responsibility together, and reject antisemitism and replacement pride.',
 teaching:[
  {heading:'1. Paul’s Grief',body:'Paul begins with anguish for his fellow Israelites and honors their covenants, worship, promises, and Messiah. Theology about Israel must retain this love, not turn Jewish people into an abstract problem.'},
  {heading:'2. God’s Purpose and Mercy',body:'Paul traces God’s freedom in election through Israel’s story. Mercy is never owed or controlled. These chapters have generated differing Christian models; humility is required.'},
  {heading:'3. Human Responsibility',body:'Paul also speaks of pursuing righteousness wrongly, stumbling over Christ, confessing, believing, hearing, and preaching. Divine sovereignty does not erase meaningful response or mission.'},
  {heading:'4. A Remnant by Grace',body:'Paul himself is evidence that God has not rejected His people. A remnant exists by grace, excluding boasting from both Jews and Gentiles.'},
  {heading:'5. Grafted Branches',body:'Gentile believers are wild branches grafted into Israel’s olive tree. They do not support the root and must not become proud. Antisemitism directly contradicts Paul’s warning.'},
  {heading:'6. God’s Faithfulness and Mystery',body:'Paul anticipates mercy and ends in worship. Interpretive details about “all Israel” differ, but the conclusion is wonder before God’s unsearchable wisdom, not speculation or political exploitation.'}
 ]
},
{
 number:7,
 title:'A Living Sacrifice',
 scripture:'Romans 12:1–13:14; Micah 6:8; Matthew 5:43–48',
 question:'How does God’s mercy reshape bodies, gifts, relationships, enemies, and public life?',
 truth:'God’s mercy forms living sacrifices who think humbly, serve through diverse gifts, love sincerely, overcome evil with good, and honor public responsibility.',
 goal:'To translate gospel doctrine into embodied worship, accountable community, enemy love, and wise civic conduct.',
 teaching:[
  {heading:'1. Mercy Before Sacrifice',body:'The appeal rests on God’s mercies. Bodies become living sacrifices through daily obedience. Worship includes ordinary work, relationships, and choices.'},
  {heading:'2. Renewed Minds',body:'Believers resist conformity and learn discernment. Transformation is not isolation from culture but renewed evaluation under God’s truth.'},
  {heading:'3. One Body, Many Gifts',body:'No member should think too highly or dismiss their gift. Gifts are exercised proportionately, diligently, generously, and cheerfully for the body.'},
  {heading:'4. Genuine Love',body:'Love abhors evil and clings to good. It shows honor, hospitality, patience, generosity, and shared emotion. Love is neither permissiveness nor performance.'},
  {heading:'5. Overcome Evil With Good',body:'Believers refuse private vengeance, feed enemies, and leave final judgment to God. This does not forbid protection, courts, reporting, or wise boundaries.'},
  {heading:'6. Governing Authorities',body:'Romans 13 describes authority as accountable service for good, not unlimited obedience. The whole biblical witness permits resistance when rulers command evil. Paying obligations and loving neighbors remain central.'}
 ]
},
{
 number:8,
 title:'Welcome One Another',
 scripture:'Romans 14:1–16:27; Isaiah 11:1–10; John 17:20–23',
 question:'How can believers disagree faithfully, protect conscience, pursue mission, and welcome one another as Christ has welcomed them?',
 truth:'Christ-centered community refuses contempt, limits freedom through love, pursues peace, and welcomes across disputable practices for God’s glory.',
 goal:'To distinguish disputable matters from core truth and harm, practice conscience-sensitive freedom, and build mission-shaped unity.',
 teaching:[
  {heading:'1. Disputable Matters',body:'Food and calendar observance divided believers. Paul treats both sides as servants of the Lord. Not every disagreement is a salvation issue.'},
  {heading:'2. No Contempt or Judgment',body:'The strong may despise the weak, and the weak may judge the strong. Each will answer to God. Humility does not prevent the church from addressing abuse, exploitation, or clear sin.'},
  {heading:'3. Do Not Destroy With Freedom',body:'Love voluntarily limits a practice that seriously wounds another’s conscience. Yet conscience should grow through truth; manipulative offense cannot govern everyone indefinitely.'},
  {heading:'4. The Kingdom’s Priorities',body:'God’s kingdom is righteousness, peace, and joy in the Spirit. Pursue what builds others up. Unity is moral and relational, not merely keeping meetings calm.'},
  {heading:'5. Welcome as Christ Welcomed',body:'Jesus fulfills Israel’s hope and brings Gentiles to praise God. Welcome crosses cultural boundaries without requiring people to erase their identity.'},
  {heading:'6. Partners in Mission',body:'Paul names many coworkers, including women and men in significant service, then warns against divisive teachers. Healthy mission values diverse partners, tests teaching, and remains wise about good and innocent about evil.'}
 ]
}
];

roLessons.forEach(function(l){
 l.opening=roOpening;
 l.context=roContext;
 l.questions=roQuestions.slice();
 l.examination=roExamination;
 l.challenge=roPractice;
 l.caution=roLeader;
 l.prayer=roPrayer(l.truth);
 l.supporting=[];
});

window.NLDG_BOOK_STUDY={
 slug:'romans-study',
 book:'Romans',
 title:'Romans: The Gospel, Grace, and a Transformed Family',
 description:'An eight-lesson study of the gospel, justification, new life, mercy, unity, and mission',
 theme:'God justifies sinners through faith in Jesus Christ, gives new life through the Spirit, displays mercy to Jews and Gentiles, and forms a community of sacrificial love.',
 audience:'Adults, groups, classes, and ministry teams',
 purpose:'To follow Paul’s argument as a whole, deepen assurance in Christ, resist boasting and antisemitism, and embody the gospel through holiness, mercy, justice, welcome, and mission.',
 background:'',
 lessons:roLessons
};