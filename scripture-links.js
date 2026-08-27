(()=>{
if(window.NLDG_SCRIPTURE_LINKS_LOADED)return;
window.NLDG_SCRIPTURE_LINKS_LOADED=true;
const BOOKS='Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Songs|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation';
const NUMBERED_BOOK_NAMES='Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John';
const RANGE_TAIL='(?:(?::\\d{1,3}(?:[-–—](?:\\d{1,3}(?::\\d{1,3})?))?)|(?:[-–—]\\d{1,3}(?::\\d{1,3})?))?';
const CORE=`\\d{1,3}${RANGE_TAIL}`;
const CONTINUATION=`\\d{1,3}(?!\\s+(?:${NUMBERED_BOOK_NAMES})\\b)${RANGE_TAIL}`;
const REFERENCE=new RegExp(`\\b(?:${BOOKS})\\s+${CORE}(?:\\s*,\\s*${CONTINUATION})*(?:\\s*;\\s*${CONTINUATION}(?:\\s*,\\s*${CONTINUATION})*)*`,'gi');
const SKIP='a,script,style,textarea,input,select,option,button,code,pre,[contenteditable="true"],.no-scripture-links';
const passageUrl=reference=>`https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference.replace(/[–—]/g,'-'))}`;
const findReferences=text=>[...String(text||'').matchAll(REFERENCE)].map(match=>match[0]);
function linkTextNode(node){
 const text=node.nodeValue;
 REFERENCE.lastIndex=0;
 if(!text||!REFERENCE.test(text))return;
 REFERENCE.lastIndex=0;
 const fragment=document.createDocumentFragment();
 let last=0;
 for(const match of text.matchAll(REFERENCE)){
  if(match.index>last)fragment.append(text.slice(last,match.index));
  const reference=match[0];
  const link=document.createElement('a');
  link.className='scripture-reference-link';
  link.href=passageUrl(reference);
  link.target='_blank';
  link.rel='noopener noreferrer';
  link.textContent=reference;
  link.setAttribute('aria-label',`Read ${reference} on Bible Gateway (opens in a new tab)`);
  fragment.append(link);
  last=match.index+reference.length;
 }
 if(last<text.length)fragment.append(text.slice(last));
 node.replaceWith(fragment);
}
function linkReferences(root=document.body){
 if(!root||root.nodeType===Node.ELEMENT_NODE&&(root.matches(SKIP)||root.closest(SKIP)))return;
 if(root.nodeType===Node.TEXT_NODE){linkTextNode(root);return}
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement?.closest(SKIP)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(linkTextNode);
}

const FYJ_DEPTH={
 'following-jesus-for-yourself-1':{
  context:[
   'Psalm 139 is not mainly David giving himself a motivational speech. He is amazed that God knows him completely and that there is nowhere he can go beyond God’s presence.',
   'Ephesians 1 repeatedly says these blessings are received “in Christ.” The emphasis is on what God has done before anything we achieve: choosing, adopting, redeeming, forgiving, and sealing His people by grace.',
   'Colossians 3 connects identity with Jesus’ death and resurrection. The believer’s life is “hidden with Christ,” so belonging to Jesus reshapes both how we understand ourselves and how we live.'
  ],
  jesus:'Christian identity is not mainly about discovering a “true self” with ourselves at the center. Jesus calls us to receive life in Him. He knows us fully, loves us faithfully, calls us to repentance, and teaches us who we are becoming as His disciples.',
  distinctions:['Identity in Christ ≠ pretending choices do not matter.','Grace ≠ never being corrected.','A label ≠ the whole person.','Humility ≠ believing you are worthless.']
 },
 'following-jesus-for-yourself-2':{
  context:[
   'In Matthew 16, Jesus first asks what the crowds are saying and then turns directly to His disciples: “Who do you say I am?” Peter identifies Jesus as the Messiah, but the conversation quickly moves to Jesus’ suffering and the cost of following Him. We cannot separate who Jesus is from the kind of discipleship He calls for.',
   'Luke 9 says disciples take up the cross “daily.” Jesus is not telling young people to seek harm. He is describing a life where loyalty to Him outranks comfort, image, and self-rule.',
   'John 15 comes during Jesus’ final night with His disciples before the cross. Remaining in the vine means life and fruit come from continuing relationship with Jesus, not from trying to look spiritual on our own.'
  ],
  jesus:'Following Jesus is not adopting a religious lifestyle brand. It is responding to a Person. Peter’s confession names who Jesus is, and Jesus immediately explains that discipleship follows the way of the cross. We receive His grace, remain in Him, and learn to place every part of life under His leadership.',
  distinctions:['Personal faith ≠ private faith.','Surrender ≠ self-hatred.','Spiritual practices ≠ earning God’s love.','Family faith ≠ fake faith; it can be a gift that leads us toward our own response to Jesus.']
 },
 'following-jesus-for-yourself-3':{
  context:[
   'Second Timothy is one of Paul’s final letters. His point is not merely that Scripture contains information. Scripture teaches, corrects, trains, and equips God’s people for a faithful life.',
   'Acts 17 praises the Bereans because they listened eagerly and also checked what they heard against Scripture. Being teachable and being discerning belong together.',
   'Luke 24 takes place after Jesus’ resurrection on the road to Emmaus. Jesus helps confused disciples see that the larger story of Scripture points toward the Messiah. The Bible is a library of different books, but Christians read it as part of one unfolding story centered in God’s work fulfilled in Christ.'
  ],
  jesus:'The Bible is not an end in itself. Jesus shows in Luke 24 that Scripture belongs to one great story that reaches its fulfillment in Him. Careful Bible reading should help us know Christ more truthfully and follow Him more faithfully.',
  distinctions:['The authority of Scripture ≠ the authority of my interpretation.','Context ≠ an excuse to avoid what a passage clearly says.','Questions ≠ disrespect.','Application ≠ the original meaning; first ask what the text meant, then how its truth shapes us today.']
 },
 'following-jesus-for-yourself-4':{
  context:[
   'Matthew 6 is part of the Sermon on the Mount. Jesus warns against prayer performed for an audience before giving the Lord’s Prayer. The model begins with God as Father, God’s name, and God’s kingdom before moving to daily needs, forgiveness, and protection.',
   'Psalm 13 is a lament. The writer asks “How long?” and speaks honestly about pain, yet continues turning toward God. Biblical faith does not require pretending everything feels fine.',
   'Philippians 4 was written by Paul while he was living under serious pressure and confinement. The peace he describes is not the absence of difficulty. It is God’s guarding presence in the middle of uncertainty.'
  ],
  jesus:'Jesus does more than teach a prayer formula. He invites His followers to know God as Father and to seek God’s kingdom before trying to control outcomes. Jesus Himself prayed honestly in Gethsemane, bringing real desire to the Father while still surrendering to the Father’s will.',
  distinctions:['Honesty ≠ every feeling being true.','Prayer ≠ a transaction that puts God in our debt.','Peace ≠ every problem disappearing immediately.','Silence ≠ God being absent.']
 },
 'following-jesus-for-yourself-5':{
  context:[
   'Mark 9 happens after Jesus’ transfiguration. A desperate father comes to Jesus after the disciples have been unable to help his son. His words hold faith and struggle together: “I believe; help my unbelief.”',
   'In John 20, Thomas had not been present when Jesus first appeared to the other disciples. Jesus later meets Thomas directly and invites him to examine the evidence. The scene ends with one of the strongest confessions about Jesus in John’s Gospel: “My Lord and my God.”',
   'Jude tells believers to remain rooted in God’s love while showing mercy to those who doubt. The church is meant to be a place where questions are handled with both truth and compassion.'
  ],
  jesus:'Thomas is often remembered mainly for doubt, but that is not where his story ends. When he encounters the risen Jesus, he responds, “My Lord and my God.” Honest questions are meant to move us toward truth, trust, confession, and worship, not endless distance from Jesus.',
  distinctions:['Doubt ≠ automatic unbelief.','Evidence ≠ possessing total certainty about everything.','Humility ≠ refusing to reach any conclusion.','Honest questions ≠ permission to avoid responding to Jesus forever.']
 },
 'following-jesus-for-yourself-6':{
  context:[
   'Proverbs 13 is wisdom literature. It describes the direction relationships can shape over time; it is not a command to avoid everyone who is different from us.',
   'Daniel 1 takes place in exile. Daniel and his friends are young people living under an empire trying to reshape their identity and habits. Daniel responds with conviction, but also with wisdom and respect rather than unnecessary hostility.',
   'Galatians 1 warns against letting human approval outrank loyalty to Christ. First Corinthians 15:33 appears in a chapter defending the resurrection, reminding believers that close influence can slowly shape what they accept as normal and true.'
  ],
  jesus:'Jesus welcomed people from many backgrounds, yet He was never controlled by the crowd. His deepest belonging was with the Father, and that gave Him freedom to love people without copying every expectation around Him. Following Jesus teaches us to belong without surrendering our conscience.',
  distinctions:['Belonging ≠ surrendering your convictions.','Boundaries ≠ hatred.','Loyalty ≠ keeping dangerous secrets or accepting control.','Courage ≠ being argumentative.']
 },
 'following-jesus-for-yourself-7':{
  context:[
   'Ephesians 4 is written to a church learning how to live as one body in Christ. Paul tells believers to put away falsehood because “we are members of one another.” Our words are not only private choices; they affect the community around us.',
   'Philippians 4 calls believers to give sustained attention to what is true, honorable, just, pure, lovely, and worthy of praise. That does not mean ignoring difficult reality. It means refusing to let unhealthy attention train our minds without question.',
   'First Corinthians 10:31 comes from a discussion about ordinary choices and disagreements over food. Paul’s principle is bigger than food: even everyday decisions can be made for God’s glory while considering how our choices affect other people.'
  ],
  jesus:'Jesus does not become Lord only when we enter a church building. The same Jesus who calls us to truth, love, self-control, and care for our neighbor is Lord of texts, posts, gaming chats, searches, and private messages. Digital discipleship is simply discipleship lived through modern tools.',
  distinctions:['Privacy ≠ secrecy used to hide harm.','Attention ≠ harmless just because no one else sees it.','Posting Christian content ≠ automatically having a Christlike witness.','Healthy boundaries ≠ believing technology itself is evil.']
 },
 'following-jesus-for-yourself-8':{
  context:[
   'James 1 makes an important distinction: God does not tempt people toward evil. James traces temptation through desire, choice, and consequence, helping us notice the process before the final decision.',
   'First Corinthians 10 looks back at Israel’s failures as a warning against overconfidence. Paul immediately adds hope: temptation is common to human beings, and God is faithful to provide a way to endure it.',
   'Galatians 5 explains Christian freedom through love and life in the Spirit. Freedom is not becoming controlled by every desire. The Spirit forms a different kind of character.',
   'Proverbs 4 uses the picture of a path. Wisdom pays attention not only to one isolated choice but to the direction repeated choices are taking us.'
  ],
  jesus:'Jesus faced real temptation and did not treat temptation itself as failure. He responded with trust in the Father and faithfulness to God’s Word. Christian self-control is not merely stronger willpower; it is learning, by the Spirit, to choose what fits life under Jesus’ leadership.',
  distinctions:['Temptation ≠ sin.','Freedom ≠ living with no limits.','A personal boundary ≠ a universal command from God.','Self-control ≠ willpower without the Spirit, wisdom, and support.']
 },
 'following-jesus-for-yourself-9':{
  context:[
   'Luke 15 is Jesus’ response to religious leaders complaining that He welcomes sinners. The younger son’s return shows repentance and the father’s response shows surprising grace. The whole parable also includes an older brother, reminding us that being physically near the father is not the same as sharing the father’s heart.',
   'First John 1 describes walking in the light within Christian fellowship. Confession is the opposite of pretending, hiding, and managing appearances.',
   'Matthew 5 connects worship with taking responsibility for damaged relationships. It does not require unsafe contact in situations involving abuse or danger.',
   'Second Corinthians 7 distinguishes godly sorrow from regret that goes nowhere. Healthy sorrow moves us toward repentance and change rather than deeper hiding.'
  ],
  jesus:'Jesus receives repentant sinners without pretending sin does not matter. In Luke 15, the father runs toward the returning son. The gospel makes honest confession possible because God’s grace meets us in Christ. Jesus does not call us to hide from failure; He calls us home and teaches us to walk differently.',
  distinctions:['Confession ≠ public exposure of every private struggle.','Forgiveness ≠ immediate restoration of trust.','Repentance ≠ shame that says you are beyond hope.','Reconciliation ≠ giving unsafe people renewed access to you.']
 },
 'following-jesus-for-yourself-10':{
  context:[
   'Romans 12 begins with the word “therefore.” Paul has spent the earlier chapters describing God’s mercy and grace, and then he says our response is to offer our whole lives to God. The discussion of individual gifts comes after whole-life surrender and within the life of one body.',
   'First Peter 4 describes gifts as stewardship. Whatever God gives is meant to serve other people, especially in a community learning faithfulness under pressure.',
   'Matthew 5 places salt and light inside the Sermon on the Mount. Jesus wants good works to be visible in a way that points people toward the Father, not toward our own image.',
   'Micah 6:8 comes in a passage challenging religious performance without faithful character. God’s concern includes justice, mercy, and humble walking with Him.'
  ],
  jesus:'Jesus’ life shows that purpose is not the same as fame. He gave Himself in obedience to the Father and in service to others. Our gifts matter because they can participate in that same pattern of love. Before asking, “What impressive thing am I called to do?” disciples learn to ask, “How can my life belong to Jesus and bless the people around me?”',
  distinctions:['Calling ≠ career.','Gifts ≠ status.','Visible faith ≠ religious performance.','Ambition ≠ purpose; ambition must be surrendered to Christ and redirected toward faithful service.']
 }
};

function enhanceFollowingJesusYouthStudy(){
 if(!document.body?.classList.contains('fyj-study-page'))return;
 const lesson=FYJ_DEPTH[document.body.dataset.studyPage];
 if(!lesson||document.querySelector('[data-fyj-depth-added]'))return;
 const content=document.querySelector('.fyj-study-content');
 if(!content)return;
 const blocks=[...content.querySelectorAll('.fyj-block')];
 const findBlock=label=>blocks.find(block=>block.querySelector('.fyj-eyebrow')?.textContent.trim().toLowerCase()===label.toLowerCase());
 const bibleBlock=findBlock('Open Your Bible');
 const thinkBlock=findBlock('Think It Through');
 if(bibleBlock){
  const context=document.createElement('section');
  context.className='fyj-block fyj-context';
  context.dataset.fyjDepthAdded='context';
  context.innerHTML=`<p class="fyj-eyebrow">Context in Plain English</p><h2>See what is happening around the passage.</h2>${lesson.context.map(text=>`<p>${text}</p>`).join('')}`;
  bibleBlock.insertAdjacentElement('afterend',context);
 }
 if(thinkBlock){
  const jesus=document.createElement('section');
  jesus.className='fyj-block fyj-jesus-connection';
  jesus.dataset.fyjDepthAdded='jesus';
  jesus.innerHTML=`<p class="fyj-eyebrow">Jesus Connection</p><h2>Keep the lesson centered on Christ.</h2><p>${lesson.jesus}</p><div class="fyj-callout"><strong>Don’t Confuse These</strong><ul>${lesson.distinctions.map(item=>`<li>${item}</li>`).join('')}</ul></div>`;
  thinkBlock.insertAdjacentElement('beforebegin',jesus);
 }
}

const style=document.createElement('style');
style.textContent='.scripture-reference-link{color:#8fe9b6;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;font-weight:750}.scripture-reference-link:hover,.scripture-reference-link:focus-visible{color:#ffd55f}.scripture-reference-link:focus-visible{outline:3px solid #ffd55f;outline-offset:3px;border-radius:3px}';
document.head.appendChild(style);
const start=()=>{
 enhanceFollowingJesusYouthStudy();
 linkReferences(document.body);
 let queued=false;
 const pending=new Set();
 const observer=new MutationObserver(records=>{
  records.forEach(record=>record.addedNodes.forEach(node=>pending.add(node)));
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;const nodes=[...pending];pending.clear();nodes.forEach(linkReferences)});
 });
 observer.observe(document.body,{childList:true,subtree:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.NLDG_SCRIPTURE_LINKS={linkReferences,passageUrl,findReferences};
})();
