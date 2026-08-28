(()=>{
  const lessons=window.NLDG_WALKING_WITH_JESUS_WEEKS;
  if(!Array.isArray(lessons))return;
  const byNumber=number=>lessons.find(item=>Number(item.number)===Number(number));
  const apply=(number,patch)=>Object.assign(byNumber(number)||{},patch);
  const applyScene=(number,patch)=>{const lesson=byNumber(number);if(lesson?.scene)Object.assign(lesson.scene,patch);};

  apply(8,{
    supporting:['Isaiah 61:1–3','Matthew 4:17','Matthew 11:28–30'],
    context:[
      'The Beatitudes are not a ladder people climb to earn God’s kingdom. Jesus announces God’s favor and future to people whose lives do not look “blessed” by ordinary standards, then describes the merciful, pure, peacemaking life His kingdom forms.',
      'Matthew says “poor in spirit,” while Luke simply says “poor” and pairs blessings with woes. Read both accounts without flattening them. Together they challenge both spiritual pride and comfortable definitions of success.',
      'Salt and light follow the Beatitudes. Jesus forms a people whose kingdom-shaped life becomes visible to the world, not so they can display their superiority, but so others may glorify the Father.'
    ],
    jesusConnection:'Jesus does more than describe kingdom character. He embodies it: meek, merciful, pure, peacemaking, faithful under persecution, and completely dependent on the Father. The blessed life is life under His reign.',
    distinctions:['Blessed ≠ comfortable or successful by ordinary standards','The Beatitudes ≠ entrance requirements that earn salvation','Meekness ≠ weakness or passivity'],
    leaderNote:'Let Matthew and Luke keep their distinct emphases. “Poor in spirit” should not erase Luke’s concern for the materially poor, and Luke’s “poor” should not be reduced to a claim that poverty automatically makes someone righteous. The blessing comes from God’s kingdom and the King who is near.',
    application:'Choose one Beatitude and ask how Jesus is reshaping your definition of a good life. Practice one concrete kingdom response this week.'
  });

  apply(9,{
    supporting:['Leviticus 19:17–18','Deuteronomy 6:4–5','Matthew 22:34–40'],
    context:[
      'Jesus says He came to fulfill the Law and the Prophets, not discard them. His repeated “you have heard…but I say” statements press righteousness beneath outward behavior into anger, desire, truthfulness, retaliation, and love.',
      'Jesus is not saying that every angry feeling is identical to murder or that every temptation is identical to adultery. He exposes the heart-level movements from which destructive actions grow and refuses a righteousness that looks clean while contempt, exploitation, or hatred remain inside.',
      'The command to be “perfect” uses language of wholeness or maturity and comes at the end of Jesus’ teaching on enemy-love. The Father gives sun and rain beyond the boundaries of our preferred group, and His children are called to reflect that generous love.'
    ],
    jesusConnection:'Jesus fulfills the Law and reveals the Father’s heart. His own life will carry enemy-love all the way to the cross, so the righteousness He teaches is not rule-polishing but a life being transformed into His likeness.',
    distinctions:['Heart righteousness ≠ pretending outward actions do not matter','Enemy-love ≠ approval, restored trust, or remaining in danger','Jesus’ radical language about removing causes of sin ≠ a command to harm yourself'],
    leaderNote:'Handle anger, lust, marriage, divorce, and enemy-love pastorally. Do not use reconciliation language to pressure someone back into an abusive or unsafe relationship. Jesus calls for truthful hearts and holy love, not denial of harm or removal of wise boundaries.',
    application:'Ask the Spirit to expose one heart pattern beneath your outward behavior, then take one concrete step toward truth, purity, reconciliation, or enemy-love.'
  });

  apply(10,{
    supporting:['Luke 11:1–13','Matthew 18:21–35'],
    context:[
      'Jesus assumes His disciples will give, pray, and fast. His warning is not against visible faith but against practicing devotion in order to be seen and rewarded by people.',
      'The Lord’s Prayer begins “Our Father.” Even private prayer joins us to a people and places God’s name, kingdom, and will ahead of our own agenda. Daily bread, forgiveness, and deliverance teach dependence rather than performance.',
      'Jesus takes forgiveness seriously, but forgiveness should not be confused with pretending harm did not happen, immediately restoring trust, or abandoning safety and accountability.'
    ],
    jesusConnection:'The Son teaches His disciples to approach God as Father and to desire the Father’s kingdom and will. Prayer is not a technique for impressing God; it is participation in the life and mission Jesus opens to us.',
    distinctions:['Private devotion ≠ isolated faith','Forgiveness ≠ instant reconciliation or restored trust','Prayer ≠ spiritual performance or a formula for controlling God'],
    leaderNote:'Emphasize motive rather than policing whether a practice is public or private. When forgiveness comes up, distinguish forgiveness, reconciliation, trust, justice, and safety so wounded people are not pressured into unsafe contact.',
    application:'Pray slowly through the Lord’s Prayer in your own words, allowing each phrase to reorder your desires around the Father’s name, kingdom, provision, mercy, and protection.'
  });

  apply(11,{
    supporting:['Matthew 7:12','Matthew 7:15–23','Matthew 7:28–29'],
    context:[
      'Matthew 6:19–7:29 moves from treasure and worry to judgment, prayer, the Golden Rule, two ways, false prophets, false profession, and two foundations. Jesus is preparing hearers to choose what kind of life they will actually build.',
      '“Do not judge” is immediately followed by teaching that requires discernment. Jesus condemns hypocritical judgment: remove the log from your own eye so you can see clearly, then learn to recognize harmful fruit without pretending you are morally above others.',
      'The rock is not vague spirituality. Jesus says the wise person hears “these words of mine” and does them. Matthew ends by noting the crowd’s amazement because Jesus teaches with authority.'
    ],
    jesusConnection:'The Sermon ends by placing Jesus’ own words at the foundation of a life. He is not merely one wisdom teacher among many; discipleship means hearing the King and building around what He says.',
    distinctions:['“Do not judge” ≠ never exercise moral discernment','Seek first the kingdom ≠ a promise of financial comfort or a trouble-free life','Obedience ≠ earning grace; it is the lived response of discipleship'],
    leaderNote:'Do not use Matthew 6:25–34 to shame people who experience anxiety disorders, trauma, or persistent worry. Jesus redirects anxious attention toward the Father’s care and kingdom; pastoral care, wise support, counseling, and medical treatment can all coexist with trust in God.',
    application:'Choose one teaching from Matthew 6–7 that you have admired but not consistently practiced, and build one concrete act of obedience around it this week.'
  });

  apply(12,{
    supporting:['Isaiah 35:4–6','Luke 4:16–21','Matthew 11:2–6'],
    context:[
      'The biblical category often translated “leprosy” covered a range of serious skin conditions and should not automatically be equated with modern Hansen’s disease. What matters in Matthew 8 is that Jesus willingly touches and cleanses someone considered unclean.',
      'The centurion is a Gentile military officer who trusts Jesus’ authority without requiring His physical presence. In Luke 7, Jesus also meets a grieving widow and raises her only son. Compassion and authority belong together in His ministry.',
      'These healings are signs of God’s kingdom and previews of creation restored. They do not create a promise that every faithful believer will receive immediate physical healing in this age. Christian hope finally rests in resurrection and new creation.'
    ],
    jesusConnection:'Jesus does not heal simply to demonstrate power. His authority reveals the arrival of God’s reign, and His compassion moves toward people who are sick, grieving, unclean, foreign, or overlooked.',
    distinctions:['Biblical “leprosy” ≠ automatically modern Hansen’s disease','Faith ≠ certainty that God must give the outcome we request','Prayer for healing ≠ rejection of medicine, professional care, or practical support'],
    leaderNote:'Never imply that a person remains sick because they lack faith. The Gospels show many different healing encounters, and the New Testament also makes room for ongoing weakness and suffering. Pray boldly while refusing to blame the person if healing does not occur as hoped.',
    application:'Move toward someone who is hurting or overlooked with the compassion of Jesus, and trust His authority without pretending you can control the outcome.'
  });

  apply(13,{
    scripture:'Matthew 14:13–21; Mark 6:30–44; John 6:1–71',
    supporting:['Exodus 16:1–18','Deuteronomy 8:2–3','John 20:30–31'],
    bigQuestion:'What does the feeding sign reveal about Jesus Himself?',
    focus:'Jesus feeds a real hungry crowd with abundant compassion, but John does not let the story stop with full stomachs. The sign leads into Jesus’ claim, “I am the bread of life.” The deepest gift is not what Jesus can place in our hands but Jesus Himself.',
    context:[
      'The feeding of the five thousand is the only miracle of Jesus, apart from the resurrection, reported in all four Gospels. John places it near Passover and later connects it to Israel’s wilderness bread, inviting readers to see something greater than another meal.',
      'After the sign, the crowd wants more bread and even attempts to make Jesus king by force. Jesus refuses to be reduced to a provider who exists to satisfy their expectations.',
      'John 6 becomes difficult because Jesus insists that eternal life depends on receiving Him, not merely admiring His miracles. Christian traditions differ on how directly the “eat my flesh and drink my blood” language relates to Communion, but all agree that Jesus Himself is indispensable.'
    ],
    jesusConnection:'The sign points past the loaves to the Son. Jesus is the Bread of Life, the One sent by the Father who gives Himself for the life of the world.',
    distinctions:['Provision ≠ prosperity theology','A small resource placed before Jesus ≠ a formula guaranteeing multiplication','Bread of Life ≠ merely “God will meet all my material needs”'],
    leaderNote:'The Gospel does not tell us the boy’s motives or narrate him voluntarily presenting the food, so avoid building the main application around “the boy’s willingness to give.” John’s stated emphasis is the sign, Jesus’ identity, the crowd’s misunderstanding, and the call to believe in Him.',
    questions:['What do all four Gospel accounts emphasize about Jesus and the crowd?','Why does John call miracles “signs,” and what is this sign pointing toward?','Why did the crowd want to make Jesus king after being fed?','What does Jesus mean when He says, “I am the bread of life”?','Are we seeking Jesus Himself, or mainly what we hope He will provide?'],
    application:'Thank Jesus for His provision, but go deeper: seek Him as the Bread of Life rather than reducing faith to what you want Him to give you.'
  });

  apply(14,{
    supporting:['Job 9:8','Psalm 77:16–20','John 6:15–21'],
    context:[
      'The storm follows the feeding miracle. Jesus sends the disciples ahead while He withdraws to pray, then comes to them across the water in the night. The story continues to answer the question of who Jesus is.',
      'When Jesus says, “Take courage. It is I. Do not be afraid,” the words translated “It is I” can carry the ordinary sense “It is me,” while also resonating with the Bible’s language of divine self-identification. At minimum, Jesus acts with an authority over the sea that Scripture associates with God.',
      'Peter’s step onto the water appears only in Matthew. The scene ends not with a generic lesson about leaving comfort zones but with the disciples worshiping Jesus and confessing, “Truly you are the Son of God.”'
    ],
    jesusConnection:'The center of the storm story is Jesus: He comes to His disciples, rules the chaotic waters, rescues Peter when he cries out, and receives worship as the Son of God.',
    distinctions:['Peter leaving the boat ≠ a command to take reckless risks','Fear in a frightening situation ≠ automatic spiritual failure','A storm in your life ≠ proof that God sent a specific test you can decode'],
    leaderNote:'Avoid making “Why did Jesus allow this storm?” the controlling question; Matthew does not give a full explanation. Keep the emphasis on what Jesus reveals about Himself and how He responds when Peter cries, “Lord, save me.”',
    application:'When fear and faith are both present, call on Jesus, remember who He is, and let the story lead you toward trust and worship rather than a formula for controlling the storm.'
  });

  apply(15,{
    supporting:['Matthew 10:1–20','Mark 6:7–13'],
    bigQuestion:'Whose mission is it when Jesus sends His disciples?',
    context:[
      'Luke 9 begins with Jesus giving the Twelve power and authority and sending them to proclaim the kingdom of God and heal. Their authority is received from Jesus; ministry never becomes their private possession or proof of personal importance.',
      'The instructions to travel lightly were given to this particular mission. They teach dependence, urgency, hospitality, and freedom from self-protection, but should not be turned into a rule that faithful ministry must always reject planning or resources.',
      'The chapter places mission alongside Herod’s confusion, the disciples’ return, and the feeding of the crowd. Public attention can grow while understanding of Jesus remains shallow, so apparent success is never the final measure of faithfulness.'
    ],
    jesusConnection:'Jesus is the One who calls, authorizes, sends, and defines the message: the kingdom of God has come near. Disciples do not build their own mission; they participate in His.',
    distinctions:['Being sent ≠ gaining a platform or status','Opposition ≠ automatic proof that we are right','Dependence on God ≠ refusing wise preparation in every ministry setting'],
    leaderNote:'Distinguish rejection because of faithful witness from criticism caused by poor judgment, arrogance, or harm. “People opposed me” is not by itself evidence that I represented Jesus well.',
    application:'Serve or speak about Jesus in one concrete way this week, remembering that the mission belongs to Him and faithfulness matters more than attention.'
  });

  apply(16,{
    supporting:['Luke 10:17–24','Luke 10:25–42'],
    context:[
      'Luke 10 records a mission larger than the Twelve: Jesus sends seventy-two disciples in many translations, while some ancient manuscripts read seventy. The number does not change the main point: the harvest is large and the Lord sends workers ahead of Jesus.',
      'They are told to carry peace, receive hospitality, heal, and announce that God’s kingdom has come near. Their work is urgent but not manipulative; they are guests and witnesses, not controllers of the people they meet.',
      'When they return excited about spiritual authority, Jesus redirects their joy: “Rejoice that your names are written in heaven.” Ministry fruit is worth celebrating, but belonging to God is deeper than results.'
    ],
    jesusConnection:'Jesus is the Lord of the mission and the One toward whom the workers point. Later in the chapter He rejoices in the Holy Spirit and speaks of His unique relationship with the Father, keeping mission rooted in knowing God rather than chasing outcomes.',
    distinctions:['Harvest language ≠ treating people as projects','Urgency ≠ pressure, manipulation, or fear tactics','Ministry results ≠ personal identity or spiritual worth'],
    leaderNote:'The selected Chosen scene portrays the Twelve in Luke 9, not the seventy-two in Luke 10. Keep calling it a visual parallel. The website already states this; do not blur the two events in discussion.',
    application:'Enter one relationship or place this week as a peaceful witness: listen, serve, speak honestly about Jesus when appropriate, and leave the results with God.'
  });

  apply(17,{
    supporting:['John 5:24–29','1 Corinthians 15:20–26','Revelation 21:1–5'],
    bigQuestion:'Who is Jesus when grief, waiting, and death feel final?',
    focus:'John tells us that Jesus loved Martha, Mary, and Lazarus, and also that He delayed going to Bethany for a stated purpose in this particular story. At the tomb He does not offer a theory of grief. He reveals Himself: “I am the resurrection and the life,” weeps with the mourners, and calls Lazarus out.',
    truths:['Jesus is the resurrection and the life.','Jesus is present and compassionate in real grief.','The delay in this story serves the sign John is narrating; Scripture does not give us a simple explanation for every painful delay.','Resurrection hope rests in Jesus, not in a promise that every present loss will be reversed immediately.'],
    context:[
      'John explicitly says Jesus loved this family, yet the sisters still experienced waiting, death, disappointment, and tears. Love and unanswered questions exist in the same chapter.',
      'Before raising Lazarus, Jesus asks Martha to trust who He is. Her confession that He is the Messiah and Son of God is as important to the chapter as the miracle itself.',
      'Lazarus is restored to mortal life and will die again; Jesus’ own resurrection will be different. The sign points forward to the final defeat of death, but it also intensifies the leaders’ decision to seek Jesus’ death.'
    ],
    jesusConnection:'Jesus does not merely possess resurrection power. He says, “I am the resurrection and the life.” Christian hope is ultimately personal: our future is secure because it is joined to Him.',
    distinctions:['Jesus’ delay in John 11 ≠ a code explaining every tragedy or unanswered prayer','Tears ≠ lack of faith','Lazarus returning from the tomb ≠ the full final resurrection promised to God’s people'],
    leaderNote:'Do not tell a grieving person, “God delayed because He has something bigger planned,” based on this passage. John tells us Jesus’ purpose in this specific sign; he does not authorize us to explain every death or loss. Let Jesus’ tears, presence, and resurrection promise carry the pastoral weight.',
    questions:['What does John tell us about Jesus’ love for the family before describing His delay?','Why does Jesus center the conversation with Martha on who He is?','What do Jesus’ tears permit Christians to do in grief?','How is Lazarus’s return to life different from the final resurrection hope?','How can we trust Jesus without pretending we know the reason for every painful delay?'],
    application:'Bring grief, disappointment, or waiting honestly to Jesus. Trust the One who is resurrection and life without forcing yourself to invent an explanation for everything that hurts.'
  });

  apply(18,{
    supporting:['Isaiah 52:13–53:12','Philippians 2:5–11','1 Peter 2:21–24'],
    context:[
      'Peter’s confession is true, but his understanding of Messiah is immediately tested. When Jesus speaks of rejection, death, and resurrection, Peter resists. A correct title for Jesus is not enough if we refuse the kind of Messiah Jesus says He is.',
      '“Take up your cross” would have sounded far more severe in the first century than the modern phrase “this is my cross to bear.” The cross was an instrument of Roman execution. Jesus calls for a loyalty willing to lose status, control, and even life rather than abandon Him.',
      'Self-denial is not self-hatred. It means refusing to make the self the final authority and entrusting life to Jesus. The paradox is that the life surrendered to Christ is the life ultimately found.'
    ],
    jesusConnection:'Jesus defines Messiah through suffering, death, and resurrection. To confess Him faithfully is to receive Him on His terms and follow the cruciform path He sets before His disciples.',
    distinctions:['Taking up your cross ≠ every inconvenience, illness, or difficult relationship','Self-denial ≠ self-hatred or tolerating abuse','Correct words about Jesus ≠ mature discipleship by themselves'],
    leaderNote:'Christian traditions differ on details such as the meaning of “this rock,” the keys, and Petrine authority in Matthew 16. Acknowledge those differences if they arise, but keep this lesson centered on the shared core: Jesus is Messiah, He goes to the cross, and His followers are called to costly allegiance.',
    questions:['What did Peter understand correctly about Jesus?','Why did Peter resist Jesus’ explanation of the Messiah’s suffering?','What did “take up your cross” communicate in Jesus’ world?','How is self-denial different from self-hatred or allowing mistreatment?','What allegiance, habit, or ambition is Jesus asking you to place under His lordship?'],
    application:'Confess Jesus not only with words but with allegiance. Place one area of control, status, comfort, or ambition under His leadership this week.'
  });

  apply(19,{
    supporting:['Zechariah 9:9–10','Psalm 118:19–29','Philippians 2:5–11'],
    focus:'Jesus deliberately enters Jerusalem in a way that evokes Israel’s royal and prophetic hopes. The crowds acclaim Him with language from Psalm 118, while Jesus comes as the humble King whose path will lead toward the cross. The Gospels show real enthusiasm, but they do not tell us that the exact same individuals later demanded His crucifixion.',
    context:[
      'Zechariah 9 describes a king coming humble and riding on a donkey, with a reign ultimately associated with peace. Jesus’ entry is therefore royal, but it challenges ordinary pictures of conquering power.',
      '“Hosanna” comes from a plea meaning “save, please” and had become part of festal praise. The crowd’s expectations were likely varied; the Gospels give us messianic and royal language without letting us reconstruct one identical political expectation for every person present.',
      'Luke adds that Jesus weeps over Jerusalem even as He is welcomed. The King enters with authority and compassion, aware that the city does not recognize what makes for peace.'
    ],
    jesusConnection:'Jesus is the promised King, but He refuses to be reshaped into the kind of king people may prefer. His throne will be revealed through humble obedience, sacrificial love, and ultimately the cross and resurrection.',
    distinctions:['Hosanna ≠ a political campaign slogan','Humility ≠ weakness','Crowd enthusiasm ≠ enduring discipleship'],
    leaderNote:'Do not repeat the common claim that “the same crowd that shouted Hosanna shouted Crucify Him” as though the Gospels identify the groups person-for-person. They do not. The broader contrast between public acclaim and later rejection is real, but teach only what the text supports.',
    questions:['What does Zechariah 9 help us notice about Jesus’ chosen way of entering Jerusalem?','What does “Hosanna” communicate?','How might people try to reshape Jesus into the kind of king they want?','Why does Luke place Jesus’ tears over Jerusalem alongside the royal welcome?','What does it mean to receive Jesus as King on His terms rather than ours?'],
    application:'Welcome Jesus as King without demanding that He serve your preferred agenda. Let His humility, peace, and sacrificial way reshape your own use of influence and power.'
  });

  applyScene(20,{
    summary:'Jesus enters the temple courts, drives out buyers and sellers, overturns tables, and declares God’s house to be a house of prayer.',
    start:'Begin when Jesus enters the temple courts and takes in the buying, selling, and activity around Him.'
  });
  apply(20,{
    supporting:['Isaiah 56:6–8','Jeremiah 7:1–15','Mark 11:12–25'],
    focus:'Jesus’ temple action is a prophetic sign of judgment and a declaration of authority. He joins Isaiah’s vision of “a house of prayer for all nations” with Jeremiah’s warning about a “den of robbers.” The text condemns what worship has become without giving us enough detail to reconstruct every economic practice or motive behind it.',
    context:[
      'Buying sacrificial animals and exchanging currency were connected to temple worship, so commerce by itself is not the whole explanation. Jesus’ words interpret His action by reaching back to Isaiah 56 and Jeremiah 7.',
      'In Mark, the temple action is framed by the fig tree, strengthening the theme of judgment on fruitless religion. Jesus is not having an uncontrolled outburst; He acts deliberately as a prophet and as the Son who possesses authority in God’s house.',
      '“House of prayer for all nations” widens the lens beyond personal sincerity. God’s worshiping community is meant to serve God’s purpose rather than becoming a system that obstructs, exploits, or replaces genuine devotion.'
    ],
    jesusConnection:'Jesus cleanses the temple as the authoritative King and prophet approaching the cross. His action exposes religion that uses God while resisting God’s reign.',
    distinctions:['Jesus’ prophetic anger ≠ permission for uncontrolled personal rage','Temple commerce ≠ proof that every church sale or fundraiser is sinful','Sincere worship ≠ private emotion alone; it includes justice, prayer, obedience, and God’s mission'],
    leaderNote:'The Gospels do not spell out every mechanism of financial exploitation, so label such reconstructions as historical interpretation rather than explicit text. Also note that John narrates a temple cleansing earlier in Jesus’ ministry; Christians differ on whether this represents a separate cleansing or a different placement of the same event.',
    questions:['Which Old Testament passages does Jesus quote, and what do they add to the meaning of His action?','Why is “for all nations” important in Mark’s wording?','How is Jesus’ anger different from uncontrolled rage?','What can religious activity look like when it has lost prayer, justice, and obedience?','Where might Jesus be calling us from religious performance back to faithful worship?'],
    application:'Ask Jesus to expose any way religious activity has replaced prayer, obedience, justice, or love in your life, and take one concrete step toward wholehearted worship.'
  });

  apply(21,{
    supporting:['Matthew 24:4–14','Matthew 24:36–44','Acts 1:6–11','1 Thessalonians 4:13–18'],
    context:[
      'Matthew 24 begins with Jesus predicting the temple’s destruction and the disciples asking questions about what is coming. Interpreters differ on how the chapter relates the first-century destruction of Jerusalem, later history, and Christ’s future return. That complexity should produce humility, not date-setting.',
      'Jesus repeatedly warns about deception, fear, and false claims. He also states that no one knows the day or hour. Readiness in Matthew 24–25 therefore looks less like decoding headlines and more like steady faithfulness.',
      'The parables emphasize prepared lives, faithful stewardship, and accountability before the returning King. Christians also differ on whether “the least of these my brothers and sisters” in Matthew 25 refers especially to Jesus’ vulnerable messengers or more broadly to people in need; either way, the scene refuses a discipleship detached from how people are treated.'
    ],
    jesusConnection:'The One who teaches watchfulness is the Son of Man who will come as King and Judge. Christian hope is not centered on a timetable but on Jesus Himself, His promised return, and a life ready to meet Him.',
    distinctions:['Readiness ≠ predicting a date','Watchfulness ≠ panic, conspiracy, or constant headline speculation','The parable of the talents ≠ a simple endorsement of any modern economic system'],
    leaderNote:'Make room for different orthodox end-times frameworks without allowing the lesson to become a prophecy-chart debate. Keep returning to Jesus’ explicit commands: do not be deceived, endure faithfully, stay ready, use what has been entrusted to you, and live in a way that honors the King.',
    application:'Live ready rather than frightened: practice faithful prayer, truthful living, wise stewardship, mercy, and service so that waiting for Jesus actively forms your life now.'
  });
})();
