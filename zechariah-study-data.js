const zechariahPurpose='This lesson helps participants read the passage within its prophetic setting, interpret its imagery responsibly, and respond through worship, justice, repentance, compassion, and hope.';
const zechariahOpening='Pray for wisdom and gentleness. Invite one word, image, or question. No one must disclose trauma, marriage history, abuse, grief, illness, displacement, sexuality, or mental-health history. Listen without rushing to explain another person’s pain.';
const zechariahExamination='Where am I trusting power, resisting correction, using religious language to control, or overlooking another person’s dignity? Ask God for one truthful conviction and one grace-filled step toward repentance, repair, courage, or faithful hope.';
const zechariahGuidance='Treat apocalyptic symbols with humility. Do not map every figure onto current politicians, predict dates, target Jewish people, or justify violence. Honor Zechariah’s postexilic Jewish setting and Christian messianic fulfillment without replacement contempt, conspiracy claims, or partisan decoding. Never pressure disclosure, unsafe reconciliation, or speculative agreement. Judgment belongs to God. Prioritize consent, safety, truthful accountability, and practical care.';
const zechariahGenericBody=heading=>`${heading} shows that God confronts false worship and abusive power while calling people toward truth, responsibility, mercy, and hope. The passage should be read in its prophetic and covenant setting rather than turned into a slogan for controlling others.`;
const zechariahContext=passage=>`Read ${passage} in manageable sections. Observe audience, historical crisis, metaphor, vision, symbolic action, and movement between judgment and hope. Do not detach severe imagery from covenant context or treat it as a direct modern command.`;
const zechariahQuestions=passage=>[
  `What stands out in ${passage}?`,
  'What does this passage reveal about God?',
  'What human failure or hope does it expose?',
  'Which symbol requires historical context?',
  'Whose dignity or safety needs attention?',
  'What harmful interpretation must be rejected?',
  'How does the passage shape faithful leadership or worship?',
  'What will you practice this week?'
];
const zechariahPractice=passage=>`Read ${passage} again. Write one truth about God, one warning, and one hope. Choose a practical act of listening, accountability, mercy, material support, boundary-respect, justice, prayer, or worship.`;
const zechariahPrayer=passage=>`Faithful God, meet us in ${passage}. Correct our false worship, protect vulnerable people, renew our hearts, and teach us to live by your Spirit with justice, mercy, humility, and hope. Amen.`;
const zMovement=(heading,body)=>({heading,body:body||zechariahGenericBody(heading)});

