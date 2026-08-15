const fcOpening='Begin with prayer for wisdom, honesty, and love. Read the main passage aloud and allow a quiet moment before discussion. Invite observations before conclusions. Participants may pass on any question, and no one should be pressured to disclose private experiences. The goal is faithful formation under Scripture, not winning an argument.';
const fcContext='Read the passage within its literary setting, historical circumstances, and the argument of the whole book. Notice repeated words, contrasts, poetry, rhetoric, and cultural details. Distinguish a general wisdom principle from a universal promise, and distinguish explicit teaching from inference and modern application.';
const fcQuestions=[
 'What word, contrast, or situation stands out in the passage?',
 'What does this text reveal about God, Christ, wisdom, or the church?',
 'What false promise, misuse of power, or destructive habit does it expose?',
 'Which distinction in the lesson protects the passage from misuse?',
 'How might this truth comfort someone who has been shamed, overlooked, or burdened?',
 'Where do you need repentance, courage, patience, or teachability?',
 'What specific practice could embody this teaching this week?',
 'How can the group support growth without pressure or control?'
];
const fcExamination='Come honestly before God. Where am I tempted by pride, control, careless speech, distorted desire, comparison, secrecy, or self-justification? What wisdom must I receive? What relationship, habit, or use of influence needs repentance, a boundary, repair, or a more loving practice?';
const fcPractice='Choose one concrete practice: reread the passage on three days; seek wise counsel; pause before speaking; review a financial or work habit; encourage an overlooked person; repair a truthful conversation; establish a healthy boundary; or serve through a spiritual gift. Keep it safe, specific, and measurable.';
const fcLeader='Do not use wisdom sayings, discipline, sexuality, marriage, singleness, gender, conscience, submission, forgiveness, unity, or spiritual gifts to shame people, demand loyalty, excuse abuse, conceal crime, or pressure unsafe reconciliation. Where danger, exploitation, severe distress, or criminal conduct is present, prioritize safety, qualified care, transparent process, and applicable reporting responsibilities.';
const fcPrayer=(truth)=>'God of truth and grace, '+truth+' Make us teachable, holy, just, and loving. Guard our words, bodies, relationships, resources, and influence. Keep Christ at the center, give honor to every member, and make our daily choices reflect resurrection hope. Amen.';

