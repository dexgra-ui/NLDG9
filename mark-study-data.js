const mkOpening='Begin with prayer for humility, courage, and compassion. Read the main passage aloud and allow a quiet moment before discussion. Invite observations first. Participants may pass on any question. Do not request personal accounts of abuse, violence, sexuality, grief, or trauma. The goal is faithful formation, not shock, debate, or exposure.';
const mkContext='Read within the book’s narrative movement, historical setting, literary purpose, and whole-Bible witness. Distinguish what a story describes from what Scripture commands. Notice patterns, reversals, repeated phrases, and character development. Difficult violence and disputed texts deserve honesty, careful context, and submission to Jesus.';
const mkQuestions=[
 'What part of the passage is most troubling, surprising, or hopeful?',
 'What does the text reveal about God, Jesus, leadership, or human need?',
 'Where do power, fear, idolatry, or misunderstanding shape the story?',
 'Which distinction prevents this passage from being used harmfully?',
 'How does the passage honor people who are vulnerable, overlooked, or afraid?',
 'Where is repentance, courage, truth, or patient faith needed?',
 'What concrete practice can embody this teaching this week?',
 'How can the group support faithfulness without pressure or forced disclosure?'
];
const mkExamination='Come honestly before God. Where am I tempted by control, retaliation, status, appetite, fear, religious performance, or silence in the face of harm? What truth about God or Jesus must reshape my response? Name one place for repentance, a boundary, courageous service, patient prayer, or renewed hope.';
const mkPractice='Choose one concrete practice: reread the passage three times; establish a prayer rhythm; examine how you use influence; encourage someone overlooked; learn a safeguarding or reporting procedure; repair a truthful conversation; strengthen a wise boundary; or serve without recognition. Keep it safe, specific, and measurable.';
const mkLeader='Teach calmly and without sensational detail. Do not joke about bodies or victims, identify modern enemies as biblical targets, romanticize abusive leaders, demand secrecy, or use submission, forgiveness, vows, suffering, unity, or spiritual authority to pressure unsafe access. Do not promise confidentiality. Follow approved safeguarding procedures and applicable reporting duties when harm or danger is disclosed.';
const mkPrayer=(truth)=>'Holy and compassionate God, '+truth+' Expose our idols, restrain destructive power, and form the servant life of Jesus in us. Give protection to the vulnerable, repentance to those who harm, courage to tell truth, and hope rooted in Christ’s cross and resurrection. Amen.';
const mkLessons=[
 {number:1,title:'The Kingdom Draws Near',scripture:'Mark 1:1–2:28; Isaiah 40:1–11; Daniel 7:13–14',question:'What do Jesus’ proclamation, authority, compassion, and forgiveness reveal about the arrival of God’s kingdom?',truth:'In Jesus, God’s kingdom draws near with authority that calls, cleanses, forgives, restores, and confronts oppressive interpretations of religion.',goal:'To respond to the gospel through repentance and trust and to recognize authority shaped by compassion and holiness.',teaching:[
  {heading:'Prepare the Way',body:'John fulfills the wilderness voice, calling people to repentance and baptism. Repentance is truthful turning toward God, not public humiliation.'},
  {heading:'The Beloved Son',body:'At baptism, Jesus is named beloved Son and the Spirit descends. His identity precedes public achievement. God’s love is not earned through platform success.'},
  {heading:'Repent and Believe',body:'Jesus announces fulfilled time and nearby kingdom. Repentance and faith are ongoing allegiance, not merely emotion at one moment.'},
  {heading:'Authority in Word and Deliverance',body:'Jesus teaches with authority and confronts an unclean spirit. His authority liberates rather than performs for control. Spiritual warfare must never become labeling disliked people as demons.'},
  {heading:'Moved With Compassion',body:'Jesus touches a man with a skin disease and restores him. Purity does not make Jesus afraid of the excluded. Churches should combine appropriate health wisdom with dignity and belonging.'},
  {heading:'Forgiveness and Sabbath',body:'Jesus forgives the paralytic and declares the Sabbath made for people. Religious practice serves God’s restorative purpose; it should not be weaponized against need or mercy.'}
 ]},
 {number:2,title:'Authority, Opposition, and the Word',scripture:'Mark 3:1–4:41; Isaiah 6:8–13; Psalm 107:23–30',question:'How do people respond differently to Jesus’ authority, and what kind of hearing produces fruitful discipleship?',truth:'Jesus confronts hardened opposition, forms a new family around obedience, sows the kingdom Word, and rules chaos with divine authority.',goal:'To examine receptivity and resistance, practice faithful hearing, and trust Jesus amid growth we cannot control.',teaching:[
  {heading:'Healing and Hard Hearts',body:'Jesus heals on the Sabbath while opponents watch for accusation. He grieves their hardness. Rule-keeping that prefers suffering to mercy has missed God’s heart.'},
  {heading:'Crowds and the Twelve',body:'Crowds press toward Jesus, and He appoints twelve to be with Him and be sent. Ministry begins with presence before activity and requires shared service.'},
  {heading:'The Unforgivable Sin',body:'Jesus warns those who persistently call the Spirit’s liberating work demonic. This is not an accidental phrase or intrusive thought. People worried they have committed it should be directed toward Christ’s mercy, not terror.'},
  {heading:'A New Family',body:'Jesus identifies family through doing God’s will. This expands belonging without excusing neglect of relatives. Church family must not isolate people from healthy relationships.'},
  {heading:'The Sower and the Soils',body:'The same Word meets different conditions. Fruitfulness requires receptive, enduring hearing. The parable should inspire examination, not labeling other people permanently as bad soil.'},
  {heading:'Peace in the Storm',body:'Jesus commands wind and sea, revealing authority associated with God. The disciples’ fear becomes a question of identity. Faith does not mean every storm stops immediately, but Christ remains Lord.'}
 ]},
 {number:3,title:'Compassion in the Face of Fear and Need',scripture:'Mark 5:1–6:56; Psalm 23; Isaiah 35:3–6',question:'How does Jesus respond to spiritual bondage, chronic suffering, death, hunger, and human fear?',truth:'Jesus crosses boundaries and responds to desperate need with restoring authority, compassionate attention, provision, and patient formation.',goal:'To see vulnerable people as persons rather than problems and to follow Jesus through courageous compassion without promising identical outcomes.',teaching:[
  {heading:'The Man Among the Tombs',body:'A tormented man is isolated, restrained, and self-harming. Jesus restores dignity and community. Do not equate every mental illness with demonic oppression; seek appropriate medical, psychological, pastoral, and spiritual care.'},
  {heading:'Sent Home as a Witness',body:'The restored man wants to travel with Jesus but is sent to tell his community. Testimony belongs to the person; no one should be pressured to disclose traumatic details publicly.'},
  {heading:'The Woman in the Crowd',body:'A woman with chronic bleeding reaches for Jesus after costly failed treatment. Jesus stops, calls her daughter, and restores public dignity. Illness is not proof of weak faith.'},
  {heading:'Jairus’ Daughter',body:'Jesus attends to a powerful man’s child while also honoring an overlooked woman. Delay does not mean indifference. The resurrection sign points to Jesus’ authority over death.'},
  {heading:'Rejection at Home',body:'Nazareth’s familiarity becomes offense. Jesus’ statement about unbelief should not be turned into a formula that makes communities responsible for every unperformed miracle.'},
  {heading:'Feeding the Crowd',body:'Jesus sees sheep without a shepherd, teaches, and provides food. Compassion addresses spiritual and material hunger. Disciples are invited to participate rather than dismiss need.'}
 ]},
 {number:4,title:'Who Do You Say Jesus Is?',scripture:'Mark 7:1–8:38; Isaiah 29:13; Isaiah 35:5–6',question:'How do purity, inclusion, signs, and the cross reveal Jesus’ identity and redefine discipleship?',truth:'Jesus exposes heart-level defilement, extends mercy across boundaries, opens ears and eyes, and defines Messiahship through the cross.',goal:'To move beyond external religion, receive Jesus’ inclusive mercy, and confess Him without rejecting His path of suffering love.',teaching:[
  {heading:'Tradition and God’s Command',body:'Jesus confronts traditions used to avoid responsibility to parents. Tradition can carry wisdom, but it must never cancel God’s commands or protect self-interest.'},
  {heading:'Defilement From the Heart',body:'Jesus locates evil in the heart rather than food or external contact. This does not make bodies dirty; it holds every person accountable for desires and actions.'},
  {heading:'The Syrophoenician Woman',body:'A Gentile mother persists in seeking deliverance for her daughter, and Jesus commends the exchange through granting her request. Teach the difficult wording honestly and honor her courage rather than portraying her as an obstacle.'},
  {heading:'Ears Opened',body:'Jesus gives personal attention to a deaf man and restores communication. Do not use the story to treat disabled people as object lessons or incomplete persons. Accessibility and dignity matter.'},
  {heading:'Beware the Leaven',body:'The disciples worry about bread while Jesus warns against corrupt influence. Repeated miracles do not automatically create understanding. Leaders and followers need continued formation.'},
  {heading:'Peter’s Confession and Rebuke',body:'Peter names Jesus as Christ but rejects the cross. Jesus rebukes the temptation toward power without suffering. Discipleship means following Jesus, not using Him to protect ambition.'}
 ]},
 {number:5,title:'Glory, Discipleship, and Servant Leadership',scripture:'Mark 9:1–10:52; Philippians 2:3–11; Isaiah 53:4–6',question:'How do glory, weakness, childlike welcome, costly discipleship, and service belong together?',truth:'The glorious Son leads disciples toward prayerful dependence, humble welcome, faithful relationships, surrendered possessions, and servant leadership.',goal:'To reject status competition and coercive power and embrace Jesus’ way of service, dignity, and costly love.',teaching:[
  {heading:'Transfiguration and Listening',body:'Jesus’ glory is revealed with Moses and Elijah, and the Father commands disciples to listen to Him. Spiritual experiences must lead to obedience, not platform-building.'},
  {heading:'Prayer and Dependence',body:'The disciples cannot deliver a boy, and Jesus emphasizes prayer. The account should not blame families or make deliverance a performance. Complex suffering deserves compassionate and qualified care.'},
  {heading:'Welcome the Child',body:'When disciples debate greatness, Jesus places a child among them. Leadership is measured by welcome and protection of those with less social power. Children must never be used as props or denied safeguarding.'},
  {heading:'Severe Warnings About Harm',body:'Jesus uses vivid language about causing little ones to stumble and cutting off sources of sin. The imagery calls for decisive repentance, not literal self-harm.'},
  {heading:'Marriage, Divorce, and Vulnerability',body:'Jesus confronts casual divorce practices that exposed women to harm. These verses uphold covenant seriousness but must not trap anyone in abuse or immediate danger.'},
  {heading:'The Son of Man Serves',body:'James and John seek status; Jesus contrasts Gentile domination with service. He gives His life as ransom. Christian authority builds others up and never demands others be sacrificed for the leader.'}
 ]},
 {number:6,title:'The King Enters and Confronts the Temple',scripture:'Mark 11:1–12:44; Isaiah 56:6–8; Jeremiah 7:9–11',question:'What do Jesus’ entry, temple actions, controversies, and teaching reveal about His royal authority and true worship?',truth:'Jesus is the humble King who confronts fruitless religion, exposes exploitation, answers traps with wisdom, and calls for wholehearted love.',goal:'To receive Jesus’ authority, examine religious systems, and practice worship joined to justice, truth, and love of neighbor.',teaching:[
  {heading:'A Humble Royal Entry',body:'Jesus enters on a colt, fulfilling royal hopes without military display. His kingship rejects domination and exposes nationalistic expectations.'},
  {heading:'The Fig Tree and Temple',body:'The enacted parable surrounds Jesus’ temple action. He confronts fruitlessness and obstruction of prayer for the nations. The passage must not fuel contempt toward Jewish people or Judaism.'},
  {heading:'A Den of Robbers',body:'Jesus quotes prophets against worship joined to exploitation. Churches should examine financial practices, access, leadership privilege, and whether vulnerable people are protected.'},
  {heading:'Authority Questioned',body:'Leaders challenge Jesus, and He exposes their fear of public opinion. Accountability questions can be legitimate; His response addresses bad-faith evasion, not permission for leaders to avoid all scrutiny.'},
  {heading:'God and Caesar',body:'Jesus refuses a political trap and relativizes Caesar under God. Civic obligations do not claim the worship and image-bearing identity that belong to God.'},
  {heading:'The Greatest Command and the Widow',body:'Love of God and neighbor surpasses sacrifice. The widow’s gift displays devotion but also follows condemnation of leaders who devour widows’ houses. Do not use her story to pressure poor people to give beyond safety.'}
 ]},
 {number:7,title:'Watchfulness, Failure, and Faithful Love',scripture:'Mark 13:1–14:72; Zechariah 13:7; 1 Peter 4:7–11',question:'How do watchfulness, sacrificial love, prayer, betrayal, and failure prepare disciples for suffering?',truth:'Jesus calls disciples to watchful faithfulness, receives costly love, gives Himself in covenant, and remains faithful when His followers fail.',goal:'To reject date-setting, prepare for hardship, practice prayerful courage, and find hope when discipleship exposes weakness.',teaching:[
  {heading:'Not One Stone Left',body:'Jesus predicts the temple’s destruction and warns against false messiahs, wars, persecution, and deception. These signs call for endurance, not panic or confident end-times timetables.'},
  {heading:'Stay Awake',body:'No one knows the day or hour. Watchfulness means faithful work, prayer, holiness, and witness, not obsession with speculation.'},
  {heading:'A Woman Anoints Jesus',body:'An unnamed woman recognizes the moment and offers costly love. Jesus defends her against criticism and preserves her action in gospel memory.'},
  {heading:'The Lord’s Supper',body:'Jesus interprets bread and cup through His body and covenant blood. He gives Himself; He does not authorize leaders to demand unquestioning sacrifice from others.'},
  {heading:'Gethsemane Prayer',body:'Jesus is deeply distressed and prays honestly, submitting to the Father. Faith includes bringing anguish to God. The sleeping disciples show the weakness of good intentions without spiritual attention.'},
  {heading:'Peter’s Denial',body:'Peter’s confidence collapses under fear. His tears acknowledge failure. The story prepares for restoration without minimizing betrayal; grace tells truth and creates a new path.'}
 ]},
 {number:8,title:'The Cross and the Empty Tomb',scripture:'Mark 15:1–16:20; Isaiah 53:7–12; 1 Corinthians 15:1–8',question:'What do Jesus’ crucifixion, burial, and empty tomb reveal about God’s victory and the future of failed disciples?',truth:'Jesus is the crucified Son of God who bears shame, truly dies, is raised, and summons fearful disciples into resurrection witness.',goal:'To stand honestly before the cross, honor the witnesses, explain Mark’s ending transparently, and live from resurrection hope.',teaching:[
  {heading:'Political and Religious Injustice',body:'Jesus faces manipulation, mockery, and execution under Roman authority. The cross exposes how institutions, crowds, and leaders can cooperate in injustice.'},
  {heading:'The Crucified King',body:'The title King of the Jews is used in mockery, yet Mark reveals true kingship through self-giving endurance. Jesus does not save Himself because He is giving His life for others.'},
  {heading:'My God, Why?',body:'Jesus prays Psalm 22 in abandonment. Scripture makes room for anguished lament. People in pain should not be shamed for asking why.'},
  {heading:'The Centurion’s Confession',body:'A Roman officer sees Jesus die and calls Him God’s Son. Mark’s opening claim is echoed at the cross by an outsider, where divine identity is revealed through suffering love.'},
  {heading:'Women Witness and Joseph Buries',body:'Women remain, observe the burial, and come to the tomb. Joseph courageously requests the body. These witnesses establish that Jesus truly died and that the tomb found empty is the same tomb.'},
  {heading:'The Earliest Ending',body:'The earliest manuscripts end with the women fleeing in fear after the resurrection announcement. Later endings summarize appearances and mission. Teach the textual evidence openly: Jesus is risen, failure is not final, and readers are invited to continue the witness.'}
 ]}
];
mkLessons.forEach(function(l){
 l.opening=mkOpening;
 l.context=mkContext;
 l.questions=mkQuestions.slice();
 l.examination=mkExamination;
 l.challenge=mkPractice;
 l.caution=mkLeader;
 l.prayer=mkPrayer(l.truth);
 l.supporting=[];
});
window.NLDG_BOOK_STUDY={
 slug:'mark-study',
 book:'Mark',
 title:'Mark: Jesus’ Authority, the Way of the Cross, and Resurrection Hope',
 description:'An eight-lesson study of Jesus’ restoring authority, compassionate service, cross-shaped discipleship, and resurrection hope',
 theme:'Jesus is the authoritative Son of God and suffering Messiah who announces God’s kingdom, serves vulnerable people, gives His life as a ransom, rises, and calls disciples to follow.',
 audience:'Adults, groups, classes, and ministry teams',
 purpose:'Encounter Mark’s fast-moving portrait of Jesus, understand discipleship through the cross, and become servants who watch, pray, love courageously, and hope in resurrection.',
 background:'',
 lessons:mkLessons
};