window.NLDG_BOOK_STUDY={
  slug:'zechariah-study',
  book:'Zechariah',
  title:'Zechariah: Return, Cleansing, Spirit-Empowered Work, and Final Hope',
  description:'Return, Cleansing, Spirit-Empowered Work, the Humble King, and Final Hope',
  theme:'',
  audience:'Adults, groups, classes, and ministry teams',
  purpose:'Zechariah encourages a postexilic community through calls to return, symbolic night visions, cleansing, temple rebuilding, ethical instruction, messianic hope, shepherd imagery, and visions of God’s universal reign.',
  background:'',
  lessons:[
    {
      number:1,
      title:'Return to Me and I Will Return to You',
      scripture:'Zechariah 1',
      supporting:[],
      question:'How does a discouraged postexilic community begin again?',
      truth:'God calls the people to learn from prior generations, return wholeheartedly, and trust his renewed compassion for Jerusalem.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zechariah 1'),
      teaching:[
        zMovement('Remember the Former Prophets'),
        zMovement('Return Is Relational'),
        zMovement('The Horsemen Among the Myrtles'),
        zMovement('How Long?'),
        zMovement('God Answers with Comfort'),
        zMovement('Measuring Restoration by Presence')
      ],
      questions:zechariahQuestions('Zechariah 1'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zechariah 1'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zechariah 1')
    },
    {
      number:2,
      title:'Night Visions and God’s Restoring Presence',
      scripture:'Zechariah 1–6',
      supporting:[],
      question:'What do Zechariah’s night visions reveal about God’s work beyond visible weakness?',
      truth:'God sees the nations, removes wickedness, protects Jerusalem, cleanses leadership, and advances restoration by his Spirit.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zechariah 1–6'),
      teaching:[
        zMovement('Visions Are Symbolic Revelation'),
        zMovement('Horns and Craftsmen'),
        zMovement('A City Without Walls'),
        zMovement('The Measuring Line'),
        zMovement('The Flying Scroll and Basket'),
        zMovement('Chariots Patrol the Earth')
      ],
      questions:zechariahQuestions('Zechariah 1–6'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zechariah 1–6'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zechariah 1–6')
    },
    {
      number:3,
      title:'Joshua Cleansed and the Coming Branch',
      scripture:'Zechariah 3',
      supporting:[],
      question:'How does God restore a compromised priesthood and announce future hope?',
      truth:'God rebukes the accuser, removes Joshua’s filthy garments, renews responsibility, and promises the Branch.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zechariah 3'),
      teaching:[
        zMovement('Joshua Before the Angel'),
        zMovement('The Accuser Rebuked'),
        zMovement('A Brand from the Fire'),
        zMovement('Garments Replaced'),
        zMovement('Cleansing Restores Responsibility'),
        zMovement('The Branch and Removal of Sin')
      ],
      questions:zechariahQuestions('Zechariah 3'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zechariah 3'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zechariah 3')
    },
    {
      number:4,
      title:'Not by Might, but by My Spirit',
      scripture:'Zechariah 4',
      supporting:[],
      question:'How can a small community complete God’s work without relying on domination?',
      truth:'God supplies his Spirit, encourages Zerubbabel, and teaches that faithful beginnings should not be despised.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zechariah 4'),
      teaching:[
        zMovement('A Lampstand Supplied with Oil'),
        zMovement('Not by Might','God’s work does not depend on military force, political dominance, manipulation, or celebrity. The Spirit empowers faithful obedience.'),
        zMovement('The Great Mountain Becomes Level'),
        zMovement('Zerubbabel Will Finish'),
        zMovement('Do Not Despise Small Beginnings'),
        zMovement('The Two Anointed Ones')
      ],
      questions:zechariahQuestions('Zechariah 4'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zechariah 4'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zechariah 4')
    },
    {
      number:5,
      title:'True Fasting, Justice, and the Nations',
      scripture:'Zechariah 7–8',
      supporting:[],
      question:'What turns religious fasting into genuine covenant faithfulness?',
      truth:'God calls for justice, mercy, compassion, truthful community, and joyful worship that draws nations.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zechariah 7–8'),
      teaching:[
        zMovement('Was Your Fast Really for God?'),
        zMovement('The Former Prophets’ Message'),
        zMovement('Administer True Justice'),
        zMovement('Do Not Oppress the Vulnerable'),
        zMovement('Old and Young in Safe Streets','Restoration is measured by public safety and intergenerational belonging. Communities should protect children, elders, and people with disabilities.'),
        zMovement('Nations Seek the Lord')
      ],
      questions:zechariahQuestions('Zechariah 7–8'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zechariah 7–8'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zechariah 7–8')
    },
    {
      number:6,
      title:'The Humble King and the Pierced One',
      scripture:'Zechariah 9; 12',
      supporting:[],
      question:'How do the humble king and pierced figure shape messianic hope?',
      truth:'God’s king comes humbly, ends instruments of war, and opens a fountain of grief and cleansing.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zechariah 9; 12'),
      teaching:[
        zMovement('A King Riding on a Donkey'),
        zMovement('War Horses Cut Off'),
        zMovement('Peace to the Nations'),
        zMovement('The One They Pierced','Christian readers see fulfillment in Jesus, while the text remains part of Israel’s prophetic hope. Interpretation must never fuel antisemitism.'),
        zMovement('Mourning by Families'),
        zMovement('A Fountain Opened')
      ],
      questions:zechariahQuestions('Zechariah 9; 12'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zechariah 9; 12'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zechariah 9; 12')
    },
    {
      number:7,
      title:'The Shepherd, the Flock, and Rejected Leadership',
      scripture:'Zechariah 10–13',
      supporting:[],
      question:'What do shepherd images reveal about failed leadership and God’s care?',
      truth:'God opposes exploitative shepherds, gathers the flock, and exposes the cost of rejecting faithful leadership.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zechariah 10–13'),
      teaching:[
        zMovement('Household Idols Mislead'),
        zMovement('Shepherds Are Accountable'),
        zMovement('God Visits the Flock'),
        zMovement('Thirty Pieces of Silver'),
        zMovement('A Rejected Shepherd'),
        zMovement('Strike the Shepherd')
      ],
      questions:zechariahQuestions('Zechariah 10–13'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zechariah 10–13'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zechariah 10–13')
    },
    {
      number:8,
      title:'The Day of the Lord and Living Waters',
      scripture:'Zechariah 14',
      supporting:[],
      question:'How should Zechariah’s final day-of-the-Lord vision form hope without violent speculation?',
      truth:'God confronts evil, becomes king over all the earth, sends living waters, and makes ordinary life holy.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zechariah 14'),
      teaching:[
        zMovement('A Severe Apocalyptic Battle','The imagery is violent and symbolic. Judgment belongs to God and never authorizes believers to attack Jewish people, political opponents, or religious outsiders.'),
        zMovement('God Stands with the Threatened'),
        zMovement('Living Waters Flow'),
        zMovement('The Lord Is One'),
        zMovement('Nations Come to Worship'),
        zMovement('Holy to the Lord Everywhere')
      ],
      questions:zechariahQuestions('Zechariah 14'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zechariah 14'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zechariah 14')
    }
  ]
};