const fcLessons=[
{
 number:1,
 title:'Christ, Not Celebrity Leaders',
 scripture:'1 Corinthians 1:1–4:21; Jeremiah 9:23–24; Mark 10:42–45',
 question:'How does the cross confront division, boasting, and celebrity-centered leadership?',
 truth:'God’s wisdom is revealed in the crucified Christ, leaving no room for factional pride or leaders who make disciples dependent on themselves.',
 goal:'To center identity on Christ, evaluate leadership by cruciform character, and replace comparison with faithful service.',
 teaching:[
  {heading:'1. Called Saints With Problems',body:'Paul begins with grace and identity before correction. The church belongs to God. Naming grace does not minimize sin; it establishes the basis for repentance.'},
  {heading:'2. Christ Is Not Divided',body:'Believers had formed factions around teachers. Gratitude for leaders becomes idolatrous when loyalty to a personality outranks truth, conscience, or unity in Christ.'},
  {heading:'3. The Word of the Cross',body:'Crucified Messiah appears foolish to status-seeking culture, yet reveals God’s power. Ministry shaped by the cross rejects manipulation and self-exaltation.'},
  {heading:'4. God Chooses the Overlooked',body:'God’s calling dismantles boasting. This does not romanticize poverty or lack of education. It means status cannot purchase spiritual worth.'},
  {heading:'5. Servants, Not Owners',body:'Paul and Apollos plant and water; God gives growth. Leaders are accountable stewards, not owners of people, ministries, or outcomes.'},
  {heading:'6. Test Leadership by the Cross',body:'Apostolic ministry includes humility, sacrifice, truth, and parental care. Hardship alone does not prove authority. Character, doctrine, accountability, and treatment of vulnerable people matter.'}
 ]
},
{
 number:2,
 title:'Holiness, Bodies, and Belonging',
 scripture:'1 Corinthians 5:1–6:20; Matthew 18:15–20; 1 Thessalonians 4:3–8',
 question:'How should a church pursue sexual holiness, accountability, justice, and restoration?',
 truth:'Because bodies belong to Christ, the church must practice holiness with truth, proportionate accountability, protection for those harmed, and hope for repentance.',
 goal:'To address serious sin without gossip, hypocrisy, victim-blaming, or coercive discipline and to honor the body as belonging to the Lord.',
 teaching:[
  {heading:'1. Grieving Serious Harm',body:'Paul confronts an openly tolerated sexual relationship. The church’s boasting reveals distorted grace. Serious misconduct should produce grief, protection, investigation, and accountable action.'},
  {heading:'2. Discipline Has a Purpose',body:'Removal from fellowship seeks to confront destructive persistence and protect the body. Discipline must follow fair process, accurate facts, proportion, and safeguards against retaliation.'},
  {heading:'3. Judgment Within the Community',body:'Paul distinguishes church accountability from controlling outsiders. Christians bear responsibility for professing members and leaders, while treating neighbors with dignity.'},
  {heading:'4. Disputes and Public Witness',body:'Paul criticizes believers using courts to exploit one another, not every lawful appeal. Courts and authorities may be necessary for crime, abuse, safety, or fair resolution when church processes fail.'},
  {heading:'5. The Body Is for the Lord',body:'Sexual behavior matters because bodies are members of Christ and temples of the Spirit. This truth creates dignity, not shame. Consent alone does not answer every Christian ethical question, but coercion is always contrary to love.'},
  {heading:'6. Washed and Made New',body:'Paul names past patterns and then emphasizes cleansing, sanctification, and justification. No sin creates a lower class of person. Grace offers forgiveness and transformation while consequences and boundaries may remain.'}
 ]
},
{
 number:3,
 title:'Marriage, Singleness, and Faithful Calling',
 scripture:'1 Corinthians 7:1–40; Matthew 19:10–12; Ephesians 5:21',
 question:'How can married and single believers honor God within their present calling and circumstances?',
 truth:'Marriage and singleness are both honorable gifts, and faithful relationships require mutuality, consent, wisdom, peace, and devotion to the Lord.',
 goal:'To resist romantic idolatry, coercion, and simplistic rules while honoring covenant faithfulness, single vocation, and complex pastoral realities.',
 teaching:[
  {heading:'1. Mutual Responsibility',body:'Paul uses reciprocal language for spouses’ responsibilities. Marriage does not erase bodily dignity or authorize coercion. Sexual intimacy requires mutual willingness, communication, and care.'},
  {heading:'2. Temporary Abstinence by Agreement',body:'Paul describes abstinence through mutual consent for a time, followed by reunion. One spouse does not hold unilateral spiritual authority over another’s body.'},
  {heading:'3. Singleness as Gift',body:'Paul values singleness as a meaningful calling with focused service. Single people are complete members of Christ’s body, not waiting rooms for adulthood or ministry.'},
  {heading:'4. Marriage and Divorce',body:'Paul upholds marriage while addressing separation and abandonment. These verses require pastoral care alongside the whole biblical witness. They must not trap someone in violence or forbid necessary safety.'},
  {heading:'5. Remain With God',body:'Paul’s counsel to remain in one’s calling resists status anxiety. It does not sanctify slavery or forbid lawful change. He explicitly values freedom when available.'},
  {heading:'6. Undivided Devotion',body:'Marriage brings real responsibilities; singleness offers distinct freedom. Neither state guarantees holiness. Each requires community, self-control, purpose, and dependence on grace.'}
 ]
},
{
 number:4,
 title:'Freedom Shaped by Love',
 scripture:'1 Corinthians 8:1–11:1; Romans 14:1–23; Galatians 5:13–14',
 question:'How should Christians use knowledge, rights, and freedom when choices affect another person?',
 truth:'Christian freedom is governed by love, conscience, mission, and the good of others rather than self-assertion.',
 goal:'To practice mature liberty without legalism, arrogance, manipulation, or careless harm to another conscience.',
 teaching:[
  {heading:'1. Knowledge Can Inflate',body:'Correct information without love can create pride. Mature knowledge recognizes dependence on God and uses understanding to build others up.'},
  {heading:'2. Idols Are Nothing, Effects Are Real',body:'Food does not unite us to God, yet participation can wound conscience or imply allegiance. Context matters. Freedom considers meaning, relationship, and spiritual impact.'},
  {heading:'3. The Weaker Conscience',body:'A vulnerable conscience deserves care, but this teaching should not allow controlling people to label every preference an offense and govern the whole community. Growth toward truth remains the goal.'},
  {heading:'4. Paul Limits His Rights',body:'Paul has legitimate support rights but sometimes declines them for mission. Voluntary sacrifice differs from institutions withholding fair compensation or shaming workers into exploitation.'},
  {heading:'5. Warnings From Israel',body:'Privilege and spiritual experience do not guarantee faithfulness. Temptation is common, and God provides a way to endure. This promise is not a claim that every trauma or abuse situation can be escaped without outside help.'},
  {heading:'6. Do All for God’s Glory',body:'Freedom seeks God’s honor and another’s good. Paul’s call to imitate him is limited by his imitation of Christ; no leader deserves loyalty when departing from Jesus’ way.'}
 ]
},
{
 number:5,
 title:'Worship, Communion, and Mutual Honor',
 scripture:'1 Corinthians 11:2–34; Galatians 3:26–29; James 2:1–9',
 question:'How should worship and the Lord’s Table embody mutual honor, justice, and remembrance of Christ?',
 truth:'Christian worship honors God by honoring people, rejecting class contempt, practicing self-examination, and receiving the Lord’s Table as one body.',
 goal:'To approach disputed worship practices humbly and restore Communion as a Christ-centered practice of unity and justice.',
 teaching:[
  {heading:'1. A Difficult Cultural Passage',body:'Head coverings, honor, gender, and public prayer involve ancient cultural signals and theological reasoning. Faithful Christians differ on application. Teach convictions without contempt or claims that sincere disagreement equals rebellion.'},
  {heading:'2. Women Pray and Prophesy',body:'Paul assumes women participate vocally in gathered worship. Whatever interpretation is taken, women’s Spirit-enabled presence and dignity must not be erased.'},
  {heading:'3. Mutual Dependence in the Lord',body:'Paul states that woman and man are not independent and all things come from God. Gender teaching cannot justify domination, abuse, or spiritual inferiority.'},
  {heading:'4. Division at the Table',body:'Wealthier members eat abundantly while poorer members are humiliated. The gathering contradicts the gospel when access and honor follow class.'},
  {heading:'5. Discerning the Body',body:'Self-examination includes relationship to Christ’s body, not private introspection alone. Communion calls believers to repentance from contempt, exploitation, and division.'},
  {heading:'6. Practicing the Supper Safely',body:'The Table announces Christ’s death and coming. Churches should offer clear guidance, accessibility, and pastoral care without using Communion denial as arbitrary control or public humiliation.'}
 ]
},
{
 number:6,
 title:'Gifts of One Spirit',
 scripture:'1 Corinthians 12:1–31; Romans 12:3–8; 1 Peter 4:10–11',
 question:'How does the Spirit create unity through diverse gifts and mutually dependent members?',
 truth:'The Spirit gives varied gifts for the common good, and every member of Christ’s body deserves honor, care, and opportunity to serve.',
 goal:'To discover and steward gifts without hierarchy, comparison, platform obsession, or neglect of less visible members.',
 teaching:[
  {heading:'1. Jesus Is Lord',body:'Spirituality is tested first by allegiance to Jesus, not dramatic experience. Gifts never outrank Christ’s character or apostolic truth.'},
  {heading:'2. Varieties, Same Spirit',body:'Different gifts, services, and activities come from the one God. Diversity is designed, not a problem to eliminate. No single gift is the universal mark of spiritual maturity.'},
  {heading:'3. For the Common Good',body:'A gift is entrusted for service. It is not personal property or proof of superiority. Communities should evaluate fruit, accountability, and whether people are being built up.'},
  {heading:'4. One Body Through the Spirit',body:'Baptism into one body crosses ethnic and social divisions. Unity does not erase identity or permit injustice. It creates shared belonging and responsibility.'},
  {heading:'5. The Members That Seem Weaker',body:'The body gives greater honor to members treated as less visible. Disability, age, income, education, or platform size do not determine worth.'},
  {heading:'6. Suffer and Rejoice Together',body:'Mutual care refuses both competition and indifference. When one member reports harm, the body should listen and act; when another is honored, the body resists jealousy.'}
 ]
},
{
 number:7,
 title:'The More Excellent Way of Love',
 scripture:'1 Corinthians 13:1–14:40; John 13:34–35; Galatians 5:22–23',
 question:'Why must love govern every spiritual gift, word, and worship practice?',
 truth:'Without Christ-shaped love, even remarkable gifts become empty; love seeks another’s good through patience, truth, humility, and ordered service.',
 goal:'To move love from sentiment to practiced character and evaluate worship by intelligibility, edification, peace, and mutual honor.',
 teaching:[
  {heading:'1. Nothing Without Love',body:'Tongues, prophecy, knowledge, faith, and sacrifice can coexist with lovelessness. Results and spiritual intensity do not prove mature character.'},
  {heading:'2. Love Is Patient and Kind',body:'Paul describes durable actions rather than emotion alone. Patience never means tolerating abuse indefinitely, and kindness does not require unsafe access.'},
  {heading:'3. Love Rejoices With Truth',body:'Love refuses wrongdoing and celebrates truth. Protecting reputation through secrecy is not love. Truth should be pursued with fairness, care, and concern for people harmed.'},
  {heading:'4. Gifts Are Partial',body:'Knowledge and prophecy are incomplete until Christ’s fullness. Humility marks genuine gifting. No teacher or prophet sees everything.'},
  {heading:'5. Edification in Worship',body:'Paul prefers intelligible speech that builds the church. Public gifts should be evaluated, interpreted where necessary, and practiced with accountability rather than spectacle.'},
  {heading:'6. God Is Not a God of Confusion',body:'Order serves participation and peace, not rigid control. The disputed restrictions on women require careful contextual interpretation alongside women praying and prophesying in chapter 11.'}
 ]
},
{
 number:8,
 title:'Resurrection Changes Everything',
 scripture:'1 Corinthians 15:1–16:24; John 20:24–29; 1 Thessalonians 4:13–18',
 question:'How does the bodily resurrection of Christ transform hope, grief, work, courage, and generosity?',
 truth:'Because Christ has been bodily raised, death will be defeated, God’s people will be raised, and faithful labor in the Lord is never wasted.',
 goal:'To anchor Christian hope in the gospel’s historical claim and live with steadfast service, honest grief, generosity, and courage.',
 teaching:[
  {heading:'1. The Gospel Received',body:'Paul summarizes Christ’s death, burial, resurrection, and appearances as the message received and passed on. Christianity rests on God’s action in history, not merely inspirational values.'},
  {heading:'2. Grace and Witness',body:'Paul acknowledges his past persecution and attributes his ministry to grace. Grace neither hides history nor traps a person in it. It produces humble labor and accountability.'},
  {heading:'3. If Christ Is Not Raised',body:'Paul welcomes the logical consequence of the question. Christian faith is not threatened by honest inquiry. The resurrection is essential, not an optional symbol.'},
  {heading:'4. Firstfruits and Final Victory',body:'Christ’s resurrection begins the harvest that includes His people. Death remains an enemy, not a friend, and will finally be destroyed.'},
  {heading:'5. A Transformed Body',body:'Resurrection involves continuity and transformation. Bodies marked by weakness and mortality will be raised in glory. Present bodies deserve care and dignity without becoming idols.'},
  {heading:'6. Steadfast Work and Generosity',body:'Resurrection hope leads to steadfast labor, practical giving, courageous service, and loving relationships. Paul’s final plans show that eternal hope deepens ordinary responsibility rather than escaping it.'}
 ]
}
];

fcLessons.forEach(function(l){
 l.opening=fcOpening;
 l.context=fcContext;
 l.questions=fcQuestions.slice();
 l.examination=fcExamination;
 l.challenge=fcPractice;
 l.caution=fcLeader;
 l.prayer=fcPrayer(l.truth);
 l.supporting=[];
});

window.NLDG_BOOK_STUDY={
 slug:'first-corinthians-study',
 book:'1 Corinthians',
 title:'1 Corinthians: Unity, Holiness, Love, and Resurrection',
 description:'An eight-lesson study of unity, holiness, freedom, worship, gifts, love, and resurrection',
 theme:'The cross of Christ overturns pride and forms one body that honors every member, practices holiness and love, and lives in hope of resurrection.',
 audience:'Adults, groups, classes, and ministry teams',
 purpose:'To address church conflict and difficult ethical questions through the gospel while cultivating accountable leadership, mutual dignity, orderly worship, and resurrection hope.',
 background:'',
 lessons:fcLessons
};
