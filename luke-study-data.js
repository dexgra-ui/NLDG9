const lkOpening='Begin with prayer for humility, courage, and compassion. Read the main passage aloud and allow silence before discussion. Invite observation before explanation. Participants may pass on any question, and no one should be required to disclose private family, financial, immigration, trauma, or relationship experiences. The goal is faithful formation under Scripture.';
const lkContext='Read within the book’s historical setting, covenant location, literary movement, and whole-Bible witness. Notice chronology, repeated themes, quoted Scripture, cultural details, and whose voices are heard or absent. Distinguish what the text reports from what it commands, and resist transferring ancient covenant actions mechanically into modern situations.';
const lkQuestions=[
 'What detail, contrast, or voice most needs attention in this passage?',
 'What does the text reveal about God, Jesus, restoration, or discipleship?',
 'Where do power, fear, money, identity, or exclusion shape the situation?',
 'Which distinction protects this passage from racist, coercive, or harmful application?',
 'How does the passage make room for grief, vulnerability, or honest questions?',
 'Where is repentance, courage, mercy, or patient faith required?',
 'What specific practice can embody this teaching this week?',
 'How can the group support faithfulness without pressure or forced disclosure?'
];
const lkExamination='Come honestly before God. Where am I tempted by pride, fear, greed, prejudice, spiritual performance, exclusion, or confidence in status? What grace must I receive? What use of time, money, authority, worship, speech, or relationship needs repentance, mercy, repair, or a wiser boundary?';
const lkPractice='Choose one concrete practice: reread the passage three times; write a prayer of confession or gratitude; examine a financial practice; welcome someone across a boundary; listen to a voice often overlooked; repair a truthful conversation; strengthen a safe boundary; or serve without expectation of repayment. Keep it specific and measurable.';
const lkLeader='Do not use covenant identity, intermarriage, poverty, forgiveness, submission, cross-bearing, prayer, or spiritual authority to promote racism, antisemitism, anti-immigrant hostility, forced divorce, financial pressure, victim-blaming, or unsafe reconciliation. Do not promise confidentiality. Follow approved safeguarding procedures and applicable reporting duties when harm or danger is disclosed.';
const lkPrayer=(truth)=>'Faithful and merciful God, '+truth+' Restore what sin has broken, make us humble under Your Word, and form the compassion of Jesus in us. Teach us to worship truthfully, steward resources justly, welcome outsiders, protect the vulnerable, and witness to the risen Christ. Amen.';
const lkLessons=[
{
 number:1,
 title:'Good News for the Humble',
 scripture:'Luke 1:1–3:38; 1 Samuel 2:1–10; Isaiah 40:3–5',
 question:'How does God prepare salvation through ordinary faithfulness, surprising people, humble trust, and the Spirit?',
 truth:'God remembers His promises and brings salvation through Jesus, lifting the lowly and inviting faithful, thoughtful response.',
 goal:'To trust God’s covenant faithfulness, honor the voices of women and elders, and respond to Jesus through repentance and Spirit-led obedience.',
 teaching:[
  {heading:'1. Careful Investigation',body:'Luke values sources, sequence, and eyewitnesses. Christian confidence does not require hostility toward evidence or honest questions.'},
  {heading:'2. Zechariah and Elizabeth',body:'An older faithful couple carries long disappointment. Their infertility is not punishment or lack of faith. God’s gift should never become a formula imposed on others.'},
  {heading:'3. Mary’s Willing Response',body:'Mary asks how, receives an answer, and responds in trust. Her faith has agency. Her story must never be used to erase the importance of consent or pressure vulnerable people into obedience to human authority.'},
  {heading:'4. Songs of Reversal',body:'Mary and Zechariah praise God for mercy, covenant, justice, and liberation. Salvation challenges proud power and remembers the lowly.'},
  {heading:'5. Good News to Shepherds',body:'Jesus’ birth is announced to workers outside elite circles. The sign is a vulnerable child. God’s glory appears through humility rather than status.'},
  {heading:'6. John Prepares the Way',body:'John calls for fruits of repentance, economic sharing, honest tax practice, and restraint by soldiers. Repentance becomes visible in how power and resources are used.'}
 ]
},
{
 number:2,
 title:'Jesus Announces the Kingdom',
 scripture:'Luke 4:1–5:39; Isaiah 61:1–2; Leviticus 25:8–17',
 question:'What kind of kingdom does Jesus announce through testing, proclamation, healing, forgiveness, and table fellowship?',
 truth:'Jesus rejects self-serving power and announces Spirit-filled good news that liberates, heals, forgives, and welcomes sinners into transformed community.',
 goal:'To resist distorted power and follow Jesus’ authority through compassion, truth, restoration, and mission.',
 teaching:[
  {heading:'1. Tested in the Wilderness',body:'Jesus rejects using power for appetite, spectacle, and political domination. Scripture can be quoted by the tempter; faithful interpretation serves obedience to God’s character.'},
  {heading:'2. Good News at Nazareth',body:'Jesus announces good news to the poor, release, sight, freedom, and the Lord’s favor. The kingdom addresses whole-person need and fulfills Israel’s hope.'},
  {heading:'3. Grace Beyond Familiar Boundaries',body:'Jesus recalls God’s mercy to a Sidonian widow and Syrian commander, provoking rage. Grace cannot be owned by a hometown, ethnicity, or nation.'},
  {heading:'4. Authority That Restores',body:'Jesus teaches, confronts evil, heals, and withdraws to pray. His authority restores persons rather than making them props for fame.'},
  {heading:'5. A Miraculous Catch and Calling',body:'Peter recognizes his sin, yet Jesus calls rather than humiliates him. Discipleship transforms vocation and directs gifts toward gathering people for life.'},
  {heading:'6. Forgiveness and the Table',body:'Jesus forgives a paralytic and eats with tax collectors. Fellowship with sinners is aimed at healing and repentance, not endorsement or exclusion.'}
 ]
},
{
 number:3,
 title:'Learning the Way of Discipleship',
 scripture:'Luke 6:1–9:62; Micah 6:8; Philippians 2:3–8',
 question:'How does Jesus form disciples through mercy, enemy love, prayer, faith, service, and the cross?',
 truth:'Jesus forms a community that practices mercy, loves enemies, hears and obeys His Word, receives power humbly, and follows Him toward the cross.',
 goal:'To move from admiration to obedient discipleship while rejecting retaliation, status competition, and manipulative uses of power.',
 teaching:[
  {heading:'1. Lord of the Sabbath',body:'Jesus restores the Sabbath’s merciful purpose and heals a man while opponents watch. Religious rules should never prefer suffering to compassionate action.'},
  {heading:'2. Blessings and Woes',body:'Jesus blesses the poor, hungry, grieving, and rejected while warning the satisfied and admired. He does not romanticize deprivation; He announces God’s reversal and calls communities toward mercy.'},
  {heading:'3. Love Your Enemies',body:'Enemy love rejects retaliation and imitates God’s mercy. It does not require remaining in danger, ending legal accountability, or restoring unsafe access.'},
  {heading:'4. Hear and Do',body:'The house on rock represents obedience to Jesus’ words. Spiritual language without practice cannot sustain a life.'},
  {heading:'5. Faith and Compassion',body:'Jesus responds to a centurion, widow, sinful woman, desperate father, and suffering woman. Their stories show attentive mercy across status. Illness and loss are never proof of weak faith.'},
  {heading:'6. Take Up the Cross',body:'Peter confesses Jesus, glory appears on the mountain, and Jesus turns toward Jerusalem. Cross-bearing means allegiance to Christ, not accepting abuse or neglecting protection.'}
 ]
},
{
 number:4,
 title:'Loving God, Neighbor, and Enemy',
 scripture:'Luke 10:1–11:54; Deuteronomy 6:4–9; Leviticus 19:17–18',
 question:'How do mission, neighbor love, attentive discipleship, prayer, and integrity belong together?',
 truth:'Disciples depend on God, cross boundaries in mercy, listen at Jesus’ feet, pray persistently, and align inner life with outward religion.',
 goal:'To develop compassionate mission and prayer while resisting prejudice, busyness, performance, and hypocrisy.',
 teaching:[
  {heading:'1. Sent in Dependence',body:'Jesus sends disciples with urgency and vulnerability. Mission does not justify poor planning or exploitation of workers; it teaches dependence, hospitality, and peace.'},
  {heading:'2. The Good Samaritan',body:'A despised Samaritan becomes the model neighbor through practical, costly mercy. The parable confronts prejudice and asks what love does, not which group deserves compassion.'},
  {heading:'3. Mary and Martha',body:'Mary sits as a disciple and listens; Martha carries anxious service. Jesus does not shame hospitality or women’s work. He protects attentive discipleship from being swallowed by distraction.'},
  {heading:'4. Teach Us to Pray',body:'Jesus gives a God-centered pattern for daily provision, forgiveness, and protection, then encourages persistence. Prayer is trusting relationship, not a technique to control outcomes.'},
  {heading:'5. A Divided Kingdom',body:'Jesus answers accusations about His power and warns against false neutrality. Spiritual warfare should never become labeling mental illness, disagreement, or cultural difference as demonic.'},
  {heading:'6. Clean Outside, Corrupt Inside',body:'Jesus confronts religious leaders who neglect justice and burden others. External order cannot compensate for exploitation. Leaders should examine whether teaching creates help or crushing weight.'}
 ]
},
{
 number:5,
 title:'Money, Mercy, and Watchful Faithfulness',
 scripture:'Luke 12:1–16:31; Amos 5:21–24; 1 Timothy 6:6–10',
 question:'How should the coming kingdom reshape fear, possessions, hospitality, repentance, and responsibility?',
 truth:'Faithful disciples fear God rather than people, hold possessions as stewards, welcome those who cannot repay, repent now, and use wealth for mercy.',
 goal:'To confront greed and anxiety without shaming poverty and to practice generous, accountable stewardship while waiting for Christ.',
 teaching:[
  {heading:'1. Beware Hypocrisy',body:'Hidden things will be revealed, so disciples should not build lives around appearance. Transparency must be joined to wisdom; victims are not required to expose themselves publicly.'},
  {heading:'2. The Rich Fool',body:'A man expands storage while ignoring God and neighbor. Planning is not condemned; self-sufficient accumulation without generosity is.'},
  {heading:'3. Do Not Be Anxious',body:'Jesus points to God’s care and calls the flock to seek the kingdom. Anxiety is not a moral failure. Prayer, community, planning, counseling, and medical care can all be faithful responses.'},
  {heading:'4. Watchful Servants',body:'Readiness means responsible service, especially by leaders entrusted with people. Authority increases accountability; it never licenses violence or domination.'},
  {heading:'5. Invite Those Who Cannot Repay',body:'Jesus challenges status-based hospitality and centers poor and disabled guests. Inclusion should honor agency and accessibility rather than turning people into charitable displays.'},
  {heading:'6. The Rich Man and Lazarus',body:'The rich man ignores a suffering neighbor at his gate. The parable warns that religious identity cannot replace mercy. It does not teach that poverty alone earns salvation.'}
 ]
},
{
 number:6,
 title:'The King Who Seeks the Lost',
 scripture:'Luke 17:1–19:48; Ezekiel 34:11–16; Zechariah 9:9',
 question:'How does Jesus seek the lost, welcome persistent faith, confront wealth, and enter Jerusalem as a humble King?',
 truth:'Jesus seeks and saves the lost, receives humble faith, calls for just repentance, and brings God’s kingdom through humble royal authority.',
 goal:'To cultivate gratitude, persistent prayer, humble trust, restitution, and allegiance to Jesus rather than status or wealth.',
 teaching:[
  {heading:'1. Do Not Cause Little Ones to Stumble',body:'Jesus takes harm seriously and calls for repentance and forgiveness. Forgiveness does not erase safeguarding, consequences, or boundaries.'},
  {heading:'2. The Grateful Samaritan',body:'Ten are cleansed, but a Samaritan returns in praise. Gratitude recognizes the giver and crosses social prejudice. Healing accounts must not become promises that every illness will resolve now.'},
  {heading:'3. Persistent Widow',body:'A vulnerable widow keeps seeking justice from an unjust judge. God is not like the judge; He hears. The parable supports persevering prayer and concern for systems that force vulnerable people to fight for basic justice.'},
  {heading:'4. Pharisee and Tax Collector',body:'The self-righteous worshiper compares; the tax collector asks mercy. Humility does not mean denying growth. It refuses to use another person’s failure as proof of superiority.'},
  {heading:'5. Zacchaeus Makes Restitution',body:'Jesus seeks a wealthy tax collector, and repentance becomes economic repair. Hospitality and grace precede transformed use of money.'},
  {heading:'6. The Humble King Weeps',body:'Jesus enters Jerusalem on a colt and weeps over the city. His kingship combines authority with grief, peace, and prophetic confrontation, not triumphal nationalism.'}
 ]
},
{
 number:7,
 title:'Faithful Witness in Jerusalem',
 scripture:'Luke 20:1–21:38; Psalm 118:19–29; Daniel 7:13–14',
 question:'How does Jesus expose corrupt authority, teach wise public faithfulness, and prepare disciples for crisis?',
 truth:'Jesus answers traps with truth, centers love of God and neighbor, warns against exploitative leadership, and calls disciples to enduring witness rather than panic.',
 goal:'To discern authority, civic responsibility, generosity, and apocalyptic teaching with humility and watchful faithfulness.',
 teaching:[
  {heading:'1. Authority and Bad Faith',body:'Leaders question Jesus while avoiding honest response to John. Questions can be legitimate; Jesus exposes manipulation rather than rejecting accountability itself.'},
  {heading:'2. The Vineyard Tenants',body:'The parable warns leaders who reject God’s messengers and Son. It must not fuel antisemitism; Jesus speaks within Israel’s prophetic tradition against corrupt stewardship.'},
  {heading:'3. God and Caesar',body:'Jesus avoids a political trap and returns ultimate allegiance to God. Governments may receive lawful obligations but never the worship owed to the One whose image humans bear.'},
  {heading:'4. Beware Leaders Who Devour',body:'Jesus condemns teachers who seek status and exploit widows. Spiritual appearance cannot hide financial harm. Churches need transparent oversight and protection for vulnerable donors.'},
  {heading:'5. The Widow’s Offering',body:'The widow gives all she has immediately after the warning about devouring widows. Her devotion deserves honor, but the passage must never pressure poor people to surrender necessities or enrich exploitative systems.'},
  {heading:'6. Watch Without Date-Setting',body:'Jesus warns of Jerusalem’s crisis, persecution, deception, and His coming. Disciples prepare through testimony, endurance, prayer, and holiness, not fear-driven timelines.'}
 ]
},
{
 number:8,
 title:'The Cross, the Table, and the Risen Lord',
 scripture:'Luke 22:1–24:53; Isaiah 53:4–12; 1 Corinthians 15:3–8',
 question:'How do Jesus’ table, prayer, trial, cross, empty tomb, and resurrection commission complete Luke’s good news?',
 truth:'Jesus gives Himself for sinners, serves failed disciples, bears injustice, rises bodily, opens Scripture, and sends witnesses in the Spirit’s promised power.',
 goal:'To receive Christ’s saving work, confront leadership failure and injustice, and live as joyful resurrection witnesses.',
 teaching:[
  {heading:'1. The Table and Servant Leadership',body:'Jesus gives bread and cup as His body and covenant, then corrects a status argument. Greatness is service. Leaders may not use Jesus’ sacrifice to demand unhealthy sacrifice from others.'},
  {heading:'2. Peter Warned and Restored',body:'Jesus predicts Peter’s denial and prays that his faith will not finally fail. Restoration includes strengthening others. Confidence must become dependence.'},
  {heading:'3. Gethsemane and Anguish',body:'Jesus prays honestly and submits to the Father. His suffering does not mean anguish is sinful. Disciples should support people in crisis rather than spiritualize pain.'},
  {heading:'4. Unjust Trial and Crucifixion',body:'Religious and political systems fail, yet Jesus forgives and promises paradise to a repentant criminal. Forgiveness is His sovereign grace, not a tool for silencing victims.'},
  {heading:'5. Women at the Empty Tomb',body:'Women discover the tomb and report the resurrection, but the apostles initially dismiss them. God entrusts essential witness to voices society may undervalue.'},
  {heading:'6. Emmaus and Commission',body:'The risen Jesus opens Scripture, is recognized at the table, proves bodily life, and commissions proclamation to all nations. Resurrection creates worship, joy, repentance, forgiveness, and mission.'}
 ]
}
];
lkLessons.forEach(function(l){
 l.opening=lkOpening;
 l.context=lkContext;
 l.questions=lkQuestions.slice();
 l.examination=lkExamination;
 l.challenge=lkPractice;
 l.caution=lkLeader;
 l.prayer=lkPrayer(l.truth);
 l.supporting=[];
});
window.NLDG_BOOK_STUDY={
 slug:'luke-study',
 book:'Luke',
 title:'Luke: Good News, Mercy, Justice, and the Risen Lord',
 description:'An eight-lesson study of Jesus, the Spirit, prayer, outsiders, stewardship, the cross, and resurrection',
 theme:'Jesus is the Spirit-anointed Savior who fulfills Israel’s hope, seeks the lost, confronts oppressive power, welcomes outsiders, gives Himself at the cross, and rises to send witnesses to all nations.',
 audience:'Adults, groups, classes, and ministry teams',
 purpose:'To follow Luke’s orderly account, receive Jesus’ upside-down kingdom, and become prayerful disciples marked by mercy, justice, stewardship, table fellowship, and resurrection witness.',
 background:'',
 lessons:lkLessons
};
