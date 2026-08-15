const jnOpening='Begin with prayer for humility, courage, and compassionate attention. Read the main passage aloud and allow silence before discussion. Invite observation first. Participants may pass on any question. Do not require disclosure about assault, domestic danger, mental health, disability, grief, sexuality, or trauma. The goal is faithful formation under Scripture.';
const jnContext='Read within the book’s historical setting, literary purpose, narrative movement, and whole-Bible witness. Notice power differences, repeated images, character development, signs, testimony, and whose voices bear the consequences. Distinguish divine use of a leader from approval of every action and internal Jewish conflict from language about all Jewish people.';
const jnQuestions=[
 'What detail or voice in the passage most needs careful attention?',
 'What does the text reveal about God, Jesus, leadership, or power?',
 'Where do fear, status, violence, secrecy, or self-interest shape the events?',
 'Which distinction prevents this passage from excusing abuse or prejudice?',
 'How does the passage honor grief, doubt, disability, or vulnerability?',
 'Where are repentance, restraint, courage, or truth required?',
 'What specific practice can embody this teaching this week?',
 'How can the group support faithfulness without pressure or unsafe disclosure?'
];
const jnExamination='Come honestly before God. Where am I tempted by control, secrecy, image protection, revenge, entitlement, prejudice, or spiritual performance? What truth about God or Jesus must reshape me? Name one place for repentance, safe distance, courageous witness, restitution, patient prayer, or renewed trust.';
const jnPractice='Choose one concrete practice: reread the passage three times; examine your use of authority; listen to a voice often overlooked; learn a safeguarding process; repair a truthful conversation; strengthen a necessary boundary; serve someone without recognition; or write a prayer of belief and surrender. Keep it safe, specific, and measurable.';
const jnLeader='Do not use anointing, covenant, forgiveness, unity, shepherding, belief, healing, suffering, or restoration to protect powerful offenders, shame illness, promote antisemitism, demand loyalty, or force unsafe access. Do not promise confidentiality. Follow approved safeguarding procedures, independent accountability, and applicable reporting duties whenever harm or danger is disclosed.';
const jnPrayer=(truth)=>'God of truth and resurrection life, '+truth+' Expose hidden harm, comfort those who grieve, protect the vulnerable, and make our leadership look like Jesus. Give repentance with fruit, courage to tell truth, humble service, and faith that abides in the risen Son. Amen.';
const jnLessons=[
{
 number:1,
 title:'The Word Became Flesh',
 scripture:'John 1:1–2:25; Genesis 1:1–5; Exodus 33:18–23',
 question:'What do the Word’s incarnation, John’s witness, the first disciples, and Jesus’ signs reveal about His identity?',
 truth:'The eternal Word became flesh to reveal God’s glory and grace, inviting people to witness, follow, and trust Him.',
 goal:'To confess Jesus’ full deity and humanity, receive grace, and move from curiosity toward discipleship.',
 teaching:[
  {heading:'1. In the Beginning',body:'The Word exists with God and is God, creates all things, and gives life and light. Jesus is not merely a teacher added to creation; He is its divine source.'},
  {heading:'2. The Word Became Flesh',body:'God’s Word becomes truly human and dwells among us. Incarnation honors embodied life. Bodies are neither shameful nor disposable.'},
  {heading:'3. Grace and Truth',body:'Jesus reveals the Father’s glory full of grace and truth. Grace does not deny truth, and truth should never be weaponized without grace.'},
  {heading:'4. John Is a Witness',body:'John clearly denies being Messiah and points away from himself. Faithful ministry helps people behold Jesus rather than become dependent on the witness.'},
  {heading:'5. Come and See',body:'The first disciples bring questions, relationships, and expectations. Jesus invites encounter and reveals knowledge of Nathanael without manipulating him.'},
  {heading:'6. Water Into Wine and Temple Sign',body:'At Cana Jesus provides abundant joy; at the temple He confronts commercial misuse and points to His body. Neither sign authorizes prosperity promises or antisemitic contempt.'}
 ]
},
{
 number:2,
 title:'New Birth and Living Water',
 scripture:'John 3:1–4:54; Numbers 21:4–9; Ezekiel 36:24–28',
 question:'How do new birth, God’s love, truthful exposure, living water, and boundary-crossing witness describe salvation?',
 truth:'The Spirit gives new birth through faith in the lifted-up Son, and Jesus offers living water that creates truthful worship and generous witness.',
 goal:'To receive salvation as God’s gift and follow Jesus across social, ethnic, moral, and gender boundaries.',
 teaching:[
  {heading:'1. Nicodemus Comes at Night',body:'A respected teacher approaches with partial understanding. Jesus does not shame his questions but insists on birth from above by the Spirit.'},
  {heading:'2. God So Loved the World',body:'God gives the Son for salvation rather than condemnation. Belief receives life; refusal remains in darkness. Evangelism should invite truthfully, never coerce.'},
  {heading:'3. John Decreases',body:'John rejoices that Jesus receives attention and says he must decrease. Healthy leaders are glad when people mature beyond dependence on them.'},
  {heading:'4. A Samaritan Woman Speaks',body:'Jesus crosses ethnic, gender, and moral boundaries at a well. He engages her as a thoughtful person. Her history should not be sensationalized or used to label her sexually.'},
  {heading:'5. Spirit and Truth',body:'Worship is not owned by one mountain or ethnic group. The Father seeks worshipers through the Messiah. Truthful worship crosses hostility without erasing history.'},
  {heading:'6. The Woman Becomes a Witness',body:'She leaves her jar, invites the town, and many believe through her word before meeting Jesus themselves. Women’s testimony belongs at the center of mission.'}
 ]
},
{
 number:3,
 title:'The Son Gives Life and Bread',
 scripture:'John 5:1–6:71; Exodus 16:1–18; Isaiah 55:1–3',
 question:'How do Jesus’ healing, authority, provision, and Bread of Life teaching call people beyond signs into enduring trust?',
 truth:'The Son shares the Father’s life-giving authority and is Himself the bread who satisfies deeper than miracles, food, or popular expectation.',
 goal:'To trust Jesus’ identity rather than chase spectacle and to respond to difficult teaching with persevering faith.',
 teaching:[
  {heading:'1. Do You Want to Be Healed?',body:'Jesus addresses a long-disabled man and heals him. The question honors agency; it should never imply chronically ill people prefer suffering or lack faith.'},
  {heading:'2. Equal With the Father',body:'Jesus gives life, judges, and does the Father’s works. Multiple witnesses support His claim. Eternal life begins through hearing and believing.'},
  {heading:'3. Feeding the Crowd',body:'Jesus receives a child’s bread and feeds thousands. The sign reveals generous provision and invites disciples to participate, not exploit hunger for a platform.'},
  {heading:'4. Walking on the Sea',body:'Jesus comes through the storm and says, “I am.” His presence addresses fear. Faith does not guarantee every storm stops on our timetable.'},
  {heading:'5. Bread of Life',body:'Jesus redirects people from another meal to Himself. Eating flesh and drinking blood is vivid covenant language of receiving His life and sacrifice, not literal violence.'},
  {heading:'6. Many Turn Back',body:'The teaching offends many, and Jesus permits departure rather than coercing loyalty. Peter remains because Jesus has words of eternal life. Genuine discipleship includes freedom and difficult trust.'}
 ]
},
{
 number:4,
 title:'Light, Truth, and the Good Shepherd',
 scripture:'John 7:1–10:42; Psalm 23; Ezekiel 34:1–16',
 question:'How does Jesus expose false judgment, give light, open eyes, and distinguish true shepherds from exploitative leaders?',
 truth:'Jesus is the light and Good Shepherd who knows, protects, leads, and lays down His life, while false leaders exclude and exploit.',
 goal:'To follow Jesus’ truthful compassion, reject spiritual superiority, and evaluate leadership through protection, sacrifice, and voice.',
 teaching:[
  {heading:'1. Rivers of Living Water',body:'Jesus promises the Spirit to those who thirst. The crowd divides over His identity. Honest disagreement should be examined rather than suppressed by status.'},
  {heading:'2. The Adulterous Woman and Textual Note',body:'The beloved account in John 7:53–8:11 is absent from the earliest manuscripts and appears in different locations, though it reflects Jesus’ mercy and call to leave sin. Teach the evidence transparently and never use the story to ignore the man’s responsibility or public-shame women.'},
  {heading:'3. I Am the Light',body:'Jesus exposes darkness and offers liberating truth. Freedom is not ethnic superiority; it comes through abiding in His word.'},
  {heading:'4. Born Blind',body:'Jesus rejects the assumption that disability resulted from the man’s or parents’ sin. Healing reveals God’s work, but disability should not be treated as punishment or people as object lessons.'},
  {heading:'5. Thrown Out by Leaders',body:'Authorities interrogate and exclude the healed man; Jesus finds him. Religious institutions can punish truthful witnesses. Christ seeks those discarded for telling what happened.'},
  {heading:'6. The Good Shepherd',body:'Jesus enters rightly, knows the sheep, gives abundant life, and lays down His life. Shepherd language never grants leaders ownership, secrecy, or unchecked control over people.'}
 ]
},
{
 number:5,
 title:'Resurrection and Costly Belief',
 scripture:'John 11:1–12:50; Ezekiel 37:1–14; Isaiah 53:1–6',
 question:'How do Jesus’ grief, resurrection power, public belief, and looming opposition reveal the cost and hope of His mission?',
 truth:'Jesus is the resurrection and life who enters human grief, calls the dead to life, and moves willingly toward the cross.',
 goal:'To hold grief and hope together, trust Jesus beyond delayed outcomes, and recognize how threatened power can respond to life with violence.',
 teaching:[
  {heading:'1. Jesus Loves and Delays',body:'Jesus loves Lazarus’s family yet does not arrive immediately. Delay is not evidence of indifference, and the story must not become a formula explaining every unanswered prayer.'},
  {heading:'2. Martha’s Confession',body:'Martha speaks grief, hope, theology, and faith. Jesus reveals Himself as resurrection and life. Her active discipleship deserves attention.'},
  {heading:'3. Jesus Wept',body:'Jesus is deeply moved and weeps at the tomb. Grief is not lack of faith. Compassion enters pain before displaying power.'},
  {heading:'4. Lazarus Comes Out',body:'Jesus calls Lazarus and invites the community to unbind him. The sign points to Jesus’ authority, not a guarantee that every present death will be reversed before the final resurrection.'},
  {heading:'5. Some Believe, Leaders Plot',body:'The sign creates faith and fear. Authorities worry about national consequences and plan Jesus’ death. Institutions may treat truth as threat when survival and status dominate.'},
  {heading:'6. Mary’s Costly Anointing',body:'Mary anoints Jesus while Judas invokes the poor dishonestly. Concern for justice must be genuine, and devotion must not become an excuse to neglect the poor.'}
 ]
},
{
 number:6,
 title:'Servant Love and the Promised Spirit',
 scripture:'John 13:1–16:33; Jeremiah 31:31–34; Galatians 5:22–25',
 question:'How do foot-washing, abiding love, obedience, the Spirit, grief, and peace shape Jesus’ community?',
 truth:'Jesus loves His own through humble service, commands mutual love, sends the Spirit of truth, and gives peace that endures through trouble.',
 goal:'To practice servant leadership, abiding dependence, truthful love, and Spirit-enabled witness without coercive authority.',
 teaching:[
  {heading:'1. Jesus Washes Feet',body:'The Lord takes a servant’s role and washes disciples’ feet, including those who will fail Him. Service is voluntary self-giving, not a tool for leaders to demand degrading acts from others.'},
  {heading:'2. A New Commandment',body:'Disciples are known by love patterned after Jesus. Love includes truth, protection, patience, and sacrifice. It is not secrecy that protects wrongdoing.'},
  {heading:'3. The Way, Truth, and Life',body:'Jesus is the way to the Father and reveals Him fully. Christian witness should be confident and humble, never violent or contemptuous.'},
  {heading:'4. The Advocate Comes',body:'The Spirit teaches, reminds, testifies, convicts, and guides into truth. Claims of spiritual guidance must align with Jesus and Scripture and remain accountable.'},
  {heading:'5. Abide in the Vine',body:'Fruit grows through dependence on Jesus. Pruning imagery belongs to God’s formation; it must not be used to label another person’s abuse or trauma as divinely required pain.'},
  {heading:'6. Sorrow Into Joy',body:'Jesus prepares disciples for hatred, grief, and scattering while promising peace and final victory. Peace is not absence of trouble but confidence in Him.'}
 ]
},
{
 number:7,
 title:'Jesus’ Prayer, Trial, and Cross',
 scripture:'John 17:1–19:42; Isaiah 52:13–53:12; Psalm 22',
 question:'How do Jesus’ prayer, arrest, trial, crucifixion, and burial reveal glory through self-giving truth and love?',
 truth:'Jesus glorifies the Father by giving Himself, protects His disciples, bears unjust judgment, completes His saving work, and is truly buried.',
 goal:'To receive the cross as Jesus’ willing saving act, resist antisemitic readings, and examine institutional complicity in injustice.',
 teaching:[
  {heading:'1. Jesus Prays for His People',body:'Jesus prays for protection, holiness, unity, and mission. Unity centers on truth and shared life with God; it never means hiding abuse or silencing conscience.'},
  {heading:'2. Arrest in the Garden',body:'Jesus steps forward and protects the disciples. Peter uses a sword, but Jesus refuses that path. His kingdom advances through willing sacrifice, not armed defense.'},
  {heading:'3. Religious and Imperial Power',body:'Jesus is questioned by Jewish authorities and sentenced under Roman power. John’s shorthand must not blame all Jewish people. Crucifixion is Roman execution amid complex leadership cooperation.'},
  {heading:'4. Peter’s Denial',body:'Peter follows at a distance and denies Jesus near a charcoal fire. Fear exposes his limits. Failure is named honestly and later met by restoring grace.'},
  {heading:'5. The King on the Cross',body:'Pilate’s title speaks more truth than he understands. Jesus entrusts His mother to the beloved disciple, receives sour wine, and declares completion.'},
  {heading:'6. Blood, Water, and Burial',body:'The pierced side and burial testimony emphasize real death. Joseph and Nicodemus act publicly at cost. The cross is not appearance but completed self-giving love.'}
 ]
},
{
 number:8,
 title:'The Risen Lord Restores and Sends',
 scripture:'John 20:1–21:25; 1 Corinthians 15:1–8; 1 Peter 5:1–4',
 question:'How does the risen Jesus meet grief, doubt, fear, vocation, failure, and the call to witness?',
 truth:'The risen Jesus calls people by name, brings peace, welcomes honest belief, restores failed disciples, and sends witnesses to care for His people.',
 goal:'To receive resurrection life, honor diverse witnesses, and practice restoration that includes love, responsibility, and renewed calling.',
 teaching:[
  {heading:'1. Mary at the Tomb',body:'Mary remains in grief, encounters Jesus, and recognizes Him when He calls her name. She becomes the first resurrection messenger to the disciples. Women’s witness is essential, not secondary.'},
  {heading:'2. Peace and Sending',body:'Jesus enters a locked room, offers peace, shows His wounds, and sends disciples as the Father sent Him. Mission flows from crucified peace, not domination.'},
  {heading:'3. Thomas and Honest Evidence',body:'Thomas asks to see and is later invited to believe. Jesus does not shame him. Honest questions can become confession when met by truth and presence.'},
  {heading:'4. Why John Wrote',body:'The signs are selected so readers may believe and have life in Jesus’ name. Belief is relational trust and allegiance, not mere agreement.'},
  {heading:'5. Breakfast by the Sea',body:'Jesus provides food and repeats a familiar sign after the disciples return to fishing. Resurrection meets ordinary work and need.'},
  {heading:'6. Peter Restored to Shepherd',body:'Three questions of love answer three denials, and Jesus entrusts care of His sheep. Restoration is not image rehabilitation; it joins truth, love, responsibility, and a changed pattern of servant leadership.'}
 ]
}
];
jnLessons.forEach(function(l){
 l.opening=jnOpening;
 l.context=jnContext;
 l.questions=jnQuestions.slice();
 l.examination=jnExamination;
 l.challenge=jnPractice;
 l.caution=jnLeader;
 l.prayer=jnPrayer(l.truth);
 l.supporting=[];
});
window.NLDG_BOOK_STUDY={
 slug:'john-study',
 book:'John',
 title:'John: The Word Became Flesh, Gave His Life, and Rose',
 description:'An eight-lesson study of the eternal Word, signs, belief, servant love, the cross, and resurrection life',
 theme:'Jesus is the eternal Word and Son who reveals the Father, gives life through His signs and self-giving death, sends the Spirit, rises bodily, and restores disciples for witness.',
 audience:'Adults, groups, classes, and ministry teams',
 purpose:'To follow John’s signs and conversations, deepen belief in Jesus, and practice abiding love, humble service, truthful witness, and resurrection mission.',
 background:'',
 lessons:jnLessons
};
